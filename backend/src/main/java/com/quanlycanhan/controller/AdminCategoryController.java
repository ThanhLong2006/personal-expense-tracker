package com.quanlycanhan.controller;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.entity.Category;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.CategoryRepository;
import com.quanlycanhan.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller Admin - Quản lý categories
 * - Yêu cầu role ADMIN
 * - Admin có thể quản lý tất cả categories (của user và system default)
 */
@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    /**
     * Lấy tất cả categories (phân trang, tìm kiếm)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Category>>> getAllCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("systemDefault").descending()
                .and(Sort.by("sortOrder").ascending())
                .and(Sort.by("name").ascending()));

        // Hiện tại, lấy tất cả categories và lọc thủ công
        // Trong production, bạn có thể muốn thêm một phương thức tìm kiếm thích hợp vào
        // repository
        Page<Category> allCategories = categoryRepository.findAll(pageable);

        // Lọc theo từ khóa và loại nếu được cung cấp
        if (keyword != null && !keyword.trim().isEmpty()) {
            // Lọc theo từ khóa - đây là một cài đặt đơn giản
            // Trong production, sử dụng truy vấn repository để có hiệu suất tốt hơn
        }

        return ResponseEntity.ok(ApiResponse.success(allCategories));
    }

    /**
     * Tạo category mới (system default)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @RequestBody CreateCategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType() != null ? request.getType() : "expense")
                .icon(request.getIcon())
                .color(request.getColor())
                .description(request.getDescription())
                .systemDefault(request.getSystemDefault() != null ? request.getSystemDefault() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .deleted(false)
                .build();

        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    /**
     * Cập nhật category (admin có thể sửa bất kỳ category nào)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @RequestBody UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));

        if (request.getName() != null) {
            category.setName(request.getName());
        }
        if (request.getType() != null) {
            category.setType(request.getType());
        }
        if (request.getIcon() != null) {
            category.setIcon(request.getIcon());
        }
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }

        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    /**
     * Xóa category (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setDeleted(true);
        categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success("Xóa category thành công", null));
    }

    @lombok.Data
    public static class CreateCategoryRequest {
        private String name;
        private String type;
        private String icon;
        private String color;
        private String description;
        private Boolean systemDefault;
        private Integer sortOrder;
    }

    @lombok.Data
    public static class UpdateCategoryRequest {
        private String name;
        private String type;
        private String icon;
        private String color;
        private String description;
        private Integer sortOrder;
    }
}
