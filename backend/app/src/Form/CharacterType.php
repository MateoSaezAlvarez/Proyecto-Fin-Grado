<?php

namespace App\Form;

use App\Entity\Campaign;
use App\Entity\Character;
use App\Entity\Characteristic;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CharacterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('proficiencyBonus')
            ->add('level')
            ->add('classSubclass')
            ->add('hitPoints')
            ->add('lore')
            ->add('characteristics', EntityType::class, [
                'class' => Characteristic::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
            ->add('campaign', EntityType::class, [
                'class' => Campaign::class,
                'choice_label' => 'id',
            ])
            ->add('players', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Character::class,
        ]);
    }
}
