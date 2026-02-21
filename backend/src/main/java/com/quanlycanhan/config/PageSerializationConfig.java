package com.quanlycanhan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

/**
 * Configure Spring Data web support to serialize Page results via DTOs
 * which produces a stable JSON structure and avoids PageImpl serialization warnings.
 */
@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class PageSerializationConfig {

}
