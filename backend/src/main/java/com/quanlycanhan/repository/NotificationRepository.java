package com.quanlycanhan.repository;

import com.quanlycanhan.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository cho Notification entity
 * - Tìm thông báo của user
 * - Đếm thông báo chưa đọc
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Tìm tất cả thông báo của user (phân trang, mới nhất trước)
     */
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Tìm thông báo chưa đọc của user
     */
    Page<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Đếm số thông báo chưa đọc của user
     */
    long countByUserIdAndIsReadFalse(Long userId);

    /**
     * Đánh dấu tất cả thông báo của user là đã đọc
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsReadByUserId(@Param("userId") Long userId);

    /**
     * Xóa thông báo cũ hơn 30 ngày
     */
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :beforeDate")
    void deleteOldNotifications(@Param("beforeDate") java.time.LocalDateTime beforeDate);
}

