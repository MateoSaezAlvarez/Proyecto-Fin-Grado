<?php

namespace App\Entity;

use App\Repository\DiceRollRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    /**
     * @var Collection<int, Attack>
     */
    #[ORM\OneToMany(targetEntity: Attack::class, mappedBy: 'rolls_id')]
    private Collection $attacks_id;

    public function __construct()
    {
        $this->attacks_id = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Attack>
     */
    public function getAttacksId(): Collection
    {
        return $this->attacks_id;
    }

    public function addAttacksId(Attack $attacksId): static
    {
        if (!$this->attacks_id->contains($attacksId)) {
            $this->attacks_id->add($attacksId);
            $attacksId->setRollsId($this);
        }

        return $this;
    }

    public function removeAttacksId(Attack $attacksId): static
    {
        if ($this->attacks_id->removeElement($attacksId)) {
            // set the owning side to null (unless already changed)
            if ($attacksId->getRollsId() === $this) {
                $attacksId->setRollsId(null);
            }
        }

        return $this;
    }
}
