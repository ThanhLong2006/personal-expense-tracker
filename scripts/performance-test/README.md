# Performance Test với k6

## Cài đặt k6

**Windows:**
```powershell
choco install k6
```

**Mac:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Chạy test

```bash
# Test mặc định (localhost:8085)
k6 run scripts/performance-test/k6-load-test.js

# Test với API URL khác
k6 run -e API_URL=https://api.yourdomain.com/api scripts/performance-test/k6-load-test.js

# Test nhanh (giảm thời gian)
k6 run --vus 10 --duration 1m scripts/performance-test/k6-load-test.js

# Export kết quả ra file
k6 run --out json=results.json scripts/performance-test/k6-load-test.js
```

## Đánh giá kết quả

- **http_req_duration**: Thời gian phản hồi - mục tiêu p(95) < 3s
- **http_req_failed**: Tỷ lệ lỗi - mục tiêu < 5%
- **iterations**: Số request đã thực hiện
- **data_received/s**: Băng thông nhận

## Lưu ý

- Đảm bảo backend đang chạy trước khi test
- Test với dữ liệu thật (có user, transactions) để kết quả chính xác hơn
- Có thể tạo script test có JWT token để test các endpoint authenticated

