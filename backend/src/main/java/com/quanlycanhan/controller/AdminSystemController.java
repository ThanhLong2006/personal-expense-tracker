package com.quanlycanhan.controller;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.service.BackupService;
import com.quanlycanhan.service.BackupService.BackupFileInfo;
import com.quanlycanhan.service.BackupService.BackupResult;
import com.quanlycanhan.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * AdminSystemController - quản lý cấu hình hệ thống
 * - Backup / Restore dữ liệu
 * - Liệt kê các bản backup
 */
@RestController
@RequestMapping("/admin/system")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSystemController {

    private final BackupService backupService;
    private final SecurityUtil securityUtil;

    /**
     * Tạo backup thủ công
     */
    @PostMapping("/backups")
    public ResponseEntity<ApiResponse<BackupResult>> createBackup(Authentication authentication) {
        var admin = securityUtil.getUser(authentication);
        BackupResult result = backupService.createBackup(admin.getId(), admin.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Tạo backup thành công", result));
    }

    /**
     * Liệt kê các bản backup
     */
    @GetMapping("/backups")
    public ResponseEntity<ApiResponse<List<BackupFileInfo>>> listBackups() {
        List<BackupFileInfo> backups = backupService.listBackups();
        return ResponseEntity.ok(ApiResponse.success(backups));
    }

    /**
     * Tải file backup
     */
    @GetMapping("/backups/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadBackup(@PathVariable String fileName) {
        ByteArrayResource resource = backupService.loadBackup(fileName);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(resource.contentLength())
            .body(resource);
    }
}

