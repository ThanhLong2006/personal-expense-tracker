package com.quanlycanhan.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.quanlycanhan.entity.Transaction;

/**
 * Repository cho Transaction entity
 * - Tìm kiếm giao dịch theo user, ngày, danh mục
 * - Thống kê tổng chi theo khoảng thời gian
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Tìm tất cả giao dịch của user (phân trang) kèm category để tránh N+1 query.
     *
     * NOTE: Không bake ORDER BY trong method name, để Pageable quyết định.
     * Sử dụng EntityGraph để load luôn category trong 1 round-trip.
     */
    @EntityGraph(attributePaths = "category")
    Page<Transaction> findByUserIdAndDeletedFalse(Long userId, Pageable pageable);

    /**
     * Tìm giao dịch của user trong khoảng thời gian (không phân trang - for backward compatibility)
     * Kèm category để tránh N+1 query.
     */
    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.deleted = false " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * Tìm giao dịch của user trong khoảng thời gian (phân trang - OPTIMIZED)
     * Sử dụng Pageable để phân trang ngay tại database, không load toàn bộ dữ liệu lên RAM
     */
    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.deleted = false " +
            "AND t.transactionDate BETWEEN :startDate AND :endDate ")
    Page<Transaction> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );

    /**
     * Tìm giao dịch của user theo danh mục, kèm category để tránh N+1 query
     */
    @EntityGraph(attributePaths = "category")
    Page<Transaction> findByUserIdAndCategoryIdAndDeletedFalse(
        Long userId, Long categoryId, Pageable pageable
    );

    /**
     * Tìm kiếm giao dịch của user (theo note, amount) kèm category để tránh N+1 query
     */
    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND t.deleted = false " +
            "AND (:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(t.note) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(t.amount AS string) LIKE CONCAT('%', :keyword, '%'))")
    Page<Transaction> searchTransactions(
        @Param("userId") Long userId,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    /**
     * Tính tổng chi của user trong khoảng thời gian
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND t.deleted = false " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    Object getTotalAmountByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = :userId AND deleted = 0 AND transaction_date BETWEEN :startDate AND :endDate", nativeQuery = true)
    Object getTotalAmountByUserIdAndDateRangeNative(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * Tính tổng chi của user theo danh mục trong khoảng thời gian
     */
    @Query("SELECT t.category.id, COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND t.deleted = false " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category.id")
    List<Object[]> getTotalAmountByCategory(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * Tính tổng theo danh mục nhưng chỉ lấy các danh mục có `type` tương ứng ("expense" hoặc "income").
     */
    @Query("SELECT t.category.id, COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND t.deleted = false " +
           "AND t.category.type = :type " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category.id")
    List<Object[]> getTotalAmountByCategoryAndType(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("type") String type
    );

    /**
     * Tính tổng income / expense trong khoảng thời gian (tách theo category.type)
     */
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN t.category.type = 'income' THEN t.amount ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN t.category.type = 'expense' THEN t.amount ELSE 0 END), 0) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND t.deleted = false " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    Object[] getIncomeAndExpenseTotals(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * Đếm số giao dịch của user
     */
    long countByUserIdAndDeletedFalse(Long userId);

    /**
     * Lấy giao dịch theo id + userId, kèm category để tránh N+1 và đảm bảo quyền sở hữu.
     */
    @EntityGraph(attributePaths = "category")
    @Query("SELECT t FROM Transaction t WHERE t.id = :id AND t.user.id = :userId AND t.deleted = false")
    java.util.Optional<Transaction> findByIdAndUserIdWithCategory(
        @Param("id") Long id,
        @Param("userId") Long userId
    );

    /**
     * Lấy tất cả giao dịch (admin) kèm category để tránh N+1 query.
     */
    @EntityGraph(attributePaths = "category")
    Page<Transaction> findAllByDeletedFalse(Pageable pageable);

    /**
     * Tính tổng chi của user (tất cả thời gian)
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.deleted = false")
    Object getTotalAmountByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = :userId AND deleted = 0", nativeQuery = true)
    Object getTotalAmountByUserIdNative(@Param("userId") Long userId);
    
    /**
     * Tính tổng số tiền từ tất cả transactions (cho admin statistics)
     */
    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE deleted = 0", nativeQuery = true)
    Object getTotalAmountAllUsers();
}

