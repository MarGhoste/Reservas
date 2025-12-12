<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HistorialTotalResource\Pages;
use App\Models\Reserva; // El resource sigue usando el modelo Reserva
use App\Models\User;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;

class HistorialTotalResource extends Resource
{
    // Apuntamos al modelo Reserva, pero el Resource tiene nombre diferente
    protected static ?string $model = Reserva::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-chart-bar'; // Ícono sugerido para reportes

    protected static ?string $navigationGroup = 'Reportes y Supervision'; // Agrupación diferente para evitar confusión
    protected static ?string $modelLabel = 'Historial General';
    protected static ?string $pluralModelLabel = 'Historial Total de Citas';

    // Ocultamos la creación y edición, ya que solo es un reporte
    public static function canCreate(): bool
    {
        return false;
    }
    public static function canEdit($record): bool
    {
        return false;
    }

    // --- FORM (Dejamos vacío) ---
    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    // --- TABLA (VISTA DE REPORTE) ---
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('fecha_inicio')
                    ->label('Fecha y Hora')
                    ->dateTime('D, d M Y \a \l\a\s H:i') // Formato corregido y más legible
                    ->sortable(),

                TextColumn::make('barbero.name')
                    ->label('Barbero')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('cliente.name')
                    ->label('Cliente')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('servicio.nombre')
                    ->label('Servicio')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('servicio.precio')
                    ->label('Precio')
                    ->money('usd') // Ajusta la moneda si es necesario
                    ->sortable(),

                TextColumn::make('estado')
                    ->label('Estado')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'realizada' => 'success',
                        'cancelada' => 'danger',
                        'no_show' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
            ])
            // 🚨 FILTRO CLAVE: Solo mostrar citas que ya terminaron y tienen estado final
            ->modifyQueryUsing(
                fn(Builder $query) =>
                $query->where('fecha_inicio', '<', now())
                    ->whereIn('estado', ['realizada', 'cancelada', 'no_show'])
            )
            ->defaultSort('fecha_inicio', 'desc')
            ->filters([
                // Filtro por Barbero usando la relación y el rol de Spatie
                SelectFilter::make('barbero_id')
                    ->label('Filtrar por Barbero')
                    ->relationship(
                        'barbero',
                        'name',
                        // Obtener solo usuarios con el rol 'barbero'
                        fn(Builder $query) => $query->role('barbero')
                    )
                    ->searchable()
                    ->preload(),

                // Filtro por Estado 
                SelectFilter::make('estado')
                    ->options([
                        'realizada' => 'Realizada',
                        'cancelada' => 'Cancelada',
                        'no_show' => 'No Show / Faltó',
                    ])
                    ->label('Filtrar por Estado'),
            ])
            ->actions([
                \Filament\Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([]);
    }


    // --- PAGES ---
    public static function getPages(): array
    {
        return [
            // Solo necesitamos la página de listado (el historial)
            'index' => Pages\ListHistorialTotals::route('/'),
        ];
    }
}
