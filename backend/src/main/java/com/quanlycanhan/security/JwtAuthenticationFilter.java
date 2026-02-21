package com.quanlycanhan.security;

import com.quanlycanhan.service.JwtService;
import com.quanlycanhan.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * - Lọc mọi request, kiểm tra JWT token
 * - Nếu token hợp lệ, set authentication vào SecurityContext
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Lấy token từ header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Kiểm tra header Authorization có tồn tại và bắt đầu bằng "Bearer " không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Không có token, tiếp tục filter chain (có thể là public endpoint)
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy token (bỏ "Bearer " prefix)
        jwt = authHeader.substring(7);

        try {
            // Lấy email từ token
            userEmail = jwtService.extractUsername(jwt);

            // Nếu có email và chưa có authentication trong SecurityContext
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load user details từ database
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Kiểm tra token có hợp lệ không (chưa hết hạn, đúng user)
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Tạo authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                    // Set details (IP, session ID, etc.)
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Set authentication vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token không hợp lệ, tiếp tục filter chain
            // JwtAuthenticationEntryPoint sẽ xử lý nếu endpoint yêu cầu authentication
        }

        // Tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
}

