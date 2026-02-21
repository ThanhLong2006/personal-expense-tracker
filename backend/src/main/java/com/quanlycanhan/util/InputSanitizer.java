package com.quanlycanhan.util;

import java.util.regex.Pattern;

/**
 * Utility class để sanitize input từ người dùng, chống XSS và injection
 */
public class InputSanitizer {

    // Pattern để detect các ký tự nguy hiểm trong HTML/JS
    private static final Pattern SCRIPT_PATTERN = Pattern.compile(
        "<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );
    
    private static final Pattern STYLE_PATTERN = Pattern.compile(
        "<style[^>]*>.*?</style>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );
    
    private static final Pattern EVENT_HANDLER_PATTERN = Pattern.compile(
        "on\\w+\\s*=", Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern JAVASCRIPT_PATTERN = Pattern.compile(
        "javascript:", Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern DATA_URI_PATTERN = Pattern.compile(
        "data:", Pattern.CASE_INSENSITIVE
    );

    /**
     * Sanitize string input - loại bỏ các ký tự nguy hiểm
     * @param input Input cần sanitize
     * @return String đã được sanitize
     */
    public static String sanitize(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        String sanitized = input;
        
        // Loại bỏ script tags
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        
        // Loại bỏ style tags
        sanitized = STYLE_PATTERN.matcher(sanitized).replaceAll("");
        
        // Loại bỏ event handlers (onclick, onerror, etc.)
        sanitized = EVENT_HANDLER_PATTERN.matcher(sanitized).replaceAll("");
        
        // Loại bỏ javascript: protocol
        sanitized = JAVASCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        
        // Loại bỏ data: URI (có thể chứa base64 encoded scripts)
        sanitized = DATA_URI_PATTERN.matcher(sanitized).replaceAll("");
        
        // Escape các ký tự HTML đặc biệt
        sanitized = sanitized
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
        
        // Trim whitespace
        sanitized = sanitized.trim();
        
        return sanitized;
    }

    /**
     * Sanitize nhưng giữ lại một số HTML tags an toàn (cho rich text editor)
     * Chỉ cho phép các tags: p, br, strong, em, u, ol, ul, li
     */
    public static String sanitizeHtml(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        String sanitized = input;
        
        // Loại bỏ script và style
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        sanitized = STYLE_PATTERN.matcher(sanitized).replaceAll("");
        
        // Loại bỏ event handlers
        sanitized = EVENT_HANDLER_PATTERN.matcher(sanitized).replaceAll("");
        
        // Loại bỏ javascript: và data: URI
        sanitized = JAVASCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        sanitized = DATA_URI_PATTERN.matcher(sanitized).replaceAll("");
        
        // Chỉ giữ lại các tags an toàn: p, br, strong, em, u, ol, ul, li, a (với href hợp lệ)
        // Loại bỏ tất cả các tags khác
        sanitized = sanitized.replaceAll("(?i)<(?![/]?(p|br|strong|em|u|ol|ul|li|a)\\b)[^>]*>", "");
        
        return sanitized.trim();
    }

    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        // RFC 5322 compliant email regex (simplified)
        String emailPattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return Pattern.matches(emailPattern, email);
    }

    /**
     * Validate và sanitize email
     */
    public static String sanitizeEmail(String email) {
        if (email == null) {
            return null;
        }
        email = email.trim().toLowerCase();
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }
        return email;
    }

    /**
     * Sanitize số - chỉ giữ lại số và dấu chấm/thập phân
     */
    public static String sanitizeNumber(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.replaceAll("[^0-9.-]", "");
    }
}

