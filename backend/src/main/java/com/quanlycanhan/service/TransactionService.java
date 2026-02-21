package com.quanlycanhan.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quanlycanhan.entity.Category;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.CategoryRepository;
import com.quanlycanhan.repository.TransactionRepository;
import com.quanlycanhan.repository.UserRepository;
import com.quanlycanhan.service.FileStorageService;

import lombok.RequiredArgsConstructor;

/**
 * Service xử lý giao dịch chi tiêu
 * - CRUD giao dịch
 * - Thống kê chi tiêu
 * - Import/Export
 */
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    /**
     * Lấy danh sách giao dịch của user (phân trang)
     * Đảm bảo category được load để tránh LazyInitializationException
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<Transaction> getUserTransactions(Long userId, Pageable pageable) {
        // Đã dùng EntityGraph trong repository để load category, không cần trigger lazy load thủ công
        return transactionRepository.findByUserIdAndDeletedFalse(userId, pageable);
    }

    /**
     * Tìm kiếm giao dịch của user
     * Đảm bảo category được load để tránh LazyInitializationException
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<Transaction> searchTransactions(Long userId, String keyword, Pageable pageable) {
        // Đã dùng EntityGraph trong repository để load category, không cần trigger lazy load thủ công
        return transactionRepository.searchTransactions(userId, keyword, pageable);
    }

    /**
     * Lấy giao dịch theo ID với category được load
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Transaction getTransactionById(Long id, Long userId) {
        // Lấy theo id + userId để đảm bảo quyền sở hữu ngay tại query, kèm category
        return transactionRepository.findByIdAndUserIdWithCategory(id, userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.TRANSACTION_NOT_FOUND));
    }

    /**
     * Tạo giao dịch mới
     */
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = {"totalAmount", "totalByCategory", "aiPrediction"}, key = "#userId")
    public Transaction createTransaction(Long userId, Long categoryId, BigDecimal amount,
                                       LocalDate transactionDate, String note, String location,
                                       String receiptImage, Transaction.CreatedBy createdBy, Long createdByAdminId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // Kiểm tra category có thuộc user hoặc là system default không
        if (!categoryRepository.existsByIdAndUserOrSystemDefault(categoryId, userId)) {
            throw new BusinessException(ErrorCode.CATEGORY_INVALID);
        }

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));

        Transaction transaction = Transaction.builder()
            .user(user)
            .category(category)
            .amount(amount)
            .transactionDate(transactionDate)
            .note(note)
            .location(location)
            .receiptImage(receiptImage)
            .createdBy(createdBy)
            .createdByAdminId(createdByAdminId)
            .build();

        // EntityGraph sẽ lo việc load category khi cần; không trigger lazy load thủ công
        return transactionRepository.save(transaction);
    }

    /**
     * Cập nhật giao dịch
     */
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = {"totalAmount", "totalByCategory", "aiPrediction"}, key = "#userId")
    public Transaction updateTransaction(Long id, Long userId, Long categoryId, BigDecimal amount,
                                       LocalDate transactionDate, String note, String location,
                                       String receiptImage) {
        Transaction transaction = getTransactionById(id, userId);

        // Cập nhật category nếu có
        if (categoryId != null) {
            if (!categoryRepository.existsByIdAndUserOrSystemDefault(categoryId, userId)) {
                throw new BusinessException(ErrorCode.CATEGORY_INVALID);
            }
            Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
            transaction.setCategory(category);
        }

        // Cập nhật các trường khác
        if (amount != null) {
            transaction.setAmount(amount);
        }
        if (transactionDate != null) {
            transaction.setTransactionDate(transactionDate);
        }
        if (note != null) {
            transaction.setNote(note);
        }
        if (location != null) {
            transaction.setLocation(location);
        }
        if (receiptImage != null) {
            // Xóa file cũ nếu có (nếu là URL, không phải base64)
            String oldReceiptImage = transaction.getReceiptImage();
            if (oldReceiptImage != null && oldReceiptImage.startsWith("/api/files/")) {
                fileStorageService.deleteFile(oldReceiptImage);
            }
            transaction.setReceiptImage(receiptImage);
        }

        // EntityGraph sẽ lo việc load category khi cần; không trigger lazy load thủ công
        return transactionRepository.save(transaction);
    }

    /**
     * Xóa giao dịch
     */
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = {"totalAmount", "totalByCategory", "aiPrediction"}, key = "#userId")
    public void deleteTransaction(Long id, Long userId) {
        Transaction transaction = getTransactionById(id, userId);
        
        // Xóa file ảnh hóa đơn nếu có (nếu là URL, không phải base64)
        String receiptImage = transaction.getReceiptImage();
        if (receiptImage != null && receiptImage.startsWith("/api/files/")) {
            fileStorageService.deleteFile(receiptImage);
        }

        // Soft delete thay vì xóa cứng
        transaction.setDeleted(true);
        transactionRepository.save(transaction);
    }

    /**
     * Tính tổng chi của user trong khoảng thời gian
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public BigDecimal getTotalAmount(Long userId, LocalDate startDate, LocalDate endDate) {
        try {
            // Prefer native query, but treat its result defensively (DB driver may return Double/BigDecimal)
            Object nativeResult = transactionRepository.getTotalAmountByUserIdAndDateRangeNative(userId, startDate, endDate);
            if (nativeResult != null) {
                if (nativeResult instanceof BigDecimal) return (BigDecimal) nativeResult;
                if (nativeResult instanceof Number) return BigDecimal.valueOf(((Number) nativeResult).doubleValue());
                try { return new BigDecimal(nativeResult.toString()); } catch (Exception ignored) {}
            }
        } catch (Exception ignored) {
            // fall back to JPQL/raw handling below
        }

        Object raw = transactionRepository.getTotalAmountByUserIdAndDateRange(userId, startDate, endDate);
        if (raw == null) return BigDecimal.ZERO;
        if (raw instanceof BigDecimal) return (BigDecimal) raw;
        if (raw instanceof Number) {
            return BigDecimal.valueOf(((Number) raw).doubleValue());
        }
        try {
            return new BigDecimal(raw.toString());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Tính tổng chi theo danh mục
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Object[]> getTotalAmountByCategory(Long userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.getTotalAmountByCategory(userId, startDate, endDate);
    }

    public List<Object[]> getTotalAmountByCategoryAndType(Long userId, LocalDate startDate, LocalDate endDate, String type) {
        return transactionRepository.getTotalAmountByCategoryAndType(userId, startDate, endDate, type);
    }

    public Object[] getIncomeAndExpenseTotals(Long userId, LocalDate startDate, LocalDate endDate) {
        Object[] raw = transactionRepository.getIncomeAndExpenseTotals(userId, startDate, endDate);
        if (raw == null) return new Object[]{BigDecimal.ZERO, BigDecimal.ZERO};
        return raw;
    }

    /**
     * Lấy giao dịch trong khoảng thời gian (phân trang) - OPTIMIZED
     * Sử dụng Pageable trong query để phân trang ngay tại database, không load toàn bộ dữ liệu lên RAM
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<Transaction> getTransactionsByDateRange(Long userId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        // If no date range specified, get all transactions
        if (startDate == null && endDate == null) {
            return getUserTransactions(userId, pageable);
        }
        
        // Set default dates if only one is provided
        if (startDate == null) {
            startDate = LocalDate.of(1970, 1, 1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        // Use Pageable query - database handles pagination efficiently, EntityGraph load luôn category
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate, pageable);
    }
    
    /**
     * Lấy giao dịch trong khoảng thời gian (không phân trang - for backward compatibility)
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Transaction> getTransactionsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        // EntityGraph trong repository sẽ load luôn category để tránh N+1 query
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }
}

