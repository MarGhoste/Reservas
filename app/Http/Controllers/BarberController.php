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
                    'start_time' => Carbon::parse($reserva->fecha_inicio)->format('H:i'),
                    'end_time' => Carbon::parse($reserva->fecha_fin)->format('H:i'),
                    'servicio_name' => $reserva->servicio->nombre, // Usamos 'nombre'
                    'cliente_name' => $reserva->cliente->name,
                    'cliente_email' => $reserva->cliente->email, // Usamos email en lugar de phone
                    'duration' => $duration,
                    'estado' => $reserva->estado, // Usamos 'estado'
                    'fecha_inicio_raw' => $reserva->fecha_inicio,
                ];
            });

        return Inertia::render('Barbero/Agenda', [
            'reservasHoy' => $reservasHoy,
            'fechaActual' => $today->isoFormat('dddd, D [de] MMMM'),
        ]);
    }
}
