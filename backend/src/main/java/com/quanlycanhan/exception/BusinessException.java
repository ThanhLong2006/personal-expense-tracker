package com.quanlycanhan.exception;

/**
 * Exception nghiệp vụ chuẩn có kèm ErrorCode.
 * Toàn bộ các lỗi kiểm soát được (không phải lỗi hệ thống) nên ném dạng này
 * để GlobalExceptionHandler có thể trả về response thống nhất.
 */
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;
    private final String details;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode != null ? errorCode.getDefaultMessage() : null);
        this.errorCode = errorCode;
        this.details = null;
    }

    public BusinessException(ErrorCode errorCode, String details) {
        super(errorCode != null ? errorCode.getDefaultMessage() : null);
        this.errorCode = errorCode;
        this.details = details;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getDetails() {
        return details;
    }
}


