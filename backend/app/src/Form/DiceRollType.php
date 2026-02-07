<?php

namespace App\Form;

use App\Entity\Ability;
use App\Entity\DiceRoll;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DiceRollType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('rollDate')
            ->add('dice')
            ->add('rollValue')
            ->add('ability', EntityType::class, [
                'class' => Ability::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => DiceRoll::class,
        ]);
    }
}
