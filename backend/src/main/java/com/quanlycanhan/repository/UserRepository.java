package com.quanlycanhan.repository;

import com.quanlycanhan.entity.User;
import com.quanlycanhan.entity.User.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho User entity
 * - Tìm kiếm user theo email
 * - Tìm kiếm user theo status
 * - Phân trang danh sách user
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tìm user theo email (unique)
     */
    Optional<User> findByEmail(String email);

    /**
     * Kiểm tra email đã tồn tại chưa
     */
    boolean existsByEmail(String email);

    /**
     * Tìm user theo email và status
     */
    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    /**
     * Tìm kiếm user theo email hoặc fullName (phân trang)
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Đếm số user theo status
     */
    long countByStatus(UserStatus status);

    /**
     * Đếm tổng số user
     */
    @Query("SELECT COUNT(u) FROM User u")
    long countAllUsers();
}

