<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServicioResource\Pages;
use App\Models\Servicio;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class ServicioResource extends Resource
{
    protected static ?string $model = Servicio::class;

    protected static ?string $navigationIcon = 'heroicon-o-scissors'; // Icono representativo

    protected static ?string $navigationGroup = 'Gestión de Citas';

    protected static ?string $modelLabel = 'Servicio'; // Singular
    protected static ?string $pluralModelLabel = 'Servicios'; // Plural

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make([
                    // Campo 1: Nombre del Servicio
                    TextInput::make('nombre')
                        ->label('Nombre del Servicio')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true), // Único para evitar duplicados

                    // Campo 2: Duración en minutos (Crítico para la lógica de reservas)
                    TextInput::make('duracion_minutos')
                        ->label('Duración (minutos)')
                        ->numeric()
                        ->required()
                        ->minValue(10) // Mínimo lógico para un servicio
                        ->suffix('minutos'),

                    // Campo 3: Precio (decimal)
                    TextInput::make('precio')
                        ->label('Precio')
                        ->numeric()
                        ->required()
                        ->prefix('$') // Prefijo de moneda (ejemplo)
                        ->inputMode('decimal'), // Permite decimales

                    // Campo 5: Descripción (opcional)
                    Textarea::make('descripcion')
                        ->label('Descripción del Servicio')
                        ->nullable()
                        ->columnSpanFull(), // Ocupa todo el ancho

                    // Campo 6: URL de la Imagen (opcional)
                    FileUpload::make('imagen_url')
                        ->label('Imagen del Servicio')
                        ->image() // Valida que sea una imagen y muestra previsualización
                        ->disk('public') // Asegura explícitamente el disco público
                        ->directory('servicios') // Directorio en el disco público (storage/app/public/servicios)
                        ->nullable()
                        ->columnSpanFull(),

                    // Campo 4: Estado Activo/Inactivo
                    Toggle::make('activo')
                        ->label('Activo')
                        ->helperText('Si está desactivado, el servicio no aparecerá disponible para reservas.')
                        ->default(true),

                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_url')
                    ->label('Imagen')
                    ->square(),

                TextColumn::make('nombre')
                    ->label('Servicio')
                    ->searchable()
                    ->sortable()
                    ->description(fn(Servicio $record): ?string => $record->descripcion),

                TextColumn::make('duracion_minutos')
                    ->label('Duración')
                    ->suffix(' min')
                    ->sortable(),

                TextColumn::make('precio')
                    ->label('Precio')
                    ->money('USD', 2) // Formato de moneda, ajusta 'USD' según tu necesidad
                    ->sortable(),

                // Columna editable para Activo/Inactivo
                ToggleColumn::make('activo')
                    ->label('Estado'),

                TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // Filtro para mostrar solo los servicios activos
                \Filament\Tables\Filters\TernaryFilter::make('activo')
                    ->label('Mostrar solo activos')
                    ->default(true),
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
            'index' => Pages\ListServicios::route('/'),
            'create' => Pages\CreateServicio::route('/create'),
            'edit' => Pages\EditServicio::route('/{record}/edit'),
        ];
    }
}
