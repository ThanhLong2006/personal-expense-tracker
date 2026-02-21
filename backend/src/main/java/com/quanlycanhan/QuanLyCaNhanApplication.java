package com.quanlycanhan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Ứng dụng quản lý chi tiêu cá nhân - Backend
 * 
 * @author QuanLyCaNhan
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync // Bật xử lý bất đồng bộ cho email, OTP
@EnableScheduling // Bật lập lịch cho các tác vụ định kỳ
public class QuanLyCaNhanApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuanLyCaNhanApplication.class, args);
    }
}

