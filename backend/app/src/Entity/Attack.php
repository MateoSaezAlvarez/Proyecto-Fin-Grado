<?php

namespace App\Entity;

use App\Repository\AttackRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AttackRepository::class)]
class Attack
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Name = null;

    #[ORM\Column]
    private ?int $Modifier = null;

    #[ORM\Column(length: 255)]
    private ?string $Damage = null;

    #[ORM\ManyToOne(inversedBy: 'attacks')]
    private ?Character $Attacks = null;

    #[ORM\ManyToOne(inversedBy: 'attacks')]
    private ?Characteristic $RelatedCharacteristic = null;

    #[ORM\ManyToOne(inversedBy: 'attacks_id')]
    private ?DiceRoll $rolls_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->Name;
    }

    public function setName(string $Name): static
    {
        $this->Name = $Name;

        return $this;
    }

    public function getModifier(): ?int
    {
        return $this->Modifier;
    }

    public function setModifier(int $Modifier): static
    {
        $this->Modifier = $Modifier;

        return $this;
    }

    public function getDamage(): ?string
    {
        return $this->Damage;
    }

    public function setDamage(string $Damage): static
    {
        $this->Damage = $Damage;

        return $this;
    }

    public function getAttacks(): ?Character
    {
        return $this->Attacks;
    }

    public function setAttacks(?Character $Attacks): static
    {
        $this->Attacks = $Attacks;

        return $this;
    }

    public function getRelatedCharacteristic(): ?Characteristic
    {
        return $this->RelatedCharacteristic;
    }

    public function setRelatedCharacteristic(?Characteristic $RelatedCharacteristic): static
    {
        $this->RelatedCharacteristic = $RelatedCharacteristic;

        return $this;
    }

    public function getRollsId(): ?DiceRoll
    {
        return $this->rolls_id;
    }

    public function setRollsId(?DiceRoll $rolls_id): static
    {
        $this->rolls_id = $rolls_id;

        return $this;
    }
}
