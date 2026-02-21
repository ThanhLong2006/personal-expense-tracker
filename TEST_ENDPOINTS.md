# Hướng Dẫn Test API Đăng Ký

## Endpoints Công Khai (Không cần authentication)

### 1. Test API hoạt động
```bash
GET http://localhost:8085/api/public/test
```

Response:
```json
{
  "status": "success",
  "message": "Thành công",
  "data": {
    "status": "OK",
    "message": "API đang hoạt động bình thường",
    "timestamp": "2026-02-09T00:00:00",
    "endpoints": {
      "register": "POST /api/auth/register",
      "login": "POST /api/auth/login",
      "verifyOtp": "POST /api/auth/verify-otp",
      "health": "GET /api/actuator/health"
    }
  }
}
```

### 2. Thông tin API
```bash
GET http://localhost:8085/api/public/info
```

### 3. Health Check
```bash
GET http://localhost:8085/api/actuator/health
```

## Đăng Ký Tài Khoản

### Endpoint
```
POST http://localhost:8085/api/auth/register
Content-Type: application/json
```

### Request Body
```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "fullName": "Nguyễn Văn Test",
  "phone": "0123456789"
}
```

### Response (Thành công)
```json
{
  "status": "success",
  "message": "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.",
  "data": null
}
```

### Response (Lỗi - Email đã tồn tại)
```json
{
  "status": "error",
  "message": "Email đã được sử dụng. Vui lòng chọn email khác.",
  "code": "EMAIL_ALREADY_USED"
}
```

## Verify OTP

### Endpoint
```
POST http://localhost:8085/api/auth/verify-otp
Content-Type: application/json
```

### Request Body
```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

**Lưu ý:** Nếu OTP bị tắt (OTP_ENABLED=false), mã OTP luôn là `123456`.

## Đăng Nhập

### Endpoint
```
POST http://localhost:8085/api/auth/login
Content-Type: application/json
```

### Request Body
```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Response
```json
{
  "status": "success",
  "message": "Thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "fullName": "Nguyễn Văn Test",
      "role": "USER",
      "twoFactorEnabled": false
    }
  }
}
```

## Test với cURL

### Test API
```bash
curl -X GET http://localhost:8085/api/public/test
```

### Đăng ký
```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "fullName": "Nguyễn Văn Test",
    "phone": "0123456789"
  }'
```

### Verify OTP
```bash
curl -X POST http://localhost:8085/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### Đăng nhập
```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

## Test với Postman/Thunder Client

1. **Tạo request mới**
2. **Method:** POST
3. **URL:** `http://localhost:8085/api/auth/register`
4. **Headers:**
   - `Content-Type: application/json`
5. **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "fullName": "Nguyễn Văn Test",
  "phone": "0123456789"
}
```

## Lưu Ý

- **CORS:** Backend đã cấu hình CORS cho `http://localhost:5173` và `http://localhost:3000`
- **OTP:** Nếu muốn test nhanh không cần email, set `OTP_ENABLED=false` trong environment variables
- **JWT Secret:** Đảm bảo đã set `JWT_SECRET` environment variable hoặc dùng default trong `application-localdocker.yml`
- **Database:** Đảm bảo MySQL đang chạy và kết nối đúng

## Troubleshooting

### Lỗi CORS
- Kiểm tra `cors.allowed-origins` trong `application.yml`
- Đảm bảo frontend đang chạy trên port được whitelist

### Lỗi 401 Unauthorized
- Kiểm tra endpoint có trong danh sách `permitAll()` không
- Kiểm tra JWT_SECRET đã được set

### Lỗi 500 Internal Server Error
- Kiểm tra logs trong console
- Kiểm tra database connection
- Kiểm tra Redis connection (nếu dùng)

