package com.quanlycanhan.mapper;

import com.quanlycanhan.dto.response.TransactionResponseDTO;
import com.quanlycanhan.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper để convert Transaction Entity sang TransactionResponseDTO
 * - Ẩn các field nhạy cảm (user, internal fields)
 * - Chỉ expose các field cần thiết cho API response
 */
@Component
public class TransactionMapper {

    /**
     * Convert Transaction Entity sang TransactionResponseDTO
     */
    public TransactionResponseDTO toDTO(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        TransactionResponseDTO.CategoryInfo categoryInfo = null;
        if (transaction.getCategory() != null) {
            categoryInfo = TransactionResponseDTO.CategoryInfo.builder()
                    .id(transaction.getCategory().getId())
                    .name(transaction.getCategory().getName())
                    .icon(transaction.getCategory().getIcon())
                    .color(transaction.getCategory().getColor())
                    .type(transaction.getCategory().getType())
                    .description(transaction.getCategory().getDescription())
                    .build();
        }

        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .category(categoryInfo)
                .amount(transaction.getAmount())
                .transactionDate(transaction.getTransactionDate())
                .note(transaction.getNote())
                .location(transaction.getLocation())
                .receiptImage(transaction.getReceiptImage())
                .createdBy(transaction.getCreatedBy() != null ? transaction.getCreatedBy().name() : null)
                .createdByAdminId(transaction.getCreatedByAdminId())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    /**
     * Convert List<Transaction> sang List<TransactionResponseDTO>
     */
    public List<TransactionResponseDTO> toDTOList(List<Transaction> transactions) {
        if (transactions == null) {
            return null;
        }
        return transactions.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert Page<Transaction> sang Page<TransactionResponseDTO>
     */
    public org.springframework.data.domain.Page<TransactionResponseDTO> toDTOPage(Page<Transaction> transactionPage) {
        if (transactionPage == null) {
            return null;
        }
        List<TransactionResponseDTO> dtoList = toDTOList(transactionPage.getContent());
        return new org.springframework.data.domain.PageImpl<>(
                dtoList,
                transactionPage.getPageable(),
                transactionPage.getTotalElements()
        );
    }
}

