package com.quanlycanhan.exception;

/**
 * Danh sách mã lỗi chuẩn cho toàn hệ thống.
 * - code: dùng cho frontend xử lý logic/i18n
 * - defaultMessage: thông báo mặc định (có thể thay thế bằng i18n sau này)
 */
public enum ErrorCode {

    // Common
    BAD_REQUEST("BAD_REQUEST", "Yêu cầu không hợp lệ"),
    UNAUTHORIZED("UNAUTHORIZED", "Không có quyền truy cập"),
    FORBIDDEN("FORBIDDEN", "Không được phép truy cập tài nguyên này"),
    INTERNAL_ERROR("INTERNAL_ERROR", "Lỗi máy chủ. Vui lòng thử lại sau."),

    // User / Auth
    USER_NOT_FOUND("USER_NOT_FOUND", "Không tìm thấy user"),
    USER_WITH_EMAIL_NOT_FOUND("USER_WITH_EMAIL_NOT_FOUND", "Không tìm thấy user với email"),
    ACCOUNT_LOCKED("ACCOUNT_LOCKED", "Tài khoản đang bị khóa tạm thời"),
    ACCOUNT_DISABLED("ACCOUNT_DISABLED", "Tài khoản đã bị vô hiệu hóa"),
    ACCOUNT_PENDING("ACCOUNT_PENDING", "Tài khoản chưa xác thực OTP"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng"),
    ACCOUNT_NOT_ACTIVATED("ACCOUNT_NOT_ACTIVATED", "Tài khoản chưa được kích hoạt. Vui lòng xác nhận OTP từ email."),

    // Transaction
    TRANSACTION_NOT_FOUND("TRANSACTION_NOT_FOUND", "Không tìm thấy giao dịch"),
    TRANSACTION_ACCESS_DENIED("TRANSACTION_ACCESS_DENIED", "Không có quyền truy cập giao dịch này"),

    // Category
    CATEGORY_NOT_FOUND("CATEGORY_NOT_FOUND", "Không tìm thấy danh mục"),
    CATEGORY_INVALID("CATEGORY_INVALID", "Danh mục không hợp lệ"),
    CATEGORY_FORBIDDEN_DELETE_SYSTEM("CATEGORY_FORBIDDEN_DELETE_SYSTEM", "Không thể xóa danh mục hệ thống"),
    CATEGORY_NOT_FOUND_OR_NO_PERMISSION("CATEGORY_NOT_FOUND_OR_NO_PERMISSION", "Không tìm thấy danh mục hoặc không có quyền"),

    // OTP / 2FA
    OTP_FEATURE_DISABLED("OTP_FEATURE_DISABLED", "OTP đang tắt"),
    OTP_INVALID_OR_EXPIRED("OTP_INVALID_OR_EXPIRED", "Mã OTP không đúng hoặc đã hết hạn"),
    OTP_ALREADY_VERIFIED("OTP_ALREADY_VERIFIED", "Tài khoản đã được kích hoạt rồi"),

    // Token
    REFRESH_TOKEN_INVALID("REFRESH_TOKEN_INVALID", "Refresh token không hợp lệ hoặc đã hết hạn"),
    TOKEN_INVALID("TOKEN_INVALID", "Token không hợp lệ hoặc đã hết hạn"),
    TOKEN_ALREADY_USED("TOKEN_ALREADY_USED", "Token không hợp lệ hoặc đã được sử dụng"),

    // Login security
    ACCOUNT_TEMPORARILY_LOCKED("ACCOUNT_TEMPORARILY_LOCKED", "Tài khoản bị khóa tạm thời do đăng nhập sai quá nhiều lần"),

    // Validation / Business
    EMAIL_ALREADY_USED("EMAIL_ALREADY_USED", "Email đã được sử dụng. Vui lòng chọn email khác."),
    OTP_REQUIRED("OTP_REQUIRED", "Vui lòng nhập mã 2FA");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}


