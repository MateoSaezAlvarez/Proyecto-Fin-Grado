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
    #[ORM\JoinColumn(nullable: false)]
    private ?Ability $ability = null;

    #[ORM\ManyToOne(inversedBy: 'rolls')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Campaign $campaign = null;

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
}
