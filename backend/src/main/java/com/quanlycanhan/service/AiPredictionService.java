package com.quanlycanhan.service;

import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Service AI dự đoán chi tiêu
 * - Dự đoán chi tiêu tháng tới dựa trên dữ liệu 3-6 tháng gần nhất
 * - Sử dụng EMA (Exponential Moving Average) và Linear Regression đơn giản
 */
@Service
@RequiredArgsConstructor
public class AiPredictionService {

    private final TransactionRepository transactionRepository;

    /**
     * Dự đoán chi tiêu tháng tới
     * - Phân tích dữ liệu 6 tháng gần nhất
     * - Tính EMA và Linear Regression
     */
    public PredictionResult predictNextMonth(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);

        // Lấy dữ liệu 6 tháng gần nhất
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(
            userId, startDate, endDate
        );

        if (transactions.isEmpty()) {
            return PredictionResult.builder()
                .predictedAmount(BigDecimal.ZERO)
                .confidence(0.0)
                .message("Chưa có đủ dữ liệu để dự đoán")
                .build();
        }

        // Tính tổng chi theo tháng
        List<MonthlyTotal> monthlyTotals = calculateMonthlyTotals(transactions, startDate, endDate);

        if (monthlyTotals.size() < 3) {
            return PredictionResult.builder()
                .predictedAmount(monthlyTotals.get(monthlyTotals.size() - 1).getTotal())
                .confidence(0.5)
                .message("Dữ liệu chưa đủ, dự đoán dựa trên tháng gần nhất")
                .build();
        }

        // Tính EMA (Exponential Moving Average)
        BigDecimal emaPrediction = calculateEMA(monthlyTotals);

        // Tính Linear Regression
        BigDecimal lrPrediction = calculateLinearRegression(monthlyTotals);

        // Kết hợp EMA và Linear Regression (trung bình có trọng số)
        BigDecimal predictedAmount = emaPrediction.multiply(BigDecimal.valueOf(0.6))
            .add(lrPrediction.multiply(BigDecimal.valueOf(0.4)));

        // Tính độ tin cậy (confidence) dựa trên độ ổn định của dữ liệu
        double confidence = calculateConfidence(monthlyTotals);

        return PredictionResult.builder()
            .predictedAmount(predictedAmount.setScale(2, RoundingMode.HALF_UP))
            .confidence(confidence)
            .message("Dự đoán dựa trên dữ liệu " + monthlyTotals.size() + " tháng gần nhất")
            .trend(calculateTrend(monthlyTotals))
            .build();
    }

    /**
     * Tính tổng chi theo tháng
     */
    private List<MonthlyTotal> calculateMonthlyTotals(List<Transaction> transactions,
                                                      LocalDate startDate, LocalDate endDate) {
        List<MonthlyTotal> monthlyTotals = new ArrayList<>();
        LocalDate current = startDate.withDayOfMonth(1);

        while (!current.isAfter(endDate)) {
            LocalDate monthStart = current;
            LocalDate monthEnd = current.plusMonths(1).minusDays(1);

            BigDecimal total = transactions.stream()
                .filter(t -> !t.getTransactionDate().isBefore(monthStart) &&
                           !t.getTransactionDate().isAfter(monthEnd))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            monthlyTotals.add(new MonthlyTotal(monthStart, total));
            current = current.plusMonths(1);
        }

        return monthlyTotals;
    }

    /**
     * Tính EMA (Exponential Moving Average)
     * - Alpha = 0.3 (trọng số cho giá trị gần nhất)
     */
    private BigDecimal calculateEMA(List<MonthlyTotal> monthlyTotals) {
        double alpha = 0.3;
        BigDecimal ema = monthlyTotals.get(0).getTotal();

        for (int i = 1; i < monthlyTotals.size(); i++) {
            ema = monthlyTotals.get(i).getTotal()
                .multiply(BigDecimal.valueOf(alpha))
                .add(ema.multiply(BigDecimal.valueOf(1 - alpha)));
        }

        return ema;
    }

    /**
     * Tính Linear Regression đơn giản
     * - y = a + b*x
     */
    private BigDecimal calculateLinearRegression(List<MonthlyTotal> monthlyTotals) {
        int n = monthlyTotals.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        for (int i = 0; i < n; i++) {
            double x = i;
            double y = monthlyTotals.get(i).getTotal().doubleValue();
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }

        double b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        double a = (sumY - b * sumX) / n;

        // Dự đoán tháng tiếp theo (x = n)
        double prediction = a + b * n;
        return BigDecimal.valueOf(Math.max(0, prediction));
    }

    /**
     * Tính độ tin cậy (0.0 - 1.0)
     * - Dựa trên độ ổn định của dữ liệu (độ lệch chuẩn)
     */
    private double calculateConfidence(List<MonthlyTotal> monthlyTotals) {
        if (monthlyTotals.size() < 2) {
            return 0.5;
        }

        // Tính trung bình
        double mean = monthlyTotals.stream()
            .mapToDouble(m -> m.getTotal().doubleValue())
            .average()
            .orElse(0);

        // Tính độ lệch chuẩn
        double variance = monthlyTotals.stream()
            .mapToDouble(m -> Math.pow(m.getTotal().doubleValue() - mean, 2))
            .average()
            .orElse(0);
        double stdDev = Math.sqrt(variance);

        // Độ tin cậy = 1 - (coefficient of variation)
        double cv = mean > 0 ? stdDev / mean : 1.0;
        return Math.max(0.0, Math.min(1.0, 1.0 - cv * 0.5));
    }

    /**
     * Tính xu hướng (tăng/giảm/ổn định)
     */
    private String calculateTrend(List<MonthlyTotal> monthlyTotals) {
        if (monthlyTotals.size() < 2) {
            return "KHÔNG_XÁC_ĐỊNH";
        }

        BigDecimal first = monthlyTotals.get(0).getTotal();
        BigDecimal last = monthlyTotals.get(monthlyTotals.size() - 1).getTotal();
        BigDecimal diff = last.subtract(first);
        BigDecimal percentChange = first.compareTo(BigDecimal.ZERO) > 0
            ? diff.divide(first, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;

        if (percentChange.compareTo(BigDecimal.valueOf(5)) > 0) {
            return "TĂNG";
        } else if (percentChange.compareTo(BigDecimal.valueOf(-5)) < 0) {
            return "GIẢM";
        } else {
            return "ỔN_ĐỊNH";
        }
    }

    /**
     * Class lưu tổng chi theo tháng
     */
    private static class MonthlyTotal {
        private final LocalDate month;
        private final BigDecimal total;

        public MonthlyTotal(LocalDate month, BigDecimal total) {
            this.month = month;
            this.total = total;
        }

        public LocalDate getMonth() {
            return month;
        }

        public BigDecimal getTotal() {
            return total;
        }
    }

    /**
     * Kết quả dự đoán
     */
    @lombok.Data
    @lombok.Builder
    public static class PredictionResult {
        private BigDecimal predictedAmount;
        private double confidence;
        private String message;
        private String trend; // TĂNG, GIẢM, ỔN_ĐỊNH
    }
}

