<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Aseguramos que solo existan los roles administrativos/empleados
        $adminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $barberRole = Role::firstOrCreate(['name' => 'barbero']);

        // 2. Crear Administrador (Con Rol)
        $admin = User::updateOrCreate(
            ['email' => 'marcoscarpiocorazon@gmail.com'],
            [
                'name' => 'Marcos Admin',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole($adminRole);

        // 3. Crear Barbero (Con Rol)
        $barber = User::updateOrCreate(
            ['email' => 'sincovid19marco@gmail.com'],
            [
                'name' => 'Marco Barbero',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );
        $barber->assignRole($barberRole);

        // 4. Crear Cliente (Sin Rol asignado)
        User::updateOrCreate(
            ['email' => 'clientedeprueba@gmail.com'],
            [
                'name' => 'Marco Cliente',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Usuarios creados: Admin y Barbero (con roles), Cliente (sin rol).');
    }
}
