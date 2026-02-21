package com.quanlycanhan.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import lombok.RequiredArgsConstructor;

/**
 * Cấu hình Rate Limiting sử dụng Bucket4j với Redis
 * Giúp chống spam/DDoS và bảo vệ API
 */
@Configuration
@RequiredArgsConstructor
public class RateLimitingConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    @Value("${rate-limit.public.capacity:100}")
    private int publicCapacity;

    @Value("${rate-limit.public.refill-tokens:100}")
    private int publicRefillTokens;

    @Value("${rate-limit.public.refill-duration:60}")
    private int publicRefillDuration;

    @Value("${rate-limit.authenticated.capacity:200}")
    private int authenticatedCapacity;

    @Value("${rate-limit.authenticated.refill-tokens:200}")
    private int authenticatedRefillTokens;

    @Value("${rate-limit.authenticated.refill-duration:60}")
    private int authenticatedRefillDuration;

    @Value("${rate-limit.admin.capacity:500}")
    private int adminCapacity;

    @Value("${rate-limit.admin.refill-tokens:500}")
    private int adminRefillTokens;

    @Value("${rate-limit.admin.refill-duration:60}")
    private int adminRefillDuration;

    /**
     * Tạo Redis Client cho Bucket4j
     */
        @Bean
        public LettuceBasedProxyManager<byte[]> proxyManager() {
        RedisURI.Builder uriBuilder = RedisURI.builder()
                .withHost(redisHost)
                .withPort(redisPort);

        if (redisPassword != null && !redisPassword.isEmpty()) {
            uriBuilder.withPassword(redisPassword.toCharArray());
        }

        RedisClient redisClient = RedisClient.create(uriBuilder.build());
        return LettuceBasedProxyManager.builderFor(redisClient)
                .build();
    }

    /**
     * Tạo bucket cho API public
     */
    @Bean(name = "publicBucket")
    public Bucket publicBucket() {
        Bandwidth limit = Bandwidth.classic(
                publicCapacity,
                Refill.intervally(publicRefillTokens, Duration.ofSeconds(publicRefillDuration))
        );
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Tạo bucket cho API authenticated
     */
    @Bean(name = "authenticatedBucket")
    public Bucket authenticatedBucket() {
        Bandwidth limit = Bandwidth.classic(
                authenticatedCapacity,
                Refill.intervally(authenticatedRefillTokens, Duration.ofSeconds(authenticatedRefillDuration))
        );
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Tạo bucket cho API admin
     */
    @Bean(name = "adminBucket")
    public Bucket adminBucket() {
        Bandwidth limit = Bandwidth.classic(
                adminCapacity,
                Refill.intervally(adminRefillTokens, Duration.ofSeconds(adminRefillDuration))
        );
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}

