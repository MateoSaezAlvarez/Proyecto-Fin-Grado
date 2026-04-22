<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260422075306 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE attack (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, modifier INT NOT NULL, damage VARCHAR(255) NOT NULL, attacks_id INT DEFAULT NULL, related_characteristic_id INT DEFAULT NULL, rolls_id_id INT DEFAULT NULL, INDEX IDX_47C02D3BF5336522 (attacks_id), INDEX IDX_47C02D3B81AE66D3 (related_characteristic_id), INDEX IDX_47C02D3B4908DBB9 (rolls_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE attack ADD CONSTRAINT FK_47C02D3BF5336522 FOREIGN KEY (attacks_id) REFERENCES `character` (id)');
        $this->addSql('ALTER TABLE attack ADD CONSTRAINT FK_47C02D3B81AE66D3 FOREIGN KEY (related_characteristic_id) REFERENCES characteristic (id)');
        $this->addSql('ALTER TABLE attack ADD CONSTRAINT FK_47C02D3B4908DBB9 FOREIGN KEY (rolls_id_id) REFERENCES dice_roll (id)');
        $this->addSql('ALTER TABLE ability CHANGE is_proficient is_proficient TINYINT NOT NULL');
        $this->addSql('ALTER TABLE characteristic CHANGE save_proficient save_proficient TINYINT NOT NULL');
        $this->addSql('ALTER TABLE dice_roll ADD CONSTRAINT FK_7FF702CFDEE9D12B FOREIGN KEY (characteristic_id) REFERENCES characteristic (id)');
        $this->addSql('CREATE INDEX IDX_7FF702CFDEE9D12B ON dice_roll (characteristic_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attack DROP FOREIGN KEY FK_47C02D3BF5336522');
        $this->addSql('ALTER TABLE attack DROP FOREIGN KEY FK_47C02D3B81AE66D3');
        $this->addSql('ALTER TABLE attack DROP FOREIGN KEY FK_47C02D3B4908DBB9');
        $this->addSql('DROP TABLE attack');
        $this->addSql('ALTER TABLE ability CHANGE is_proficient is_proficient TINYINT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE characteristic CHANGE save_proficient save_proficient TINYINT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE dice_roll DROP FOREIGN KEY FK_7FF702CFDEE9D12B');
        $this->addSql('DROP INDEX IDX_7FF702CFDEE9D12B ON dice_roll');
    }
}
