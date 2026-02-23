package com.quanlycanhan.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Validator JWT secret khi khởi động - Production profile.
 * Đảm bảo JWT_SECRET đủ độ dài và phức tạp (>= 32 ký tự / 256 bits).
 */
@Slf4j
@Component
@Profile("prod")
public class JwtSecretValidator {

    private static final int MIN_SECRET_LENGTH = 32;
    private static final String DEV_DEFAULT_SECRET = "dev-change-me-in-production-minimum-32-chars";

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @EventListener(ApplicationReadyEvent.class)
    public void validateJwtSecret() {
        if (jwtSecret == null || jwtSecret.isBlank() || DEV_DEFAULT_SECRET.equals(jwtSecret)) {
            log.error("=".repeat(60));
            log.error("LỖI BẢO MẬT: JWT_SECRET chưa được cấu hình!");
            log.error("Production BẮT BUỘC set biến môi trường JWT_SECRET.");
            log.error("Generate: openssl rand -base64 48");
            log.error("=".repeat(60));
            throw new IllegalStateException("JWT_SECRET is required in production. Set environment variable JWT_SECRET (min 32 chars).");
        }
        if (jwtSecret.length() < MIN_SECRET_LENGTH) {
            log.error("=".repeat(60));
            log.error("LỖI BẢO MẬT: JWT_SECRET quá ngắn (cần >= {} ký tự)", MIN_SECRET_LENGTH);
            log.error("Generate: openssl rand -base64 48");
            log.error("=".repeat(60));
            throw new IllegalStateException("JWT_SECRET must be at least " + MIN_SECRET_LENGTH + " characters for security.");
        }
        log.info("JWT secret validation passed (length={})", jwtSecret.length());
    }
}

