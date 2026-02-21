# Scripts Backup Database

## Mô tả
Các script tự động backup MySQL database hàng ngày.

## Windows (backup-database.bat)

### Cài đặt
1. Mở Task Scheduler (gõ `taskschd.msc` trong Run)
2. Tạo Task mới:
   - General: Đặt tên "Database Backup"
   - Trigger: Daily, 2:00 AM
   - Action: Start a program
   - Program: `cmd.exe`
   - Arguments: `/c "D:\QUANLYCANHAN\scripts\backup-database.bat"`
   - Start in: `D:\QUANLYCANHAN\scripts`

### Cấu hình
Chỉnh sửa các biến trong `backup-database.bat`:
- `MYSQL_HOST`: Địa chỉ MySQL (mặc định: localhost)
- `MYSQL_PORT`: Port MySQL (mặc định: 3307)
- `MYSQL_USER`: Username MySQL
- `MYSQL_PASSWORD`: Password MySQL
- `MYSQL_DATABASE`: Tên database
- `BACKUP_DIR`: Thư mục lưu backup
- `RETENTION_DAYS`: Số ngày giữ backup (mặc định: 30)

## Linux/Mac (backup-database.sh)

### Cài đặt
```bash
# Cấp quyền thực thi
chmod +x scripts/backup-database.sh

# Thiết lập cronjob tự động (chạy lúc 2h sáng)
chmod +x scripts/setup-cron-backup.sh
./scripts/setup-cron-backup.sh
```

Hoặc thủ công:
```bash
# Mở crontab editor
crontab -e

# Thêm dòng sau (chạy lúc 2h sáng mỗi ngày)
0 2 * * * /path/to/scripts/backup-database.sh >> /path/to/scripts/backup.log 2>&1
```

### Cấu hình
Chỉnh sửa các biến trong `backup-database.sh` hoặc export environment variables:
```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=quanlycanhan
export BACKUP_DIR=/path/to/backups
export RETENTION_DAYS=30
```

## Upload lên Cloud Storage (Tùy chọn)

### AWS S3
1. Cài đặt AWS CLI: `pip install awscli`
2. Cấu hình credentials: `aws configure`
3. Uncomment dòng trong script:
```bash
aws s3 cp "$BACKUP_FILE_FINAL" s3://your-bucket-name/backups/ --storage-class STANDARD_IA
```

### Google Drive (rclone)
1. Cài đặt rclone: https://rclone.org/install/
2. Cấu hình: `rclone config`
3. Uncomment dòng trong script:
```bash
rclone copy "$BACKUP_FILE_FINAL" gdrive:backups/
```

### Google Cloud Storage
1. Cài đặt gsutil: https://cloud.google.com/storage/docs/gsutil_install
2. Cấu hình: `gcloud auth login`
3. Uncomment dòng trong script:
```bash
gsutil cp "$BACKUP_FILE_FINAL" gs://your-bucket-name/backups/
```

## Kiểm tra Backup
```bash
# Xem danh sách backup
ls -lh backend/backups/

# Xem log (Linux/Mac)
tail -f scripts/backup.log
```

