# Nginx Configuration

## Mô tả
Cấu hình Nginx với SSL/HTTPS cho production và HTTP cho development.

## Files

- `nginx.conf`: Cấu hình với SSL/HTTPS (Production)
- `nginx-http-only.conf`: Cấu hình HTTP only (Development)
- `setup-ssl.sh`: Script tự động thiết lập SSL với Let's Encrypt

## Development (HTTP Only)

Sử dụng `nginx-http-only.conf` cho môi trường development:

```bash
# Trong docker-compose.yml, mount file này
volumes:
  - ./nginx/nginx-http-only.conf:/etc/nginx/nginx.conf
```

## Production (HTTPS với Let's Encrypt)

### Bước 1: Chuẩn bị
- Domain name trỏ về IP server
- Port 80 và 443 mở trên firewall

### Bước 2: Chạy script setup SSL
```bash
chmod +x nginx/setup-ssl.sh
./nginx/setup-ssl.sh yourdomain.com admin@yourdomain.com
```

Script sẽ:
1. Tạo thư mục cho certbot
2. Khởi động nginx với HTTP
3. Lấy SSL certificate từ Let's Encrypt
4. Cập nhật nginx.conf với domain
5. Khởi động lại nginx với SSL
6. Thiết lập auto-renewal

### Bước 3: Cập nhật docker-compose.yml
Đảm bảo nginx service mount đúng volumes:

```yaml
nginx:
  image: nginx:alpine
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    - ./certbot/conf:/etc/letsencrypt
    - ./certbot/www:/var/www/certbot
    - ./frontend/dist:/usr/share/nginx/html
  ports:
    - "80:80"
    - "443:443"
```

### Bước 4: Kiểm tra
```bash
# Kiểm tra SSL
curl -I https://yourdomain.com

# Kiểm tra certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## Manual Setup (Nếu script không hoạt động)

### 1. Cài đặt certbot
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot

# CentOS/RHEL
sudo yum install certbot
```

### 2. Lấy certificate
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### 3. Cập nhật nginx.conf
Thay `YOUR_DOMAIN` bằng domain thực tế trong `nginx/nginx.conf`:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### 4. Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Thêm cronjob
sudo crontab -e
# Thêm dòng:
0 3 * * * certbot renew --quiet && docker-compose restart nginx
```

## Rate Limiting

Nginx đã được cấu hình rate limiting:
- API endpoints: 10 requests/second với burst 20
- Auth endpoints: 5 requests/second với burst 10

Có thể điều chỉnh trong `nginx.conf`:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/s;
```

## Security Headers

Nginx đã được cấu hình các security headers:
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Content-Security-Policy

## Troubleshooting

### Certificate không renew
```bash
# Kiểm tra log
tail -f certbot/renew.log

# Renew thủ công
./certbot/renew.sh
```

### Nginx không start
```bash
# Kiểm tra cấu hình
docker exec nginx nginx -t

# Xem log
docker logs nginx
```

### SSL handshake failed
- Kiểm tra port 443 đã mở chưa
- Kiểm tra certificate path đúng chưa
- Kiểm tra domain trỏ đúng IP chưa

