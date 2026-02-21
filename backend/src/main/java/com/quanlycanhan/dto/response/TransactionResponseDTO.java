package com.quanlycanhan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO response cho Transaction
 * - Ẩn các field nhạy cảm của Entity (user, internal fields)
 * - Chỉ expose các field cần thiết cho frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponseDTO {

    private Long id;
    private CategoryInfo category;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private String note;
    private String location;
    private String receiptImage; // URL hoặc base64 (nếu cần)
    private String createdBy; // USER hoặc ADMIN
    private Long createdByAdminId; // null nếu createdBy = USER
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Nested DTO cho Category info (chỉ expose các field cần thiết)
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String icon;
        private String color;
        private String type; // expense hoặc income
        private String description;
    }
}

