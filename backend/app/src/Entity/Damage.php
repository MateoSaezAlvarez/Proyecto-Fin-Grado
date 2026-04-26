<?php

namespace App\Entity;

use App\Repository\DamageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DamageRepository::class)]
class Damage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $Dice = null;

    #[ORM\Column]
    private ?int $Flat_Modifier = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Characteristic $Characteristic = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDice(): ?int
    {
        return $this->Dice;
    }

    public function setDice(int $Dice): static
    {
        $this->Dice = $Dice;

        return $this;
    }

    public function getFlatModifier(): ?int
    {
        return $this->Flat_Modifier;
    }

    public function setFlatModifier(int $Flat_Modifier): static
    {
        $this->Flat_Modifier = $Flat_Modifier;

        return $this;
    }

    public function getCharacteristic(): ?Characteristic
    {
        return $this->Characteristic;
    }

    public function setCharacteristic(?Characteristic $Characteristic): static
    {
        $this->Characteristic = $Characteristic;

        return $this;
    }
}
