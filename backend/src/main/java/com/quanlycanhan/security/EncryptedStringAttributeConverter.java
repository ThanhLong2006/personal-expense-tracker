package com.quanlycanhan.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * JPA AttributeConverter để mã hóa/giải mã chuỗi nhạy cảm (ví dụ: 2FA secret) bằng AES-256-GCM.
 *
 * LƯU Ý:
 * - Khóa mã hóa phải được cấu hình qua biến môi trường hoặc system property:
 *   - ENV:  SENSITIVE_ENCRYPTION_KEY (Base64, 32 bytes)
 *   - hoặc: -Dsensitive.encryption.key=<Base64>
 * - KHÔNG lưu khóa trong code hoặc database.
 */
@Converter
@Slf4j
public class EncryptedStringAttributeConverter implements AttributeConverter<String, String> {

    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128; // bits
    private static final int IV_LENGTH = 12;       // bytes

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String ENV_KEY = "SENSITIVE_ENCRYPTION_KEY";
    private static final String SYS_KEY = "sensitive.encryption.key";

    private static SecretKeySpec secretKeySpec;

    private static SecretKeySpec getKey() {
        if (secretKeySpec != null) {
            return secretKeySpec;
        }

        String base64Key = System.getProperty(SYS_KEY);
        if (base64Key == null || base64Key.isEmpty()) {
            base64Key = System.getenv(ENV_KEY);
        }

        if (base64Key == null || base64Key.isEmpty()) {
            log.error("SENSITIVE_ENCRYPTION_KEY / sensitive.encryption.key chưa được cấu hình. "
                    + "Các trường nhạy cảm sẽ được lưu dạng plain text!");
            return null;
        }

        try {
            byte[] keyBytes = Base64.getDecoder().decode(base64Key);
            if (keyBytes.length != 32) {
                log.error("Khóa mã hóa không hợp lệ. Yêu cầu 32 bytes (AES-256). Độ dài hiện tại: {}", keyBytes.length);
                return null;
            }
            secretKeySpec = new SecretKeySpec(keyBytes, "AES");
            return secretKeySpec;
        } catch (IllegalArgumentException e) {
            log.error("Không thể decode SENSITIVE_ENCRYPTION_KEY. Giá trị phải là Base64 hợp lệ.", e);
            return null;
        }
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return attribute;
        }

        SecretKeySpec key = getKey();
        if (key == null) {
            // Fallback: lưu plain text nếu chưa cấu hình key (dev / local)
            return attribute;
        }

        try {
            byte[] iv = new byte[IV_LENGTH];
            SECURE_RANDOM.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, spec);

            byte[] cipherText = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));

            String ivBase64 = Base64.getEncoder().encodeToString(iv);
            String cipherBase64 = Base64.getEncoder().encodeToString(cipherText);
            // Format lưu: iv:cipher
            return ivBase64 + ":" + cipherBase64;
        } catch (Exception e) {
            log.error("Lỗi mã hóa dữ liệu nhạy cảm. Lưu plain text để tránh mất dữ liệu.", e);
            return attribute;
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return dbData;
        }

        SecretKeySpec key = getKey();
        if (key == null) {
            // Fallback: giả định đang lưu plain text
            return dbData;
        }

        try {
            String[] parts = dbData.split(":", 2);
            if (parts.length != 2) {
                // Có thể là dữ liệu cũ chưa mã hóa
                return dbData;
            }

            byte[] iv = Base64.getDecoder().decode(parts[0]);
            byte[] cipherText = Base64.getDecoder().decode(parts[1]);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, spec);

            byte[] plainBytes = cipher.doFinal(cipherText);
            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Lỗi giải mã dữ liệu nhạy cảm. Trả về nguyên giá trị từ DB.", e);
            return dbData;
        }
    }
}


