<?php

namespace App\Filament\Resources\HorarioBarberoResource\Pages;

use App\Filament\Resources\HorarioBarberoResource;
use Filament\Resources\Pages\CreateRecord;

class CreateHorarioBarbero extends CreateRecord
{
    protected static string $resource = HorarioBarberoResource::class;

    /**
     * Modificamos la URL de redirección para que vuelva al listado
     * en lugar de intentar ir a la página de "ver" que no existe.
     */
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
