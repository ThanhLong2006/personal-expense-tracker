package com.quanlycanhan.service;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.quanlycanhan.entity.AdminActivityLog;
import com.quanlycanhan.entity.Category;
import com.quanlycanhan.entity.Notification;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.entity.User;
import com.quanlycanhan.repository.AdminActivityLogRepository;
import com.quanlycanhan.repository.CategoryRepository;
import com.quanlycanhan.repository.NotificationRepository;
import com.quanlycanhan.repository.TransactionRepository;
import com.quanlycanhan.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * BackupService - tạo và quản lý bản sao lưu dữ liệu
 * - Xuất dữ liệu ra JSON
 * - Lưu trữ file backup trong thư mục cục bộ
 * - Tự động backup định kỳ
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BackupService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationRepository notificationRepository;
    private final AdminActivityLogRepository adminActivityLogRepository;
    private final EntityManager entityManager;

    @Value("${backup.directory:backups}")
    private String backupDirectory;

    private final ObjectMapper objectMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule());

    private static final DateTimeFormatter FILE_DATE_FORMATTER =
        DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(backupDirectory));
        } catch (IOException e) {
            log.error("Không thể tạo thư mục backup: {}", e.getMessage());
        }
    }

    /**
     * Tạo backup thủ công
     * - Dùng Jackson streaming API để ghi lần lượt ra file, tránh load toàn bộ dữ liệu vào RAM.
     */
    @Transactional(readOnly = true)
    public BackupResult createBackup(Long adminId, String adminEmail) {
        String fileName = "backup-" + FILE_DATE_FORMATTER.format(LocalDateTime.now()) + ".json";
        Path filePath = Paths.get(backupDirectory, fileName);

        try (BufferedWriter writer = Files.newBufferedWriter(filePath);
             JsonGenerator gen = objectMapper.getFactory().createGenerator(writer)) {

            writeBackupStreaming(gen, adminId, adminEmail);
            gen.flush();

            return BackupResult.builder()
                .fileName(fileName)
                .path(filePath.toString())
                .size(Files.size(filePath))
                .createdAt(LocalDateTime.now())
                .createdBy(adminEmail)
                .build();
        } catch (Exception e) {
            log.error("Tạo backup thất bại: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể tạo backup: " + e.getMessage());
        }
    }

    /**
     * Backup tự động theo cron expression (mặc định 6h/lần)
     */
    @Scheduled(cron = "${backup.schedule.cron:0 0 */6 * * *}")
    public void scheduledBackup() {
        try {
            BackupResult result = createBackup(null, "system@backup");
            log.info("Tạo backup tự động thành công: {}", result.getFileName());
        } catch (Exception e) {
            log.error("Backup tự động thất bại: {}", e.getMessage());
        }
    }

    /**
     * Lấy danh sách file backup
     */
    public List<BackupFileInfo> listBackups() {
        try {
            Path directory = Paths.get(backupDirectory);
            if (!Files.exists(directory)) {
                return List.of();
            }

            return Files.list(directory)
                .filter(Files::isRegularFile)
                .filter(path -> path.getFileName().toString().endsWith(".json"))
                .sorted(Comparator.reverseOrder())
                .map(path -> {
                    try {
                        return BackupFileInfo.builder()
                            .fileName(path.getFileName().toString())
                            .size(Files.size(path))
                            .lastModified(Files.getLastModifiedTime(path).toMillis())
                            .build();
                    } catch (IOException e) {
                        log.warn("Không thể đọc file backup {}: {}", path, e.getMessage());
                        return null;
                    }
                })
                .filter(info -> info != null)
                .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("Không thể liệt kê backup: {}", e.getMessage());
            throw new RuntimeException("Không thể liệt kê backup");
        }
    }

    /**
     * Tải nội dung backup
     */
    public ByteArrayResource loadBackup(String fileName) {
        try {
            Path filePath = sanitizePath(fileName);
            byte[] data = Files.readAllBytes(filePath);
            return new ByteArrayResource(data);
        } catch (IOException e) {
            throw new RuntimeException("Không thể đọc file backup");
        }
    }

    /**
     * Ghi nội dung backup ra JsonGenerator theo kiểu streaming, phân trang để tránh OOM.
     */
    @Transactional(readOnly = true)
    protected void writeBackupStreaming(JsonGenerator gen, Long adminId, String adminEmail) throws IOException {
        gen.writeStartObject();

        // Metadata
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("generatedAt", LocalDateTime.now());
        metadata.put("generatedBy", adminEmail);
        metadata.put("adminId", adminId);
        gen.writeFieldName("metadata");
        gen.writeObject(metadata);

        // Users (phân trang)
        gen.writeFieldName("users");
        gen.writeStartArray();
        paginate(userRepository, user -> {
            try {
                gen.writeObject(toUserBackup(user));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        gen.writeEndArray();

        // Categories (ít, có thể load 1 lần)
        List<Category> categories = categoryRepository.findAll();
        gen.writeFieldName("categories");
        gen.writeStartArray();
        for (Category c : categories) {
            gen.writeObject(c);
        }
        gen.writeEndArray();

        // Transactions – phân trang + dùng DTO gọn để tránh trường nặng
        gen.writeFieldName("transactions");
        gen.writeStartArray();
        paginateTransactions(gen);
        gen.writeEndArray();

        // Notifications (phân trang)
        gen.writeFieldName("notifications");
        gen.writeStartArray();
        paginate(notificationRepository, n -> {
            try {
                gen.writeObject(n);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        gen.writeEndArray();

        // Admin logs (phân trang)
        gen.writeFieldName("adminLogs");
        gen.writeStartArray();
        paginate(adminActivityLogRepository, l -> {
            try {
                gen.writeObject(l);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        gen.writeEndArray();

        gen.writeEndObject();
    }

    /**
     * Hàm helper generic để phân trang trên JpaRepository<T, Long> mà không load tất cả vào RAM.
     */
    private <T> void paginate(org.springframework.data.jpa.repository.JpaRepository<T, Long> repo,
                              Consumer<T> consumer) {
        int pageSize = 1000;
        int pageIndex = 0;
        while (true) {
            Page<T> page = repo.findAll(PageRequest.of(pageIndex, pageSize));
            if (!page.hasContent()) break;
            page.getContent().forEach(consumer);
            if (!page.hasNext()) break;
            pageIndex++;
        }
    }

    /**
     * Phân trang riêng cho Transaction để đảm bảo JOIN user/category khi cần mà vẫn tránh OOM.
     */
    private void paginateTransactions(JsonGenerator gen) throws IOException {
        int batchSize = 1000;
        Session session = entityManager.unwrap(Session.class);

        Query<Transaction> query = session.createQuery(
            "SELECT t FROM Transaction t " +
                "LEFT JOIN FETCH t.category " +
                "LEFT JOIN FETCH t.user " +
                "ORDER BY t.id ASC",
            Transaction.class
        );

        int offset = 0;
        while (true) {
            query.setFirstResult(offset);
            query.setMaxResults(batchSize);
            List<Transaction> batch = query.getResultList();
            if (batch.isEmpty()) {
                break;
            }

            for (Transaction t : batch) {
                gen.writeObject(toTransactionBackup(t));
            }

            // Giải phóng session định kỳ để tránh phình bộ nhớ
            session.clear();
            offset += batchSize;
        }
    }

    private Path sanitizePath(String fileName) throws IOException {
        Path directory = Paths.get(backupDirectory).toAbsolutePath().normalize();
        Path filePath = directory.resolve(fileName).normalize();
        if (!filePath.startsWith(directory)) {
            throw new IOException("Đường dẫn không hợp lệ");
        }
        if (!Files.exists(filePath)) {
            throw new IOException("File không tồn tại");
        }
        return filePath;
    }

    private UserBackup toUserBackup(User user) {
        UserBackup dto = new UserBackup();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setAvatar(user.getAvatar());
        dto.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setTwoFactorEnabled(Boolean.TRUE.equals(user.getTwoFactorEnabled()));
        dto.setLanguage(user.getLanguage());
        dto.setTheme(user.getTheme());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    private TransactionBackup toTransactionBackup(Transaction t) {
        TransactionBackup dto = new TransactionBackup();
        dto.setId(t.getId());
        dto.setUserId(t.getUser() != null ? t.getUser().getId() : null);
        dto.setCategoryId(t.getCategory() != null ? t.getCategory().getId() : null);
        dto.setAmount(t.getAmount());
        dto.setTransactionDate(t.getTransactionDate());
        dto.setNote(t.getNote());
        dto.setLocation(t.getLocation());
        dto.setCreatedBy(t.getCreatedBy() != null ? t.getCreatedBy().name() : null);
        dto.setCreatedByAdminId(t.getCreatedByAdminId());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setUpdatedAt(t.getUpdatedAt());
        return dto;
    }

    // BackupPayload không còn được dùng trực tiếp (đã chuyển sang streaming),
    // giữ lại class cho backward compatibility nếu cần parse lại các file cũ.
    @Data
    public static class BackupPayload {
        private Map<String, Object> metadata;
        private List<UserBackup> users;
        private List<Category> categories;
        private List<TransactionBackup> transactions;
        private List<Notification> notifications;
        private List<AdminActivityLog> adminLogs;
    }

    /**
     * DTO an toàn cho User trong backup – KHÔNG chứa password, 2FA secret, failedLoginAttempts, v.v.
     */
    @Data
    public static class UserBackup {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String avatar;
        private String status;
        private String role;
        private Boolean twoFactorEnabled;
        private String language;
        private String theme;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
    }

    /**
     * DTO gọn cho Transaction trong backup – loại bỏ receiptImage (ảnh có thể rất lớn).
     */
    @Data
    public static class TransactionBackup {
        private Long id;
        private Long userId;
        private Long categoryId;
        private java.math.BigDecimal amount;
        private java.time.LocalDate transactionDate;
        private String note;
        private String location;
        private String createdBy;
        private Long createdByAdminId;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
    }

    @Data
    @Builder
    public static class BackupResult {
        private String fileName;
        private String path;
        private long size;
        private LocalDateTime createdAt;
        private String createdBy;   
    }

    @Data
    @Builder
    public static class BackupFileInfo {
        private String fileName;
        private long size;
        private long lastModified;
    }
}