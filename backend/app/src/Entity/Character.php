<?php

namespace App\Entity;

use App\Repository\CharacterRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CharacterRepository::class)]
#[ORM\Table(name: '`character`')]
class Character
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $proficiencyBonus = null;

    #[ORM\Column]
    private ?int $level = null;

    #[ORM\Column(length: 255)]
    private ?string $classSubclass = null;

    #[ORM\Column]
    private ?int $hitPoints = null;

    #[ORM\Column(length: 255)]
    private ?string $lore = null;



    #[ORM\ManyToOne(inversedBy: 'characters')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Campaign $campaign = null;

    #[ORM\ManyToOne(inversedBy: 'characters')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $players = null;

    /**
     * @var Collection<int, Characteristic>
     */
    #[ORM\OneToMany(targetEntity: Characteristic::class, mappedBy: 'character', orphanRemoval: true)]
    private Collection $Characteristics;

    public function __construct()
    {
        $this->characteristics = new ArrayCollection();
        $this->Characteristics = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getProficiencyBonus(): ?int
    {
        return $this->proficiencyBonus;
    }

    public function setProficiencyBonus(int $proficiencyBonus): static
    {
        $this->proficiencyBonus = $proficiencyBonus;

        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(int $level): static
    {
        $this->level = $level;

        return $this;
    }

    public function getClassSubclass(): ?string
    {
        return $this->classSubclass;
    }

    public function setClassSubclass(string $classSubclass): static
    {
        $this->classSubclass = $classSubclass;

        return $this;
    }

    public function getHitPoints(): ?int
    {
        return $this->hitPoints;
    }

    public function setHitPoints(int $hitPoints): static
    {
        $this->hitPoints = $hitPoints;

        return $this;
    }

    public function getLore(): ?string
    {
        return $this->lore;
    }

    public function setLore(string $lore): static
    {
        $this->lore = $lore;

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

    public function getPlayers(): ?User
    {
        return $this->players;
    }

    public function setPlayers(?User $players): static
    {
        $this->players = $players;

        return $this;
    }

    /**
     * @return Collection<int, Characteristic>
     */
    public function getCharacteristics(): Collection
    {
        return $this->Characteristics;
    }

    public function addCharacteristic(Characteristic $characteristic): static
    {
        if (!$this->Characteristics->contains($characteristic)) {
            $this->Characteristics->add($characteristic);
            $characteristic->setCharacter($this);
        }

        return $this;
    }

    public function removeCharacteristic(Characteristic $characteristic): static
    {
        if ($this->Characteristics->removeElement($characteristic)) {
            // set the owning side to null (unless already changed)
            if ($characteristic->getCharacter() === $this) {
                $characteristic->setCharacter(null);
            }
        }

        return $this;
    }
}
