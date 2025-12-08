<?php

namespace App\Filament\Resources;

use Filament\Forms\Form;
use Filament\Tables\Table;
use Illuminate\Support\Arr;
use App\Models\HorarioBarbero;
use Filament\Resources\Resource;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TagsColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Notifications\Notification;
use Filament\Forms\Components\TimePicker;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\CheckboxList;
use App\Filament\Resources\HorarioBarberoResource\Pages;

class HorarioBarberoResource extends Resource
{
    protected static ?string $model = HorarioBarbero::class;

    protected static ?string $navigationIcon = 'heroicon-o-clock';

    protected static ?string $navigationGroup = 'Gestión de Citas';

    protected static ?string $modelLabel = 'Horario de Barbero';
    protected static ?string $pluralModelLabel = 'Horarios Recurrentes';

    // Array para traducir el número del día a texto (1=Lunes)
    private static function getDiasSemanaOptions(): array
    {
        return [
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo',
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make([
                    // Campo 1: Barbero (Solo rol 'barbero')
                    Select::make('barbero_id')
                        ->label('Barbero')
                        ->relationship(
                            'barbero',
                            'name',
                            fn(Builder $query) =>
                            $query->role('barbero')
                        )
                        ->required()
                        ->preload()
                        ->searchable(),

                    // Campo 2: Días de la Semana (selección múltiple)
                    CheckboxList::make('dias_semana')
                        ->label('Días de la Semana')
                        ->options(static::getDiasSemanaOptions())
                        ->required()
                        ->columns(4) // Muestra los checkboxes en columnas para mejor layout
                        ->columnSpan(3), // Ocupa más espacio horizontal

                    // Campo 3: Hora de Inicio
                    TimePicker::make('hora_inicio')
                        ->label('Hora de Inicio')
                        ->required()
                        ->withoutSeconds(),

                    // Campo 4: Hora de Fin
                    TimePicker::make('hora_fin')
                        ->label('Hora de Fin')
                        ->required()
                        ->withoutSeconds()
                        ->afterOrEqual('hora_inicio'),

                ])->columns(4),
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

                // Usamos TagsColumn para mostrar el array de días de forma más elegante.
                // Filament es lo suficientemente inteligente para manejar el array gracias al 'cast' del modelo.
                TagsColumn::make('dias_semana')
                    ->label('Días')
                    // El método 'formatStateUsing' se puede usar de forma más simple
                    // para transformar cada valor del array a su nombre correspondiente.
                    ->formatStateUsing(fn($state) => static::getDiasSemanaOptions()[$state] ?? 'N/A'),

                TextColumn::make('hora_inicio')
                    ->label('Inicio')
                    ->sortable(),

                TextColumn::make('hora_fin')
                    ->label('Fin')
                    ->sortable(),

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
                \Filament\Tables\Actions\DeleteAction::make(), // Añadimos acción de borrado individual
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
            'index' => Pages\ListHorarioBarberos::route('/'),
            'create' => Pages\CreateHorarioBarbero::route('/create'),
            'edit' => Pages\EditHorarioBarbero::route('/{record}/edit'),
        ];
    }
}
