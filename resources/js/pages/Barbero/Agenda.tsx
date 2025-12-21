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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronRight,
    Clock,
    Mail,
    Scissors,
    User,
} from 'lucide-react';

// --- INTERFACES ---
interface Reserva {
    id: number;
    fecha_inicio_hora: string;
    fecha_fin_hora: string;
    servicio_name: string;
    cliente_name: string;
    cliente_email: string;
    duration: number;
    estado: string;
    fecha_inicio_raw: string;
}

interface AgendaProps {
    auth: { user: any };
    reservasHoy: Reserva[];
    fechaActual: string;
}

export default function Agenda({
    auth,
    reservasHoy,
    fechaActual,
}: AgendaProps) {
    const handleComplete = (id: number) => {
        router.put(
            route('reservas.completar', id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Tu Agenda de Hoy
                </h2>
            }
        >
            <Head title="Agenda Barbero" />

            <div className="min-h-screen bg-slate-50/50 py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header de la Agenda */}
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                {fechaActual}
                            </h1>
                            <p className="mt-1 text-lg text-slate-500">
                                Tienes{' '}
                                <span className="font-bold text-indigo-600">
                                    {reservasHoy.length} citas
                                </span>{' '}
                                programadas para hoy.
                            </p>
                        </div>
                    </div>

                    {/* --- LISTADO DE CITAS --- */}
                    <div className="grid gap-6">
                        {reservasHoy.length > 0 ? (
                            reservasHoy.map((reserva) => (
                                <Card
                                    key={reserva.id}
                                    className="overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Barra Lateral de Hora */}
                                        <div className="flex flex-col items-center justify-center bg-slate-900 p-4 text-white md:w-32">
                                            <span className="text-2xl font-bold">
                                                {reserva.fecha_inicio_hora}
                                            </span>
                                            <span className="text-xs tracking-wider text-slate-400 uppercase">
                                                Inicio
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2 text-xl text-indigo-700">
                                                            <Scissors
                                                                size={18}
                                                            />
                                                            {
                                                                reserva.servicio_name
                                                            }
                                                        </CardTitle>
                                                        <CardDescription className="mt-1 flex items-center gap-1">
                                                            <Clock size={14} />
                                                            Termina a las{' '}
                                                            {
                                                                reserva.fecha_fin_hora
                                                            }{' '}
                                                            ({reserva.duration}{' '}
                                                            min)
                                                        </CardDescription>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            reserva.estado ===
                                                            'confirmada'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            reserva.estado ===
                                                            'confirmada'
                                                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                                                : ''
                                                        }
                                                    >
                                                        {reserva.estado.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="grid gap-4 py-2 text-sm md:grid-cols-2">
                                                    <div className="flex items-center gap-3 text-slate-600">
                                                        <div className="rounded-full bg-slate-100 p-2">
                                                            <User size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {
                                                                    reserva.cliente_name
                                                                }
                                                            </p>
                                                            <p className="text-xs">
                                                                Cliente
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-600">
                                                        <div className="rounded-full bg-slate-100 p-2">
                                                            <Mail size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">
                                                                {
                                                                    reserva.cliente_email
                                                                }
                                                            </p>
                                                            <p className="text-xs">
                                                                Contacto
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Acciones */}
                                                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        Ver Detalles{' '}
                                                        <ChevronRight
                                                            size={14}
                                                        />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                size="sm"
                                                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                                            >
                                                                <CheckCircle2
                                                                    size={16}
                                                                />{' '}
                                                                Marcar
                                                                Completada
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    ¿Completar
                                                                    cita?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    ¿Estás
                                                                    seguro de
                                                                    que quieres
                                                                    marcar esta
                                                                    cita como
                                                                    completada?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancelar
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleComplete(
                                                                            reserva.id,
                                                                        )
                                                                    }
                                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    Confirmar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-2 border-dashed bg-slate-50/50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                                        <CheckCircle2
                                            size={48}
                                            className="text-slate-300"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        ¡Día Libre de Citas!
                                    </h2>
                                    <p className="mt-2 max-w-xs text-slate-500">
                                        No tienes citas programadas para hoy,{' '}
                                        {fechaActual}. Aprovecha para descansar
                                        o organizar tu espacio.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
