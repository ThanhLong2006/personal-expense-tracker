# Luồng Đi Chi Tiết Dự Án Quản Lý chi tiêu Cá Nhân

Mục tiêu: mô tả đầy đủ cách hệ thống vận hành từ khi người dùng truy cập đến khi dữ liệu được xử lý và trả về; bao gồm frontend, backend, bảo mật, caching, database, Nginx, và triển khai. Tài liệu này giúp bạn nắm rõ dòng chảy của request/response, các lớp chịu trách nhiệm, dữ liệu qua các tầng, và các tối ưu hiệu năng/bảo mật đã áp dụng.

## Tổng Quan Kiến Trúc
- Frontend: React + React Router + React Query, Zustand cho auth state, Axios cho HTTP.
- Backend: Spring Boot 3, Spring Security + JWT, Data JPA, Validation, Redis, Actuator.
- Database: MySQL 8 (InnoDB, UTF8MB4), schema tối ưu chỉ mục.
- Hạ tầng: Docker Compose (backend, mysql, redis, nginx), Nginx proxy và serve static.
- Bảo mật: CSP, HSTS, XSS Protection, X‑Frame‑Options, Referrer‑Policy, Content‑Type‑Options.
- Hiệu năng: gzip, HTTP/2, Redis cache cho đọc nhiều, lazy‑load public pages.

## Luồng Tải Trang (Client → Nginx → Frontend)
- Trình duyệt truy cập tên miền.
- Nginx lắng nghe port 80, phục vụ static build từ `/usr/share/nginx/html` với `try_files` và headers bảo mật, bật `gzip` cho các loại nội dung tĩnh.
- Frontend được tải: `App.tsx` khởi tạo `QueryClient`, router, layouts, và pages (frontend/src/App.tsx:50–58). Các trang public được lazy‑load để giảm bundle ban đầu (frontend/src/App.tsx:71–85).

## Luồng Gọi API (Axios → Backend → Response)
- Axios cấu hình `baseURL` từ `VITE_API_URL` (frontend/src/api/axios.ts:7).
- Interceptor request đính kèm `Authorization: Bearer <accessToken>` nếu có (frontend/src/api/axios.ts:16–21).
- Interceptor response:
  - Nếu `401` và có `refreshToken`, gọi `POST /auth/refresh` để lấy `accessToken` mới, đánh dấu `_retry`, gắn lại header và retry request gốc (frontend/src/api/axios.ts:41–63).
  - Nếu refresh thất bại, logout và điều hướng `/login` (frontend/src/api/axios.ts:63–74).
- Mọi API trả về theo chuẩn `ApiResponse<T>` với trường `data` dùng cho payload (backend/src/main/java/com/quanlycanhan/dto/response/ApiResponse.java:13–54). Frontend đọc `response.data.data` nhất quán.

## Luồng Authentication
- Đăng ký: `POST /auth/register` nhận email/password/fullName, gửi OTP qua email (backend/src/main/java/com/quanlycanhan/controller/AuthController.java:31–47).
- Verify OTP: `POST /auth/verify-otp` kích hoạt tài khoản (backend/src/main/java/com/quanlycanhan/controller/AuthController.java:49–61).
- Đăng nhập: `POST /auth/login` trả `accessToken` + `refreshToken` + `user` (backend/src/main/java/com/quanlycanhan/controller/AuthController.java:76–86). Frontend lưu cả hai vào store và `localStorage` (frontend/src/store/authStore.ts:18–25, 39–61).
- Refresh token: `POST /auth/refresh?refreshToken=...` trả access token mới; interceptor tự động xử lý (backend/src/main/java/com/quanlycanhan/controller/AuthController.java:88–92, frontend/src/api/axios.ts:41–63).
- Quên/đặt lại mật khẩu: liên kết reset được tạo và lưu token trong Redis TTL 15 phút, xóa sau khi dùng.

## Bảo Vệ Endpoint (Spring Security)
- Phân quyền đường dẫn: public `/auth/**`, `/public/**`, health `/actuator/health`, admin `/admin/**` yêu cầu role, còn lại yêu cầu authenticated (backend/src/main/java/com/quanlycanhan/config/SecurityConfig.java:69–88).
- CORS đọc từ cấu hình để whitelist origins (backend/src/main/java/com/quanlycanhan/config/SecurityConfig.java:92–119).
- Headers bảo mật: CSP, HSTS, XSS, FrameOptions, ReferrerPolicy, ContentTypeOptions (backend/src/main/java/com/quanlycanhan/config/SecurityConfig.java:69–88).
- Stateless sessions: mỗi request phải có JWT hợp lệ.

## Dòng Chảy Request Chi Tiết (Protected Route)
1. Người dùng truy cập một route cần đăng nhập; `ProtectedRoute` kiểm tra trạng thái đăng nhập, nếu chưa có chuyển về `/login` (frontend/src/components/ProtectedRoute.tsx:… nếu có).
2. Axios gửi request kèm `Authorization`.
3. Backend nhận request:
   - Security filter chain kiểm tra JWT (backend/src/main/java/com/quanlycanhan/config/SecurityConfig.java:54–90).
   - Nếu hợp lệ, chuyển vào Controller tương ứng.
4. Controller gọi Service, Service thao tác Repository.
5. Service trả entity/DTO, Controller gói vào `ApiResponse.success(data)`.
6. Frontend nhận `response.data.data`, cập nhật UI.

## Luồng Danh Mục (Categories)
- Lấy danh mục người dùng (bao gồm danh mục hệ thống): `GET /categories` (backend/src/main/java/com/quanlycanhan/controller/CategoryController.java:24–33).
- Service trả về cả danh mục hệ thống và của user; bật cache Redis:
  - `getUserCategories(userId)` cache `userCategories::userId` và `readOnly` (backend/src/main/java/com/quanlycanhan/service/CategoryService.java:28–31).
  - `getSystemDefaultCategories()` cache `systemCategories` (backend/src/main/java/com/quanlycanhan/service/CategoryService.java:36–39).
  - Tạo/sửa/xóa danh mục sẽ evict cache để dữ liệu nhất quán (backend/src/main/java/com/quanlycanhan/service/CategoryService.java:44–62, 67–90, 95–107).
- Dữ liệu mặc định hệ thống được seed qua `database/init` khi khởi tạo MySQL lần đầu.

## Luồng Giao Dịch (Transactions)
- CRUD: các endpoint trong `TransactionController` đảm nhiệm lấy danh sách, chi tiết, tạo, cập nhật, xóa (backend/src/main/java/com/quanlycanhan/controller/TransactionController.java:12–44, 46–60, 62–73, 98–119, 121–132).
- Kiểm tra sở hữu giao dịch trước khi thao tác (backend/src/main/java/com/quanlycanhan/service/TransactionService.java:50–60).
- Thống kê:
  - Tổng chi theo khoảng thời gian: cache `totalAmount::<userId>:<start>:<end>` (backend/src/main/java/com/quanlycanhan/service/TransactionService.java:146–148).
  - Tổng chi theo danh mục: cache `totalByCategory::<userId>:<start>:<end>` (backend/src/main/java/com/quanlycanhan/service/TransactionService.java:153–155).
  - Mọi thay đổi CRUD giao dịch evict các cache thống kê liên quan (backend/src/main/java/com/quanlycanhan/service/TransactionService.java:65–93, 98–132, 137–141).

## Chuẩn Hóa Response & Xử Lý Lỗi
- Mọi response thành công: `ApiResponse.success(data)`. Lỗi validation: `400` với `ApiResponse.error(message)` (backend/src/main/java/com/quanlycanhan/dto/response/ApiResponse.java:25–34; backend/src/main/java/com/quanlycanhan/config/GlobalExceptionHandler.java:20–28).
- Lỗi runtime: `400` với thông báo chi tiết, lỗi chưa xử lý: `500` với thông báo chung (backend/src/main/java/com/quanlycanhan/config/GlobalExceptionHandler.java:30–45).
- Frontend xử lý lỗi tập trung qua axios interceptor; khi `401` có refresh tự động; khi refresh thất bại, logout và chuyển `/login`.

## Caching Chi Tiết (Redis)
- Cấu hình `CacheManager` Redis TTL 30 phút (backend/src/main/java/com/quanlycanhan/config/RedisConfig.java:25–41) và bật `@EnableCaching` (backend/src/main/java/com/quanlycanhan/config/RedisConfig.java:1).
- Khoá cache:
  - `userCategories::<userId>`: danh mục của user.
  - `systemCategories`: danh mục hệ thống.
  - `totalAmount::<userId>:<start>:<end>`: tổng theo thời gian.
  - `totalByCategory::<userId>:<start>:<end>`: tổng theo danh mục.
- OTP/reset password: dùng Redis TTL ngắn cho token.

## Database & Chỉ Mục
- Bảng: `users`, `categories`, `transactions`, `notifications`, `admin_activity_logs` (database/schema.sql:6–26, 28–43, 45–63, 65–77, 79–94).
- Charset/collation: `utf8mb4` để hỗ trợ đầy đủ tiếng Việt/emoji.
- Chỉ mục:
  - `users`: theo `status`, `role`.
  - `categories`: theo `user_id`, `system_default`.
  - `transactions`: theo `user_id, transaction_date`, `category_id`, `transaction_date`, và composite `user_id, category_id, transaction_date` (database/schema.sql:60–63).
- Ràng buộc: FK `transactions.user_id` và `transactions.category_id` đảm bảo toàn vẹn dữ liệu.

## Nginx & Triển Khai
- Cấu hình Nginx:
  - Serve static frontend với cache dài hạn và security headers (nginx/nginx.conf:18–29).
  - Proxy `/api` sang `backend:8085` với headers chuẩn và bảo mật (nginx/nginx.conf:28–37).
  - Bật `gzip` cho các loại nội dung phổ biến (nginx/nginx.conf:5–12).
- Docker Compose:
  - `mysql`: port `3307:3306`, mount `database/init` để auto‑import schema/seed (docker-compose.yml:17–24).
  - `redis`: cache và token.
  - `backend`: Spring Boot trên `8085` với context `/api`.
  - `nginx`: serve static và proxy `/api`.

## Bảo Mật Tổng Hợp
- Không hardcode secrets; đọc từ biến môi trường trong `application.yml` (backend/src/main/resources/application.yml:21–41).
- CORS whitelist từ cấu hình `cors.allowed-origins` (backend/src/main/java/com/quanlycanhan/config/SecurityConfig.java:92–119).
- JWT: thời gian sống access/refresh khác nhau; refresh chỉ cấp lại access token.
- Headers bảo mật ở cả backend và Nginx.
- Stateless sessions giảm rủi ro CSRF.

## Quan Sát & Vận Hành
- Actuator: `/actuator/health` public để load balancer kiểm tra (backend/pom.xml:31–39, backend/src/main/java/com/quanlycanhan/config/SecurityConfig.java:75–77).
- Logging: bật mức DEBUG cho module chính khi cần (backend/src/main/resources/application.yml:79–85).

## Quy Trình CI/CD Gợi Ý
- Build backend: `mvn clean package`, chạy test.
- Build frontend: `npm run build`, copy vào Nginx.
- Cấu hình `.env` cung cấp `VITE_API_URL`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`.
- Khởi chạy Compose: `docker-compose up -d`.

## Luồng Ví Dụ Chi Tiết
1. Người dùng mở `/transactions`:
   - Nginx trả về `index.html` và assets, gzip bật.
   - `ProtectedRoute` kiểm tra login; nếu ok, render.
   - Frontend gọi `GET /api/transactions?page=0&size=20`.
2. Backend nhận request:
   - Security chain xác thực JWT hợp lệ.
   - `TransactionController.getTransactions` lấy `userId`, tạo `PageRequest`, gọi `TransactionService.getUserTransactions` (backend/src/main/java/com/quanlycanhan/controller/TransactionController.java:12–44).
   - Repository truy vấn DB với chỉ mục phù hợp.
3. Trả response:
   - `ApiResponse.success(Page<Transaction>)` → frontend nhận `data` và render danh sách.

4. Người dùng mở thống kê tháng:
   - Frontend gọi `GET /api/transactions/stats?start=...&end=...` (ví dụ endpoint thống kê).
   - `TransactionService.getTotalAmount` kiểm tra cache Redis theo key `totalAmount::<userId>:<start>:<end>` (backend/src/main/java/com/quanlycanhan/service/TransactionService.java:146–148).
   - Nếu có cache → trả ngay; nếu không → truy vấn DB, set cache TTL 30 phút.

## Khuyến Nghị Sử Dụng & Mở Rộng
- Áp dụng `@Cacheable` cho các API thống kê dashboard khác (theo tháng/quý/năm).
- Áp dụng code splitting sâu cho các cụm public nội dung lớn.
- Bật HTTPS thực tế (Let’s Encrypt) và di chuyển HSTS/CSP sang server `ssl` để hiệu lực tối đa.
- Thêm CI pipeline chạy `mvn test`, `npm run build`, `tsc`, lint để đảm bảo chất lượng trước deploy.

---

Tài liệu này phản ánh cấu trúc và luồng xử lý hiện tại của dự án. Các đường dẫn mã nguồn được chú thích theo mẫu `file_path:line_number` để thuận tiện tra cứu.

