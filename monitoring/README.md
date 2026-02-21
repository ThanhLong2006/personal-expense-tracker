# Monitoring với Prometheus và Grafana

## Mô tả
Hệ thống monitoring sử dụng Prometheus để thu thập metrics và Grafana để visualize.

## Cài đặt

### 1. Khởi động services
```bash
docker-compose up -d prometheus grafana
```

### 2. Truy cập
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
  - Username: `admin`
  - Password: `admin` (đổi ngay sau lần đăng nhập đầu tiên)

## Cấu hình

### Prometheus
File cấu hình: `monitoring/prometheus.yml`

Prometheus sẽ scrape metrics từ Spring Boot Actuator endpoint `/actuator/prometheus` mỗi 15 giây.

### Grafana

#### Datasource
Đã được cấu hình tự động trong `monitoring/grafana/datasources/prometheus.yml`

#### Dashboards
1. Import dashboard có sẵn:
   - Vào Grafana → Dashboards → Import
   - Import ID: `4701` (Spring Boot 2.1 Statistics)
   - Hoặc tạo dashboard mới

2. Metrics có sẵn từ Spring Boot Actuator:
   - `jvm_memory_used_bytes`: Memory usage
   - `jvm_memory_max_bytes`: Max memory
   - `http_server_requests_seconds`: HTTP request metrics
   - `jvm_gc_pause_seconds`: GC metrics
   - `process_cpu_usage`: CPU usage
   - `system_cpu_usage`: System CPU usage

## Metrics có sẵn

### JVM Metrics
- Memory usage (heap, non-heap)
- GC pause time
- Thread count
- Class loading

### HTTP Metrics
- Request count
- Request duration
- Error rate
- Response status codes

### Application Metrics
- Custom metrics từ `@Timed`, `@Counted` annotations
- Database connection pool metrics
- Cache metrics (nếu dùng Spring Cache)

## Tạo Custom Metrics

Trong Spring Boot, bạn có thể tạo custom metrics:

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class MyService {
    private final Counter customCounter;
    
    public MyService(MeterRegistry registry) {
        this.customCounter = Counter.builder("custom.counter")
            .description("Custom counter metric")
            .register(registry);
    }
    
    public void doSomething() {
        customCounter.increment();
    }
}
```

## Alerting (Tùy chọn)

### Thiết lập Alertmanager
1. Thêm Alertmanager vào docker-compose.yml
2. Cấu hình alert rules trong Prometheus
3. Thiết lập notification channels (Email, Slack, etc.)

### Alert Rules Example
Tạo file `monitoring/prometheus/alerts.yml`:

```yaml
groups:
  - name: application_alerts
    interval: 30s
    rules:
      - alert: HighMemoryUsage
        expr: jvm_memory_used_bytes / jvm_memory_max_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 90%"
      
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 10%"
```

## Troubleshooting

### Prometheus không scrape được metrics
1. Kiểm tra backend có chạy không: `docker ps`
2. Kiểm tra endpoint: `curl http://localhost:8085/actuator/prometheus`
3. Kiểm tra network: `docker network inspect app-network`

### Grafana không kết nối được Prometheus
1. Kiểm tra Prometheus có chạy không: `docker logs qlcn-prometheus`
2. Kiểm tra datasource URL trong Grafana
3. Kiểm tra network connectivity

### Metrics không hiển thị
1. Kiểm tra Spring Boot Actuator đã enable chưa trong `application.yml`
2. Kiểm tra endpoint `/actuator/prometheus` có trả về data không
3. Kiểm tra Prometheus có scrape được không trong Prometheus UI

