-- MySQL Initialization Script
-- This script runs when the MySQL container is first created

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS `node_js_test` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create test database
CREATE DATABASE IF NOT EXISTS `node_js_test_test` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user with proper permissions
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';

-- Grant permissions for main database
GRANT ALL PRIVILEGES ON `node_js_test`.* TO 'app_user'@'%';

-- Grant permissions for test database
GRANT ALL PRIVILEGES ON `node_js_test_test`.* TO 'app_user'@'%';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Set MySQL configuration for optimal performance
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
SET GLOBAL innodb_file_format = 'Barracuda';
SET GLOBAL innodb_large_prefix = 1;
