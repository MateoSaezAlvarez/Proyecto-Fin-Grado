<?php

namespace App\Entity;

use App\Repository\AttackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    #[ORM\Column]
    private ?bool $proficiencyBonus = false;

    #[ORM\Column(length: 255)]
    private ?string $Damage = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'attacks')]
    private ?Character $Attacks = null;

    #[ORM\ManyToOne(inversedBy: 'attacks')]
    private ?Characteristic $RelatedCharacteristic = null;

    /**
     * @var Collection<int, DiceRoll>
     */
    #[ORM\OneToMany(targetEntity: DiceRoll::class, mappedBy: 'attack')]
    private Collection $diceRolls;

    public function __construct()
    {
        $this->diceRolls = new ArrayCollection();
    }

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

    public function getProficiencyBonus(): ?bool
    {
        return $this->proficiencyBonus;
    }

    public function setProficiencyBonus(bool $proficiencyBonus): static
    {
        $this->proficiencyBonus = $proficiencyBonus;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

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

    /**
     * @return Collection<int, DiceRoll>
     */
    public function getDiceRolls(): Collection
    {
        return $this->diceRolls;
    }

    public function addDiceRoll(DiceRoll $diceRoll): static
    {
        if (!$this->diceRolls->contains($diceRoll)) {
            $this->diceRolls->add($diceRoll);
            $diceRoll->setAttack($this);
        }

        return $this;
    }

    public function removeDiceRoll(DiceRoll $diceRoll): static
    {
        if ($this->diceRolls->removeElement($diceRoll)) {
            if ($diceRoll->getAttack() === $this) {
                $diceRoll->setAttack(null);
            }
        }

        return $this;
    }
}
