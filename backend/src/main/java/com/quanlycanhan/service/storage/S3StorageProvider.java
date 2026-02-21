package com.quanlycanhan.service.storage;

import java.io.InputStream;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * AWS S3 storage - lưu ảnh hóa đơn trên S3 hoặc tương thích (MinIO, DigitalOcean Spaces)
 */
@Slf4j
@Component
@ConditionalOnProperty(name = "app.file-storage.provider", havingValue = "s3")
public class S3StorageProvider implements StorageProvider {

    private final S3Client s3Client;

    @Value("${app.file-storage.s3.bucket}")
    private String bucket;

    @Value("${app.file-storage.url-prefix:/api/files}")
    private String urlPrefix;

    public S3StorageProvider(
            @Value("${app.file-storage.s3.region:ap-southeast-1}") String region,
            @Value("${app.file-storage.s3.access-key:}") String accessKey,
            @Value("${app.file-storage.s3.secret-key:}") String secretKey,
            @Value("${app.file-storage.s3.endpoint:}") String endpoint) {

        var builder = software.amazon.awssdk.services.s3.S3Client.builder()
                .region(software.amazon.awssdk.regions.Region.of(region));

        if (accessKey != null && !accessKey.isEmpty() && secretKey != null && !secretKey.isEmpty()) {
            builder.credentialsProvider(software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
                    .create(software.amazon.awssdk.auth.credentials.AwsBasicCredentials.create(accessKey, secretKey)));
        }

        if (endpoint != null && !endpoint.isEmpty()) {
            builder.endpointOverride(java.net.URI.create(endpoint))
                    .forcePathStyle(true); // Cần cho MinIO
        }

        this.s3Client = builder.build();
    }

    @Override
    public String saveFile(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }
        validateFile(file);

        String extension = getExtension(file.getOriginalFilename());
        String key = "receipts/" + UUID.randomUUID() + extension;

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String url = urlPrefix + "/" + key.replace("receipts/", "");
        log.info("File saved to S3: {}", key);
        return url;
    }

    @Override
    public void deleteFile(String url) {
        if (url == null || url.isEmpty()) return;
        try {
            String key = extractS3Key(url);
            if (key == null) return;

            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
            log.info("File deleted from S3: {}", key);
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", url, e);
        }
    }

    @Override
    public InputStream getFileStream(String url) throws Exception {
        String key = extractS3Key(url);
        if (key == null) return null;

        try {
            return s3Client.getObject(GetObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (NoSuchKeyException e) {
            return null;
        }
    }

    @Override
    public boolean exists(String url) {
        if (url == null || url.isEmpty()) return false;
        try {
            String key = extractS3Key(url);
            if (key == null) return false;
            s3Client.headObject(HeadObjectRequest.builder().bucket(bucket).key(key).build());
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (Exception e) {
            log.warn("Error checking S3 file existence: {}", url, e);
            return false;
        }
    }

    @Override
    public Path getFilePath(String url) {
        return null; // S3 không có local path
    }

    @Override
    public boolean isLocal() {
        return false;
    }

    private String extractS3Key(String url) {
        if (url == null || !url.contains("/")) return null;
        String filename = url.substring(url.lastIndexOf("/") + 1);
        return "receipts/" + filename;
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

