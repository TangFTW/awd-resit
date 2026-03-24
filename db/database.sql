CREATE DATABASE IF NOT EXISTS `hk_dgpg`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `hk_dgpg`;

DROP TABLE IF EXISTS `facilities`;

CREATE TABLE `facilities` (
    `id`                      BIGINT NOT NULL AUTO_INCREMENT,
    `gihs`                    VARCHAR(50) NULL UNIQUE COMMENT 'Unique identifier',
    
    `district_en`             VARCHAR(100) NOT NULL,
    `district_cn`             VARCHAR(100) NOT NULL,
    
    `name_en`                 VARCHAR(255) NOT NULL,
    `name_cn`                 VARCHAR(255) NOT NULL,
    
    `address_en`              VARCHAR(500) NOT NULL,
    `address_cn`              VARCHAR(500) NOT NULL,
    
    `facilities_en`           LONGTEXT,
    `facilities_b5`           LONGTEXT,
    
    `ancillary_facilities_en` LONGTEXT,
    `ancillary_facilities_cn` LONGTEXT,
    
    `opening_hours_en`        VARCHAR(255),
    `opening_hours_cn`        VARCHAR(255),
    
    `phone`                   VARCHAR(20),
    `remarks_en`              LONGTEXT,
    `remarks_cn`              LONGTEXT,
    
    `latitude`                VARCHAR(50),
    `longitude`               VARCHAR(50),
    
    `created_at`              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    KEY `idx_gihs` (`gihs`),
    KEY `idx_district_en` (`district_en`),
    KEY `idx_district_cn` (`district_cn`),
    KEY `idx_name_en` (`name_en`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
