package com.quanlycanhan.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quanlycanhan.dto.response.ApiResponse;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Rate Limiting Filter
 * - Áp dụng giới hạn số lượng request dựa trên loại endpoint (public, authenticated, admin)
 * - Sử dụng Bucket4j để quản lý rate limit
 * - Trả về HTTP 429 (Too Many Requests) khi vượt quá giới hạn
 */
@Slf4j
@Component
@Order(1) // Chạy trước JWT filter
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Bucket publicBucket;
    private final Bucket authenticatedBucket;
    private final Bucket adminBucket;
    private final ObjectMapper objectMapper;

    @Value("${rate-limit.enabled:true}")
    private boolean rateLimitEnabled;

    @Value("${rate-limit.whitelist-ips:127.0.0.1,::1}")
    private String whitelistIps;

    public RateLimitingFilter(
            @Qualifier("publicBucket") Bucket publicBucket,
            @Qualifier("authenticatedBucket") Bucket authenticatedBucket,
            @Qualifier("adminBucket") Bucket adminBucket,
            ObjectMapper objectMapper) {
        this.publicBucket = publicBucket;
        this.authenticatedBucket = authenticatedBucket;
        this.adminBucket = adminBucket;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Bỏ qua rate limiting nếu đã tắt
        if (!rateLimitEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bỏ qua OPTIONS requests (CORS preflight)
        if ("OPTIONS".equals(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bỏ qua rate limit cho IP trong whitelist (nội bộ, load balancer, monitoring)
        String clientIp = getClientIpAddress(request);
        if (isWhitelistedIp(clientIp)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Xác định loại bucket dựa trên endpoint và authentication
        Bucket bucket = determineBucket(request);

        // Kiểm tra rate limit
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // Cho phép request tiếp tục
            response.setHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Vượt quá rate limit
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000; // Convert to seconds
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("X-RateLimit-Retry-After", String.valueOf(waitForRefill));
            response.setHeader("Retry-After", String.valueOf(waitForRefill));

                ApiResponse<?> errorResponse = ApiResponse.error(
                    "Quá nhiều request. Vui lòng thử lại sau " + waitForRefill + " giây."
                );

            objectMapper.writeValue(response.getWriter(), errorResponse);
            log.warn("Rate limit exceeded for {} {} from IP: {}", 
                    request.getMethod(), 
                    request.getRequestURI(), 
                    getClientIpAddress(request));
        }
    }

    /**
     * Xác định bucket nào sẽ được sử dụng dựa trên endpoint và authentication
     */
    private Bucket determineBucket(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Kiểm tra authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Admin endpoints
        if (path.startsWith("/api/admin") || path.startsWith("/admin")) {
            if (authentication != null && authentication.isAuthenticated()) {
                Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
                boolean isAdmin = authorities.stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
                if (isAdmin) {
                    return adminBucket;
                }
            }
        }

        // Authenticated endpoints (có JWT token)
        if (authentication != null && authentication.isAuthenticated() 
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            return authenticatedBucket;
        }

        // Public endpoints (auth, public)
        return publicBucket;
    }

    /**
     * Lấy IP address của client
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    /**
     * Kiểm tra IP có trong whitelist không
     * Hỗ trợ: IP đơn (127.0.0.1), CIDR (10.0.0.0/8), ::1 cho IPv6 localhost
     */
    private boolean isWhitelistedIp(String clientIp) {
        if (whitelistIps == null || whitelistIps.trim().isEmpty()) {
            return false;
        }
        List<String> ips = Arrays.stream(whitelistIps.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        for (String ip : ips) {
            if (ip.contains("/")) {
                if (matchesCidr(clientIp, ip)) return true;
            } else if (clientIp.equals(ip)) {
                return true;
            }
        }
        return false;
    }

    private boolean matchesCidr(String ip, String cidr) {
        try {
            String[] parts = cidr.split("/");
            int prefixLen = Integer.parseInt(parts[1]);
            if (ip.contains(":")) {
                return matchesIpv6Cidr(ip, parts[0], prefixLen);
            }
            return matchesIpv4Cidr(ip, parts[0], prefixLen);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean matchesIpv4Cidr(String ip, String cidrBase, int prefixLen) {
        try {
            long ipLong = ipToLong(ip);
            long baseLong = ipToLong(cidrBase);
            long mask = prefixLen == 0 ? 0 : (0xFFFFFFFFL << (32 - prefixLen));
            return (ipLong & mask) == (baseLong & mask);
        } catch (Exception e) {
            return false;
        }
    }

    private long ipToLong(String ip) {
        String[] octets = ip.split("\\.");
        return (Long.parseLong(octets[0]) << 24) + (Long.parseLong(octets[1]) << 16)
                + (Long.parseLong(octets[2]) << 8) + Long.parseLong(octets[3]);
    }

    private boolean matchesIpv6Cidr(String ip, String cidrBase, int prefixLen) {
        return ip.equals(cidrBase) || ip.startsWith(cidrBase.split("%")[0]);
    }
}

