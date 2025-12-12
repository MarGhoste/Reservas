import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// Asegúrate de que tienes un componente o función para formatear moneda
// Si no tienes formatCurrency, puedes usar `cita.servicio_precio.toFixed(2)`
import { formatCurrency } from '@/Utils/formatters'; 
// Asumimos que tienes un componente de paginación
import Pagination from '@/Components/Pagination'; 

// --- INTERFACES ---
interface HistorialCita {
    id: number;
    fecha_hora: string;
    servicio_name: string;
    servicio_precio: number;
    cliente_name: string;
    duration: number;
    estado: string;
}

// La prop 'historialCitas' viene paginada (Inertia/Laravel)
interface HistorialProps {
    auth: { user: any };
    historialCitas: {
        data: HistorialCita[];
        links: any[]; // Links de paginación
        // ... otras propiedades de paginación (current_page, last_page, etc.)
    };
}

export default function Historial({ auth, historialCitas }: HistorialProps) {

    // Función auxiliar para colorear el estado de la cita
    const getStatusClass = (estado: string) => {
        switch (estado) {
            case 'completada': return 'bg-green-100 text-green-800';
            case 'cancelada': return 'bg-red-100 text-red-800';
            case 'no_show': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Historial de Servicios</h2>}>
            <Head title="Historial Barbero" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 md:p-10">
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            Historial de Citas Pasadas
                        </h1>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha y Hora
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Servicio (Duración)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {historialCitas.data.length > 0 ? (
                                        historialCitas.data.map((cita) => (
                                            <tr key={cita.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {cita.fecha_hora}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {cita.cliente_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {cita.servicio_name} ({cita.duration} min)
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                                                    {/* Asegúrate de que formatCurrency esté disponible o usa toFixed(2) */}
                                                    {/* Ejemplo alternativo: `$${cita.servicio_precio.toFixed(2)}` */}
                                                    {formatCurrency(cita.servicio_precio)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(cita.estado)}`}>
                                                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1).replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No hay historial de citas completadas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="mt-8">
                            <Pagination links={historialCitas.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}