package com.quanlycanhan.service.storage;

import java.io.InputStream;
import java.nio.file.Path;

import org.springframework.web.multipart.MultipartFile;

/**
 * Interface cho storage provider - Local hoặc S3
 */
public interface StorageProvider {

    /**
     * Lưu file và trả về URL
     */
    String saveFile(MultipartFile file) throws Exception;

    /**
     * Xóa file theo URL
     */
    void deleteFile(String url);

    /**
     * Lấy InputStream của file (cho download)
     * @return InputStream hoặc null nếu không tìm thấy
     */
    InputStream getFileStream(String url) throws Exception;

    /**
     * Kiểm tra file có tồn tại không
     */
    boolean exists(String url);

    /**
     * Lấy Path (chỉ cho local storage), null nếu S3
     */
    Path getFilePath(String url);

    /**
     * Có phải local storage không (true = local, false = S3/cloud)
     */
    boolean isLocal();
}

