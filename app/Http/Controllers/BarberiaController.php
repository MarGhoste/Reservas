<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Reserva;
use App\Models\Servicio;
use Illuminate\Http\Request;
use App\Models\Disponibilidad;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\ValidationException;


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

    public function serviciosShowcase()
    {
        $servicios = Servicio::where('activo', true)
            ->select('id', 'nombre', 'precio', 'duracion_minutos')
            ->get();

        // **APUNTA AL COMPONENTE ESTILÍSTICO SIN ACCIÓN**
        return Inertia::render('Servicios/Showcase', [
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

    public function store(Request $request)
    {
        // 1. Validar los datos de entrada
        $validated = $request->validate([
            'servicio_id' => ['required', 'exists:servicios,id'],
            // barbero_id puede ser null si eligió 'Cualquiera'
            'barbero_id' => ['nullable', 'exists:users,id'],
            'fecha_inicio' => ['required', 'date', 'after:now'],
        ]);

        // Si el usuario no está autenticado, aquí deberíamos capturar su información de contacto
        // Asumiremos que el usuario DEBE estar autenticado para finalizar la reserva.
        if (!auth()->check()) {
            throw ValidationException::withMessages([
                'auth' => 'Debes iniciar sesión para completar la reserva.',
            ]);
        }

        $servicio = Servicio::find($validated['servicio_id']);
        $fechaInicio = Carbon::parse($validated['fecha_inicio']);

        // 2. Determinar la hora de fin (necesario para verificar disponibilidad final)
        $fechaFin = $fechaInicio->copy()->addMinutes($servicio->duracion_minutos);

        // 3. Re-verificación de la Disponibilidad Final
        // Esto es una capa de seguridad crítica contra reservas simultáneas.
        $barberoIdFinal = $validated['barbero_id'];

        if (!$barberoIdFinal) {
            // Si el cliente eligió 'Cualquier Barbero', necesitamos asignarle uno que esté libre
            $barberosDisponibles = $this->findFirstAvailableBarber($fechaInicio, $fechaFin);

            if ($barberosDisponibles->isEmpty()) {
                return back()->with('error', 'Lamentablemente, el slot que seleccionaste se acaba de ocupar. Por favor, selecciona otro horario.');
            }
            $barberoIdFinal = $barberosDisponibles->first()->id;
        } else {
            // Si eligió un barbero específico, verificar que siga libre
            if ($this->isBarberBusy($barberoIdFinal, $fechaInicio, $fechaFin)) {
                return back()->with('error', 'El barbero seleccionado se acaba de ocupar. Por favor, selecciona otro barbero u horario.');
            }
        }

        // 4. Crear la Reserva
        $reserva = Reserva::create([
            'cliente_id' => auth()->id(),
            'barbero_id' => $barberoIdFinal,
            'servicio_id' => $validated['servicio_id'],
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin, // Almacenamos el fin para simplificar futuras consultas
            'estado' => 'confirmada', // O 'pendiente', según tu flujo de negocio
        ]);

        // 5. Redirigir y notificar

        // NOTA: Aquí se enviaría el correo de confirmación

        return redirect()->route('barberia.programacion')
            ->with('success', '¡Tu reserva ha sido confirmada con éxito!');
    }
    
    // --- MÉTODOS AUXILIARES CRÍTICOS ---

    /**
     * Verifica si un barbero específico está ocupado en un rango de tiempo.
     */
    private function isBarberBusy(int $barberoId, Carbon $inicio, Carbon $fin): bool
    {
        return Reserva::where('barbero_id', $barberoId)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            // La reserva choca si empieza antes de que nuestra cita termine Y termina después de que nuestra cita empiece
            ->where(function ($query) use ($inicio, $fin) {
                $query->where('fecha_inicio', '<', $fin)
                    ->where('fecha_fin', '>', $inicio);
            })
            ->exists();
    }

    /**
     * Encuentra el primer barbero disponible en un slot (para la opción 'Cualquiera').
     */
    private function findFirstAvailableBarber(Carbon $inicio, Carbon $fin)
    {
        // 1. Obtener todos los IDs de barberos activos
        $barberoIds = User::role('barbero')->pluck('id');

        if ($barberoIds->isEmpty()) {
            return collect(); // No hay barberos
        }

        // 2. Encontrar barberos que están ocupados en el slot
        $barberosOcupadosIds = Reserva::whereIn('barbero_id', $barberoIds)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->where(function ($query) use ($inicio, $fin) {
                $query->where('fecha_inicio', '<', $fin)
                    ->where('fecha_fin', '>', $inicio);
            })
            ->pluck('barbero_id');

        // 3. Devolver el primer barbero cuyo ID no esté en la lista de ocupados
        $barberosDisponibles = User::whereIn('id', $barberoIds)
            ->whereNotIn('id', $barberosOcupadosIds)
            ->get();

        return $barberosDisponibles;
    }

    public function cancelarReserva(Reserva $reserva)
    {
        // 1. Verificar Autenticación y Autorización
        if ($reserva->cliente_id !== auth()->id()) {
            return back()->with('error', 'No tienes permiso para cancelar esta cita.');
        }

        // 2. Regla de Negocio: Verificar Antelación (Ejemplo: Mínimo 2 horas antes)
        $horaLimite = Carbon::parse($reserva->fecha_inicio)->subHours(2);

        if (Carbon::now()->greaterThanOrEqualTo($horaLimite)) {
            return back()->with('error', 'La cancelación debe hacerse con al menos 2 horas de antelación.');
        }

        // 3. Verificar Estado Actual
        if ($reserva->estado === 'cancelada') {
            return back()->with('warning', 'Esta cita ya estaba marcada como cancelada.');
        }

        // 4. Ejecutar la Cancelación
        $reserva->update([
            'estado' => 'cancelada',
        ]);

        // NOTA: Aquí se dispararía un evento para notificar al barbero.

        return redirect()->route('barberia.programacion')
            ->with('success', 'La cita ha sido cancelada con éxito.');
    }

    public function programacion(Request $request)
    {
        // 1. Obtener el ID del usuario autenticado
        $userId = auth()->id();

        // 2. Cargar las reservas del cliente
        // Utilizamos with() para cargar las relaciones 'barbero' y 'servicio' y evitar el N+1
        $reservas = Reserva::where('cliente_id', $userId)
            ->with(['barbero:id,name', 'servicio:id,nombre,precio'])
            ->orderBy('fecha_inicio', 'desc') // Mostrar las más recientes o futuras primero
            ->get();

        // 3. Mapear los datos para Inertia (simplificar la estructura y tipos)
        $reservasMapeadas = $reservas->map(function ($reserva) {
            return [
                'id' => $reserva->id,
                'fecha_inicio' => Carbon::parse($reserva->fecha_inicio)->format('Y-m-d H:i'),
                'fecha_fin' => Carbon::parse($reserva->fecha_fin)->format('Y-m-d H:i'),
                'estado' => $reserva->estado,
                'barbero' => $reserva->barbero->name,
                'servicio' => $reserva->servicio->nombre,
                'precio' => $reserva->servicio->precio,
            ];
        });

        // 4. Renderizar la vista
        return Inertia::render('Programacion/Index', [
            'reservas' => $reservasMapeadas,
        ]);
    }

    public function calendarioAusencias()
    {
        // 1. Obtener todas las indisponibilidades futuras y recientes
        $indisponibilidades = Disponibilidad::where('fecha', '>=', Carbon::now()->subDays(30))
            ->with('barbero:id,name') // Asumimos que la relación 'barbero' existe en el modelo Disponibilidad
            ->orderBy('fecha', 'asc')
            ->get();

        // 2. Contar el número total de barberos activos para determinar el 'cierre total'
        // Asumimos que los barberos tienen el rol 'barbero'
        $totalBarberos = User::role('barbero')->count();

        // 3. Agrupar por fecha y mapear para el frontend
        $diasIndisponibles = $indisponibilidades->groupBy(function ($item) {
            return Carbon::parse($item->fecha)->format('Y-m-d');
        })->map(function ($ausenciasPorDia, $fecha) use ($totalBarberos) {

            $barberosAusentes = $ausenciasPorDia->pluck('barbero.name')->filter()->implode(', ');
            $numAusentes = $ausenciasPorDia->unique('barbero_id')->count();

            $isCierreTotal = $numAusentes >= $totalBarberos;

            if ($isCierreTotal) {
                $title = 'CERRADO: Todos los barberos ausentes';
                $type = 'cierre_total';
            } else {
                $title = "Ausencias Parciales: {$barberosAusentes}";
                $type = 'parcial';
            }

            return [
                'date' => $fecha,
                'title' => $title,
                'type' => $type,
                'barberos' => $barberosAusentes,
            ];
        })->values(); // Resetear las keys para Inertia/React

        // 4. Renderizar la vista
        return Inertia::render('Calendario/Ausencias', [
            'diasIndisponibles' => $diasIndisponibles,
        ]);
    }
}
