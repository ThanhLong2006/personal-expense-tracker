#!/bin/bash

# ============================================
# Script thiết lập cronjob tự động backup
# Chạy script này một lần để setup cronjob
# ============================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"

# Đảm bảo script có quyền thực thi
chmod +x "$BACKUP_SCRIPT"

# Tạo cronjob chạy lúc 2h sáng mỗi ngày
CRON_JOB="0 2 * * * $BACKUP_SCRIPT >> $SCRIPT_DIR/backup.log 2>&1"

# Kiểm tra xem cronjob đã tồn tại chưa
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo "Cronjob đã tồn tại. Đang cập nhật..."
    crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT" | crontab -
fi

# Thêm cronjob mới
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "============================================"
echo "Đã thiết lập cronjob backup tự động!"
echo "Backup sẽ chạy lúc 2h sáng mỗi ngày"
echo "Log: $SCRIPT_DIR/backup.log"
echo "============================================"
echo ""
echo "Để xem cronjob hiện tại: crontab -l"
echo "Để xóa cronjob: crontab -e (xóa dòng tương ứng)"

