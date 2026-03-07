package com.quanlycanhan.service;

import com.quanlycanhan.entity.RecurringTransaction;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.repository.RecurringTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionService transactionService;

    /**
     * Chạy định kỳ vào 01:00 mỗi ngày để tạo giao dịch tự động
     */
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void processRecurringTransactions() {
        LocalDate today = LocalDate.now();
        log.info("Bắt đầu xử lý giao dịch định kỳ cho ngày: {}", today);
        
        List<RecurringTransaction> activeList = recurringTransactionRepository.findAllActiveSubscribed(today);
        
        for (RecurringTransaction rt : activeList) {
            try {
                if (shouldExecute(rt, today)) {
                    createTransactionFromRecurring(rt, today);
                    rt.setLastExecutedDate(today);
                    recurringTransactionRepository.save(rt);
                    log.info("Đã tạo giao dịch định kỳ ID: {} cho user: {}", rt.getId(), rt.getUser().getId());
                }
            } catch (Exception e) {
                log.error("Lỗi khi xử lý giao dịch định kỳ ID: {}", rt.getId(), e);
            }
        }
    }

    private boolean shouldExecute(RecurringTransaction rt, LocalDate today) {
        if (rt.getLastExecutedDate() == null) {
            return !today.isBefore(rt.getStartDate());
        }

        LocalDate nextDate;
        switch (rt.getFrequency()) {
            case DAILY:
                nextDate = rt.getLastExecutedDate().plusDays(1);
                break;
            case WEEKLY:
                nextDate = rt.getLastExecutedDate().plusWeeks(1);
                break;
            case MONTHLY:
                nextDate = rt.getLastExecutedDate().plusMonths(1);
                break;
            case YEARLY:
                nextDate = rt.getLastExecutedDate().plusYears(1);
                break;
            default:
                return false;
        }

        return !today.isBefore(nextDate);
    }

    private void createTransactionFromRecurring(RecurringTransaction rt, LocalDate date) {
        transactionService.createTransaction(
                rt.getUser().getId(),
                rt.getCategory().getId(),
                rt.getAmount(),
                rt.getCurrency(),
                date,
                rt.getNote() != null ? rt.getNote() + " (Định kỳ)" : "Giao dịch định kỳ",
                "Tự động",
                null,
                Transaction.CreatedBy.USER, // Đánh dấu là USER để user vẫn quản lý được
                null
        );
    }

    public List<RecurringTransaction> getUserRecurringTransactions(Long userId) {
        return recurringTransactionRepository.findByUserId(userId);
    }

    @Transactional
    public RecurringTransaction createRecurringTransaction(RecurringTransaction rt) {
        return recurringTransactionRepository.save(rt);
    }

    @Transactional
    public void deleteRecurringTransaction(Long id) {
        recurringTransactionRepository.deleteById(id);
    }
}
