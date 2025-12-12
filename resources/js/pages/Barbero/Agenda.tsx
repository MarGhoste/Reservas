// resources/js/Pages/Barbero/Agenda.tsx

import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// --- INTERFACES ACTUALIZADAS ---
interface Reserva {
    id: number;
    // Usamos los campos correctos del modelo:
    fecha_inicio_hora: string; // H:i
    fecha_fin_hora: string;     // H:i
    servicio_name: string;
    cliente_name: string;
    cliente_email: string;
    duration: number;
    estado: string; // Usamos 'estado'
    fecha_inicio_raw: string;
}

interface AgendaProps {
    auth: { user: any };
    reservasHoy: Reserva[];
    fechaActual: string;
}

export default function Agenda({ auth, reservasHoy, fechaActual }: AgendaProps) {
    
    // Función de ejemplo para un futuro botón de acción
    const handleComplete = (id: number) => {
        // Pedimos confirmación al usuario
        if (window.confirm('¿Estás seguro de que quieres marcar esta cita como completada?')) {
            // Usamos el router de Inertia para enviar la petición PUT
            router.put(route('reservas.completar', id), {}, {
                preserveScroll: true, // Evita que la página salte al inicio
                // onSuccess: () => alert('¡Cita completada!'), // Opcional: para mostrar una alerta
            });
        }
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tu Agenda de Hoy</h2>}>
            <Head title="Agenda Barbero" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 md:p-10">
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Agenda para {fechaActual}
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Tienes {reservasHoy.length} citas programadas. ¡A dar el mejor servicio!
                        </p>

                        {/* --- LISTADO DE CITAS --- */}
                        <div className="space-y-6">
                            {reservasHoy.length > 0 ? (
                                reservasHoy.map(reserva => (
                                    <div key={reserva.id} className="p-5 border-l-4 border-indigo-500 shadow-md rounded-lg bg-gray-50 hover:bg-white transition duration-150 ease-in-out">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl font-extrabold text-gray-900">
                                                    {reserva.fecha_inicio_hora}
                                                </div>
                                                <span className="text-sm font-medium text-gray-500">
                                                    - {reserva.fecha_fin_hora} ({reserva.duration} min)
                                                </span>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {reserva.estado}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                                            {reserva.servicio_name}
                                        </h3>

                                        <div className="text-gray-700 space-y-1 text-base">
                                            <p>
                                                <span className="font-medium">Cliente:</span> {reserva.cliente_name}
                                            </p>
                                           <p>
                                                <span className="font-medium">Email:</span> {reserva.cliente_email}
                                            </p>
                                        </div>

                                        {/* Botones de Acción */}
                                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end space-x-3">
                                            <button 
                                                onClick={() => handleComplete(reserva.id)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-150 shadow-sm"
                                            >
                                                Marcar como Completada
                                            </button>
                                            <button 
                                                // Lógica similar para "No Show" o "Cancelar"
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150 shadow-sm"
                                            >
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-8 bg-gray-50 rounded-lg shadow-inner">
                                    <p className="text-2xl font-bold text-gray-500">🎉 ¡Día Libre de Citas!</p>
                                    <p className="text-gray-500 mt-2">No tienes citas programadas para hoy, {fechaActual}.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}