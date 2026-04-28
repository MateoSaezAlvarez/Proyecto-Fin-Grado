-- ============================================================
--  init.sql  –  Full schema for the TFG application
--  Generated from Doctrine migrations (cumulative result)
--  Database: tfg  |  Engine: MySQL 8  |  Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `tfg`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `tfg`;

-- ── Core tables ───────────────────────────────────────────────────────────────

CREATE TABLE `user` (
    `id`       INT          NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(180) NOT NULL,
    `roles`    JSON         NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UNIQ_IDENTIFIER_USERNAME` (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `campaign` (
    `id`                INT          NOT NULL AUTO_INCREMENT,
    `dungeon_master_id` INT          NOT NULL,
    `name`              VARCHAR(255) NOT NULL,
    `game_system`       VARCHAR(255) NOT NULL,
    `description`       TEXT         NOT NULL,
    `status`            VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_1F1512DDDC7DA27C` (`dungeon_master_id`),
    CONSTRAINT `FK_1F1512DDDC7DA27C` FOREIGN KEY (`dungeon_master_id`) REFERENCES `user` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `campaign_user` (
    `campaign_id` INT NOT NULL,
    `user_id`     INT NOT NULL,
    PRIMARY KEY (`campaign_id`, `user_id`),
    INDEX `IDX_8C74EDABF639F774` (`campaign_id`),
    INDEX `IDX_8C74EDABA76ED395` (`user_id`),
    CONSTRAINT `FK_8C74EDABF639F774` FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_8C74EDABA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `character` (
    `id`              INT          NOT NULL AUTO_INCREMENT,
    `campaign_id`     INT          NOT NULL,
    `players_id`      INT          DEFAULT NULL,
    `name`            VARCHAR(255) NOT NULL,
    `proficiency_bonus` INT        DEFAULT 2,
    `level`           INT          DEFAULT 1,
    `class_subclass`  VARCHAR(255) DEFAULT NULL,
    `hit_points`      INT          DEFAULT 10,
    `lore`            TEXT         DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_937AB034F639F774` (`campaign_id`),
    INDEX `IDX_937AB034F1849495` (`players_id`),
    CONSTRAINT `FK_937AB034F639F774` FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`),
    CONSTRAINT `FK_937AB034F1849495` FOREIGN KEY (`players_id`) REFERENCES `user` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `characteristic` (
    `id`              INT          NOT NULL AUTO_INCREMENT,
    `character_id`    INT          NOT NULL,
    `name`            VARCHAR(255) NOT NULL,
    `score`           INT          NOT NULL,
    `save_proficient` TINYINT(1)   NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_522FA9501136BE75` (`character_id`),
    CONSTRAINT `FK_522FA9501136BE75` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `ability` (
    `id`                INT          NOT NULL AUTO_INCREMENT,
    `characteristic_id` INT          NOT NULL,
    `description`       VARCHAR(255) NOT NULL,
    `is_proficient`     TINYINT(1)   NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_3B7329E1DEE9D12B` (`characteristic_id`),
    CONSTRAINT `FK_3B7329E1DEE9D12B` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `damage` (
    `id`                INT AUTO_INCREMENT NOT NULL,
    `characteristic_id` INT DEFAULT NULL,
    `dice`              INT NOT NULL,
    `flat_modifier`     INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_11C8546CDEE9D12B` (`characteristic_id`),
    CONSTRAINT `FK_11C8546CDEE9D12B` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `attack` (
    `id`                        INT          NOT NULL AUTO_INCREMENT,
    `attacks_id`                INT          DEFAULT NULL,
    `related_characteristic_id` INT          DEFAULT NULL,
    `damage_roll_id`            INT          DEFAULT NULL,
    `name`                      VARCHAR(255) NOT NULL,
    `modifier`                  INT          NOT NULL,
    `proficiency_bonus`         TINYINT(1)   NOT NULL,
    `damage`                    VARCHAR(255) NOT NULL,
    `description`               TEXT         DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UNIQ_47C02D3B2FA6D6E0` (`damage_roll_id`),
    INDEX `IDX_47C02D3BE13A7865` (`attacks_id`),
    INDEX `IDX_47C02D3BF5315759` (`related_characteristic_id`),
    CONSTRAINT `FK_47C02D3B2FA6D6E0` FOREIGN KEY (`damage_roll_id`) REFERENCES `damage` (`id`),
    CONSTRAINT `FK_47C02D3BE13A7865` FOREIGN KEY (`attacks_id`) REFERENCES `character` (`id`),
    CONSTRAINT `FK_47C02D3BF5315759` FOREIGN KEY (`related_characteristic_id`) REFERENCES `characteristic` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `dice_roll` (
    `id`                INT      NOT NULL AUTO_INCREMENT,
    `campaign_id`       INT      NOT NULL,
    `characteristic_id` INT      DEFAULT NULL,
    `ability_id`        INT      DEFAULT NULL,
    `attack_id`         INT      DEFAULT NULL,
    `damage_id`         INT      DEFAULT NULL,
    `damage_roll_id`    INT      DEFAULT NULL,
    `roll_value`        INT      NOT NULL,
    `roll_date`         DATETIME NOT NULL,
    `dice`              INT      NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UNIQ_7FF702CF2FA6D6E0` (`damage_roll_id`),
    INDEX `IDX_7FF702CFF639F774` (`campaign_id`),
    INDEX `IDX_7FF702CFDEE9D12B` (`characteristic_id`),
    INDEX `IDX_7FF702CF8016D8B2` (`ability_id`),
    INDEX `IDX_7FF702CFF5315759` (`attack_id`),
    INDEX `IDX_7FF702CF6CE425B7` (`damage_id`),
    CONSTRAINT `FK_7FF702CF2FA6D6E0` FOREIGN KEY (`damage_roll_id`) REFERENCES `dice_roll` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_7FF702CF6CE425B7` FOREIGN KEY (`damage_id`) REFERENCES `damage` (`id`) ON DELETE SET NULL,
    CONSTRAINT `FK_7FF702CF8016D8B2` FOREIGN KEY (`ability_id`) REFERENCES `ability` (`id`),
    CONSTRAINT `FK_7FF702CFDEE9D12B` FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic` (`id`),
    CONSTRAINT `FK_7FF702CFF5315759` FOREIGN KEY (`attack_id`) REFERENCES `attack` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_7FF702CFF639F774` FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;
