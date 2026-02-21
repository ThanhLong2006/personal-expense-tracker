package com.quanlycanhan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response chung cho API
 * - Format thống nhất cho tất cả response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private String status; // success, error
    private String message;
    private T data;
    private String code; // Error code (nếu có)

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .status("success")
            .message("Thành công")
            .data(data)
            .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
            .status("success")
            .message(message)
            .data(data)
            .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
            .status("error")
            .message(message)
            .build();
    }

    public static <T> ApiResponse<T> error(String message, String code) {
        return ApiResponse.<T>builder()
            .status("error")
            .message(message)
            .code(code)
            .build();
    }
}

