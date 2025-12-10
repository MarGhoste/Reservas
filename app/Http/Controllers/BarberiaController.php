<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Servicio;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;


class BarberiaController extends Controller
{
    /**
     * Muestra la página principal con el catálogo de servicios activos.
     */
    public function servicios()
    {
        // Obtener solo los servicios que están activos para mostrar al público
        $servicios = Servicio::where('activo', true)
            ->select('id', 'nombre', 'precio', 'duracion_minutos')
            ->get();

        // Renderizar el componente de React (Servicios/Index.jsx) y pasar los datos
        return Inertia::render('Servicios/Index', [
            'servicios' => $servicios,
        ]);
    }

    // Los otros métodos (reservacion, programacion) los crearemos después...

    public function reservacion(Request $request)
    {
        // 1. Obtener el servicio seleccionado (Validación básica)
        $servicioId = $request->input('servicio_id');

        if (!$servicioId) {
            // Si no hay ID de servicio, redirigir al catálogo
            return redirect()->route('dashboard')->with('error', 'Debes seleccionar un servicio primero.');
        }

        $servicio = Servicio::where('activo', true)
            ->find($servicioId);

        if (!$servicio) {
            return redirect()->route('dashboard')->with('error', 'El servicio seleccionado no está disponible.');
        }

        // 2. Obtener la lista de Barberos (solo usuarios con el rol 'barbero')
        // Usamos la lógica de Spatie para filtrar por rol
        $barberos = User::role('barbero')
            ->select('id', 'name')
            ->get();

        // 3. Preparar los datos para Inertia
        return Inertia::render('Reservacion/Index', [
            'servicio' => [
                'id' => $servicio->id,
                'nombre' => $servicio->nombre,
                'duracion_minutos' => $servicio->duracion_minutos,
                'precio' => $servicio->precio,
            ],
            'barberos' => $barberos->map(function ($barbero) {
                return [
                    'id' => $barbero->id,
                    'name' => $barbero->name,
                ];
            }),
        ]);
    }

    public function getHorariosDisponibles(Request $request)
    {
        $request->validate([
            'servicio_id' => 'required|exists:servicios,id',
            'fecha' => 'required|date_format:Y-m-d',
            'barbero_id' => 'nullable|exists:users,id', // Puede ser nulo si eligen 'Cualquiera'
        ]);

        $fecha = Carbon::parse($request->input('fecha'))->startOfDay();
        $servicio = Servicio::find($request->input('servicio_id'));
        $barberoId = $request->input('barbero_id');

        $duracionServicio = $servicio->duracion_minutos;

        // 1. Definir Horario de Apertura y Cierre de la Barbería
        // NOTA: En un sistema real, esto vendría de una tabla de 'Horarios'
        $horaApertura = Carbon::createFromTime(9, 0, 0); // 09:00 AM
        $horaCierre = Carbon::createFromTime(18, 0, 0); // 06:00 PM

        // Asignar la fecha del request a la hora de apertura/cierre
        $inicioDia = $fecha->copy()->setTime($horaApertura->hour, $horaApertura->minute);
        $finDia = $fecha->copy()->setTime($horaCierre->hour, $horaCierre->minute);

        // 2. Obtener reservaciones existentes (filtrando por barbero si se seleccionó uno)
        $reservacionesExistentesQuery = Reserva::whereDate('fecha_inicio', $fecha->format('Y-m-d'))
            ->whereIn('estado', ['pendiente', 'confirmada']); // Solo citas activas

        if ($barberoId) {
            $reservacionesExistentesQuery->where('barbero_id', $barberoId);
        } else {
            // Si el cliente eligió 'Cualquier Barbero', necesitamos saber qué barberos están trabajando.
            // Para simplificar, asumiremos que todos los 'barberos' están trabajando y los uniremos en el siguiente paso.
            $barberoIds = User::role('barbero')->pluck('id')->toArray();
            $reservacionesExistentesQuery->whereIn('barbero_id', $barberoIds);
        }

        // Cargar las reservaciones con la duración del servicio asociado
        $reservacionesExistentes = $reservacionesExistentesQuery->get()->map(function ($reserva) {
            // El modelo Reservacion DEBERÍA tener fecha_fin, pero si no, la calculamos:
            $fin = $reserva->fecha_fin
                ? Carbon::parse($reserva->fecha_fin)
                : Carbon::parse($reserva->fecha_inicio)->addMinutes($reserva->servicio->duracion_minutos);

            return [
                'start' => Carbon::parse($reserva->fecha_inicio),
                'end' => $fin,
            ];
        })->toArray();

        // Ordenar las reservas por hora de inicio
        usort($reservacionesExistentes, fn($a, $b) => $a['start']->timestamp - $b['start']->timestamp);


        // 3. Generar todos los slots posibles (generalmente en intervalos de 30 minutos)
        $intervalo = 15; // Slots de 15 minutos para mayor precisión
        $slotsDisponibles = [];
        $currentTime = $inicioDia->copy();

        // El último slot posible debe terminar antes de la hora de cierre del día.
        while ($currentTime->copy()->addMinutes($duracionServicio) <= $finDia) {
            $slotFin = $currentTime->copy()->addMinutes($duracionServicio);
            $isAvailable = true;

            // a. Verificar contra citas existentes
            foreach ($reservacionesExistentes as $reserva) {
                // Si el slot choca con una reserva existente (cualquier superposición)
                if ($currentTime < $reserva['end'] && $slotFin > $reserva['start']) {
                    $isAvailable = false;

                    // Si choca, avanza el puntero de tiempo al final de la cita ocupada
                    // Esto evita verificar slot por slot dentro de una cita grande
                    if ($currentTime < $reserva['end']) {
                        $currentTime = $reserva['end']->copy();
                        // Ajustar el currentTime a un múltiplo del intervalo (ej. 15, 30, 45, 00)
                        $currentTime->minute($intervalo * ceil($currentTime->minute / $intervalo));
                        $currentTime->second(0);
                    }
                    break;
                }
            }

            // b. Si no chocó, agregar el slot a la lista
            if ($isAvailable) {
                // Solo mostrar slots que están en el futuro (si la fecha es hoy)
                if ($currentTime > Carbon::now()) {
                    $slotsDisponibles[] = $currentTime->format('H:i');
                }
                $currentTime->addMinutes($intervalo);
            }

            // Si el loop anterior ya avanzó currentTime, no lo volvemos a avanzar aquí
            if (!$isAvailable && $currentTime->copy()->addMinutes($duracionServicio) <= $finDia) {
                // Si hubo un salto, la siguiente iteración de while continuará desde el nuevo currentTime
                continue;
            }
        }

        // 4. Devolver la lista de horarios al frontend
        return response()->json([
            'fecha' => $fecha->format('Y-m-d'),
            'slots' => $slotsDisponibles,
        ]);
    }

    public function programacion()
    {
        // Lógica de programación...
    }
}
