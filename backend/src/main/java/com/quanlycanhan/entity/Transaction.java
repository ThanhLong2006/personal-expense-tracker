package com.quanlycanhan.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity Transaction - Giao dịch chi tiêu
 * - Lưu thông tin tiền đã tiêu của người dùng
 * - Quan hệ n-1 với User (nhiều giao dịch thuộc 1 user)
 * - Quan hệ n-1 với Category (mỗi giao dịch thuộc 1 danh mục)
 * - QUAN TRỌNG: Chỉ lưu tiền đã tiêu, không có số dư, không có ví điện tử
 */
@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_user_date", columnList = "user_id, transaction_date"),
        @Index(name = "idx_category", columnList = "category_id"),
        @Index(name = "idx_date", columnList = "transaction_date"),
        @Index(name = "idx_user_category_date", columnList = "user_id, category_id, transaction_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User sở hữu giao dịch này
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    /**
     * Danh mục chi tiêu
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({ "transactions", "user" })
    private Category category;

    /**
     * Số tiền đã tiêu (VND)
     * - Luôn là số dương
     * - Precision: 15, Scale: 2 (tối đa 999,999,999,999,999.99)
     */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    /**
     * Ngày chi tiêu
     */
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    /**
     * Ghi chú mô tả giao dịch
     */
    @Column(length = 500)
    private String note;

    /**
     * Ảnh hóa đơn – CHỈ LƯU URL / PATH NGẮN
     * Tuyệt đối không lưu base64 hoặc binary trong cột này để tránh phình dữ liệu.
     */
    @Column(name = "receipt_image", length = 255)
    private String receiptImage;

    /**
     * Địa điểm chi tiêu (optional)
     */
    @Column(length = 200)
    private String location;

    /**
     * Giao dịch được tạo bởi ai
     * - USER: Người dùng tự nhập
     * - ADMIN: Admin nhập thay cho user
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "created_by", nullable = false, length = 20)
    @Builder.Default
    private CreatedBy createdBy = CreatedBy.USER;

    /**
     * ID của admin tạo giao dịch (nếu createdBy = ADMIN)
     */
    @Column(name = "created_by_admin_id")
    private Long createdByAdminId;

    /**
     * Thời gian tạo giao dịch
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
     * Soft delete flag – thay cho xóa cứng trong database.
     */
    @Column(name = "deleted", nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    public boolean isDeleted() {
        return Boolean.TRUE.equals(this.deleted);
    }

    /**
     * Enum người tạo giao dịch
     */
    public enum CreatedBy {
        USER, // Người dùng tự nhập
        ADMIN // Admin nhập thay
    }
}
