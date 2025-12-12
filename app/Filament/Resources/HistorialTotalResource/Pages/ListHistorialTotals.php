<?php

namespace App\Filament\Resources\HistorialTotalResource\Pages;

use App\Filament\Resources\HistorialTotalResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListHistorialTotals extends ListRecords
{
    protected static string $resource = HistorialTotalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
