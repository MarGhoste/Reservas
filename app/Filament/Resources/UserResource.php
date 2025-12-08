<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms\Components\Card; // Usamos Card, estándar de v3
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'Gestión de Personal y Acceso';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make([
                    TextInput::make('name')
                        ->label('Nombre Completo')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('email')
                        ->label('Correo Electrónico')
                        ->email()
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(255),

                    // CRÍTICO: Campo para el acceso al Panel Admin/Filament
                    Toggle::make('es_personal')
                        ->label('Acceso al Panel (Personal)')
                        ->helperText('Habilita este interruptor para que el usuario pueda iniciar sesión en el área administrativa/barberos.'),

                    // CRÍTICO: Campo de Roles de Spatie (provisto por el plugin)
                    Select::make('roles')
                        ->relationship('roles', 'name') // Utiliza la relación 'roles' de Spatie
                        ->multiple()
                        ->preload() // Carga los roles para que el Select funcione rápidamente
                        ->required(),

                    TextInput::make('password')
                        ->label('Contraseña')
                        ->password()
                        ->required()
                        ->hiddenOn('edit') // La contraseña no se muestra al editar
                        ->maxLength(255),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),

                // Mostrar los roles asignados
                TextColumn::make('roles.name')
                    ->label('Roles Asignados')
                    ->badge()
                    ->color('primary'),

                // Usamos ToggleColumn ya que es editable desde la tabla
                ToggleColumn::make('es_personal')
                    ->label('Acceso Panel'),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // Filtro rápido para ver solo al personal (Administradores/Barberos)
                \Filament\Tables\Filters\TernaryFilter::make('es_personal')
                    ->label('Solo Personal')
                    ->default(false)
                    ->attribute('es_personal'),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
