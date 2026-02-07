<?php

namespace App\Controller;

use App\Entity\Characteristic;
use App\Form\CharacteristicType;
use App\Repository\CharacteristicRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/characteristic')]
final class CharacteristicController extends AbstractController
{
    #[Route(name: 'app_characteristic_index', methods: ['GET'])]
    public function index(CharacteristicRepository $characteristicRepository): Response
    {
        return $this->render('characteristic/index.html.twig', [
            'characteristics' => $characteristicRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_characteristic_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $characteristic = new Characteristic();
        $form = $this->createForm(CharacteristicType::class, $characteristic);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $characteristic->setCharacter($this->getUser()->getCharacter());
            $entityManager->persist($characteristic);
            $entityManager->flush();

            return $this->redirectToRoute('app_characteristic_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('characteristic/new.html.twig', [
            'characteristic' => $characteristic,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_characteristic_show', methods: ['GET'])]
    public function show(Characteristic $characteristic): Response
    {
        return $this->render('characteristic/show.html.twig', [
            'characteristic' => $characteristic,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_characteristic_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Characteristic $characteristic, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(CharacteristicType::class, $characteristic);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_characteristic_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('characteristic/edit.html.twig', [
            'characteristic' => $characteristic,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_characteristic_delete', methods: ['POST'])]
    public function delete(Request $request, Characteristic $characteristic, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$characteristic->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($characteristic);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_characteristic_index', [], Response::HTTP_SEE_OTHER);
    }
}
