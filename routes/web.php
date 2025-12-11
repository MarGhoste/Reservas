<?php

// web.php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarberController;
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

    Route::post('/reservacion', [BarberiaController::class, 'store'])->name('reservacion.store');

    // 4. Ruta para la página de programación (ya estaba protegida, pero ahora está en el grupo principal)
    Route::get('/programacion', [BarberiaController::class, 'programacion'])->name('barberia.programacion');

    Route::delete('/reserva/{reserva}', [BarberiaController::class, 'cancelarReserva'])
        ->name('reserva.cancelar');

    Route::get('/servicios-showcase', [BarberiaController::class, 'serviciosShowcase'])->name('barberia.servicios.showcase');

    Route::get('/calendario-ausencias', [BarberiaController::class, 'calendarioAusencias'])
        ->name('barberia.calendario.ausencias');



    //RUTA PARA EL CONTROLADOR DEL BARBERO
    Route::prefix('barbero')->group(function () {
        Route::get('agenda', [BarberController::class, 'agenda'])->name('barbero.agenda');

        // Aquí irán las rutas de historial y disponibilidad
        Route::get('historial', [BarberController::class, 'historial'])->name('barbero.historial');
        Route::get('disponibilidad', [BarberController::class, 'disponibilidad'])->name('barbero.disponibilidad');
    });
});


// Asegúrate de que este require esté al final si es necesario
require __DIR__ . '/settings.php';
