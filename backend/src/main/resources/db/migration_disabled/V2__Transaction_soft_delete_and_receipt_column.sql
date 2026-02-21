-- Disabled copy of V2 migration (moved out of db/migration to avoid local Flyway failure)
-- Original file moved here because it caused migration errors in local environment.
-- If you want to re-enable, move it back to db/migration and run `flyway:repair` then start the app.

-- V2: Thêm soft delete cho transactions và giới hạn độ dài cột receipt_image

SET @dbname = DATABASE();
SET @tablename = 'transactions';

-- Thêm cột deleted nếu chưa tồn tại
SET @columnname = 'deleted';
SET @preparedStatement = (
  SELECT IF(
    (
      SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ) > 0,
    'SELECT 1',
    'ALTER TABLE transactions ADD COLUMN deleted TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at'
  )
);
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Đảm bảo cột receipt_image là VARCHAR(255) (chỉ lưu URL/path)
SET @columnname = 'receipt_image';
SET @preparedStatement = (
  SELECT IF(
    (
      SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ) = 0,
    'SELECT 1', -- Cột không tồn tại → bỏ qua, schema.sql sẽ tạo
    'ALTER TABLE transactions MODIFY COLUMN receipt_image VARCHAR(255) NULL'
  )
);
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;
