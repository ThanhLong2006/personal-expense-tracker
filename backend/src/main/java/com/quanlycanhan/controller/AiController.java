package com.quanlycanhan.controller;

import com.quanlycanhan.dto.response.ApiResponse;
import com.quanlycanhan.service.AiPredictionService;
import com.quanlycanhan.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý AI dự đoán
 */
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiPredictionService aiPredictionService;
    private final SecurityUtil securityUtil;

    /**
     * Dự đoán chi tiêu tháng tới
     */
    @GetMapping("/prediction")
    public ResponseEntity<ApiResponse<AiPredictionService.PredictionResult>> getPrediction(
            Authentication authentication
    ) {
        Long userId = securityUtil.getUserId(authentication);
        AiPredictionService.PredictionResult result = aiPredictionService.predictNextMonth(userId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}

