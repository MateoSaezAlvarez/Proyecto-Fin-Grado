<?php

namespace App\Entity;

use App\Repository\AbilityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AbilityRepository::class)]
class Ability
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'abilities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Characteristic $characteristic = null;

    #[ORM\Column]
    private ?bool $isProficient = false;

    /**
     * @var Collection<int, DiceRoll>
     */
    #[ORM\OneToMany(targetEntity: DiceRoll::class, mappedBy: 'ability', orphanRemoval: true)]
    private Collection $diceRolls;

    public function __construct()
    {
        $this->diceRolls = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

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
            $diceRoll->setAbility($this);
        }

        return $this;
    }

    public function isProficient(): ?bool
    {
        return $this->isProficient;
    }

    public function setIsProficient(bool $isProficient): static
    {
        $this->isProficient = $isProficient;

        return $this;
    }
}
