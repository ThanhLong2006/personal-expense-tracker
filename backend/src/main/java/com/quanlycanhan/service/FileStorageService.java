package com.quanlycanhan.service;

import java.io.InputStream;
import java.nio.file.Path;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.quanlycanhan.service.storage.StorageProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service xử lý lưu trữ file (ảnh hóa đơn)
 * - Hỗ trợ Local storage và AWS S3 (hoặc MinIO, DigitalOcean Spaces)
 * - Chỉ lưu URL vào database
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    private final StorageProvider storageProvider;

    /**
     * Lưu file và trả về URL để lưu vào database
     */
    public String saveFile(MultipartFile file) throws Exception {
        return storageProvider.saveFile(file);
    }

    /**
     * Xóa file
     */
    public void deleteFile(String url) {
        storageProvider.deleteFile(url);
    }

    /**
     * Lấy file path từ URL (chỉ Local storage)
     */
    public Path getFilePath(String url) {
        return storageProvider.getFilePath(url);
    }

    /**
     * Lấy InputStream của file (cho S3 hoặc Local)
     */
    public InputStream getFileStream(String url) throws Exception {
        return storageProvider.getFileStream(url);
    }

    /**
     * Kiểm tra file có tồn tại không
     */
    public boolean exists(String url) {
        return storageProvider.exists(url);
    }

    /**
     * Kiểm tra có phải local storage không
     */
    public boolean isLocalStorage() {
        return storageProvider.isLocal();
    }

    public String storeReceipt(MultipartFile file) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'storeReceipt'");
    }
}
