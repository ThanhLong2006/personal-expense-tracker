package com.quanlycanhan.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quanlycanhan.dto.response.ApiResponse;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller công khai - không cần authentication
 * - Endpoint test để kiểm tra API hoạt động
 * - Thông tin hệ thống công khai
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    /**
     * Endpoint test công khai - kiểm tra API hoạt động
     * GET /api/public/test
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> test() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "OK");
        data.put("message", "API đang hoạt động bình thường");
        data.put("timestamp", LocalDateTime.now());
        data.put("endpoints", Map.of(
            "register", "POST /api/auth/register",
            "login", "POST /api/auth/login",
            "verifyOtp", "POST /api/auth/verify-otp",
            "health", "GET /api/actuator/health"
        ));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * Thông tin API công khai
     * GET /api/public/info
     */
    @GetMapping("/info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Quản Lý Cá Nhân API");
        info.put("version", "1.0.0");
        info.put("description", "API backend cho ứng dụng quản lý chi tiêu cá nhân");
        info.put("publicEndpoints", Map.of(
            "register", "POST /api/auth/register - Đăng ký tài khoản mới",
            "login", "POST /api/auth/login - Đăng nhập",
            "verifyOtp", "POST /api/auth/verify-otp - Xác thực OTP",
            "resendOtp", "POST /api/auth/resend-otp?email=... - Gửi lại OTP",
            "forgotPassword", "POST /api/auth/forgot-password?email=... - Quên mật khẩu",
            "resetPassword", "POST /api/auth/reset-password?token=...&newPassword=... - Đặt lại mật khẩu"
        ));
        return ResponseEntity.ok(ApiResponse.success(info));
    }
}

