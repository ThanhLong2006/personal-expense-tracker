package com.quanlycanhan.controller;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.dto.response.TransactionResponseDTO;
import com.quanlycanhan.entity.Transaction;
import com.quanlycanhan.mapper.TransactionMapper;
import com.quanlycanhan.service.TransactionService;
import com.quanlycanhan.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

/**
 * Controller xử lý giao dịch chi tiêu
 */
@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final SecurityUtil securityUtil;
    private final TransactionMapper transactionMapper;
    private final com.quanlycanhan.service.FileStorageService fileStorageService;

    /**
     * Lấy danh sách giao dịch của user (phân trang)
     * Trả về DTO để ẩn các field nhạy cảm của Entity
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        Page<Transaction> transactions;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            transactions = transactionService.searchTransactions(userId, keyword, pageable);
        } else if (startDate != null || endDate != null) {
            transactions = transactionService.getTransactionsByDateRange(userId, startDate, endDate, pageable);
        } else {
            transactions = transactionService.getUserTransactions(userId, pageable);
        }
        
        // Convert Entity sang DTO để ẩn các field nhạy cảm
        Page<TransactionResponseDTO> dtoPage = transactionMapper.toDTOPage(transactions);
        return ResponseEntity.ok(ApiResponse.success(dtoPage));
    }

    /**
     * Tìm kiếm giao dịch
     * Trả về DTO để ẩn các field nhạy cảm của Entity
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> searchTransactions(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        Page<Transaction> transactions = transactionService.searchTransactions(userId, keyword, pageable);
        Page<TransactionResponseDTO> dtoPage = transactionMapper.toDTOPage(transactions);
        return ResponseEntity.ok(ApiResponse.success(dtoPage));
    }

    /**
     * Lấy giao dịch theo ID
     * Trả về DTO để ẩn các field nhạy cảm của Entity
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> getTransaction(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        Transaction transaction = transactionService.getTransactionById(id, userId);
        TransactionResponseDTO dto = transactionMapper.toDTO(transaction);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Tạo giao dịch mới
     * Trả về DTO để ẩn các field nhạy cảm của Entity
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> createTransaction(
            @RequestBody CreateTransactionRequest request,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        BigDecimal amount = parseAmount(request.getAmount());
        Transaction transaction = transactionService.createTransaction(
            userId,
            request.getCategoryId(),
            amount,
            request.getTransactionDate(),
            request.getNote(),
            request.getLocation(),
            request.getReceiptImage(),
            Transaction.CreatedBy.USER,
            null
        );
        TransactionResponseDTO dto = transactionMapper.toDTO(transaction);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Cập nhật giao dịch
     * Trả về DTO để ẩn các field nhạy cảm của Entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> updateTransaction(
            @PathVariable Long id,
            @RequestBody UpdateTransactionRequest request,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        BigDecimal amount = request.getAmount() != null ? parseAmount(request.getAmount()) : null;
        Transaction transaction = transactionService.updateTransaction(
            id,
            userId,
            request.getCategoryId(),
            amount,
            request.getTransactionDate(),
            request.getNote(),
            request.getLocation(),
            request.getReceiptImage()
        );
        TransactionResponseDTO dto = transactionMapper.toDTO(transaction);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Xóa giao dịch
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa giao dịch thành công", null));
    }

    /**
     * Lấy tổng chi trong khoảng thời gian
     */
    @GetMapping("/total")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalAmount(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        BigDecimal total = transactionService.getTotalAmount(userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    /**
     * Upload a receipt image file. Returns a URL path that can be stored in `receipt_image` column.
     * Frontend should call this endpoint with multipart/form-data and then send returned URL in transaction payload.
     */
    @PostMapping(value = "/upload-receipt", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadReceipt(@RequestPart("file") MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No file uploaded"));
        }
        String url = fileStorageService.storeReceipt(file);
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    /**
     * DTO request tạo giao dịch
     */
    @lombok.Data
    public static class CreateTransactionRequest { 
        private Long categoryId;
        // Frontend sends a `type` ("income" | "expense"); accept but not required
        private String type;
        private String amount; // accept formatted strings like "1,000,000"
        private LocalDate transactionDate;
        private String note;
        private String location;
        private String receiptImage;
    }

    /**
     * DTO request cập nhật giao dịch
     */
    @lombok.Data
    public static class UpdateTransactionRequest {
        private Long categoryId;
        // allow `type` in update payloads as well (ignored by service)
        private String type;
        private String amount; // accept formatted strings
        private LocalDate transactionDate;
        private String note;
        private String location;
        private String receiptImage;
    }

    // Helper to parse formatted amount strings into BigDecimal
    private BigDecimal parseAmount(String raw) {
        if (raw == null) return null;
        try {
            String cleaned = raw.replaceAll("[^0-9\\.-]", "");
            if (cleaned.trim().isEmpty()) return null;
            return new BigDecimal(cleaned);
        } catch (Exception e) {
            throw new RuntimeException("Invalid amount format: " + raw);
        }
    }
}

