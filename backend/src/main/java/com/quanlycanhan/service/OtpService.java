package com.quanlycanhan.service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * Service xử lý OTP (One-Time Password)
 * - Tạo OTP 6 số ngẫu nhiên
 * - Lưu OTP vào Redis với thời gian hết hạn
 * - Verify OTP
 */
@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${otp.expiration:180}")
    private int otpExpiration; // Thời gian hết hạn OTP (giây)

    @Value("${otp.length:6}")
    private int otpLength; // Độ dài OTP

    @Value("${otp.enabled:true}")
    private boolean otpEnabled; // Tắt/bật OTP (để test nhanh)

    private static final String OTP_PREFIX = "otp:";
    private static final SecureRandom random = new SecureRandom();

    // Fallback in-memory store when Redis is not available (dev mode)
    private final Map<String, String> fallbackStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "otp-scheduler");
        t.setDaemon(true);
        return t;
    });

    /**
     * Tạo OTP 6 số ngẫu nhiên
     */
    public String generateOtp() {
        // Nếu OTP bị tắt, trả về mã test
        if (!otpEnabled) {
            return "123456";
        }

        // Tạo OTP ngẫu nhiên
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    /**
     * Lưu OTP vào Redis
     * - Key: otp:{email}
     * - Value: OTP code
     * - TTL: otpExpiration giây
     */
    /**
     * Save OTP. Returns true if saved to Redis, false if fallback in-memory was used.
     */
    public boolean saveOtp(String email, String otp) {
        String key = OTP_PREFIX + email;
        try {
            redisTemplate.opsForValue().set(key, otp, otpExpiration, TimeUnit.SECONDS);
            return true;
        } catch (Exception e) {
            // Redis not available — fallback to in-memory store with scheduled removal
            fallbackStore.put(key, otp);
            scheduler.schedule(() -> fallbackStore.remove(key), otpExpiration, TimeUnit.SECONDS);
            return false;
        }
    }

    /**
     * Lấy OTP từ Redis
     */
    public String getOtp(String email) {
        String key = OTP_PREFIX + email;
        try {
            Object otp = redisTemplate.opsForValue().get(key);
            return otp != null ? otp.toString() : null;
        } catch (Exception e) {
            return fallbackStore.get(key);
        }
    }

    /**
     * Verify OTP
     * - Kiểm tra OTP có đúng không
     * - Xóa OTP sau khi verify thành công
     */
    public boolean verifyOtp(String email, String otp) {
        // Nếu OTP bị tắt, chấp nhận mã test
        if (!otpEnabled && "123456".equals(otp)) {
            return true;
        }

        String savedOtp = getOtp(email);
        if (savedOtp == null) {
            return false; // OTP không tồn tại hoặc đã hết hạn
        }

        if (savedOtp.equals(otp)) {
            // OTP đúng, xóa OTP
            deleteOtp(email);
            return true;
        }

        return false; // OTP sai
    }

    /**
     * Xóa OTP
     */
    public void deleteOtp(String email) {
        String key = OTP_PREFIX + email;
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            fallbackStore.remove(key);
        }
    }

    /**
     * Kiểm tra OTP còn hạn không
     */
    public boolean isOtpExists(String email) {
        String key = OTP_PREFIX + email;
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            return fallbackStore.containsKey(key);
        }
    }

    /**
     * Kiểm tra trạng thái OTP hiện tại
     */
    public boolean isOtpEnabled() {
        return otpEnabled;
    }
}

