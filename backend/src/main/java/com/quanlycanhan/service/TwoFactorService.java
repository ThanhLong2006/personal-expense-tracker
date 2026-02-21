package com.quanlycanhan.service;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.CodeGenerationException;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

import java.util.Base64;

/**
 * Service xử lý 2FA TOTP (Time-based One-Time Password)
 * - Tạo secret key
 * - Tạo QR code
 * - Verify TOTP code
 */
@Service
public class TwoFactorService {

    private final SecretGenerator secretGenerator = new DefaultSecretGenerator();
    private final CodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1);
    private final TimeProvider timeProvider = new SystemTimeProvider();
    private final CodeVerifier codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    private final QrGenerator qrGenerator = new ZxingPngQrGenerator();

    /**
     * Tạo secret key mới cho 2FA
     */
    public String generateSecret() {
        return secretGenerator.generate();
    }

    /**
     * Tạo QR code cho Google Authenticator
     * - Format: otpauth://totp/{label}?secret={secret}&issuer={issuer}
     */
    public String generateQrCode(String email, String secret) throws QrGenerationException {
        QrData qrData = new QrData.Builder()
            .label(email)
            .secret(secret)
            .issuer("Quản Lý Chi Tiêu Cá Nhân")
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();

        byte[] qrCodeBytes = qrGenerator.generate(qrData);
        return Base64.getEncoder().encodeToString(qrCodeBytes);
    }

    /**
     * Verify TOTP code
     * - Kiểm tra code có đúng không
     * - Cho phép time window ±1 (30 giây trước/sau)
     */
    public boolean verifyTotp(String secret, String code) {
        return codeVerifier.isValidCode(secret, code);
    }
}

