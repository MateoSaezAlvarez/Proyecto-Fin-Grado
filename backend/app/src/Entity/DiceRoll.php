<?php

namespace App\Entity;

use App\Repository\DiceRollRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DiceRollRepository::class)]
class DiceRoll
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTime $rollDate = null;

    #[ORM\Column]
    private ?int $dice = null;

    #[ORM\Column]
    private ?int $rollValue = null;

    #[ORM\ManyToOne(inversedBy: 'diceRolls')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Ability $ability = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?Characteristic $characteristic = null;

    #[ORM\ManyToOne(inversedBy: 'rolls')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Campaign $campaign = null;

    #[ORM\ManyToOne(inversedBy: 'diceRolls')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Attack $attack = null;

    #[ORM\OneToOne(targetEntity: self::class, inversedBy: 'DamageDiceRoll', cascade: ['persist', 'remove'])]
    private ?self $Damage_Roll = null;

    #[ORM\OneToOne(targetEntity: self::class, mappedBy: 'Damage_Roll', cascade: ['persist', 'remove'])]
    private ?self $DamageDiceRoll = null;

    #[ORM\ManyToOne]
    private ?Damage $Damage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRollDate(): ?\DateTime
    {
        return $this->rollDate;
    }

    public function setRollDate(\DateTime $rollDate): static
    {
        $this->rollDate = $rollDate;

        return $this;
    }

    public function getDice(): ?int
    {
        return $this->dice;
    }

    public function setDice(int $dice): static
    {
        $this->dice = $dice;

        return $this;
    }

    public function getRollValue(): ?int
    {
        return $this->rollValue;
    }

    public function setRollValue(int $rollValue): static
    {
        $this->rollValue = $rollValue;

        return $this;
    }

    public function getAbility(): ?Ability
    {
        return $this->ability;
    }

    public function setAbility(?Ability $ability): static
    {
        $this->ability = $ability;

        return $this;
    }

    public function getCampaign(): ?Campaign
    {
        return $this->campaign;
    }

    public function setCampaign(?Campaign $campaign): static
    {
        $this->campaign = $campaign;

        return $this;
    }

    public function getCharacteristic(): ?Characteristic
    {
        return $this->characteristic;
    }

    public function setCharacteristic(?Characteristic $characteristic): static
    {
        $this->characteristic = $characteristic;

        return $this;
    }

    public function getAttack(): ?Attack
    {
        return $this->attack;
    }

    public function setAttack(?Attack $attack): static
    {
        $this->attack = $attack;

        return $this;
    }

    public function getDamageRoll(): ?self
    {
        return $this->Damage_Roll;
    }

    public function setDamageRoll(?self $Damage_Roll): static
    {
        $this->Damage_Roll = $Damage_Roll;

        return $this;
    }

    public function getDamageDiceRoll(): ?self
    {
        return $this->DamageDiceRoll;
    }

    public function setDamageDiceRoll(?self $DamageDiceRoll): static
    {
        // unset the owning side of the relation if necessary
        if ($DamageDiceRoll === null && $this->DamageDiceRoll !== null) {
            $this->DamageDiceRoll->setDamageRoll(null);
        }

        // set the owning side of the relation if necessary
        if ($DamageDiceRoll !== null && $DamageDiceRoll->getDamageRoll() !== $this) {
            $DamageDiceRoll->setDamageRoll($this);
        }

        $this->DamageDiceRoll = $DamageDiceRoll;

        return $this;
    }

    public function getDamage(): ?Damage
    {
        return $this->Damage;
    }

    public function setDamage(?Damage $Damage): static
    {
        $this->Damage = $Damage;

        return $this;
    }
}
