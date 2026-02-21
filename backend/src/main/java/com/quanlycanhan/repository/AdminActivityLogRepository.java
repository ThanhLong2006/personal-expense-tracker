package com.quanlycanhan.repository;

import com.quanlycanhan.entity.AdminActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository cho AdminActivityLog entity
 * - Tìm log hoạt động của admin
 * - Tìm log theo action, target
 */
@Repository
public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {

    /**
     * Tìm log của admin (phân trang, mới nhất trước)
     */
    Page<AdminActivityLog> findByAdminIdOrderByCreatedAtDesc(Long adminId, Pageable pageable);

    /**
     * Tìm log theo action
     */
    Page<AdminActivityLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);

    /**
     * Tìm log theo target (user_id, transaction_id, etc.)
     */
    Page<AdminActivityLog> findByTargetIdAndTargetTypeOrderByCreatedAtDesc(
        Long targetId, String targetType, Pageable pageable
    );

    /**
     * Tìm kiếm log (theo action, description, admin email)
     */
    @Query("SELECT l FROM AdminActivityLog l WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(l.action) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.adminEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY l.createdAt DESC")
    Page<AdminActivityLog> searchLogs(@Param("keyword") String keyword, Pageable pageable);
}

