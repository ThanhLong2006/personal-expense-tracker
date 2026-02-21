#!/bin/bash

# ============================================
# Script tự động backup MySQL database
# Chạy hàng ngày lúc 2h sáng bằng cronjob
# ============================================

# ===== CẤU HÌNH =====
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-Long@2006}"
MYSQL_DATABASE="${MYSQL_DATABASE:-quanlycanhan}"
BACKUP_DIR="${BACKUP_DIR:-$(dirname "$0")/../backend/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DATE_FORMAT=$(date +"%Y%m%d_%H%M%S")

# Tạo thư mục backup nếu chưa có
mkdir -p "$BACKUP_DIR"

# Tên file backup
BACKUP_FILE="$BACKUP_DIR/backup_${DATE_FORMAT}.sql"
BACKUP_FILE_COMPRESSED="${BACKUP_FILE}.gz"

echo "============================================"
echo "Backup Database: $MYSQL_DATABASE"
echo "Time: $DATE_FORMAT"
echo "============================================"

# Kiểm tra mysqldump có sẵn không
if ! command -v mysqldump &> /dev/null; then
    echo "ERROR: mysqldump không tìm thấy. Vui lòng cài đặt MySQL Client."
    exit 1
fi

# Thực hiện backup
echo "Đang backup database..."
mysqldump -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
    --single-transaction --routines --triggers "$MYSQL_DATABASE" > "$BACKUP_FILE"

if [ $? -ne 0 ]; then
    echo "ERROR: Backup thất bại!"
    exit 1
fi

# Nén file backup
echo "Đang nén file backup..."
if command -v gzip &> /dev/null; then
    gzip "$BACKUP_FILE"
    BACKUP_FILE_FINAL="$BACKUP_FILE_COMPRESSED"
else
    echo "WARNING: gzip không tìm thấy, giữ file SQL không nén"
    BACKUP_FILE_FINAL="$BACKUP_FILE"
fi

# Xóa các file backup cũ (giữ lại 30 ngày)
echo "Đang xóa các file backup cũ hơn $RETENTION_DAYS ngày..."
find "$BACKUP_DIR" -name "backup_*.sql*" -type f -mtime +$RETENTION_DAYS -delete

# Hiển thị kết quả
echo "============================================"
echo "Backup hoàn tất!"
echo "File: $BACKUP_FILE_FINAL"
echo "Kích thước: $(du -h "$BACKUP_FILE_FINAL" | cut -f1)"
echo "============================================"

# ===== TÙY CHỌN: Upload lên Cloud Storage =====
# Nếu bạn muốn upload lên AWS S3, Google Drive, hoặc cloud khác,
# hãy uncomment và cấu hình phần dưới đây:

# Example: Upload to AWS S3 (cần cài AWS CLI)
# aws s3 cp "$BACKUP_FILE_FINAL" s3://your-bucket-name/backups/ --storage-class STANDARD_IA

# Example: Upload to Google Drive (cần cài rclone)
# rclone copy "$BACKUP_FILE_FINAL" gdrive:backups/

# Example: Upload to Google Cloud Storage
# gsutil cp "$BACKUP_FILE_FINAL" gs://your-bucket-name/backups/

exit 0

