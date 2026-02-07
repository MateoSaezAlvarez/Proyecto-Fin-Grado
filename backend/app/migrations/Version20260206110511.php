<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260206110511 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE characteristic_character DROP FOREIGN KEY `FK_BBE92BB21136BE75`');
        $this->addSql('ALTER TABLE characteristic_character DROP FOREIGN KEY `FK_BBE92BB2DEE9D12B`');
        $this->addSql('DROP TABLE characteristic_character');
        $this->addSql('ALTER TABLE characteristic ADD character_id INT NOT NULL');
        $this->addSql('ALTER TABLE characteristic ADD CONSTRAINT FK_522FA9501136BE75 FOREIGN KEY (character_id) REFERENCES `character` (id)');
        $this->addSql('CREATE INDEX IDX_522FA9501136BE75 ON characteristic (character_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE characteristic_character (characteristic_id INT NOT NULL, character_id INT NOT NULL, INDEX IDX_BBE92BB2DEE9D12B (characteristic_id), INDEX IDX_BBE92BB21136BE75 (character_id), PRIMARY KEY (characteristic_id, character_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_uca1400_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE characteristic_character ADD CONSTRAINT `FK_BBE92BB21136BE75` FOREIGN KEY (character_id) REFERENCES `character` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE characteristic_character ADD CONSTRAINT `FK_BBE92BB2DEE9D12B` FOREIGN KEY (characteristic_id) REFERENCES characteristic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE characteristic DROP FOREIGN KEY FK_522FA9501136BE75');
        $this->addSql('DROP INDEX IDX_522FA9501136BE75 ON characteristic');
        $this->addSql('ALTER TABLE characteristic DROP character_id');
    }
}
