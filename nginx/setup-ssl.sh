#!/bin/bash

# ============================================
# Script thiết lập SSL với Let's Encrypt
# Chạy script này trên server production
# ============================================

set -e

DOMAIN="${1:-yourdomain.com}"
EMAIL="${2:-admin@yourdomain.com}"

if [ "$DOMAIN" == "yourdomain.com" ]; then
    echo "ERROR: Vui lòng cung cấp domain name"
    echo "Usage: ./setup-ssl.sh yourdomain.com admin@yourdomain.com"
    exit 1
fi

echo "============================================"
echo "Thiết lập SSL cho domain: $DOMAIN"
echo "Email: $EMAIL"
echo "============================================"

# Kiểm tra Docker và docker-compose
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker chưa được cài đặt"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: docker-compose chưa được cài đặt"
    exit 1
fi

# Tạo thư mục cho certbot
mkdir -p certbot/conf certbot/www

# Tạm thời chạy nginx với HTTP only để certbot có thể verify
echo "Đang khởi động nginx với HTTP only..."
docker-compose -f docker-compose.yml up -d nginx

# Chờ nginx khởi động
sleep 5

# Chạy certbot để lấy certificate
echo "Đang lấy SSL certificate từ Let's Encrypt..."
docker run -it --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# Cập nhật nginx.conf với domain thực tế
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf

# Khởi động lại nginx với SSL
echo "Đang khởi động lại nginx với SSL..."
docker-compose -f docker-compose.yml restart nginx

# Thiết lập auto-renewal
echo "Đang thiết lập auto-renewal..."
cat > certbot/renew.sh << 'EOF'
#!/bin/bash
docker run --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot renew

docker-compose -f docker-compose.yml restart nginx
EOF

chmod +x certbot/renew.sh

# Thêm cronjob để renew tự động (chạy mỗi ngày lúc 3h sáng)
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 3 * * * cd $(pwd) && ./certbot/renew.sh >> certbot/renew.log 2>&1") | crontab -

echo "============================================"
echo "Hoàn tất!"
echo "SSL đã được cấu hình cho domain: $DOMAIN"
echo "Certificate sẽ tự động renew mỗi ngày lúc 3h sáng"
echo "============================================"

