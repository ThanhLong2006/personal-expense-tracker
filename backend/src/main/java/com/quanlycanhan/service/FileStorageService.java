package com.quanlycanhan.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service xử lý lưu trữ file (ảnh hóa đơn)
 * - Lưu file vào disk thay vì database
 * - Chỉ lưu URL vào database
 */
@Service
@Slf4j
public class FileStorageService {

    @Value("${app.file-storage.path:./uploads}")
    private String storagePath;

    @Value("${app.file-storage.url-prefix:/api/files}")
    private String urlPrefix;

    /**
     * Lưu file và trả về URL để lưu vào database
     */
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        // Validate file type (chỉ cho phép ảnh)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Chỉ cho phép upload file ảnh");
        }

        // Validate file size (max 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File không được vượt quá 5MB");
        }

        // Tạo thư mục nếu chưa tồn tại
        Path uploadDir = Paths.get(storagePath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Tạo tên file unique
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Lưu file
        Path targetPath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        log.info("File saved: {}", targetPath);

        // Trả về URL để lưu vào database
        return urlPrefix + "/" + uniqueFilename;
    }

    /**
     * Xóa file
     */
    public void deleteFile(String url) {
        if (url == null || url.isEmpty()) {
            return;
        }

        try {
            // Extract filename from URL
            String filename = url.substring(url.lastIndexOf("/") + 1);
            Path filePath = Paths.get(storagePath).resolve(filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", url, e);
        }
    }

    /**
     * Lấy file path từ URL
     */
    public Path getFilePath(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        String filename = url.substring(url.lastIndexOf("/") + 1);
        return Paths.get(storagePath).resolve(filename);
    }
}

