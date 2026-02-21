package com.quanlycanhan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity Notification - Thông báo
 * - Lưu thông báo cho người dùng
 * - Nhắc nhở chi tiêu định kỳ, cảnh báo vượt ngân sách, etc.
 */
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_user_read", columnList = "user_id, is_read"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User nhận thông báo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Tiêu đề thông báo
     */
    @Column(nullable = false, length = 200)
    private String title;

    /**
     * Nội dung thông báo
     */
    @Column(nullable = false, length = 1000)
    private String message;

    /**
     * Loại thông báo
     * - INFO: Thông tin
     * - WARNING: Cảnh báo
     * - ERROR: Lỗi
     * - SUCCESS: Thành công
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private NotificationType type = NotificationType.INFO;

    /**
     * Đã đọc chưa
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    /**
     * Link liên kết (optional)
     */
    @Column(length = 500)
    private String link;

    /**
     * Thời gian tạo
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Enum loại thông báo
     */
    public enum NotificationType {
        INFO,
        WARNING,
        ERROR,
        SUCCESS
    }
}

