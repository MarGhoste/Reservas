<?php

namespace Database\Seeders;

use App\Models\Servicio;
use Illuminate\Database\Seeder;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        $servicios = [
            [
                'nombre' => 'Corte Clásico Tradicional',
                'descripcion' => 'Corte de tijera y máquina con acabado tradicional, ideal para un look sobrio y elegante.',
                'precio' => 15.00,
                'duracion_minutos' => 30,
                'activo' => true,
                'imagen_path' => null, // Puedes subir la imagen luego desde Filament
            ],
            [
                'nombre' => 'Perfilado de Barba con Toalla Caliente',
                'descripcion' => 'Diseño y perfilado con navaja libre, tratamiento de toalla caliente y bálsamos hidratantes.',
                'precio' => 12.00,
                'duracion_minutos' => 30,
                'activo' => true,
                'imagen_path' => null,
            ],
            [
                'nombre' => 'Fade / Degradado Moderno',
                'descripcion' => 'Desvanecimiento gradual (Low, Mid o High Fade) con acabado impecable y perfilado de contornos.',
                'precio' => 18.00,
                'duracion_minutos' => 45,
                'activo' => true,
                'imagen_path' => null,
            ],
            [
                'nombre' => 'Ritual Facial Black Mask',
                'descripcion' => 'Limpieza profunda con mascarilla de carbón activado, exfoliación y masaje facial relajante.',
                'precio' => 10.00,
                'duracion_minutos' => 20,
                'activo' => true,
                'imagen_path' => null,
            ],
            [
                'nombre' => 'Corte Premium + Lavado',
                'descripcion' => 'Corte personalizado, lavado con champú mentolado, masaje capilar y peinado con pomada premium.',
                'precio' => 22.00,
                'duracion_minutos' => 50,
                'activo' => true,
                'imagen_path' => null,
            ],
        ];

        foreach ($servicios as $servicio) {
            Servicio::updateOrCreate(['nombre' => $servicio['nombre']], $servicio);
        }
    }
}
