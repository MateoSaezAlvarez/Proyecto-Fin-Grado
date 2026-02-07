<?php

namespace App\Controller;

use App\Entity\DiceRoll;
use App\Form\DiceRollType;
use App\Repository\DiceRollRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/dice/roll')]
final class DiceRollController extends AbstractController
{
    #[Route(name: 'app_dice_roll_index', methods: ['GET'])]
    public function index(DiceRollRepository $diceRollRepository): Response
    {
        return $this->render('dice_roll/index.html.twig', [
            'dice_rolls' => $diceRollRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_dice_roll_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $diceRoll = new DiceRoll();
        $form = $this->createForm(DiceRollType::class, $diceRoll);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $diceRoll->setCampaign($this->getUser()->getCampaign());
            $entityManager->persist($diceRoll);
            $entityManager->flush();

            return $this->redirectToRoute('app_dice_roll_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dice_roll/new.html.twig', [
            'dice_roll' => $diceRoll,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_dice_roll_show', methods: ['GET'])]
    public function show(DiceRoll $diceRoll): Response
    {
        return $this->render('dice_roll/show.html.twig', [
            'dice_roll' => $diceRoll,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_dice_roll_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, DiceRoll $diceRoll, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(DiceRollType::class, $diceRoll);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_dice_roll_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dice_roll/edit.html.twig', [
            'dice_roll' => $diceRoll,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_dice_roll_delete', methods: ['POST'])]
    public function delete(Request $request, DiceRoll $diceRoll, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$diceRoll->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($diceRoll);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_dice_roll_index', [], Response::HTTP_SEE_OTHER);
    }
}
