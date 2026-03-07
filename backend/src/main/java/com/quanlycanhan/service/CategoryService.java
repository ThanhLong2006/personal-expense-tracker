package com.quanlycanhan.service;

import com.quanlycanhan.entity.Category;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.CategoryRepository;
import com.quanlycanhan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service xử lý danh mục chi tiêu
 * - CRUD danh mục
 * - Lấy danh mục mặc định hệ thống
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    /**
     * Lấy tất cả danh mục của user (bao gồm system default)
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "userCategories", key = "#userId")
    public List<Category> getUserCategories(Long userId) {
        return categoryRepository.findByUserIdOrSystemDefault(userId);
    }

    /**
     * Lấy danh mục mặc định hệ thống
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "systemCategories")
    public List<Category> getSystemDefaultCategories() {
        return categoryRepository.findBySystemDefaultTrueAndDeletedFalseOrderBySortOrderAscNameAsc();
    }

    /**
     * Tạo danh mục mới cho user
     */
    /**
     * Tạo danh mục mới cho user
     */
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "userCategories", key = "#userId")
    public Category createCategory(Long userId, String name, String type, String icon, String color,
                                  String description, Integer sortOrder, Long parentId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Category parent = null;
        if (parentId != null) {
            parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND_OR_NO_PERMISSION));
            
            // Đảm bảo không chọn chính mình làm cha (cho create thì không cần, nhưng parentId phải hợp lệ)
            // Và đảm bảo parent thuộc user hoặc là systemDefault
            if (!parent.getSystemDefault() && !parent.getUser().getId().equals(userId)) {
                throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND_OR_NO_PERMISSION);
            }
        }

        Category category = Category.builder()
            .user(user)
            .name(name)
            .type(type != null ? type : (parent != null ? parent.getType() : "expense"))
            .icon(icon)
            .color(color)
            .description(description)
            .sortOrder(sortOrder != null ? sortOrder : 0)
            .systemDefault(false)
            .deleted(false)
            .parent(parent)
            .build();

        return categoryRepository.save(category);
    }

    /**
     * Cập nhật danh mục
     */
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "userCategories", key = "#userId")
    public Category updateCategory(Long id, Long userId, String name, String type, String icon, String color,
                                  String description, Integer sortOrder, Long parentId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND_OR_NO_PERMISSION));

        if (name != null) {
            category.setName(name);
        }
        if (type != null) {
            category.setType(type);
        }
        if (icon != null) {
            category.setIcon(icon);
        }
        if (color != null) {
            category.setColor(color);
        }
        if (description != null) {
            category.setDescription(description);
        }
        if (sortOrder != null) {
            category.setSortOrder(sortOrder);
        }
        
        if (parentId != null) {
            if (parentId.equals(id)) {
                throw new BusinessException(ErrorCode.CATEGORY_INVALID_PARENT); 
            }
            Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND_OR_NO_PERMISSION));
            
            if (!parent.getSystemDefault() && !parent.getUser().getId().equals(userId)) {
                throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND_OR_NO_PERMISSION);
            }
            category.setParent(parent);
        } else if (parentId == null && category.getParent() != null) {
            // Trường hợp muốn bỏ parent
            // Tùy theo logic, ở đây cho phép set null
            category.setParent(null);
        }

        return categoryRepository.save(category);
    }

    /**
     * Xóa danh mục (soft delete)
     */
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "userCategories", key = "#userId")
    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND_OR_NO_PERMISSION));

        // Không cho xóa danh mục hệ thống
        if (category.getSystemDefault()) {
            throw new BusinessException(ErrorCode.CATEGORY_FORBIDDEN_DELETE_SYSTEM);
        }

        softDeleteRecursive(category);
    }

    private void softDeleteRecursive(Category category) {
        category.setDeleted(true);
        if (category.getChildren() != null) {
            for (Category child : category.getChildren()) {
                softDeleteRecursive(child);
            }
        }
        categoryRepository.save(category);
    }
}

