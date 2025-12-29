// resources/js/Pages/Servicios/Showcase.tsx

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type User } from '@/types';
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
    imagen_url: string | null; // Campo para la URL de la imagen
    duracion_minutos: number;
}

// Define la forma de las props que recibe el componente principal
interface ServiciosShowcaseProps {
    auth: { user: User | null };
    servicios: Servicio[];
}

// 2. Componente Individual de la Tarjeta de Servicio (Showcase)
const ServicioShowcaseCard: React.FC<{ servicio: Servicio }> = ({
    servicio,
}) => {
    return (
        <Card className="flex flex-col overflow-hidden text-center transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
            {/* Contenedor de la Imagen */}
            <div className="h-48 w-full bg-muted">
                {servicio.imagen_url ? (
                    <img
                        src={
                            servicio.imagen_url.startsWith('http')
                                ? servicio.imagen_url
                                : `/storage/${servicio.imagen_url}`
                        }
                        alt={`Imagen de ${servicio.nombre}`}
                        className="h-full w-full object-contain p-2" // Centra la imagen sin recortarla
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Scissors className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
            </div>
            <CardHeader className="pt-6">
                <CardTitle className="font-serif text-3xl font-medium">
                    {servicio.nombre}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow px-6 pb-4">
                <p className="leading-relaxed text-muted-foreground">
                    {servicio.descripcion}
                </p>
            </CardContent>

            <CardFooter className="mt-auto flex w-full justify-center space-x-6 border-t bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
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
                <h2 className="text-xl leading-tight font-semibold">
                    Nuestros Servicios
                </h2>
            }
        >
            <Head title="Servicios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="font-serif text-5xl leading-tight font-bold">
                            Descubre Nuestros Estilos
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
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
                        <Card className="border-2 border-dashed bg-muted/50">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-xl font-medium text-muted-foreground">
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
