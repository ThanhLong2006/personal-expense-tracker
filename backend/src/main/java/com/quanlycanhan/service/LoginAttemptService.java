package com.quanlycanhan.service;

import com.quanlycanhan.entity.User;
import com.quanlycanhan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

/**
 * Service quản lý số lần đăng nhập sai
 * - Đếm số lần đăng nhập sai
 * - Khóa tài khoản cấp số nhân (2 → 4 → 8 → 16 phút...)
 * - Reset số lần đăng nhập sai khi đăng nhập thành công
 */
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;

    @Value("${security.login.max-attempts:5}")
    private int maxAttempts; // Số lần sai mật khẩu tối đa

    @Value("${security.login.lockout-duration-base:120}")
    private int lockoutDurationBase; // Thời gian khóa cơ bản (giây) - 2 phút

    @Value("${security.login.lockout-multiplier:2}")
    private int lockoutMultiplier; // Hệ số nhân thời gian khóa

    private static final String ATTEMPT_PREFIX = "login_attempt:";

    /**
     * Ghi nhận đăng nhập sai
     * - Tăng số lần đăng nhập sai
     * - Nếu vượt quá maxAttempts, khóa tài khoản
     */
    @Transactional
    public void recordFailedLogin(String email) {
        String key = ATTEMPT_PREFIX + email;
        
        // Lấy số lần đăng nhập sai hiện tại
        Object attemptsObj = redisTemplate.opsForValue().get(key);
        int attempts = attemptsObj != null ? Integer.parseInt(attemptsObj.toString()) : 0;
        attempts++;

        // Lưu số lần đăng nhập sai vào Redis (TTL 1 giờ)
        redisTemplate.opsForValue().set(key, attempts, 1, TimeUnit.HOURS);

        // Nếu vượt quá maxAttempts, khóa tài khoản
        if (attempts >= maxAttempts) {
            lockAccount(email, attempts);
        } else {
            // Cập nhật số lần đăng nhập sai vào database
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setFailedLoginAttempts(attempts);
                userRepository.save(user);
            }
        }
    }

    /**
     * Khóa tài khoản với thời gian cấp số nhân
     * - Lần 1: 2 phút
     * - Lần 2: 4 phút
     * - Lần 3: 8 phút
     * - Lần 4: 16 phút
     * - ...
     */
    private void lockAccount(String email, int attempts) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return;
        }

        // Tính thời gian khóa (cấp số nhân)
        int lockoutMinutes = (int) (lockoutDurationBase / 60.0 * Math.pow(lockoutMultiplier, attempts - maxAttempts));
        LocalDateTime lockedUntil = LocalDateTime.now().plusMinutes(lockoutMinutes);

        // Cập nhật user
        user.setStatus(User.UserStatus.LOCKED);
        user.setLockedUntil(lockedUntil);
        user.setFailedLoginAttempts(attempts);
        userRepository.save(user);
    }

    /**
     * Reset số lần đăng nhập sai khi đăng nhập thành công
     */
    @Transactional
    public void resetFailedLoginAttempts(String email) {
        String key = ATTEMPT_PREFIX + email;
        redisTemplate.delete(key);

        // Reset trong database
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
            if (user.getStatus() == User.UserStatus.LOCKED) {
                user.setStatus(User.UserStatus.ACTIVE);
            }
            userRepository.save(user);
        }
    }

    /**
     * Lấy số lần đăng nhập sai
     */
    public int getFailedLoginAttempts(String email) {
        String key = ATTEMPT_PREFIX + email;
        Object attemptsObj = redisTemplate.opsForValue().get(key);
        return attemptsObj != null ? Integer.parseInt(attemptsObj.toString()) : 0;
    }

    /**
     * Kiểm tra tài khoản có bị khóa không
     */
    public boolean isAccountLocked(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        if (user.getStatus() == User.UserStatus.LOCKED && user.getLockedUntil() != null) {
            return user.getLockedUntil().isAfter(LocalDateTime.now());
        }

        return false;
    }
}

