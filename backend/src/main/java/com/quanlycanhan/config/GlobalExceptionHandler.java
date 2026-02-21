package com.quanlycanhan.config;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.exception.BusinessException;
import com.quanlycanhan.exception.ErrorCode;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());
        String message = String.join("; ", errors);
        logger.warn("Validation failed: {}", message);
        // Có thể gắn mã lỗi VALIDATION vào code nếu cần
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(message, ErrorCode.BAD_REQUEST.getCode()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<String>> handleBusiness(BusinessException ex) {
        ErrorCode errorCode = ex.getErrorCode() != null ? ex.getErrorCode() : ErrorCode.BAD_REQUEST;
        String message = ex.getMessage() != null ? ex.getMessage() : errorCode.getDefaultMessage();

        logger.warn("Business exception [{}]: {} - details: {}", errorCode.getCode(), message, ex.getDetails(), ex);

        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (errorCode == ErrorCode.UNAUTHORIZED) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (errorCode == ErrorCode.FORBIDDEN) {
            status = HttpStatus.FORBIDDEN;
        }

        return ResponseEntity.status(status)
            .body(ApiResponse.error(message, errorCode.getCode()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntime(RuntimeException ex) {
        logger.warn("Runtime exception: {}", ex.getMessage(), ex);
        String message = ex.getMessage() != null ? ex.getMessage() : ErrorCode.BAD_REQUEST.getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(message, ErrorCode.BAD_REQUEST.getCode()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleAll(Exception ex) {
        logger.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(ErrorCode.INTERNAL_ERROR.getDefaultMessage(), ErrorCode.INTERNAL_ERROR.getCode()));
    }
}
