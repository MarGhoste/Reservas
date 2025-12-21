// resources/js/Pages/Servicios/Index.tsx

import { Head, Link } from '@inertiajs/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/Utils/formatters';
import { Banknote, Clock, Scissors } from 'lucide-react';

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
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            {/* Simulación de Imagen del Servicio */}
            <div className="flex h-40 items-center justify-center bg-slate-100">
                <Scissors className="h-12 w-12 text-slate-400" />
            </div>

            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">
                    {servicio.nombre}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                        <Banknote className="mr-2 h-4 w-4" />
                        Precio
                    </span>
                    <span className="font-semibold text-slate-900">
                        {formatCurrency(servicio.precio)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        Duración
                    </span>
                    <span className="font-semibold text-slate-900">
                        {servicio.duracion_minutos} min
                    </span>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    asChild
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    <Link
                        href={route('barberia.reservacion', {
                            servicio_id: servicio.id,
                        })}
                    >
                        Reservar Ahora
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

// Componente Principal de la Página de Servicios (TypeScript)
const ServiciosIndex: React.FC<ServiciosProps> = ({ auth, servicios }) => {
    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Servicios Disponibles
                </h2>
            }
        >
            <Head title="Nuestros Servicios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            ¡Elige tu Estilo!
                        </h1>
                        <p className="mt-2 text-xl text-gray-600">
                            Revisa nuestra lista de servicios y comienza tu
                            reserva.
                        </p>
                    </div>

                    {servicios.length > 0 ? (
                        // Cuadrícula de Servicios
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {servicios.map((servicio) => (
                                <ServicioCard
                                    key={servicio.id}
                                    servicio={servicio}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border-4 border-dashed border-gray-300 p-10 text-center">
                            <p className="text-lg text-gray-500">
                                Actualmente no hay servicios activos
                                disponibles.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

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
