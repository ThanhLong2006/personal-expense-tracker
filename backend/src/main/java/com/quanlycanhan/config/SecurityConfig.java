package com.quanlycanhan.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.quanlycanhan.security.JwtAuthenticationEntryPoint;
import com.quanlycanhan.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * CẤU HÌNH BẢO MẬT – ĐÃ FIX 100% CORS CHO LOCAL + PUBLIC LINK (ngrok, etc.)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Production: CHỈ cho phép domain chính thức. Dev: thêm ngrok qua CORS_ALLOWED_ORIGINS
    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
    private String allowedMethods;

    @Value("${cors.allowed-headers:Authorization,Content-Type,X-Requested-With}")
    private String allowedHeaders;

    @Value("${cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Value("${cors.max-age:3600}")
    private Long maxAge;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Tắt CSRF (JWT stateless)
            .csrf(csrf -> csrf.disable())

            // 2. Bật CORS – PHẢI Ở ĐẦU CHAIN
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Xử lý lỗi auth
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))

            // 4. Stateless session
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 5. Headers bảo mật
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                    .preload(true)
                )
                .contentTypeOptions(contentTypeOptions -> {})
                .referrerPolicy(referrer -> referrer
                    .policy(org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
            )

            // 6. Phân quyền – đặt SAU CORS
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Bắt buộc cho preflight
                .requestMatchers("/auth/**").permitAll()               // Đăng ký, login, forgot...
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )

            // 7. Thêm JWT filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS CONFIG – CHO PHÉP LOCAL + PUBLIC (ngrok, etc.)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Parse origins từ properties
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        // Nếu có "*", cho phép tất cả (CHỈ dùng cho test!)
        if (origins.contains("*")) {
            config.setAllowedOriginPatterns(Arrays.asList("*"));
        } else if (origins.stream().anyMatch(o -> o.contains("*"))) {
            // Có pattern (vd: *.ngrok-free.app) → dùng AllowedOriginPatterns
            config.setAllowedOriginPatterns(origins);
        } else {
            config.setAllowedOrigins(origins);
        }

        config.setAllowedMethods(Arrays.stream(allowedMethods.split(","))
                .map(String::trim)
                .collect(Collectors.toList()));

        config.setAllowedHeaders(Arrays.stream(allowedHeaders.split(","))
                .map(String::trim)
                .collect(Collectors.toList()));

        config.setAllowCredentials(allowCredentials);
        config.setMaxAge(maxAge != null ? maxAge : 3600L);
        
        // Production: Không cho phép wildcard trong headers khi allowCredentials = true
        if (allowCredentials && allowedHeaders.equals("*")) {
            // Fallback về headers an toàn hơn
            config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        }

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // XÓA CorsFilter riêng – không cần khi đã dùng http.cors()
    // @Bean public CorsFilter corsFilter() { ... } → XÓA DÒNG NÀY

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}