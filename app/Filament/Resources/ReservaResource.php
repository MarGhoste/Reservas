<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReservaResource\Pages;
use App\Models\Reserva;
use App\Models\User; // Necesario para las relaciones de cliente/barbero
use Filament\Forms\Components\Card;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ReservaResource extends Resource
{
    protected static ?string $model = Reserva::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days'; // Icono de calendario

    protected static ?string $navigationGroup = 'Gestión de Citas';

    protected static ?string $modelLabel = 'Cita/Reserva';
    protected static ?string $pluralModelLabel = 'Citas/Reservas';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make([
                    // Campo 1: Cliente (Relación con User)
                    Select::make('cliente_id')
                        ->label('Cliente')
                        ->relationship(
                            'cliente',
                            'name',
                            fn(Builder $query) =>
                            // Filtra a los usuarios que NO tienen el rol 'administrador' o 'barbero'.
                            // Asumimos que si no son personal, son clientes (o han hecho una reserva).
                            $query->whereDoesntHave('roles', function (Builder $q) {
                                $q->whereIn('name', ['super_admin', 'barbero']);
                            })
                        )
                        ->searchable()
                        ->preload()
                        ->required(),

                    // Campo 2: Barbero (Relación con User)
                    Select::make('barbero_id')
                        ->label('Barbero Asignado')
                        ->relationship(
                            'barbero',
                            'name',
                            fn(Builder $query) =>
                            // Filtra a los usuarios que SÍ tienen el rol 'barbero'.
                            $query->role('barbero')
                        )
                        ->required()
                        ->preload(),

                    // Campo 3: Servicio (Relación con Servicio)
                    Select::make('servicio_id')
                        ->label('Servicio Contratado')
                        ->relationship('servicio', 'nombre') // Usa la relación 'servicio'
                        ->required()
                        ->preload(),

                    // Campo 4: Fecha y Hora de Inicio
                    DateTimePicker::make('fecha_inicio')
                        ->label('Fecha y Hora de la Cita')
                        ->required()
                        ->minDate(now()), // Solo fechas futuras

                    // Campo 5: Estado de la Cita
                    Select::make('estado')
                        ->label('Estado de la Cita')
                        ->options([
                            'pendiente' => '🟡 Pendiente',
                            'confirmada' => '🟢 Confirmada',
                            'completada' => '✅ Completada',
                            'cancelada' => '🔴 Cancelada',
                        ])
                        ->default('pendiente')
                        ->required(),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('cliente.name')
                    ->label('Cliente')
                    ->searchable(),

                TextColumn::make('barbero.name')
                    ->label('Barbero')
                    ->searchable(),

                TextColumn::make('servicio.nombre')
                    ->label('Servicio')
                    ->searchable(),

                TextColumn::make('fecha_inicio')
                    ->label('Inicio de Cita')
                    ->dateTime('M d, Y h:i A') // Formato legible
                    ->sortable(),

                // Columna para el estado con un badge de color
                TextColumn::make('estado')
                    ->label('Estado')
                    ->badge()
                    ->sortable()
                    ->color(fn(string $state): string => match ($state) {
                        'pendiente' => 'warning',
                        'confirmada' => 'success',
                        'completada' => 'primary',
                        'cancelada' => 'danger',
                        default => 'secondary',
                    }),

                TextColumn::make('created_at')
                    ->label('Creada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // Filtros por Estado y por Barbero
                \Filament\Tables\Filters\SelectFilter::make('estado')
                    ->options([
                        'pendiente' => 'Pendiente',
                        'confirmada' => 'Confirmada',
                        'completada' => 'Completada',
                        'cancelada' => 'Cancelada',
                    ]),

                \Filament\Tables\Filters\SelectFilter::make('barbero')
                    ->relationship('barbero', 'name')
                    ->label('Filtrar por Barbero'),
            ])
            ->actions([
                \Filament\Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                \Filament\Tables\Actions\BulkActionGroup::make([
                    \Filament\Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReservas::route('/'),
            'create' => Pages\CreateReserva::route('/create'),
            'edit' => Pages\EditReserva::route('/{record}/edit'),
        ];
    }
}
