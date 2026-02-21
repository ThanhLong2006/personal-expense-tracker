package com.quanlycanhan.entity;

import com.quanlycanhan.entity.User.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity AdminActivityLog - Log hoạt động admin
 * - Ghi lại mọi hành động của admin
 * - Quản lý user, quản lý giao dịch của user, cấu hình hệ thống
 */
@Entity
@Table(name = "admin_activity_logs", indexes = {
    @Index(name = "idx_admin_id", columnList = "admin_id"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Admin thực hiện hành động
     */
    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    /**
     * Email của admin (lưu để tra cứu nhanh)
     */
    @Column(name = "admin_email", length = 100)
    private String adminEmail;

    /**
     * Hành động thực hiện
     * Ví dụ: "LOCK_USER", "UNLOCK_USER", "CREATE_TRANSACTION_FOR_USER", "DELETE_TRANSACTION"
     */
    @Column(nullable = false, length = 100)
    private String action;

    /**
     * Mô tả chi tiết hành động
     */
    @Column(length = 1000)
    private String description;

    /**
     * ID đối tượng bị tác động (user_id, transaction_id, etc.)
     */
    @Column(name = "target_id")
    private Long targetId;

    /**
     * Loại đối tượng bị tác động
     * Ví dụ: "USER", "TRANSACTION", "CATEGORY", "SYSTEM"
     */
    @Column(name = "target_type", length = 50)
    private String targetType;

    /**
     * IP address của admin
     */
    @Column(length = 50)
    private String ipAddress;

    /**
     * User agent (browser, device)
     */
    @Column(length = 500)
    private String userAgent;

    /**
     * Thời gian thực hiện
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

