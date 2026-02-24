
# QUANLYCANHAN — Phần Mềm Quản Lý Chi Tiêu Cá Nhân

Phiên bản README chuyên nghiệp tập trung vào hướng dẫn thiết lập, build và chạy ứng dụng (backend + frontend) bằng Docker hoặc trong môi trường phát triển.

**Ngôn ngữ:** Tiếng Việt

---

**Tóm tắt:**
- Ứng dụng quản lý chi tiêu cá nhân với dashboard người dùng và admin, hỗ trợ import/export, báo cáo PDF, OCR hóa đơn, và các chức năng admin để quản lý giao dịch người dùng.

## Nội dung chính
- **Yêu cầu hệ thống**
- **Thiết lập cấu hình**
- **Khởi tạo cơ sở dữ liệu**
- **Chạy bằng Docker Compose (khuyến nghị)**
- **Chạy ở chế độ phát triển (local)**
- **Backup & Restore**
- **Xử lý sự cố thường gặp**

---

**Yêu cầu trước khi bắt đầu**
- Docker & Docker Compose (phiên bản ổn định)
- Java 21 (chỉ cần khi chạy backend trực tiếp)
- Maven 3.9+ (chỉ khi build backend bằng Maven)
- Node.js 20+ và npm/yarn (chỉ khi chạy frontend trực tiếp)

## Thiết lập nhanh (Quickstart)

1) Clone repository:

```bash
git clone <repository-url>
cd QUANLYCANHAN
```

2) Chạy toàn bộ bằng Docker Compose (khuyến nghị):

```bash
docker-compose up -d --build
```

Sau khi chạy:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8085/api
- Nginx (reverse proxy): http://localhost:80

3) Đăng nhập / đăng ký theo flow ứng dụng.

---

## Cấu hình môi trường

- Copy `env.example` thành `.env` và điền giá trị thực tế
- **Production**: Xem chi tiết tại `docs/PRODUCTION_DEPLOYMENT.md`

### Backend

- Các biến quan trọng (set qua `.env` hoặc biến môi trường):
  - `JWT_SECRET` — khóa JWT (tối thiểu 32 ký tự). Generate: `openssl rand -base64 48`
  - `MAIL_USERNAME` / `MAIL_PASSWORD` — SMTP (dùng AWS SES, SendGrid cho production)
  - `CORS_ALLOWED_ORIGINS` — chỉ domain chính thức khi production
  - `FILE_STORAGE_PROVIDER` — `s3` cho production (thay vì `local`)
  - `OTP_ENABLED` — bật/tắt OTP (false để test nhanh)

> **Lưu ý bảo mật**: KHÔNG hardcode mật khẩu trong code. Dùng biến môi trường hoặc Docker Secrets.

### Frontend

- Tạo file môi trường `frontend/.env` với biến `VITE_API_URL` trỏ tới backend API:

```
VITE_API_URL=http://localhost:8085/api
```

---

## Khởi tạo cơ sở dữ liệu

- File schema chính: `database/schema.sql`
- Import vào MySQL (local):

```bash
mysql -u root -p quanlycanhan < database/schema.sql
```

- Khi dùng Docker Compose, service MySQL sẽ tự tạo database nếu cấu hình trong `docker-compose.yml` đã được thiết lập.

---

## Chạy ở chế độ phát triển (không dùng Docker)

### Backend (local)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Ghi chú:
- Cài đặt Java 21 và Maven 3.9+ trước khi chạy.

### Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

Ghi chú:
- Frontend sử dụng Vite; truy cập mặc định http://localhost:5173

---

## Build & Package

### Backend (jar)

```bash
cd backend
mvn -DskipTests clean package
# artifact: target/quanlycanhan-backend-1.0.0.jar
```

### Frontend (production)

```bash
cd frontend
npm run build
# output: frontend/dist hoặc cấu hình Vite
```

### Docker images

```bash
docker-compose build
docker-compose up -d
```

---

## Backup & Restore

- Backup JSON (admin API): `POST /admin/system/backups` (yêu cầu ADMIN)
- Backup lưu trong thư mục `backups/` theo mặc định.
- Restore: dùng API tương ứng hoặc import dữ liệu theo định dạng JSON do backend cung cấp.

---

## Các biến tắt OTP để test nhanh

- Tắt OTP trong `application.yml`: `otp.enabled: false`
- Hoặc khi chạy Docker, truyền biến môi trường `OTP_ENABLED=false`

Khi OTP bị tắt:
- Mã OTP mặc định: `123456`
- Không cần gửi email

---

## Xử lý sự cố thường gặp

- Kết nối database: kiểm tra `docker ps` hoặc connection string trong `application.yml`.
- Lỗi gửi email: kiểm tra Gmail App Password, `spring.mail.*`.
- Lỗi OTP: tạm tắt OTP để kiểm tra flow đăng ký.

---

## Kiểm thử

- Backend: `mvn test` trong thư mục `backend`
- Frontend: tùy cấu hình, `npm run test` nếu có test scripts

---

## Đóng góp

- Fork repo → tạo branch feature → mở PR kèm mô tả thay đổi và cách kiểm thử.

---

## License

MIT

---

=======
# personal-expense-tracker
Powerful personal finance manager. Track expenses, income, budgets, and gain insights into your spending habits with charts &amp; reports.

