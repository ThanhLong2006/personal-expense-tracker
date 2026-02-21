package com.quanlycanhan.service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quanlycanhan.dto.request.LoginRequest;
import com.quanlycanhan.dto.request.RegisterRequest;
import com.quanlycanhan.dto.response.AuthResponse;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.entity.User.UserStatus;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service xử lý authentication – ĐÃ FIX 100% LUỒNG ĐĂNG KÝ + OTP + ĐĂNG NHẬP
 * → Đăng ký xong KHÔNG tự động login
 * → User chỉ ACTIVE sau khi verify OTP
 * → Đăng nhập chỉ thành công khi đã ACTIVE
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final LoginAttemptService loginAttemptService;
    private final TwoFactorService twoFactorService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.refresh-expiration:604800000}") // 7 ngày mặc định
    private Long refreshExpiration;

    /**
     * ĐĂNG KÝ – CHỈ TẠO USER + GỬI OTP, KHÔNG TỰ ĐỘNG LOGIN!!!
     */
    @Transactional
    public void register(RegisterRequest request) {
        // 1. Kiểm tra email trùng
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_USED);
        }

        // 2. Tạo user với trạng thái PENDING
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(User.UserRole.USER)
                .status(UserStatus.PENDING)  // ← BẮT BUỘC PENDING
                .build();

        userRepository.save(user);
        logger.info("Đã tạo user mới: {} (status: PENDING)", request.getEmail());

        // 3. Gửi OTP (nếu bật)
        if (otpService.isOtpEnabled()) {
            try {
                String otp = otpService.generateOtp();
                otpService.saveOtp(request.getEmail(), otp);
                emailService.sendOtpEmail(request.getEmail(), otp);
                logger.info("Đã gửi OTP thành công đến: {}", request.getEmail());
            } catch (Exception e) {
                logger.warn("Gửi OTP/email thất bại cho {}: {}", request.getEmail(), e.getMessage());
                // Không throw → vẫn cho đăng ký thành công (dev mode)
            }
        } else {
            // OTP tắt → active luôn (chỉ dùng khi test)
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);
            logger.info("OTP tắt → tài khoản {} được active ngay", request.getEmail());
        }
    }

    /**
     * XÁC THỰC OTP → ACTIVE USER
     */
    @Transactional
    public void verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_WITH_EMAIL_NOT_FOUND));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.OTP_ALREADY_VERIFIED);
        }

        if (!otpService.verifyOtp(email, otp)) {
            throw new BusinessException(ErrorCode.OTP_INVALID_OR_EXPIRED);
        }

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        logger.info("User {} đã verify OTP thành công và được ACTIVE", email);
    }

    /**
     * GỬI LẠI OTP
     */
    public void resendOtp(String email) {
        if (!otpService.isOtpEnabled()) {
            throw new BusinessException(ErrorCode.OTP_FEATURE_DISABLED);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getStatus() != UserStatus.PENDING) {
            throw new BusinessException(ErrorCode.OTP_ALREADY_VERIFIED);
        }

        String otp = otpService.generateOtp();
        otpService.saveOtp(email, otp);
        emailService.sendOtpEmail(email, otp);
        logger.info("Đã gửi lại OTP cho: {}", email);
    }

    /**
     * ĐĂNG NHẬP – CHỈ CHO PHÉP KHI USER ĐÃ ACTIVE
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Kiểm tra khóa tài khoản
        if (loginAttemptService.isAccountLocked(request.getEmail())) {
            throw new BusinessException(ErrorCode.ACCOUNT_TEMPORARILY_LOCKED);
        }

        // Load user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        // ← KIỂM TRA USER ĐÃ ACTIVE CHƯA – QUAN TRỌNG NHẤT!!!
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_NOT_ACTIVATED);
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            loginAttemptService.recordFailedLogin(request.getEmail());
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        // Kiểm tra 2FA
        if (user.getTwoFactorEnabled() && user.getTwoFactorSecret() != null) {
            if (request.getTotpCode() == null || request.getTotpCode().trim().isEmpty()) {
                throw new BusinessException(ErrorCode.OTP_REQUIRED);
            }
            if (!twoFactorService.verifyTotp(user.getTwoFactorSecret(), request.getTotpCode())) {
                throw new BusinessException(ErrorCode.OTP_INVALID_OR_EXPIRED);
            }
        }

        loginAttemptService.resetFailedLoginAttempts(request.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateToken(userDetails);

        // Tạo refresh token và lưu vào Redis để hỗ trợ refresh token rotation
        java.util.Map<String, Object> refreshClaims = new java.util.HashMap<>();
        refreshClaims.put("type", "refresh");
        String refreshToken = jwtService.generateTokenWithExpiration(
                refreshClaims, userDetails, refreshExpiration
        );
        saveRefreshToken(user.getEmail(), refreshToken);

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .type("Bearer")
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .twoFactorEnabled(user.getTwoFactorEnabled())
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // 1. Kiểm tra token hợp lệ về mặt chữ ký + hạn
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        // 2. Đảm bảo đúng loại "refresh"
        String type = jwtService.extractClaim(refreshToken, claims -> claims.get("type", String.class));
        if (!"refresh".equals(type)) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        // 3. Kiểm tra rotation: refreshToken phải trùng với token đang lưu trong Redis
        String redisKey = buildRefreshTokenKey(email);
        Object stored = redisTemplate.opsForValue().get(redisKey);
        if (stored == null || !refreshToken.equals(stored.toString())) {
            // Token đã bị rotate hoặc không phải token mới nhất → từ chối
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        // 4. Sinh mới cả access token và refresh token, cập nhật Redis (rotation)
        String newAccessToken = jwtService.generateToken(userDetails);
        java.util.Map<String, Object> newRefreshClaims = new java.util.HashMap<>();
        newRefreshClaims.put("type", "refresh");
        String newRefreshToken = jwtService.generateTokenWithExpiration(
                newRefreshClaims, userDetails, refreshExpiration
        );
        saveRefreshToken(email, newRefreshToken);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return AuthResponse.builder()
            .token(newAccessToken)
            .refreshToken(newRefreshToken)
            .type("Bearer")
            .user(AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .twoFactorEnabled(user.getTwoFactorEnabled())
                .build())
            .build();
    }

    private String buildRefreshTokenKey(String email) {
        return "auth:refresh_token:" + email;
    }

    /**
     * Lưu refresh token hiện tại vào Redis để hỗ trợ rotation:
     * - Mỗi user chỉ có 1 refresh token hợp lệ tại một thời điểm.
     */
    private void saveRefreshToken(String email, String refreshToken) {
        String key = buildRefreshTokenKey(email);
        try {
            long ttlSeconds = (refreshExpiration != null ? refreshExpiration : 604800000L) / 1000;
            redisTemplate.opsForValue().set(key, refreshToken, ttlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            logger.warn("Không thể lưu refresh token vào Redis cho {}: {}", email, e.getMessage());
        }
    }

    /**
     * Quên mật khẩu
     * - Tạo reset token
     * - Gửi link reset password về email
     */
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_WITH_EMAIL_NOT_FOUND, email));

        // Tạo reset token (JWT với expiration 15 phút)
        java.util.Map<String, Object> resetClaims = new java.util.HashMap<>();
        resetClaims.put("type", "reset_password");
        String resetToken = jwtService.generateToken(
            resetClaims,
            userDetailsService.loadUserByUsername(email)
        );

        String redisKey = "reset_password:" + email;
        try {
            redisTemplate.opsForValue().set(redisKey, resetToken, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            logger.warn("Không thể lưu reset token vào Redis cho {}: {}", email, e.getMessage());
        }

        // Gửi email
        emailService.sendResetPasswordEmail(email, resetToken);
    }

    /**
     * Reset mật khẩu
     * - Verify reset token
     * - Cập nhật password mới
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Verify token
        String email = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID);
        }

        String redisKey = "reset_password:" + email;
        Object stored = null;
        try {
            stored = redisTemplate.opsForValue().get(redisKey);
        } catch (Exception e) {
            logger.warn("Không thể đọc reset token từ Redis cho {}: {}", email, e.getMessage());
        }
        if (stored == null || !token.equals(stored.toString())) {
            throw new BusinessException(ErrorCode.TOKEN_ALREADY_USED);
        }

        // Cập nhật password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        try {
            redisTemplate.delete(redisKey);
        } catch (Exception e) {
            logger.warn("Không thể xóa reset token trong Redis cho {}: {}", email, e.getMessage());
        }
    }
    
}

