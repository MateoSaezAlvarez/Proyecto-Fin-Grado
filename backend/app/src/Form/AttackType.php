<?php

namespace App\Form;

use App\Entity\Attack;
use App\Entity\Character;
use App\Entity\Characteristic;
use App\Entity\DiceRoll;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AttackType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('Name')
            ->add('Modifier')
            ->add('Damage')
            ->add('Attacks', EntityType::class, [
                'class' => Character::class,
                'choice_label' => 'id',
            ])
            ->add('RelatedCharacteristic', EntityType::class, [
                'class' => Characteristic::class,
                'choice_label' => 'id',
            ])
            ->add('rolls_id', EntityType::class, [
                'class' => DiceRoll::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Attack::class,
        ]);
    }
}
