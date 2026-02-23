# Checklist Triển khai Production

## 1. Bảo mật

- [ ] **CORS**: Set `CORS_ALLOWED_ORIGINS` chỉ domain chính thức (vd: `https://yourdomain.com`)
- [ ] **JWT_SECRET**: Tối thiểu 32 ký tự. Generate: `openssl rand -base64 48`
- [ ] **Secrets**: Dùng Docker Secrets hoặc AWS Secrets Manager thay vì file `.env` cho production
- [ ] **Cookie**: `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=strict` khi dùng HTTPS

## 2. File Storage

- [ ] **S3**: Set `FILE_STORAGE_PROVIDER=s3` và cấu hình AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET
- [ ] Hoặc dùng MinIO/DigitalOcean Spaces (tương thích S3 API)

## 3. Email

- [ ] **AWS SES / SendGrid**: Không dùng Gmail cá nhân (giới hạn, spam)
- [ ] Set `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` cho dịch vụ đã chọn

## 4. Cảnh báo (Alertmanager)

- [ ] Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` hoặc SMTP cho email
- [ ] Chạy `./scripts/generate-alertmanager-config.sh` để tạo config
- [ ] Khởi động lại: `docker-compose restart alertmanager`

## 5. SSL/TLS

- [ ] Chạy `./nginx/setup-ssl.sh yourdomain.com admin@yourdomain.com`
- [ ] Xác nhận cron auto-renewal: `crontab -l | grep certbot`

## 6. JVM Tuning

- [ ] Điều chỉnh `JAVA_OPTS` trong `.env` theo RAM server:
  - Server 1GB RAM: `-Xms256m -Xmx512m`
  - Server 2GB RAM: `-Xms512m -Xmx1g`
  - Xmx nên = 50-70% tổng RAM

## 7. Database

- [ ] Flyway migration V2 sẽ tự thêm indexes khi khởi động
- [ ] (Tùy chọn) MySQL Replication / Redis Cluster cho HA 99.99%

