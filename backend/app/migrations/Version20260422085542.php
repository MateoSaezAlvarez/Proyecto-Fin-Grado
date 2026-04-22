<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260422085542 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attack DROP FOREIGN KEY `FK_47C02D3B4908DBB9`');
        $this->addSql('DROP INDEX IDX_47C02D3B4908DBB9 ON attack');
        $this->addSql('ALTER TABLE attack DROP rolls_id_id');
        $this->addSql('ALTER TABLE dice_roll ADD attack_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE dice_roll ADD CONSTRAINT FK_7FF702CFF5315759 FOREIGN KEY (attack_id) REFERENCES attack (id)');
        $this->addSql('CREATE INDEX IDX_7FF702CFF5315759 ON dice_roll (attack_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attack ADD rolls_id_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE attack ADD CONSTRAINT `FK_47C02D3B4908DBB9` FOREIGN KEY (rolls_id_id) REFERENCES dice_roll (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_47C02D3B4908DBB9 ON attack (rolls_id_id)');
        $this->addSql('ALTER TABLE dice_roll DROP FOREIGN KEY FK_7FF702CFF5315759');
        $this->addSql('DROP INDEX IDX_7FF702CFF5315759 ON dice_roll');
        $this->addSql('ALTER TABLE dice_roll DROP attack_id');
    }
}
