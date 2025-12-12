<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\User; // Asumimos que el cliente también es un User
use Carbon\Carbon;
use Inertia\Inertia;

class BarberController extends Controller
{
    /**
     * Muestra la agenda de citas del barbero autenticado para el día de hoy.
     * Usa: fecha_inicio, fecha_fin, estado.
     */
    public function agenda()
    {
        $barberId = auth()->id();
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $reservasHoy = Reserva::where('barbero_id', $barberId)
            ->where('estado', 'confirmada') // Usamos 'estado'
            ->whereBetween('fecha_inicio', [$today, $tomorrow]) // Usamos 'fecha_inicio'
            ->with('servicio:id,nombre') // Asumimos servicio tiene campo 'nombre'
            ->with('cliente:id,name,email') // Asumimos cliente es un User, solo necesitamos nombre y email
            ->orderBy('fecha_inicio')
            ->get()
            ->map(function ($reserva) {
                // Cálculo de la duración (asumiendo que está en minutos)
                $duration = $reserva->fecha_inicio->diffInMinutes($reserva->fecha_fin);

                return [
                    'id' => $reserva->id,
                    'fecha_inicio_hora' => Carbon::parse($reserva->fecha_inicio)->format('H:i'),
                    'fecha_fin_hora' => Carbon::parse($reserva->fecha_fin)->format('H:i'),
                    'servicio_name' => $reserva->servicio->nombre, // Usamos 'nombre'
                    'cliente_name' => $reserva->cliente->name,
                    'cliente_email' => $reserva->cliente->email, // Usamos email en lugar de phone
                    'duration' => $duration,
                    'estado' => $reserva->estado, // Usamos 'estado'
                    'fecha_inicio_raw' => $reserva->fecha_inicio->toIso8601String(),
                ];
            });

        // --- LÍNEA DE DEPURACIÓN ---
        // dd($reservasHoy); 

        return Inertia::render('Barbero/Agenda', [
            'reservasHoy' => $reservasHoy,
            'fechaActual' => $today->isoFormat('dddd, D [de] MMMM'),
        ]);
    }

    /**
     * Marca una reserva específica como 'completada'.
     */
    public function marcarCompletada(Reserva $reserva)
    {
        // 1. Verificación de autorización: Asegurarse de que el barbero autenticado
        //    es el mismo que el asignado a la reserva.
        if (auth()->id() !== $reserva->barbero_id) {
            // Si no, se deniega el acceso.
            abort(403, 'No autorizado para modificar esta reserva.');
        }

        // 2. Actualizar el estado de la reserva.
        $reserva->estado = 'realizada';
        $reserva->save();

        // 3. Redirigir de vuelta a la página de la agenda con un mensaje de éxito.
        //    Inertia se encargará de mostrar el mensaje si el layout está configurado para ello.
        return redirect()->route('barbero.agenda')
            ->with('success', 'Cita marcada como realizada.');
    }

    public function historial()
    {
        $barberId = auth()->id();
        $today = Carbon::today();

        // 1. Obtener las reservas pasadas
        $historialCitas = Reserva::where('barbero_id', $barberId)
            // Citas cuya fecha de fin es anterior al inicio de hoy (ya terminaron)
            ->where('fecha_inicio', '<=', $today->endOfDay()) // Incluye todo el día de hoy
            // Solo estados finales (realizada, no_show, cancelada)
            ->whereIn('estado', ['realizada', 'no_show', 'cancelada'])
            ->with('servicio:id,nombre,precio') // Cargar nombre y precio del servicio
            ->with('cliente:id,name') // Cargar nombre del cliente
            ->orderBy('fecha_inicio', 'desc')
            ->paginate(10) // Paginación para manejar grandes volúmenes de datos
            ->through(function ($reserva) {
                // Calcular la duración en minutos
                $duration = $reserva->fecha_inicio->diffInMinutes($reserva->fecha_fin);

                return [
                    'id' => $reserva->id,
                    'fecha_hora' => Carbon::parse($reserva->fecha_inicio)->isoFormat('D MMM YY [a las] H:mm'),
                    'servicio_name' => $reserva->servicio->nombre,
                    'servicio_precio' => $reserva->servicio->precio,
                    'cliente_name' => $reserva->cliente->name,
                    'duration' => $duration,
                    'estado' => $reserva->estado,
                ];
            });

        // 2. Enviar los datos paginados a la vista de Inertia
        return Inertia::render('Barbero/Historial', [
            'historialCitas' => $historialCitas,
        ]);
    }
}
