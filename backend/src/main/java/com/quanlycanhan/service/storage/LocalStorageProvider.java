package com.quanlycanhan.service.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

/**
 * Local file storage - lưu file trên disk
 */
@Slf4j
@Component
@ConditionalOnProperty(name = "app.file-storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalStorageProvider implements StorageProvider {

    @Value("${app.file-storage.path:./uploads}")
    private String storagePath;

    @Value("${app.file-storage.url-prefix:/api/files}")
    private String urlPrefix;

    @Override
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }
        validateFile(file);

        Path uploadDir = Paths.get(storagePath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String extension = getExtension(file.getOriginalFilename());
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path targetPath = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        log.info("File saved locally: {}", targetPath);
        return urlPrefix + "/" + uniqueFilename;
    }

    @Override
    public void deleteFile(String url) {
        if (url == null || url.isEmpty()) return;
        try {
            Path filePath = getFilePath(url);
            if (filePath != null && Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", url, e);
        }
    }

    @Override
    public InputStream getFileStream(String url) throws IOException {
        Path filePath = getFilePath(url);
        if (filePath == null || !Files.exists(filePath)) return null;
        return Files.newInputStream(filePath);
    }

    @Override
    public boolean exists(String url) {
        Path filePath = getFilePath(url);
        return filePath != null && Files.exists(filePath);
    }

    @Override
    public Path getFilePath(String url) {
        if (url == null || url.isEmpty()) return null;
        String filename = url.substring(url.lastIndexOf("/") + 1);
        return Paths.get(storagePath).resolve(filename);
    }

    @Override
    public boolean isLocal() {
        return true;
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Chỉ cho phép upload file ảnh");
        }
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File không được vượt quá 5MB");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}

