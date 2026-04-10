-- CleanAI database schema
-- Safe to run multiple times (uses IF NOT EXISTS)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('citizen', 'admin') NOT NULL DEFAULT 'citizen',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reports` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `latitude` DECIMAL(10,7) NOT NULL,
  `longitude` DECIMAL(10,7) NOT NULL,
  `gps_accuracy` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('submitted', 'dispatched', 'resolved', 'rejected') NOT NULL DEFAULT 'submitted',
  PRIMARY KEY (`report_id`),
  KEY `idx_reports_user_id` (`user_id`),
  KEY `idx_reports_status` (`status`),
  KEY `idx_reports_submitted_at` (`submitted_at`),
  CONSTRAINT `fk_reports_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ai_classification` (
  `classification_id` INT NOT NULL AUTO_INCREMENT,
  `report_id` INT NOT NULL,
  `waste_type` VARCHAR(100) NOT NULL,
  `severity_level` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'low',
  `confidence_score` DECIMAL(6,4) NOT NULL DEFAULT 0,
  `processed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`classification_id`),
  KEY `idx_ai_report_id` (`report_id`),
  CONSTRAINT `fk_ai_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `satellite_verification` (
  `verification_id` INT NOT NULL AUTO_INCREMENT,
  `report_id` INT NOT NULL,
  `verified` TINYINT(1) NOT NULL DEFAULT 0,
  `verification_notes` TEXT,
  `verified_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`verification_id`),
  KEY `idx_satellite_report_id` (`report_id`),
  CONSTRAINT `fk_satellite_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cleanup_tasks` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `report_id` INT NOT NULL,
  `assigned_to` VARCHAR(150) DEFAULT NULL,
  `completion_status` ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  UNIQUE KEY `uk_cleanup_report_id` (`report_id`),
  CONSTRAINT `fk_cleanup_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `alerts` (
  `alert_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `report_id` INT DEFAULT NULL,
  `alert_type` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `delivery_method` VARCHAR(50) DEFAULT 'in_app',
  `triggered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`alert_id`),
  KEY `idx_alerts_user_id` (`user_id`),
  KEY `idx_alerts_report_id` (`report_id`),
  KEY `idx_alerts_triggered_at` (`triggered_at`),
  CONSTRAINT `fk_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_alerts_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_logs` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_system_logs_user_id` (`user_id`),
  KEY `idx_system_logs_action_type` (`action_type`),
  KEY `idx_system_logs_created_at` (`created_at`),
  CONSTRAINT `fk_system_logs_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `geospatial_zones` (
  `zone_id` INT NOT NULL AUTO_INCREMENT,
  `zone_name` VARCHAR(120) NOT NULL,
  `zone_type` VARCHAR(60) DEFAULT 'general',
  `city` VARCHAR(80) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `radius_meters` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`zone_id`),
  KEY `idx_geospatial_city` (`city`),
  KEY `idx_geospatial_zone_type` (`zone_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
