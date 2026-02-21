package com.quanlycanhan.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.entity.Category;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.service.CategoryService;
import com.quanlycanhan.service.TransactionService;
import com.quanlycanhan.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

/**
 * Controller cung cấp các API cho dashboard / reports.
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransactionService transactionService;
    private final CategoryService categoryService;
    private final SecurityUtil securityUtil;

    /**
     * Tổng hợp số liệu (income, expense, net) cho khoảng thời gian (mặc định: tháng hiện tại)
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        if (startDate == null || endDate == null) {
            YearMonth ym = YearMonth.now();
            startDate = ym.atDay(1);
            endDate = ym.atEndOfMonth();
        }

        Object[] totals = transactionService.getIncomeAndExpenseTotals(userId, startDate, endDate);
        BigDecimal income = new BigDecimal(totals[0].toString());
        BigDecimal expense = new BigDecimal(totals[1].toString());
        Map<String, Object> out = new HashMap<>();
        out.put("income", income);
        out.put("expense", expense);
        out.put("net", income.subtract(expense));
        return ResponseEntity.ok(ApiResponse.success(out));
    }

    /**
     * Tổng theo danh mục (mặc định: expense). Trả về danh sách {categoryId, sum}
     */
    @GetMapping("/category-expenses")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCategoryExpenses(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "expense") String type,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        List<Object[]> raw = transactionService.getTotalAmountByCategoryAndType(userId, startDate, endDate, type);
        // Map categoryId -> sum
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] r : raw) {
            Long catId = ((Number) r[0]).longValue();
            BigDecimal sum = new BigDecimal(r[1].toString());
            Optional<Category> cat = categoryService.getUserCategories(userId).stream().filter(c->c.getId().equals(catId)).findFirst();
            Map<String, Object> m = new HashMap<>();
            m.put("categoryId", catId);
            m.put("sum", sum);
            cat.ifPresent(c -> { m.put("name", c.getName()); m.put("icon", c.getIcon()); m.put("color", c.getColor()); });
            result.add(m);
        }
        // sort descending by sum
        result.sort((a,b) -> ((BigDecimal)b.get("sum")).compareTo((BigDecimal)a.get("sum")));
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Xu hướng (trend) chi tiêu theo period: day/week/month/year
     * - year: trả về tổng theo tháng trong year param (mặc định current year)
     */
    @GetMapping("/expense-trend")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExpenseTrend(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(required = false) Integer year,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        Map<String, Object> out = new LinkedHashMap<>();
        if ("year".equalsIgnoreCase(period)) {
            int y = year != null ? year : Year.now().getValue();
            LocalDate start = Year.of(y).atDay(1);
            LocalDate end = Year.of(y).atMonth(12).atEndOfMonth();
            List<Object[]> byCat = transactionService.getTotalAmountByCategory(userId, start, end);
            // We'll compute month sums for expense categories
            // For simplicity return empty series if none
            List<BigDecimal> months = new ArrayList<>(Collections.nCopies(12, BigDecimal.ZERO));
            // Query transactions in range and group by month
            List<Transaction> txs = transactionService.getTransactionsByDateRange(userId, start, end);
            for (Transaction t : txs) {
                if (t.getCategory() != null && "expense".equalsIgnoreCase(t.getCategory().getType())) {
                    int m = t.getTransactionDate().getMonthValue();
                    months.set(m-1, months.get(m-1).add(t.getAmount()));
                }
            }
            out.put("period", "year");
            out.put("year", y);
            out.put("labels", Arrays.asList("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"));
            out.put("values", months);
            return ResponseEntity.ok(ApiResponse.success(out));
        }

        // other periods not yet implemented — return empty
        out.put("period", period);
        out.put("labels", Collections.emptyList());
        out.put("values", Collections.emptyList());
        return ResponseEntity.ok(ApiResponse.success(out));
    }

    @GetMapping("/top-categories")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopCategories(
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        LocalDate start = YearMonth.now().atDay(1);
        LocalDate end = YearMonth.now().atEndOfMonth();
        List<Object[]> raw = transactionService.getTotalAmountByCategoryAndType(userId, start, end, "expense");
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : raw) {
            Long catId = ((Number) r[0]).longValue();
            BigDecimal sum = new BigDecimal(r[1].toString());
            Optional<Category> cat = categoryService.getUserCategories(userId).stream().filter(c->c.getId().equals(catId)).findFirst();
            Map<String, Object> m = new HashMap<>();
            m.put("categoryId", catId);
            m.put("sum", sum);
            cat.ifPresent(c -> { m.put("name", c.getName()); m.put("icon", c.getIcon()); m.put("color", c.getColor()); });
            list.add(m);
        }
        list.sort((a,b) -> ((BigDecimal)b.get("sum")).compareTo((BigDecimal)a.get("sum")));
        if (list.size() > limit) list = list.subList(0, limit);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        // reuse repository pagination via service
        var page = transactionService.getUserTransactions(userId, org.springframework.data.domain.PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("transactionDate").descending()));
        return ResponseEntity.ok(ApiResponse.success(page.getContent()));
    }
}
