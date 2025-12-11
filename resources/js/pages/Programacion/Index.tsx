// resources/js/Pages/Programacion/Index.tsx

import React from 'react';
import { Head, Link , router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/Utils/formatters'; // Asumiendo que esta utilidad existe
import { FaCalendarCheck, FaClock, FaTag, FaUserTie } from 'react-icons/fa'; // Si usas React Icons

// 1. INTERFACES DE TYPESCRIPT
interface ReservaProps {
    id: number;
    fecha_inicio: string; // Formato YYYY-MM-DD HH:mm
    fecha_fin: string;
    estado: string;
    barbero: string;
    servicio: string;
    precio: number;
}

interface ProgramacionProps {
    auth: { user: any };
    reservas: ReservaProps[];
}

// 2. Componente Principal
const ProgramacionIndex: React.FC<ProgramacionProps> = ({ auth, reservas }) => {

    const getEstadoClass = (estado: string) => {
        switch (estado) {
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getEstadoLabel = (estado: string) => {
         return estado.charAt(0).toUpperCase() + estado.slice(1);
    }

    const handleCancel = (reservaId: number) => {
        if (confirm('¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.')) {
            
            router.delete(route('reserva.cancelar', { reserva: reservaId }), {
                onSuccess: () => {
                    // La página se recargará automáticamente con Inertia
                },
                onError: (errors) => {
                    // Muestra errores de antelación o permisos
                    alert(errors.error || 'Ocurrió un error al intentar cancelar la cita.');
                }
            });
        }
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Programación de Citas</h2>}>
            <Head title="Mis Citas" />
            
           <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                            Tus Próximas Citas ({reservas.length})
                        </h1>

                        {reservas.length === 0 ? (
                            // ... (Div de "No hay reservas" se mantiene)
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-dashed border-2 text-gray-500">
                                <FaCalendarCheck className="w-10 h-10 mx-auto mb-3" />
                                <p className="text-xl font-medium">No tienes ninguna reserva agendada.</p>
                                <Link href={route('dashboard')} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                                    ¡Reserva tu primer servicio ahora!
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reservas.map((reserva) => {
                                    // Determinar si la cita es FUTURA y CONFIRMADA
                                    const isCancellable = reserva.estado === 'confirmada' && new Date(reserva.fecha_inicio) > new Date();
                                    
                                    return (
                                        <div key={reserva.id} className="p-5 border rounded-lg shadow-sm hover:shadow-md transition duration-200">
                                            
                                            {/* ... (Detalles de la reserva se mantienen) ... */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="text-xl font-bold text-indigo-600">
                                                    {reserva.servicio}
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoClass(reserva.estado)}`}>
                                                    {getEstadoLabel(reserva.estado)}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-y-2 text-gray-700 text-sm">
                                                <p className="flex items-center"><FaClock className="mr-2 text-indigo-400" /> 
                                                    <span className="font-semibold">Inicio:</span> {new Date(reserva.fecha_inicio).toLocaleDateString()} a las {new Date(reserva.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                
                                                <p className="flex items-center"><FaUserTie className="mr-2 text-indigo-400" /> 
                                                    <span className="font-semibold">Barbero:</span> {reserva.barbero}
                                                </p>

                                                <p className="flex items-center"><FaTag className="mr-2 text-indigo-400" /> 
                                                    <span className="font-semibold">Costo:</span> {formatCurrency(reserva.precio)}
                                                </p>
                                            </div>
                                            
                                            {/* Botón de CANCELAR CONDICIONAL */}
                                            {isCancellable && (
                                                <div className="mt-4 pt-4 border-t flex justify-end">
                                                    <button 
                                                        onClick={() => handleCancel(reserva.id)} 
                                                        className="text-sm text-red-600 hover:text-red-800 font-medium transition"
                                                    >
                                                        Cancelar Cita
                                                    </button>
                                                </div>
                                            )}
                                            
                                        </div>
                                    )})}
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProgramacionIndex;