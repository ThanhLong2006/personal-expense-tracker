package com.quanlycanhan.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.entity.Category;
import com.quanlycanhan.service.CategoryService;
import com.quanlycanhan.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

/**
 * Controller xử lý danh mục chi tiêu
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final SecurityUtil securityUtil;

    /**
     * Lấy tất cả danh mục của user (bao gồm system default)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories(
            @RequestParam(required = false) String type,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        List<Category> categories = categoryService.getUserCategories(userId);
        if (type != null && !type.trim().isEmpty()) {
            String wanted = type.trim().toLowerCase();
            categories.removeIf(c -> c.getType() == null || !c.getType().toLowerCase().equals(wanted));
        }
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * Tạo danh mục mới
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @RequestBody CreateCategoryRequest request,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        Category category = categoryService.createCategory(
            userId,
            request.getName(),
            request.getType(), // Add type
            request.getIcon(),
            request.getColor(),
            request.getDescription(),
            request.getSortOrder()
        );
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    /**
     * Cập nhật danh mục
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @RequestBody UpdateCategoryRequest request,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        Category category = categoryService.updateCategory(
            id,
            userId,
            request.getName(),
            request.getType(), // Add type
            request.getIcon(),
            request.getColor(),
            request.getDescription(),
            request.getSortOrder()
        );
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    /**
     * Xóa danh mục
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa danh mục thành công", null));
    }

    @lombok.Data
    public static class CreateCategoryRequest {
        private String name;
        private String type; // Add type
        private String icon;
        private String color;
        private String description;
        private Integer sortOrder;
    }

    @lombok.Data
    public static class UpdateCategoryRequest {
        private String name;
        private String type; // Add type
        private String icon;
        private String color;
        private String description;
        private Integer sortOrder;
    }
}

