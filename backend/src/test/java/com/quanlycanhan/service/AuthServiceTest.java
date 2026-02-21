package com.quanlycanhan.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.quanlycanhan.dto.request.LoginRequest;
import com.quanlycanhan.dto.request.RegisterRequest;
import com.quanlycanhan.dto.response.AuthResponse;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.entity.User.UserStatus;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailService emailService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private LoginAttemptService loginAttemptService;

    @Mock
    private TwoFactorService twoFactorService;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private UserDetails testUserDetails;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .fullName("Test User")
                .status(UserStatus.ACTIVE)
                .twoFactorEnabled(false)
                .build();

        testUserDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@example.com")
                .password("encodedPassword")
                .authorities("ROLE_USER")
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("New User");
        registerRequest.setPhone("0123456789");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    @DisplayName("Should register user successfully")
    void testRegister_Success() {
        // Given
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(otpService.isOtpEnabled()).thenReturn(true);
        when(otpService.generateOtp()).thenReturn("123456");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        assertDoesNotThrow(() -> authService.register(registerRequest));

        // Then
        verify(userRepository, times(1)).save(any(User.class));
        verify(otpService, times(1)).saveOtp(eq(registerRequest.getEmail()), anyString());
        verify(emailService, times(1)).sendOtpEmail(eq(registerRequest.getEmail()), anyString());
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void testRegister_EmailExists() {
        // Given
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.register(registerRequest);
        });

        assertEquals(ErrorCode.EMAIL_ALREADY_USED, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should verify OTP successfully")
    void testVerifyOtp_Success() {
        // Given
        String email = "test@example.com";
        String otp = "123456";
        User pendingUser = User.builder()
                .email(email)
                .status(UserStatus.PENDING)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(pendingUser));
        when(otpService.verifyOtp(email, otp)).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(pendingUser);

        // When
        assertDoesNotThrow(() -> authService.verifyOtp(email, otp));

        // Then
        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(UserStatus.ACTIVE, pendingUser.getStatus());
    }

    @Test
    @DisplayName("Should throw exception when OTP is invalid")
    void testVerifyOtp_InvalidOtp() {
        // Given
        String email = "test@example.com";
        String otp = "wrong";
        User pendingUser = User.builder()
                .email(email)
                .status(UserStatus.PENDING)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(pendingUser));
        when(otpService.verifyOtp(email, otp)).thenReturn(false);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.verifyOtp(email, otp);
        });

        assertEquals(ErrorCode.OTP_INVALID_OR_EXPIRED, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should login successfully")
    void testLogin_Success() {
        // Given
        when(loginAttemptService.isAccountLocked(loginRequest.getEmail())).thenReturn(false);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userDetailsService.loadUserByUsername(loginRequest.getEmail())).thenReturn(testUserDetails);
        when(jwtService.generateToken(testUserDetails)).thenReturn("accessToken");
        when(jwtService.generateTokenWithExpiration(any(), any(), anyLong())).thenReturn("refreshToken");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // When
        AuthResponse response = authService.login(loginRequest);

        // Then
        assertNotNull(response);
        assertEquals("accessToken", response.getToken());
        assertEquals("refreshToken", response.getRefreshToken());
        verify(loginAttemptService, times(1)).resetFailedLoginAttempts(loginRequest.getEmail());
    }

    @Test
    @DisplayName("Should throw exception when account is locked")
    void testLogin_AccountLocked() {
        // Given
        when(loginAttemptService.isAccountLocked(loginRequest.getEmail())).thenReturn(true);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals(ErrorCode.ACCOUNT_TEMPORARILY_LOCKED, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should throw exception when account not activated")
    void testLogin_AccountNotActivated() {
        // Given
        User pendingUser = User.builder()
                .email(loginRequest.getEmail())
                .status(UserStatus.PENDING)
                .build();

        when(loginAttemptService.isAccountLocked(loginRequest.getEmail())).thenReturn(false);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(pendingUser));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals(ErrorCode.ACCOUNT_NOT_ACTIVATED, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should throw exception when credentials are invalid")
    void testLogin_InvalidCredentials() {
        // Given
        when(loginAttemptService.isAccountLocked(loginRequest.getEmail())).thenReturn(false);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals(ErrorCode.INVALID_CREDENTIALS, exception.getErrorCode());
        verify(loginAttemptService, times(1)).recordFailedLogin(loginRequest.getEmail());
    }
}

