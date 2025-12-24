// resources/js/Pages/Programacion/Index.tsx

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/Utils/formatters'; // Asumiendo que esta utilidad existe
import { Head, Link, router } from '@inertiajs/react';
import { CalendarCheck, Clock, Tag, User } from 'lucide-react';
import React from 'react';

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
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelada':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getEstadoLabel = (estado: string) => {
        return estado.charAt(0).toUpperCase() + estado.slice(1);
    };

    const handleCancel = (reservaId: number) => {
        router.delete(route('reserva.cancelar', { reserva: reservaId }), {
            onSuccess: () => {
                // La página se recargará automáticamente con Inertia
            },
            onError: (errors) => {
                // Muestra errores de antelación o permisos
                alert(
                    errors.error ||
                        'Ocurrió un error al intentar cancelar la cita.',
                );
            },
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold">
                    Mi Programación de Citas
                </h2>
            }
        >
            <Head title="Mis Citas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">
                            Tus Próximas Citas ({reservas.length})
                        </h1>

                        {reservas.length === 0 ? (
                            // ... (Div de "No hay reservas" se mantiene)
                            <Card className="border-dashed bg-muted/50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <CalendarCheck className="mb-3 h-10 w-10 text-muted-foreground" />
                                    <p className="text-xl font-medium text-muted-foreground">
                                        No tienes ninguna reserva agendada.
                                    </p>
                                    <Button
                                        asChild
                                        variant="link"
                                        className="mt-4 text-primary"
                                    >
                                        <Link href={route('dashboard')}>
                                            ¡Reserva tu primer servicio ahora!
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {reservas.map((reserva) => {
                                    // Determinar si la cita es FUTURA y CONFIRMADA
                                    const isCancellable =
                                        reserva.estado === 'confirmada' &&
                                        new Date(reserva.fecha_inicio) >
                                            new Date();

                                    return (
                                        <Card
                                            key={reserva.id}
                                            className="transition-shadow hover:shadow-md"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <CardTitle className="text-xl font-bold text-primary">
                                                        {reserva.servicio}
                                                    </CardTitle>
                                                    <Badge
                                                        className={`${getEstadoClass(reserva.estado)} hover:${getEstadoClass(reserva.estado)} border-0`}
                                                    >
                                                        {getEstadoLabel(
                                                            reserva.estado,
                                                        )}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 gap-y-2 text-sm text-muted-foreground md:grid-cols-2">
                                                    <p className="flex items-center">
                                                        <Clock className="mr-2 h-4 w-4 text-primary" />
                                                        <span className="mr-1 font-semibold">
                                                            Inicio:
                                                        </span>{' '}
                                                        {new Date(
                                                            reserva.fecha_inicio,
                                                        ).toLocaleDateString()}{' '}
                                                        a las{' '}
                                                        {new Date(
                                                            reserva.fecha_inicio,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </p>

                                                    <p className="flex items-center">
                                                        <User className="mr-2 h-4 w-4 text-primary" />
                                                        <span className="mr-1 font-semibold">
                                                            Barbero:
                                                        </span>{' '}
                                                        {reserva.barbero}
                                                    </p>

                                                    <p className="flex items-center">
                                                        <Tag className="mr-2 h-4 w-4 text-primary" />
                                                        <span className="mr-1 font-semibold">
                                                            Costo:
                                                        </span>{' '}
                                                        {formatCurrency(
                                                            reserva.precio,
                                                        )}
                                                    </p>
                                                </div>

                                                {isCancellable && (
                                                    <div className="mt-4 flex justify-end border-t pt-4">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                >
                                                                    Cancelar
                                                                    Cita
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        ¿Cancelar
                                                                        Cita?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        ¿Estás
                                                                        seguro
                                                                        de que
                                                                        quieres
                                                                        cancelar
                                                                        esta
                                                                        cita?
                                                                        Esta
                                                                        acción
                                                                        no se
                                                                        puede
                                                                        deshacer.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Volver
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleCancel(
                                                                                reserva.id,
                                                                            )
                                                                        }
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Sí,
                                                                        cancelar
                                                                        cita
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProgramacionIndex;
