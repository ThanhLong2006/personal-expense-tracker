@echo off
REM ============================================
REM Script tự động backup MySQL database
REM Chạy hàng ngày lúc 2h sáng bằng Task Scheduler
REM ============================================

setlocal enabledelayedexpansion

REM ===== CẤU HÌNH =====
set MYSQL_HOST=localhost
set MYSQL_PORT=3307
set MYSQL_USER=root
set MYSQL_PASSWORD=Long@2006
set MYSQL_DATABASE=quanlycanhan
set BACKUP_DIR=%~dp0..\backend\backups
set RETENTION_DAYS=30
set DATE_FORMAT=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE_FORMAT=!DATE_FORMAT: =0!

REM Tạo thư mục backup nếu chưa có
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Tên file backup
set BACKUP_FILE=%BACKUP_DIR%\backup_%DATE_FORMAT%.sql
set BACKUP_FILE_COMPRESSED=%BACKUP_FILE%.gz

echo ============================================
echo Backup Database: %MYSQL_DATABASE%
echo Time: %DATE_FORMAT%
echo ============================================

REM Kiểm tra MySQL có sẵn không
where mysqldump >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: mysqldump không tìm thấy trong PATH
    echo Vui lòng cài đặt MySQL Client hoặc thêm MySQL bin vào PATH
    exit /b 1
)

REM Thực hiện backup
echo Đang backup database...
mysqldump -h %MYSQL_HOST% -P %MYSQL_PORT% -u %MYSQL_USER% -p%MYSQL_PASSWORD% --single-transaction --routines --triggers %MYSQL_DATABASE% > "%BACKUP_FILE%"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backup thất bại!
    exit /b 1
)

REM Nén file backup
echo Đang nén file backup...
where gzip >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    gzip "%BACKUP_FILE%"
    set BACKUP_FILE_FINAL=%BACKUP_FILE_COMPRESSED%
) else (
    echo WARNING: gzip không tìm thấy, giữ file SQL không nén
    set BACKUP_FILE_FINAL=%BACKUP_FILE%
)

REM Xóa các file backup cũ (giữ lại 30 ngày)
echo Đang xóa các file backup cũ hơn %RETENTION_DAYS% ngày...
forfiles /p "%BACKUP_DIR%" /m backup_*.sql* /d -%RETENTION_DAYS% /c "cmd /c del @path" 2>nul

REM Hiển thị kết quả
echo ============================================
echo Backup hoàn tất!
echo File: %BACKUP_FILE_FINAL%
echo Kích thước: 
for %%A in ("%BACKUP_FILE_FINAL%") do echo   %%~zA bytes
echo ============================================

REM ===== TÙY CHỌN: Upload lên Cloud Storage =====
REM Nếu bạn muốn upload lên AWS S3, Google Drive, hoặc cloud khác,
REM hãy uncomment và cấu hình phần dưới đây:

REM Example: Upload to AWS S3 (cần cài AWS CLI)
REM aws s3 cp "%BACKUP_FILE_FINAL%" s3://your-bucket-name/backups/ --storage-class STANDARD_IA

REM Example: Upload to Google Drive (cần cài rclone)
REM rclone copy "%BACKUP_FILE_FINAL%" gdrive:backups/

endlocal

