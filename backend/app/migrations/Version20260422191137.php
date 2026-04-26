<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260422191137 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE damage (id INT AUTO_INCREMENT NOT NULL, dice INT NOT NULL, flat_modifier INT NOT NULL, characteristic_id INT NOT NULL, INDEX IDX_11C8546CDEE9D12B (characteristic_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE damage ADD CONSTRAINT FK_11C8546CDEE9D12B FOREIGN KEY (characteristic_id) REFERENCES characteristic (id)');
        $this->addSql('ALTER TABLE attack ADD damage_roll_id INT NOT NULL');
        $this->addSql('ALTER TABLE attack ADD CONSTRAINT FK_47C02D3B2FA6D6E0 FOREIGN KEY (damage_roll_id) REFERENCES damage (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_47C02D3B2FA6D6E0 ON attack (damage_roll_id)');
        $this->addSql('ALTER TABLE dice_roll ADD damage_roll_id INT DEFAULT NULL, ADD damage_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE dice_roll ADD CONSTRAINT FK_7FF702CF2FA6D6E0 FOREIGN KEY (damage_roll_id) REFERENCES dice_roll (id)');
        $this->addSql('ALTER TABLE dice_roll ADD CONSTRAINT FK_7FF702CF6CE425B7 FOREIGN KEY (damage_id) REFERENCES damage (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7FF702CF2FA6D6E0 ON dice_roll (damage_roll_id)');
        $this->addSql('CREATE INDEX IDX_7FF702CF6CE425B7 ON dice_roll (damage_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE damage DROP FOREIGN KEY FK_11C8546CDEE9D12B');
        $this->addSql('DROP TABLE damage');
        $this->addSql('ALTER TABLE attack DROP FOREIGN KEY FK_47C02D3B2FA6D6E0');
        $this->addSql('DROP INDEX UNIQ_47C02D3B2FA6D6E0 ON attack');
        $this->addSql('ALTER TABLE attack DROP damage_roll_id');
        $this->addSql('ALTER TABLE dice_roll DROP FOREIGN KEY FK_7FF702CF2FA6D6E0');
        $this->addSql('ALTER TABLE dice_roll DROP FOREIGN KEY FK_7FF702CF6CE425B7');
        $this->addSql('DROP INDEX UNIQ_7FF702CF2FA6D6E0 ON dice_roll');
        $this->addSql('DROP INDEX IDX_7FF702CF6CE425B7 ON dice_roll');
        $this->addSql('ALTER TABLE dice_roll DROP damage_roll_id, DROP damage_id');
    }
}
