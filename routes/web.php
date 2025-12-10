<?php

// web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\BarberiaController; // Asegúrate de que esta línea esté al principio

/*
|--------------------------------------------------------------------------
| Rutas Públicas (sin autenticación)
|--------------------------------------------------------------------------
*/

// Ruta de bienvenida pública (funciona en '/')
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


/*
|--------------------------------------------------------------------------
| Rutas Protegidas (requieren inicio de sesión)
|--------------------------------------------------------------------------
*/

// Agrupamos todas las rutas que necesitan autenticación
Route::middleware(['auth', 'verified'])->group(function () {

    // 1. La ruta '/dashboard' ahora muestra el catálogo de servicios
    // Sobreescribe/reemplaza el dashboard Inertia por defecto.
    Route::get('/dashboard', [BarberiaController::class, 'servicios'])->name('dashboard');
    // También puedes darle un nombre de ruta específico si lo necesitas, ej:
    // Route::get('/dashboard', [BarberiaController::class, 'servicios'])->name('barberia.servicios');

    // 2. Ruta para la página de reservación (ahora protegida)
    Route::get('/reserva', [BarberiaController::class, 'reservacion'])->name('barberia.reservacion');

    // 3. Ruta para obtener horarios disponibles (ahora protegida)
    Route::get('/horarios-disponibles', [BarberiaController::class, 'getHorariosDisponibles'])->name('horarios.disponibles');

    // 4. Ruta para la página de programación (ya estaba protegida, pero ahora está en el grupo principal)
    Route::get('/programacion', [BarberiaController::class, 'programacion'])->name('barberia.programacion');
});


// Asegúrate de que este require esté al final si es necesario
require __DIR__ . '/settings.php';
