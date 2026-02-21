package com.quanlycanhan.controller;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Path;

/**
 * Controller xử lý upload/download file (ảnh hóa đơn)
 * Hỗ trợ cả Local storage và S3
 */
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * Upload file (ảnh hóa đơn)
     * Trả về URL để lưu vào database
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileStorageService.saveFile(file);
            return ResponseEntity.ok(ApiResponse.success("Upload thành công", url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lỗi khi upload file: " + e.getMessage()));
        }
    }

    /**
     * Download file theo filename
     * Hỗ trợ Local storage và S3
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            String url = "/api/files/" + filename;
            String contentType = getContentType(filename);

            if (fileStorageService.isLocalStorage()) {
                Path filePath = fileStorageService.getFilePath(url);
                if (filePath == null || !filePath.toFile().exists()) {
                    return ResponseEntity.notFound().build();
                }
                Resource resource = new UrlResource(filePath.toUri());
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                // S3 storage - stream từ S3
                InputStream stream = fileStorageService.getFileStream(url);
                if (stream == null) {
                    return ResponseEntity.notFound().build();
                }
                Resource resource = new InputStreamResource(stream);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG_VALUE;
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG_VALUE;
        if (lower.endsWith(".gif")) return MediaType.IMAGE_GIF_VALUE;
        return "application/octet-stream";
    }
}

