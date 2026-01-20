<?php

namespace App\Entity;

use App\Repository\CampaignRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CampaignRepository::class)]
class Campaign
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $gameSystem = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column(enumType: Status::class)]
    private ?Status $status = null;

    /**
     * @var Collection<int, Character>
     */
    #[ORM\OneToMany(targetEntity: Character::class, mappedBy: 'campaign')]
    private Collection $characters;

    #[ORM\ManyToOne(inversedBy: 'campaigns')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $dungeonMaster = null;

    /**
     * @var Collection<int, DiceRoll>
     */
    #[ORM\OneToMany(targetEntity: DiceRoll::class, mappedBy: 'campaign')]
    private Collection $rolls;

    public function __construct()
    {
        $this->characters = new ArrayCollection();
        $this->rolls = new ArrayCollection();
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

    public function getGameSystem(): ?string
    {
        return $this->gameSystem;
    }

    public function setGameSystem(string $gameSystem): static
    {
        $this->gameSystem = $gameSystem;

        return $this;
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

    public function getStatus(): ?Status
    {
        return $this->status;
    }

    public function setStatus(Status $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Collection<int, Character>
     */
    public function getCharacters(): Collection
    {
        return $this->characters;
    }

    public function addCharacter(Character $character): static
    {
        if (!$this->characters->contains($character)) {
            $this->characters->add($character);
            $character->setCampaign($this);
        }

        return $this;
    }

    public function removeCharacter(Character $character): static
    {
        if ($this->characters->removeElement($character)) {
            // set the owning side to null (unless already changed)
            if ($character->getCampaign() === $this) {
                $character->setCampaign(null);
            }
        }

        return $this;
    }

    public function getDungeonMaster(): ?User
    {
        return $this->dungeonMaster;
    }

    public function setDungeonMaster(?User $dungeonMaster): static
    {
        $this->dungeonMaster = $dungeonMaster;

        return $this;
    }

    /**
     * @return Collection<int, DiceRoll>
     */
    public function getRolls(): Collection
    {
        return $this->rolls;
    }

    public function addRoll(DiceRoll $roll): static
    {
        if (!$this->rolls->contains($roll)) {
            $this->rolls->add($roll);
            $roll->setCampaign($this);
        }

        return $this;
    }

    public function removeRoll(DiceRoll $roll): static
    {
        if ($this->rolls->removeElement($roll)) {
            // set the owning side to null (unless already changed)
            if ($roll->getCampaign() === $this) {
                $roll->setCampaign(null);
            }
        }

        return $this;
    }
}
