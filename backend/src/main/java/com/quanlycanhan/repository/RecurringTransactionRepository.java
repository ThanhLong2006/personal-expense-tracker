package com.quanlycanhan.repository;

import com.quanlycanhan.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findByUserId(Long userId);

    @Query("SELECT r FROM RecurringTransaction r WHERE r.status = 'ACTIVE' AND (r.endDate IS NULL OR r.endDate >= :today)")
    List<RecurringTransaction> findAllActiveSubscribed(LocalDate today);
}
