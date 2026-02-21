package com.quanlycanhan.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity Category - Danh mục chi tiêu
 * - Lưu danh mục chi tiêu của người dùng
 * - Quan hệ n-1 với User (nhiều danh mục thuộc 1 user)
 * - Quan hệ 1-n với Transaction (1 danh mục có nhiều giao dịch)
 * - Có danh mục mặc định của hệ thống (systemDefault = true)
 */
@Entity
@Table(name = "categories", indexes = {
        @Index(name = "idx_user", columnList = "user_id"),
        @Index(name = "idx_system_default", columnList = "system_default"),
        @Index(name = "idx_user_deleted_type", columnList = "user_id, deleted, type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User sở hữu danh mục này (null nếu là danh mục mặc định hệ thống)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    /**
     * Tên danh mục (ví dụ: "Ăn uống", "Đi lại", "Mua sắm")
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Icon danh mục (emoji hoặc icon class)
     * Ví dụ: "🍔", "🚗", "🛍️"
     */
    @Column(length = 50)
    private String icon;

    /**
     * Màu sắc danh mục (hex code)
     * Ví dụ: "#FF5733", "#00C4B4"
     */
    @Column(length = 20)
    private String color;

    /**
     * Loại danh mục (expense / income)
     */
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String type = "expense";

    /**
     * Mô tả danh mục
     */
    @Column(length = 500)
    private String description;

    /**
     * Là danh mục mặc định của hệ thống không
     * - true: Danh mục hệ thống, tất cả user đều thấy
     * - false: Danh mục riêng của user
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean systemDefault = false;

    /**
     * Thứ tự hiển thị
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    /**
     * Đã xóa chưa (soft delete)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    /**
     * Thời gian tạo
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
     * Danh sách giao dịch thuộc danh mục này
     */
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();
}
