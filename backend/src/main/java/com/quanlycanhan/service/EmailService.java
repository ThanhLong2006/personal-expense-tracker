package com.quanlycanhan.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Service gửi email
 * - Gửi OTP qua email
 * - Gửi link reset password
 * - Gửi thông báo
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${otp.enabled:true}")
    private boolean otpEnabled;

    /**
     * Gửi OTP qua email
     * - Async để không block request
     */
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        // Nếu OTP bị tắt, không gửi email
        if (!otpEnabled) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Mã OTP xác thực tài khoản - Quản Lý Chi Tiêu Cá Nhân");

            // Nội dung email HTML
            String htmlContent = buildOtpEmailContent(otp);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi gửi email OTP: " + e.getMessage(), e);
        }
    }

    /**
     * Gửi link reset password
     */
    @Async
    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Đặt lại mật khẩu - Quản Lý Chi Tiêu Cá Nhân");

            // Link reset password (frontend sẽ xử lý)
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            // Nội dung email HTML
            String htmlContent = buildResetPasswordEmailContent(resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi gửi email reset password: " + e.getMessage(), e);
        }
    }

    /**
     * Tạo nội dung email OTP (HTML)
     */
    private String buildOtpEmailContent(String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #00C4B4; color: white; padding: 20px; text-align: center; border-radius: 24px 24px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 24px 24px; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #00C4B4; text-align: center; padding: 20px; background: white; border-radius: 24px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Mã OTP Xác Thực</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào,</p>
                        <p>Bạn đang đăng ký tài khoản trên ứng dụng <strong>Quản Lý Chi Tiêu Cá Nhân</strong>.</p>
                        <p>Mã OTP của bạn là:</p>
                        <div class="otp-code">%s</div>
                        <p><strong>Lưu ý:</strong> Mã OTP có hiệu lực trong <strong>3 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Quản Lý Chi Tiêu Cá Nhân. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(otp);
    }

    /**
     * Tạo nội dung email reset password (HTML)
     */
    private String buildResetPasswordEmailContent(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #00C4B4; color: white; padding: 20px; text-align: center; border-radius: 24px 24px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 24px 24px; }
                    .button { display: inline-block; padding: 15px 30px; background: #00C4B4; color: white; text-decoration: none; border-radius: 24px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Đặt Lại Mật Khẩu</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào,</p>
                        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                        <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
                        <p style="text-align: center;">
                            <a href="%s" class="button">Đặt Lại Mật Khẩu</a>
                        </p>
                        <p><strong>Lưu ý:</strong> Link này có hiệu lực trong <strong>15 phút</strong>. Vui lòng không chia sẻ link này với bất kỳ ai.</p>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Quản Lý Chi Tiêu Cá Nhân. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink);
    }
}

