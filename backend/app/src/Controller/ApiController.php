<?php

namespace App\Controller;

use App\Entity\Ability;
use App\Entity\Campaign;
use App\Entity\Character;
use App\Entity\Characteristic;
use App\Entity\DiceRoll;
use App\Entity\Status;
use App\Entity\User;
use App\Repository\CampaignRepository;
use App\Repository\CharacterRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ApiController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepo, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $user = $userRepo->findOneBy(['username' => $username]);
        if (!$user) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        if (!$passwordHasher->isPasswordValid($user, $password)) {
             return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $jwtManager->create($user);

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getUsername() . '@example.com', // Mock email for now
            'roles' => $user->getRoles(),
            'token' => $token
        ]);
    }

    #[Route('/register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (!$username || !$password) {
            return $this->json(['error' => 'Username and password required'], 400);
        }

        $user = new User();
        $user->setUsername($username);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setRoles(['ROLE_PLAYER']); // Default role 'jugador' (mapped to ROLE_PLAYER)

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch(\Exception $e) {
            return $this->json(['error' => 'User already exists or error creating user'], 400);
        }

        return $this->json([
            'status' => 'success',
            'id' => $user->getId(),
            'username' => $user->getUsername()
        ], 201);
    }

    #[Route('/campaigns', methods: ['GET'])]
    public function getCampaigns(CampaignRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        // Since we are stateless, getUser() returns the User object from the JWT token
        if (!$user instanceof User) {
             return $this->json(['error' => 'User not authenticated'], 401);
        }

        // Ideally fetch only user's campaigns or all if public. 
        // For now, let's fetch all where user is DM
        // Or if simple app, all campaigns. Let's return campaigns where user is DM for Dashboard.
        
        // $campaigns = $user->getCampaigns(); // If we assume DM relation
        // Or findAll()
        $campaigns = $repo->findAll(); 
        
        $data = [];
        foreach ($campaigns as $c) {
            $data[] = [
                'id' => $c->getId(),
                'name' => $c->getName(),
                'gameSystem' => $c->getGameSystem(),
                'description' => $c->getDescription(),
                'status' => $c->getStatus()->value,
                'dungeonMaster' => [
                    'id' => $c->getDungeonMaster()->getId(),
                    'username' => $c->getDungeonMaster()->getUsername(),
                    'email' => $c->getDungeonMaster()->getUsername() . '@example.com', // Mock email
                ],
                 'imageUrl' => "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            ];
        }
        return $this->json($data);
    }

    #[Route('/campaigns', methods: ['POST'])]
    public function createCampaign(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
             return $this->json(['error' => 'User not authenticated'], 401);
        }

        $data = json_decode($request->getContent(), true);

        $campaign = new Campaign();
        $campaign->setName($data['name']);
        $campaign->setGameSystem($data['gameSystem'] ?? 'D&D 5.5e');
        $campaign->setDescription($data['description'] ?? '');
        $campaign->setStatus(Status::ACTIVE);
        $campaign->setDungeonMaster($user);

        $this->entityManager->persist($campaign);
        $this->entityManager->flush();

        return $this->json(['status' => 'success', 'id' => $campaign->getId()], 201);
    }

    #[Route('/campaigns/{id}/characters', methods: ['GET'])]
    public function getCampaignCharacters(Campaign $campaign): JsonResponse
    {
        $characters = $campaign->getCharacters();
        $data = [];
        foreach ($characters as $c) {
            $data[] = $this->serializeCharacter($c);
        }
        return $this->json($data);
    }

    #[Route('/characters/{id}', methods: ['GET'])]
    public function getCharacter(Character $character): JsonResponse
    {
        // Add security check? For now open if you have ID
        return $this->json($this->serializeCharacter($character));
    }

    #[Route('/characters', methods: ['POST'])]
    public function createCharacter(Request $request, CampaignRepository $campaignRepo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
             return $this->json(['error' => 'User not authenticated'], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        $campaign = $campaignRepo->find($data['campaignId']);
        if (!$campaign) return $this->json(['error' => 'Campaign not found'], 404);

        $character = new Character();
        $character->setName($data['name']);
        $character->setProficiencyBonus(2); // Default
        $character->setLevel(1);
        $character->setClassSubclass($data['classSubclass']);
        $character->setHitPoints((int)$data['hitPoints']);
        $character->setLore($data['lore'] ?? '');
        $character->setCampaign($campaign);
        $character->setPlayers($user);

        $this->entityManager->persist($character);

        // Initialize Characteristics and Abilities
        $statsData = [
            'Strength' => ['Athletics'],
            'Dexterity' => ['Acrobatics', 'Sleight of Hand', 'Stealth'],
            'Constitution' => [],
            'Intelligence' => ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
            'Wisdom' => ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
            'Charisma' => ['Deception', 'Intimidation', 'Performance', 'Persuasion']
        ];

        // Scores from input or default 10
        $inputScores = $data['scores'] ?? [];

        foreach ($statsData as $name => $skills) {
            $stat = new Characteristic();
            $stat->setName($name);
            $stat->setScore($inputScores[$name] ?? 10);
            $stat->setCharacterId($character);
            $this->entityManager->persist($stat);

            foreach ($skills as $skillName) {
                $ability = new Ability();
                $ability->setDescription($skillName); 
                $ability->setCharacteristic($stat);
                $this->entityManager->persist($ability);
            }
        }

        $this->entityManager->flush();

        return $this->json(['status' => 'success', 'id' => $character->getId()], 201);
    }

    #[Route('/characters/{id}/stats', methods: ['PUT'])]
    public function updateStat(Character $character, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $data = json_decode($request->getContent(), true);
        $statName = $data['name'];
        $score = $data['score'];

        foreach ($character->getCharacteristics() as $stat) {
            if ($stat->getName() === $statName) {
                $stat->setScore((int)$score);
                $this->entityManager->flush();
                return $this->json(['status' => 'updated']);
            }
        }
        return $this->json(['error' => 'Stat not found'], 404);
    }

    #[Route('/rolls', methods: ['POST'])]
    public function submitRoll(Request $request): JsonResponse
    {
        // Log roll logic here
        return $this->json(['status' => 'logged']);
    }

    private function serializeCharacter(Character $c): array
    {
        $stats = [];
        foreach ($c->getCharacteristics() as $stat) {
            $abilities = [];
            foreach ($stat->getAbilities() as $ab) {
                $abilities[] = [
                    'id' => $ab->getId(),
                    'name' => $ab->getDescription(), 
                    'characteristicId' => $stat->getId(),
                    'proficiency' => false, // Default for new chars
                ];
            }
            $stats[] = [
                'id' => $stat->getId(),
                'name' => $stat->getName(),
                'score' => $stat->getScore(),
                'characterId' => $c->getId(),
                'abilities' => $abilities,
            ];
        }

        return [
            'id' => $c->getId(),
            'name' => $c->getName(),
            'proficiencyBonus' => $c->getProficiencyBonus(),
            'level' => $c->getLevel(),
            'classSubclass' => $c->getClassSubclass(),
            'hitPoints' => $c->getHitPoints(),
            'lore' => $c->getLore(),
            'campaignId' => $c->getCampaign()->getId(),
            'playerId' => $c->getPlayers()->getId(),
            'imageUrl' => "https://images.unsplash.com/photo-1636224213709-668b57731998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            'characteristics' => $stats,
        ];
    }
}
