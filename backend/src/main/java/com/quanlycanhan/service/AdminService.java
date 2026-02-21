package com.quanlycanhan.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quanlycanhan.controller.AdminController;
import com.quanlycanhan.entity.AdminActivityLog;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;
import com.quanlycanhan.repository.AdminActivityLogRepository;
import com.quanlycanhan.repository.TransactionRepository;
import com.quanlycanhan.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service xử lý admin operations
 * - Quản lý users
 * - Log hoạt động admin
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    public final UserRepository userRepository;
    public final TransactionRepository transactionRepository;
    private final AdminActivityLogRepository adminActivityLogRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tìm kiếm users
     */
    public Page<User> searchUsers(String keyword, Pageable pageable) {
        return userRepository.searchUsers(keyword, pageable);
    }

    /**
     * Khóa tài khoản user
     */
    @Transactional
    public void lockUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(User.UserStatus.DISABLED);
        userRepository.save(user);

        // Log hoạt động
        logAdminActivity(adminId, "LOCK_USER", "Khóa tài khoản user: " + user.getEmail(), userId, "USER");
    }

    /**
     * Mở khóa tài khoản user
     */
    @Transactional
    public void unlockUser(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(User.UserStatus.ACTIVE);
        user.setLockedUntil(null);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        // Log hoạt động
        logAdminActivity(adminId, "UNLOCK_USER", "Mở khóa tài khoản user: " + user.getEmail(), userId, "USER");
    }

    /**
     * Reset mật khẩu user
     */
    @Transactional
    public void resetUserPassword(Long userId, String newPassword, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Log hoạt động
        logAdminActivity(adminId, "RESET_USER_PASSWORD", "Reset mật khẩu user: " + user.getEmail(), userId, "USER");
    }

    /**
     * Phân quyền Admin cho user
     */
    @Transactional
    public void makeAdmin(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setRole(User.UserRole.ADMIN);
        userRepository.save(user);

        // Log hoạt động
        logAdminActivity(adminId, "MAKE_ADMIN", "Phân quyền Admin cho user: " + user.getEmail(), userId, "USER");
    }

    /**
     * Thống kê hệ thống
     */
    public AdminController.SystemStatistics getSystemStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(User.UserStatus.ACTIVE);
        long totalTransactions = transactionRepository.count();

        // Tính tổng số tiền từ tất cả transactions
        Object totalAmountRaw = transactionRepository.getTotalAmountAllUsers();
        BigDecimal totalAmount = BigDecimal.ZERO;
        if (totalAmountRaw != null) {
            if (totalAmountRaw instanceof BigDecimal) {
                totalAmount = (BigDecimal) totalAmountRaw;
            } else if (totalAmountRaw instanceof Number) {
                totalAmount = BigDecimal.valueOf(((Number) totalAmountRaw).doubleValue());
            } else {
                try {
                    totalAmount = new BigDecimal(totalAmountRaw.toString());
                } catch (Exception e) {
                    totalAmount = BigDecimal.ZERO;
                }
            }
        }

        return AdminController.SystemStatistics.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalTransactions(totalTransactions)
                .totalAmount(totalAmount)
                .build();
    }

    /**
     * Lấy tất cả transactions (admin xem tất cả users)
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<Transaction> getAllTransactions(String keyword, Long userId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        Page<Transaction> transactions;

        if (userId != null) {
            // Lấy transactions của user cụ thể
            if (keyword != null && !keyword.trim().isEmpty()) {
                transactions = transactionRepository.searchTransactions(userId, keyword, pageable);
            } else if (startDate != null || endDate != null) {
                LocalDate start = startDate != null ? startDate : LocalDate.of(1970, 1, 1);
                LocalDate end = endDate != null ? endDate : LocalDate.now();
                // Use Pageable query - database handles pagination efficiently
                transactions = transactionRepository.findByUserIdAndDateRange(userId, start, end, pageable);
            } else {
                transactions = transactionRepository.findByUserIdAndDeletedFalse(userId, pageable);
            }
        } else {
            // Lấy tất cả transactions của tất cả users
            // Đã override findAll(Pageable) với EntityGraph để load luôn category, tránh N+1
            transactions = transactionRepository.findAll(pageable);
        }

        return transactions;
    }

    /**
     * Log hoạt động admin
     */
    private void logAdminActivity(Long adminId, String action, String description,
            Long targetId, String targetType) {
        User admin = userRepository.findById(adminId).orElse(null);
        String adminEmail = admin != null ? admin.getEmail() : null;

        AdminActivityLog log = AdminActivityLog.builder()
                .adminId(adminId)
                .adminEmail(adminEmail)
                .action(action)
                .description(description)
                .targetId(targetId)
                .targetType(targetType)
                .build();

        adminActivityLogRepository.save(log);
    }
}
