<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260206105141 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ability (id INT AUTO_INCREMENT NOT NULL, description VARCHAR(255) NOT NULL, characteristic_id INT NOT NULL, INDEX IDX_35CFEE3CDEE9D12B (characteristic_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE campaign (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, game_system VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, dungeon_master_id INT NOT NULL, INDEX IDX_1F1512DDDC7DA27C (dungeon_master_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE `character` (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, proficiency_bonus INT NOT NULL, level INT NOT NULL, class_subclass VARCHAR(255) NOT NULL, hit_points INT NOT NULL, lore VARCHAR(255) NOT NULL, campaign_id INT NOT NULL, players_id INT NOT NULL, INDEX IDX_937AB034F639F774 (campaign_id), INDEX IDX_937AB034F1849495 (players_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE characteristic (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, score INT NOT NULL, character_id_id INT NOT NULL, INDEX IDX_522FA95081877935 (character_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE dice_roll (id INT AUTO_INCREMENT NOT NULL, roll_date DATETIME NOT NULL, dice INT NOT NULL, roll_value INT NOT NULL, ability_id INT NOT NULL, campaign_id INT NOT NULL, INDEX IDX_7FF702CF8016D8B2 (ability_id), INDEX IDX_7FF702CFF639F774 (campaign_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME (username), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE ability ADD CONSTRAINT FK_35CFEE3CDEE9D12B FOREIGN KEY (characteristic_id) REFERENCES characteristic (id)');
        $this->addSql('ALTER TABLE campaign ADD CONSTRAINT FK_1F1512DDDC7DA27C FOREIGN KEY (dungeon_master_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `character` ADD CONSTRAINT FK_937AB034F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id)');
        $this->addSql('ALTER TABLE `character` ADD CONSTRAINT FK_937AB034F1849495 FOREIGN KEY (players_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE characteristic ADD CONSTRAINT FK_522FA95081877935 FOREIGN KEY (character_id_id) REFERENCES `character` (id)');
        $this->addSql('ALTER TABLE dice_roll ADD CONSTRAINT FK_7FF702CF8016D8B2 FOREIGN KEY (ability_id) REFERENCES ability (id)');
        $this->addSql('ALTER TABLE dice_roll ADD CONSTRAINT FK_7FF702CFF639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ability DROP FOREIGN KEY FK_35CFEE3CDEE9D12B');
        $this->addSql('ALTER TABLE campaign DROP FOREIGN KEY FK_1F1512DDDC7DA27C');
        $this->addSql('ALTER TABLE `character` DROP FOREIGN KEY FK_937AB034F639F774');
        $this->addSql('ALTER TABLE `character` DROP FOREIGN KEY FK_937AB034F1849495');
        $this->addSql('ALTER TABLE characteristic DROP FOREIGN KEY FK_522FA95081877935');
        $this->addSql('ALTER TABLE dice_roll DROP FOREIGN KEY FK_7FF702CF8016D8B2');
        $this->addSql('ALTER TABLE dice_roll DROP FOREIGN KEY FK_7FF702CFF639F774');
        $this->addSql('DROP TABLE ability');
        $this->addSql('DROP TABLE campaign');
        $this->addSql('DROP TABLE `character`');
        $this->addSql('DROP TABLE characteristic');
        $this->addSql('DROP TABLE dice_roll');
        $this->addSql('DROP TABLE user');
    }
}
