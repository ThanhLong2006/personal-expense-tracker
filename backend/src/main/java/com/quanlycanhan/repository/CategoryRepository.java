package com.quanlycanhan.repository;

import com.quanlycanhan.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho Category entity
 * - Tìm danh mục của user
 * - Tìm danh mục mặc định hệ thống
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Tìm tất cả danh mục của user (chưa xóa)
     */
    @Query("SELECT c FROM Category c WHERE " +
           "(c.user.id = :userId OR c.systemDefault = true) " +
           "AND c.deleted = false " +
           "ORDER BY c.sortOrder ASC, c.name ASC")
    List<Category> findByUserIdOrSystemDefault(@Param("userId") Long userId);

    /**
     * Tìm danh mục của user (chỉ danh mục riêng, không bao gồm system default)
     */
    List<Category> findByUserIdAndDeletedFalseOrderBySortOrderAscNameAsc(Long userId);

    /**
     * Tìm danh mục mặc định hệ thống
     */
    List<Category> findBySystemDefaultTrueAndDeletedFalseOrderBySortOrderAscNameAsc();

    /**
     * Tìm danh mục theo ID và user (để kiểm tra quyền sở hữu)
     */
    Optional<Category> findByIdAndUserId(Long id, Long userId);

    /**
     * Kiểm tra danh mục có thuộc user hoặc là system default không
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Category c " +
           "WHERE c.id = :categoryId " +
           "AND (c.user.id = :userId OR c.systemDefault = true) " +
           "AND c.deleted = false")
    boolean existsByIdAndUserOrSystemDefault(@Param("categoryId") Long categoryId, @Param("userId") Long userId);
}

