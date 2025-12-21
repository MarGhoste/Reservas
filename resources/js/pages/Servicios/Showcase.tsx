// resources/js/Pages/Servicios/Showcase.tsx

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/Utils/formatters';
import { Head } from '@inertiajs/react'; // No necesitamos Link si no hay botones de acción
import { Banknote, Clock, Scissors } from 'lucide-react';
import React from 'react';

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
const ServicioShowcaseCard: React.FC<{ servicio: Servicio }> = ({
    servicio,
}) => {
    return (
        <Card className="flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
            <CardHeader className="flex flex-col items-center pb-2">
                {/* Icono o Imagen Sugerente */}
                <div className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-600">
                    <Scissors className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                    {servicio.nombre}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-slate-600">{servicio.descripcion}</p>
            </CardContent>

            <CardFooter className="mt-auto flex w-full justify-center space-x-6 pt-4 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-emerald-500" />
                    {servicio.duracion_minutos} min
                </span>
                <span className="flex items-center gap-1.5">
                    <Banknote className="h-5 w-5 text-amber-500" />
                    {formatCurrency(servicio.precio)}
                </span>
            </CardFooter>
        </Card>
    );
};

// 3. Componente Principal de la Página de Servicios Showcase
export default function ServiciosShowcase({
    auth,
    servicios,
}: ServiciosShowcaseProps) {
    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Nuestros Servicios
                </h2>
            }
        >
            <Head title="Servicios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="text-5xl leading-tight font-extrabold text-gray-900">
                            Descubre Nuestros Estilos
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
                            Explora la gama completa de servicios de barbería
                            que ofrecemos, diseñados para realzar tu estilo.
                        </p>
                    </div>

                    {servicios.length > 0 ? (
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {servicios.map((servicio) => (
                                <ServicioShowcaseCard
                                    key={servicio.id}
                                    servicio={servicio}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-2 border-dashed bg-slate-50">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-xl font-medium text-slate-500">
                                    En este momento, no hay servicios
                                    disponibles para mostrar.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
