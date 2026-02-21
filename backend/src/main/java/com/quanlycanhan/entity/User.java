package com.quanlycanhan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.quanlycanhan.security.EncryptedStringAttributeConverter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity User - Người dùng hệ thống
 * - Lưu thông tin tài khoản người dùng
 * - Quan hệ 1-n với Transaction (một user có nhiều giao dịch)
 * - Quan hệ 1-n với Category (một user có nhiều danh mục)
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email", unique = true),
        @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email đăng nhập (unique)
     */
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * Mật khẩu đã mã hóa BCrypt
     */
    @Column(nullable = false, length = 255)
    private String password;

    /**
     * Họ và tên
     */
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    /**
     * Số điện thoại (optional)
     */
    @Column(length = 20)
    private String phone;

    /**
     * Avatar URL (optional)
     */
    @Column(length = 500)
    private String avatar;

    /**
     * Trạng thái tài khoản
     * - ACTIVE: Hoạt động bình thường
     * - LOCKED: Bị khóa (sai mật khẩu nhiều lần)
     * - DISABLED: Vô hiệu hóa bởi admin
     * - PENDING: Chờ xác thực OTP
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.PENDING;

    /**
     * Vai trò người dùng
     * - USER: Người dùng thường
     * - ADMIN: Quản trị viên
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.USER;

    /**
     * Đã bật 2FA TOTP chưa
     */
    @Column(name = "two_factor_enabled", nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    /**
     * Secret key cho 2FA TOTP (lưu mã hóa)
     */
    @Column(name = "two_factor_secret", length = 255)
    @Convert(converter = EncryptedStringAttributeConverter.class)
    @JsonIgnore // Không bao giờ trả secret ra API / backup
    private String twoFactorSecret;

    /**
     * Thời gian khóa tài khoản (nếu bị khóa do sai mật khẩu)
     */
    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    /**
     * Số lần đăng nhập sai liên tiếp
     */
    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    /**
     * Ngôn ngữ ưa thích (vi, en)
     */
    @Column(length = 10)
    @Builder.Default
    private String language = "vi";

    /**
     * Theme ưa thích (light, dark)
     */
    @Column(length = 10)
    @Builder.Default
    private String theme = "light";

    /**
     * Thời gian tạo tài khoản
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Thời gian cập nhật cuối cùng
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Danh sách giao dịch của user (quan hệ 1-n)
     * - Cascade: Xóa user thì xóa luôn transactions
     * - Fetch: Lazy (chỉ load khi cần)
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

    /**
     * Danh sách danh mục của user (quan hệ 1-n)
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Builder.Default
    private List<Category> categories = new ArrayList<>();

    /**
     * Enum trạng thái user
     */
    public enum UserStatus {
        ACTIVE, // Hoạt động
        LOCKED, // Bị khóa
        DISABLED, // Vô hiệu hóa
        PENDING // Chờ xác thực
    }

    /**
     * Enum vai trò user
     */
    public enum UserRole {
        USER, // Người dùng thường
        ADMIN // Quản trị viên
    }
}
