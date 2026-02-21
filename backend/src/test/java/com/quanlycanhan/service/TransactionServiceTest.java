package com.quanlycanhan.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.quanlycanhan.entity.Category;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.CategoryRepository;
import com.quanlycanhan.repository.TransactionRepository;
import com.quanlycanhan.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("TransactionService Tests")
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private TransactionService transactionService;

    private User testUser;
    private Category testCategory;
    private Transaction testTransaction;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .build();

        testCategory = Category.builder()
                .id(1L)
                .name("Food")
                .user(testUser)
                .build();

        testTransaction = Transaction.builder()
                .id(1L)
                .user(testUser)
                .category(testCategory)
                .amount(new BigDecimal("100.00"))
                .transactionDate(LocalDate.now())
                .note("Test transaction")
                .build();
    }

    @Test
    @DisplayName("Should create transaction successfully")
    void testCreateTransaction_Success() {
        // Given
        Long userId = 1L;
        Long categoryId = 1L;
        BigDecimal amount = new BigDecimal("100.00");
        LocalDate date = LocalDate.now();
        String note = "Test note";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(categoryRepository.existsByIdAndUserOrSystemDefault(categoryId, userId)).thenReturn(true);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        // When
        Transaction result = transactionService.createTransaction(
                userId, categoryId, amount, date, note, null, null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(testTransaction.getId(), result.getId());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void testCreateTransaction_UserNotFound() {
        // Given
        Long userId = 999L;
        Long categoryId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            transactionService.createTransaction(
                    userId, categoryId, new BigDecimal("100.00"), LocalDate.now(), null, null, null, null, null);
        });

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should throw exception when category invalid")
    void testCreateTransaction_InvalidCategory() {
        // Given
        Long userId = 1L;
        Long categoryId = 999L;

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(categoryRepository.existsByIdAndUserOrSystemDefault(categoryId, userId)).thenReturn(false);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            transactionService.createTransaction(
                    userId, categoryId, new BigDecimal("100.00"), LocalDate.now(), null, null, null, null, null);
        });

        assertEquals(ErrorCode.CATEGORY_INVALID, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should get user transactions with pagination")
    void testGetUserTransactions_Success() {
        // Given
        Long userId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        Page<Transaction> transactionPage = new PageImpl<>(java.util.List.of(testTransaction));

        when(transactionRepository.findByUserIdAndDeletedFalse(userId, pageable))
                .thenReturn(transactionPage);

        // When
        Page<Transaction> result = transactionService.getUserTransactions(userId, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTransaction.getId(), result.getContent().get(0).getId());
    }

    @Test
    @DisplayName("Should update transaction successfully")
    void testUpdateTransaction_Success() {
        // Given
        Long transactionId = 1L;
        Long userId = 1L;
        BigDecimal newAmount = new BigDecimal("200.00");
        String newNote = "Updated note";

        when(transactionRepository.findByIdAndUserIdWithCategory(transactionId, userId))
                .thenReturn(Optional.of(testTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        // When
        Transaction result = transactionService.updateTransaction(
                transactionId, userId, null, newAmount, null, newNote, null, null);

        // Then
        assertNotNull(result);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should throw exception when transaction not found")
    void testUpdateTransaction_NotFound() {
        // Given
        Long transactionId = 999L;
        Long userId = 1L;

        when(transactionRepository.findByIdAndUserIdWithCategory(transactionId, userId))
                .thenReturn(Optional.empty());

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            transactionService.updateTransaction(transactionId, userId, null, null, null, null, null, null);
        });

        assertEquals(ErrorCode.TRANSACTION_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    @DisplayName("Should delete transaction (soft delete)")
    void testDeleteTransaction_Success() {
        // Given
        Long transactionId = 1L;
        Long userId = 1L;

        when(transactionRepository.findByIdAndUserIdWithCategory(transactionId, userId))
                .thenReturn(Optional.of(testTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        // When
        transactionService.deleteTransaction(transactionId, userId);

        // Then
        assertTrue(testTransaction.isDeleted());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should calculate total amount correctly")
    void testGetTotalAmount_Success() {
        // Given
        Long userId = 1L;
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        BigDecimal expectedTotal = new BigDecimal("500.00");

        when(transactionRepository.getTotalAmountByUserIdAndDateRangeNative(userId, startDate, endDate))
                .thenReturn(expectedTotal);

        // When
        BigDecimal result = transactionService.getTotalAmount(userId, startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(expectedTotal, result);
    }

    @Test
    @DisplayName("Should return zero when no transactions found")
    void testGetTotalAmount_NoTransactions() {
        // Given
        Long userId = 1L;
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(transactionRepository.getTotalAmountByUserIdAndDateRangeNative(userId, startDate, endDate))
                .thenReturn(null);
        when(transactionRepository.getTotalAmountByUserIdAndDateRange(userId, startDate, endDate))
                .thenReturn(null);

        // When
        BigDecimal result = transactionService.getTotalAmount(userId, startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result);
    }
}

