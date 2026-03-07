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
 * Entity RecurringTransaction - Cấu hình giao dịch định kỳ
 * - Dùng để tự động tạo giao dịch theo chu kỳ (ngày, tuần, tháng, năm)
 */
@Entity
@Table(name = "recurring_transactions", indexes = {
        @Index(name = "idx_recurring_user", columnList = "user_id"),
        @Index(name = "idx_recurring_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({ "transactions", "user" })
    private Category category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "VND";

    /**
     * Chu kỳ lặp lại
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Frequency frequency;

    /**
     * Ngày bắt đầu áp dụng
     */
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /**
     * Ngày kết thúc (null nếu không xác định)
     */
    @Column(name = "end_date")
    private LocalDate endDate;

    /**
     * Lần cuối cùng giao dịch được tạo tự động
     */
    @Column(name = "last_executed_date")
    private LocalDate lastExecutedDate;

    @Column(length = 500)
    private String note;

    /**
     * Trạng thái (đang hoạt động hoặc tạm dừng)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum Frequency {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }

    public enum Status {
        ACTIVE, PAUSED
    }
}
