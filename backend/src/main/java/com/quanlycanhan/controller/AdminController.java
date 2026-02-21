package com.quanlycanhan.controller;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.dto.response.TransactionResponseDTO;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.mapper.TransactionMapper;
import com.quanlycanhan.repository.UserRepository;
import com.quanlycanhan.service.AdminService;
import com.quanlycanhan.service.TransactionService;
import com.quanlycanhan.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Controller Admin - Quản lý users và giao dịch của users
 * - Yêu cầu role ADMIN
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    /**
     * Lấy danh sách users (phân trang, tìm kiếm)
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = adminService.searchUsers(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    /**
     * Lấy chi tiết user
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> getUserDetail(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    /**
     * Khóa tài khoản user
     */
    @PutMapping("/users/{id}/lock")
    public ResponseEntity<ApiResponse<String>> lockUser(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long adminId = securityUtil.getUserId(authentication);
        adminService.lockUser(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Khóa tài khoản thành công", null));
    }

    /**
     * Mở khóa tài khoản user
     */
    @PutMapping("/users/{id}/unlock")
    public ResponseEntity<ApiResponse<String>> unlockUser(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long adminId = securityUtil.getUserId(authentication);
        adminService.unlockUser(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Mở khóa tài khoản thành công", null));
    }

    /**
     * Reset mật khẩu user
     */
    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<ApiResponse<String>> resetUserPassword(
            @PathVariable Long id,
            @RequestParam String newPassword,
            Authentication authentication
    ) {
        Long adminId = securityUtil.getUserId(authentication);
        adminService.resetUserPassword(id, newPassword, adminId);
        return ResponseEntity.ok(ApiResponse.success("Reset mật khẩu thành công", null));
    }

    /**
     * Phân quyền Admin cho user
     */
    @PutMapping("/users/{id}/make-admin")
    public ResponseEntity<ApiResponse<String>> makeAdmin(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long adminId = securityUtil.getUserId(authentication);
        adminService.makeAdmin(id, adminId);
        return ResponseEntity.ok(ApiResponse.success("Phân quyền Admin thành công", null));
    }

    /**
     * Lấy danh sách giao dịch của user (admin xem)
     */
    @GetMapping("/users/{userId}/transactions")
    public ResponseEntity<ApiResponse<Page<Transaction>>> getUserTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        Page<Transaction> transactions = transactionService.getUserTransactions(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    /**
     * Tạo giao dịch thay cho user (TÍNH NĂNG CỐT LÕI)
     */
    @PostMapping("/users/{userId}/transactions")
    public ResponseEntity<ApiResponse<Transaction>> createTransactionForUser(
            @PathVariable Long userId,
            @RequestBody CreateTransactionRequest request,
            Authentication authentication
    ) {
        Long adminId = securityUtil.getUserId(authentication);
        Transaction transaction = transactionService.createTransaction(
            userId,
            request.getCategoryId(),
            request.getAmount(),
            request.getTransactionDate(),
            request.getNote(),
            request.getLocation(),
            request.getReceiptImage(),
            Transaction.CreatedBy.ADMIN,
            adminId
        );
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    /**
     * Sửa giao dịch của user (admin)
     */
    @PutMapping("/users/{userId}/transactions/{transactionId}")
    public ResponseEntity<ApiResponse<Transaction>> updateUserTransaction(
            @PathVariable Long userId,
            @PathVariable Long transactionId,
            @RequestBody UpdateTransactionRequest request,
            Authentication authentication
    ) {
        // Admin có thể sửa giao dịch của bất kỳ user nào
        Transaction transaction = transactionService.updateTransaction(
            transactionId,
            userId, // Dùng userId của user sở hữu giao dịch
            request.getCategoryId(),
            request.getAmount(),
            request.getTransactionDate(),
            request.getNote(),
            request.getLocation(),
            request.getReceiptImage()
        );
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    /**
     * Xóa giao dịch của user (admin)
     */
    @DeleteMapping("/users/{userId}/transactions/{transactionId}")
    public ResponseEntity<ApiResponse<String>> deleteUserTransaction(
            @PathVariable Long userId,
            @PathVariable Long transactionId
    ) {
        transactionService.deleteTransaction(transactionId, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa giao dịch thành công", null));
    }

    /**
     * Thống kê tổng quan hệ thống
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<SystemStatistics>> getSystemStatistics() {
        SystemStatistics stats = adminService.getSystemStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Lấy tất cả transactions (admin xem tất cả users)
     * Trả về DTO để ẩn các field nhạy cảm của Entity
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getAllTransactions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        Page<Transaction> transactions = adminService.getAllTransactions(keyword, userId, startDate, endDate, pageable);
        Page<TransactionResponseDTO> dtoPage = transactionMapper.toDTOPage(transactions);
        return ResponseEntity.ok(ApiResponse.success(dtoPage));
    }

    @lombok.Data
    public static class CreateTransactionRequest {
        private Long categoryId;
        private BigDecimal amount;
        private LocalDate transactionDate;
        private String note;
        private String location;
        private String receiptImage;
    }

    @lombok.Data
    public static class UpdateTransactionRequest {
        private Long categoryId;
        private BigDecimal amount;
        private LocalDate transactionDate;
        private String note;
        private String location;
        private String receiptImage;
    }

    @lombok.Data
    @lombok.Builder
    public static class SystemStatistics {
        private long totalUsers;
        private long activeUsers;
        private long totalTransactions;
        private BigDecimal totalAmount;
    }
}

