<?php

namespace App\Filament\Resources\HorarioBarberoResource\Pages;

use App\Filament\Resources\HorarioBarberoResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditHorarioBarbero extends EditRecord
{
    protected static string $resource = HorarioBarberoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
