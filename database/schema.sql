-- -----------------------------------------------------
-- Database schema for Ứng Dụng Quản Lý Chi Tiêu Cá Nhân
-- MySQL 8.x compatible
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(500),
    status ENUM('ACTIVE','LOCKED','DISABLED','PENDING') NOT NULL DEFAULT 'PENDING',
    role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,
    two_factor_secret VARCHAR(255),
    locked_until DATETIME,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    language VARCHAR(10) NOT NULL DEFAULT 'vi',
    theme VARCHAR(10) NOT NULL DEFAULT 'light',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT idx_users_email UNIQUE (email),
    INDEX idx_users_status (status),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    description VARCHAR(500),
    system_default TINYINT(1) NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_categories_user (user_id),
    INDEX idx_categories_system_default (system_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date DATE NOT NULL,
    note VARCHAR(500),
    receipt_image VARCHAR(500),
    location VARCHAR(200),
    created_by ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    created_by_admin_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_transactions_user_date (user_id, transaction_date),
    INDEX idx_transactions_category (category_id),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_user_category_date (user_id, category_id, transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type ENUM('INFO','WARNING','ERROR','SUCCESS') NOT NULL DEFAULT 'INFO',
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    link VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, is_read),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    admin_email VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    target_id BIGINT,
    target_type VARCHAR(50),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_logs_admin_id (admin_id),
    INDEX idx_admin_logs_action (action),
    INDEX idx_admin_logs_target (target_id, target_type),
    INDEX idx_admin_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: seed default categories
INSERT INTO categories (name, icon, color, description, system_default, sort_order, deleted)
VALUES
    ('Ăn uống', '🍔', '#F87171', 'Chi tiêu ăn uống hằng ngày', 1, 1, 0),
    ('Đi lại', '🚌', '#60A5FA', 'Chi phí di chuyển, xăng xe', 1, 2, 0),
    ('Mua sắm', '🛍️', '#FBBF24', 'Quần áo, phụ kiện, mua sắm cá nhân', 1, 3, 0),
    ('Nhà cửa', '🏠', '#34D399', 'Tiền thuê nhà, điện nước, internet', 1, 4, 0),
    ('Sức khỏe', '💊', '#A78BFA', 'Khám bệnh, thuốc men, gym', 1, 5, 0),
    ('Giáo dục', '📚', '#F472B6', 'Học phí, sách vở, khóa học', 1, 6, 0),
    ('Giải trí', '🎮', '#FB7185', 'Xem phim, du lịch, tụ tập', 1, 7, 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);

