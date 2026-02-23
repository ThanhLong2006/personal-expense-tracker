-- V2: Performance indexes - Tối ưu truy vấn tìm kiếm và date range
-- Idempotent: Chỉ tạo index nếu chưa tồn tại

SET @dbname = DATABASE();

-- Index idx_transactions_user_deleted_date: (user_id, deleted, transaction_date)
-- Hỗ trợ: findByUserIdAndDeletedFalse, findByUserIdAndDateRange
SET @idx_name = 'idx_transactions_user_deleted_date';
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'transactions' AND INDEX_NAME = @idx_name) > 0,
    'SELECT 1',
    'ALTER TABLE transactions ADD INDEX idx_transactions_user_deleted_date (user_id, deleted, transaction_date)'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index idx_transactions_user_deleted: (user_id, deleted)
SET @idx_name = 'idx_transactions_user_deleted';
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'transactions' AND INDEX_NAME = @idx_name) > 0,
    'SELECT 1',
    'ALTER TABLE transactions ADD INDEX idx_transactions_user_deleted (user_id, deleted)'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

