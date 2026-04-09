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
    INDEX `IDX_1F1512DDDC7DA27C` (`dungeon_master_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `campaign_user` (
    `campaign_id` INT NOT NULL,
    `user_id`     INT NOT NULL,
    PRIMARY KEY (`campaign_id`, `user_id`),
    INDEX `IDX_8C74EDABF639F774` (`campaign_id`),
    INDEX `IDX_8C74EDABA76ED395` (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `character` (
    `id`                INT          NOT NULL AUTO_INCREMENT,
    `campaign_id`       INT          NOT NULL,
    `players_id`        INT          NOT NULL,
    `name`              VARCHAR(255) NOT NULL,
    `proficiency_bonus` INT          NOT NULL,
    `level`             INT          NOT NULL,
    `class_subclass`    VARCHAR(255) NOT NULL,
    `hit_points`        INT          NOT NULL,
    `lore`              TEXT         NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_937AB034F639F774` (`campaign_id`),
    INDEX `IDX_937AB034F1849495` (`players_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

-- characteristic: has character_id (not the old characteristic_character join table)
CREATE TABLE `characteristic` (
    `id`             INT          NOT NULL AUTO_INCREMENT,
    `character_id`   INT          NOT NULL,
    `name`           VARCHAR(255) NOT NULL,
    `score`          INT          NOT NULL,
    `save_proficient` TINYINT     NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `IDX_522FA9501136BE75` (`character_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `ability` (
    `id`                INT          NOT NULL AUTO_INCREMENT,
    `characteristic_id` INT          NOT NULL,
    `description`       VARCHAR(255) NOT NULL,
    `is_proficient`     TINYINT      NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `IDX_35CFEE3CDEE9D12B` (`characteristic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

CREATE TABLE `dice_roll` (
    `id`                INT      NOT NULL AUTO_INCREMENT,
    `ability_id`        INT      NULL,
    `characteristic_id` INT      NULL,
    `campaign_id`       INT      NOT NULL,
    `roll_date`         DATETIME NOT NULL,
    `dice`              INT      NOT NULL,
    `roll_value`        INT      NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `IDX_7FF702CF8016D8B2` (`ability_id`),
    INDEX `IDX_7FF702CFF639F774` (`campaign_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

-- ── Foreign keys ──────────────────────────────────────────────────────────────

ALTER TABLE `campaign`
    ADD CONSTRAINT `FK_1F1512DDDC7DA27C`
        FOREIGN KEY (`dungeon_master_id`) REFERENCES `user` (`id`);

ALTER TABLE `campaign_user`
    ADD CONSTRAINT `FK_8C74EDABF639F774`
        FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `FK_8C74EDABA76ED395`
        FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `character`
    ADD CONSTRAINT `FK_937AB034F639F774`
        FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`),
    ADD CONSTRAINT `FK_937AB034F1849495`
        FOREIGN KEY (`players_id`) REFERENCES `user` (`id`);

ALTER TABLE `characteristic`
    ADD CONSTRAINT `FK_522FA9501136BE75`
        FOREIGN KEY (`character_id`) REFERENCES `character` (`id`);

ALTER TABLE `ability`
    ADD CONSTRAINT `FK_35CFEE3CDEE9D12B`
        FOREIGN KEY (`characteristic_id`) REFERENCES `characteristic` (`id`);

ALTER TABLE `dice_roll`
    ADD CONSTRAINT `FK_7FF702CF8016D8B2`
        FOREIGN KEY (`ability_id`) REFERENCES `ability` (`id`),
    ADD CONSTRAINT `FK_7FF702CFF639F774`
        FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`);

-- ── Doctrine Migrations tracking table ───────────────────────────────────────
-- Tells Symfony that all migrations have already been applied so it won't
-- try to run them again on a fresh container.

CREATE TABLE `doctrine_migration_versions` (
    `version`        VARCHAR(191) NOT NULL,
    `executed_at`    DATETIME     NULL,
    `execution_time` INT          NULL,
    PRIMARY KEY (`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`;

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
    ('DoctrineMigrations\\Version20260120132702', NOW(), 0),
    ('DoctrineMigrations\\Version20260206105141', NOW(), 0),
    ('DoctrineMigrations\\Version20260206110511', NOW(), 0),
    ('DoctrineMigrations\\Version20260210124710', NOW(), 0),
    ('DoctrineMigrations\\Version20260210131856', NOW(), 0);
