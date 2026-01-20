<?php

namespace App\Entity;

enum Status: string
{
    case ACTIVE = 'active';
    case CANCELLED = 'cancelled';
    case COMPLETED = 'completed';
}