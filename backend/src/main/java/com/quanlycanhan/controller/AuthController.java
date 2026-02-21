package com.quanlycanhan.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quanlycanhan.dto.request.LoginRequest;
import com.quanlycanhan.dto.request.RegisterRequest;
import com.quanlycanhan.dto.request.VerifyOtpRequest;
import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.dto.response.AuthResponse;
import com.quanlycanhan.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller xử lý authentication
 * - Đăng ký
 * - Verify OTP
 * - Đăng nhập
 * - Quên mật khẩu
 * - Reset mật khẩu
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${security.token.use-http-only-cookie:false}")
    private boolean useHttpOnlyCookie;

    @Value("${security.token.cookie-name:refreshToken}")
    private String cookieName;

    @Value("${security.token.cookie-domain:}")
    private String cookieDomain;

    @Value("${security.token.cookie-secure:false}")
    private boolean cookieSecure;

    @Value("${security.token.cookie-same-site:lax}")
    private String cookieSameSite;

    @Value("${jwt.refresh-expiration:604800000}")
    private Long refreshExpiration;

    /**
     * Đăng ký tài khoản mới
     * - Nhận email, password, fullName
     * - Gửi OTP về email
     */
@PostMapping("/register")
public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
    // CHỈ GỌI REGISTER – KHÔNG GỌI LOGIN!!!
    authService.register(request);
    
    // Trả về thông báo thành công – KHÔNG TRẢ TOKEN!!!
    return ResponseEntity.ok(ApiResponse.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.",
        null
    ));
}

    /**
     * Verify OTP sau khi đăng ký
     * - Xác thực OTP
     * - Kích hoạt tài khoản
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.success(
            "Xác thực OTP thành công. Bạn có thể đăng nhập ngay bây giờ.",
            null
        ));
    }

    /**
     * Resend OTP
     * - Gửi lại mã OTP mới
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestParam String email) {
        authService.resendOtp(email);
        return ResponseEntity.ok(ApiResponse.success(
            "Đã gửi lại mã OTP. Vui lòng kiểm tra email.",
            null
        ));
    }

    /**
     * Đăng nhập
     * - Email + password
     * - Có thể yêu cầu 2FA TOTP
     * - Trả về JWT token
     * - Có thể set refresh token vào HttpOnly Cookie nếu được bật
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpResponse) {
        AuthResponse response = authService.login(request);
        
        // Nếu bật HttpOnly Cookie, set refresh token vào cookie thay vì trả về body
        if (useHttpOnlyCookie && response.getRefreshToken() != null) {
            setRefreshTokenCookie(httpResponse, response.getRefreshToken());
            // Xóa refresh token khỏi response body để bảo mật
            response = AuthResponse.builder()
                    .token(response.getToken())
                    .refreshToken(null) // Không trả về trong body
                    .type(response.getType())
                    .user(response.getUser())
                    .build();
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @RequestParam(required = false) String refreshToken,
            jakarta.servlet.http.HttpServletRequest request,
            HttpServletResponse httpResponse) {
        
        // Nếu dùng HttpOnly Cookie, lấy refresh token từ cookie
        if (useHttpOnlyCookie && refreshToken == null) {
            refreshToken = getRefreshTokenFromCookie(request);
            if (refreshToken == null) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Refresh token không tìm thấy"));
            }
        }
        
        if (refreshToken == null) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Refresh token là bắt buộc"));
        }
        
        AuthResponse response = authService.refresh(refreshToken);
        
        // Nếu dùng HttpOnly Cookie, cập nhật cookie mới
        if (useHttpOnlyCookie && response.getRefreshToken() != null) {
            setRefreshTokenCookie(httpResponse, response.getRefreshToken());
            // Xóa refresh token khỏi response body
            response = AuthResponse.builder()
                    .token(response.getToken())
                    .refreshToken(null)
                    .type(response.getType())
                    .user(response.getUser())
                    .build();
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Set refresh token vào HttpOnly Cookie
     */
    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure); // true khi dùng HTTPS
        cookie.setPath("/");
        
        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.setDomain(cookieDomain);
        }
        
        // Set SameSite attribute (cần Spring Boot 2.6+)
        // Note: SameSite được set qua response header, không phải cookie attribute trực tiếp
        int maxAge = (int) (refreshExpiration / 1000); // Convert milliseconds to seconds
        cookie.setMaxAge(maxAge);
        
        response.addCookie(cookie);
        
        // Set SameSite header manually (Spring Boot sẽ tự động xử lý nếu dùng Servlet 6.0+)
        // Với Spring Boot 3.x, có thể cần cấu hình thêm trong SecurityConfig
    }
    
    /**
     * Lấy refresh token từ cookie
     */
    private String getRefreshTokenFromCookie(jakarta.servlet.http.HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /**
     * Quên mật khẩu
     * - Gửi link reset password về email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.success(
            "Đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra email.",
            null
        ));
    }

    /**
     * Reset mật khẩu
     * - Đặt lại mật khẩu mới với token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.success(
            "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.",
            null
        ));
    }
}

