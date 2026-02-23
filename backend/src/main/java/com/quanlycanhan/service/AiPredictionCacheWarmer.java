package com.quanlycanhan.service;

import com.quanlycanhan.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Pre-warm cache AI Prediction - Chạy nền mỗi giờ
 * Giảm tải khi user request vì kết quả đã được cache sẵn
 */
@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.ai-prediction.cache-warm-enabled", havingValue = "true", matchIfMissing = false)
public class AiPredictionCacheWarmer {

    private final AiPredictionService aiPredictionService;
    private final TransactionRepository transactionRepository;

    @Value("${app.ai-prediction.cache-warm-limit:100}")
    private int maxUsersPerRun;

    /**
     * Chạy mỗi giờ - pre-warm cache cho users có giao dịch gần đây
     */
    @Scheduled(cron = "${app.ai-prediction.cache-warm-cron:0 0 * * * *}")
    @Async
    public void warmCache() {
        try {
            LocalDate since = LocalDate.now().minusMonths(6);
            List<Long> userIds = transactionRepository.findDistinctUserIdsWithTransactionsSince(since);

            if (userIds.isEmpty()) {
                log.debug("AI cache warm: No users with recent transactions");
                return;
            }

            int limit = Math.min(userIds.size(), maxUsersPerRun);
            int warmed = 0;

            for (int i = 0; i < limit; i++) {
                try {
                    aiPredictionService.predictNextMonth(userIds.get(i));
                    warmed++;
                } catch (Exception e) {
                    log.warn("AI cache warm failed for user {}: {}", userIds.get(i), e.getMessage());
                }
            }

            log.info("AI prediction cache warmed for {}/{} users", warmed, userIds.size());
        } catch (Exception e) {
            log.error("AI cache warm error", e);
        }
    }
}

