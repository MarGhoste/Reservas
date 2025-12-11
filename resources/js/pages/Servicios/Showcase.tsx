// resources/js/Pages/Servicios/Showcase.tsx

import React from 'react';
import { Head } from '@inertiajs/react'; // No necesitamos Link si no hay botones de acción
import AppLayout from '@/layouts/app-layout'; 
import { formatCurrency } from '@/Utils/formatters'; 

// 1. INTERFACES DE TYPESCRIPT

// Define la forma de los datos del servicio
interface Servicio {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string; // Nueva propiedad
    duracion_minutos: number;
}

// Define la forma de las props que recibe el componente principal
interface ServiciosShowcaseProps {
    auth: { user: any };
    servicios: Servicio[];
}

// 2. Componente Individual de la Tarjeta de Servicio (Showcase)
const ServicioShowcaseCard: React.FC<{ servicio: Servicio }> = ({ servicio }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.01] hover:shadow-2xl border border-gray-100 p-6 flex flex-col items-center text-center">
            
            {/* Icono o Imagen Sugerente */}
            <div className="bg-indigo-50 text-indigo-600 rounded-full p-4 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>

            <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{servicio.nombre}</h3>
            
            <p className="text-gray-600 mb-4 flex-grow">{servicio.descripcion}</p> {/* Descripción */}

            <div className="flex items-center justify-center space-x-4 text-lg font-semibold text-gray-800 mt-4">
                <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd"></path></svg>
                    {servicio.duracion_minutos} min
                </span>
                <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 7a1 1 0 00-1 1v4a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1H7z" clipRule="evenodd"></path></svg>
                    {formatCurrency(servicio.precio)}
                </span>
            </div>
        </div>
    );
};

// 3. Componente Principal de la Página de Servicios Showcase
export default function ServiciosShowcase({ auth, servicios }: ServiciosShowcaseProps) {
    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nuestros Servicios</h2>}>
            <Head title="Servicios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                            Descubre Nuestros Estilos
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            Explora la gama completa de servicios de barbería que ofrecemos, diseñados para realzar tu estilo.
                        </p>
                    </div>

                    {servicios.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {servicios.map((servicio) => (
                                <ServicioShowcaseCard key={servicio.id} servicio={servicio} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border-4 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-gray-500 text-xl font-medium">
                                En este momento, no hay servicios disponibles para mostrar.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}