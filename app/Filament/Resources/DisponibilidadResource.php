<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DisponibilidadResource\Pages;
use App\Models\Disponibilidad;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DisponibilidadResource extends Resource
{
    protected static ?string $model = Disponibilidad::class;

    protected static ?string $navigationIcon = 'heroicon-o-x-circle'; // Icono para ausencias

    protected static ?string $navigationGroup = 'Gestión de Citas';

    protected static ?string $modelLabel = 'Ausencia/Indisponibilidad';
    protected static ?string $pluralModelLabel = 'Gestión de Ausencias';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make([
                    // Campo 1: Barbero (Solo rol 'barbero')
                    Select::make('barbero_id')
                        ->label('Barbero Ausente')
                        ->relationship(
                            'barbero',
                            'name',
                            fn(Builder $query) =>
                            // Filtramos para mostrar solo usuarios con el rol 'barbero'
                            $query->role('barbero')
                        )
                        ->required()
                        ->preload()
                        ->searchable(),

                    // Campo 2: Fecha de Ausencia
                    DatePicker::make('fecha')
                        ->label('Fecha de Ausencia')
                        ->required()
                        ->unique(ignoreRecord: true, modifyRuleUsing: function (\Illuminate\Validation\Rules\Unique $rule, \Filament\Forms\Get $get) {
                            // Asegura que la combinación de barbero_id y fecha sea única
                            return $rule->where('barbero_id', $get('barbero_id'));
                        })
                        ->minDate(now()) // Solo fechas futuras o hoy
                        ->helperText('Solo se puede registrar una ausencia por barbero por día.'),

                    // Campo 3: Motivo (Opcional)
                    TextInput::make('motivo')
                        ->label('Motivo de la Ausencia')
                        ->maxLength(255)
                        ->nullable(),

                ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('barbero.name')
                    ->label('Barbero')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('fecha')
                    ->label('Fecha Ausente')
                    ->date()
                    ->sortable(),

                TextColumn::make('motivo')
                    ->label('Motivo')
                    ->limit(50),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
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
            'index' => Pages\ListDisponibilidads::route('/'),
            'create' => Pages\CreateDisponibilidad::route('/create'),
            'edit' => Pages\EditDisponibilidad::route('/{record}/edit'),
        ];
    }
}
