// resources/js/Pages/Servicios/Index.tsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';


import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/Utils/formatters';

// 1. INTERFACES DE TYPESCRIPT

// Define la forma de los datos del servicio que vienen de Laravel
interface Servicio {
    id: number;
    nombre: string;
    precio: number;
    duracion_minutos: number;
}

// Define la forma de las props que recibe el componente principal
interface ServiciosProps {
    auth: { user: any }; // Si usas Laravel Auth, o ajusta si no usas 'auth'
    servicios: Servicio[];
}

// Componente individual de la Tarjeta de Servicio (TypeScript)
const ServicioCard: React.FC<{ servicio: Servicio }> = ({ servicio }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
            {/* Simulación de Imagen del Servicio */}
            <div className="h-40 bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55 2.275a.5.5 0 010 .89L15 16l-3.5 3.5a1 1 0 01-1.414 0l-3.5-3.5-3.5-3.5a1 1 0 010-1.414l3.5-3.5L15 6.5l4.55-2.275a.5.5 0 010 .89L15 10z"></path></svg>
            </div>

            <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{servicio.nombre}</h3>
                
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>
                        <span className="font-semibold">Precio:</span> {formatCurrency(servicio.precio)}
                    </p>
                    <p>
                        <span className="font-semibold">Duración:</span> {servicio.duracion_minutos} minutos
                    </p>
                </div>
                
                {/* Botón para Iniciar la Reserva */}
                {/* Asegúrate de que 'barberia.reservacion' exista en tu routes/web.php */}
                <Link
                    href={route('barberia.reservacion', { servicio_id: servicio.id })}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                    Reservar Ahora
                </Link>
            </div>
        </div>
    );
};

// Componente Principal de la Página de Servicios (TypeScript)
const ServiciosIndex: React.FC<ServiciosProps> = ({ auth, servicios }) => {
    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Servicios Disponibles</h2>}>
            <Head title="Nuestros Servicios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">¡Elige tu Estilo!</h1>
                        <p className="mt-2 text-xl text-gray-600">Revisa nuestra lista de servicios y comienza tu reserva.</p>
                    </div>

                    {servicios.length > 0 ? (
                        // Cuadrícula de Servicios
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {servicios.map((servicio) => (
                                <ServicioCard key={servicio.id} servicio={servicio} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 border-4 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500 text-lg">Actualmente no hay servicios activos disponibles.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default ServiciosIndex;

// NOTA ADICIONAL: Si aún no tienes un archivo de utilidades, puedes crearlo:
// resources/js/Utils/formatters.ts o .js
/* export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency',
        currency: 'USD', 
    }).format(amount);
};
*/