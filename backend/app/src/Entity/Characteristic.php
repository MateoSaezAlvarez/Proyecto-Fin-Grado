<?php

namespace App\Entity;

use App\Repository\CharacteristicRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CharacteristicRepository::class)]
class Characteristic
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $score = null;

    /**
     * @var Collection<int, Ability>
     */
    #[ORM\OneToMany(targetEntity: Ability::class, mappedBy: 'characteristic', orphanRemoval: true)]
    private Collection $abilities;

    #[ORM\ManyToOne(inversedBy: 'Characteristics')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Character $character = null;


    public function __construct()
    {
        $this->abilities = new ArrayCollection();
        $this->characters = new ArrayCollection();
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

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;

        return $this;
    }

    /**
     * @return Collection<int, Ability>
     */
    public function getAbilities(): Collection
    {
        return $this->abilities;
    }

    public function addAbility(Ability $ability): static
    {
        if (!$this->abilities->contains($ability)) {
            $this->abilities->add($ability);
            $ability->setCharacteristic($this);
        }

        return $this;
    }

    public function removeAbility(Ability $ability): static
    {
        if ($this->abilities->removeElement($ability)) {
            // set the owning side to null (unless already changed)
            if ($ability->getCharacteristic() === $this) {
                $ability->setCharacteristic(null);
            }
        }

        return $this;
    }

    public function getCharacter(): ?Character
    {
        return $this->character;
    }

    public function setCharacter(?Character $character): static
    {
        $this->character = $character;

        return $this;
    }

    

    
}
