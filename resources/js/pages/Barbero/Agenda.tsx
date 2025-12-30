'use client';

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
import { Card, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Mail, Scissors } from 'lucide-react';

interface Reserva {
    id: number;
    fecha_inicio_hora: string;
    fecha_fin_hora: string;
    duration: number;
    servicio_name: string;
    cliente_name: string;
    cliente_email: string;
    estado: 'confirmada' | 'pendiente' | string;
}
interface AgendaProps {
    auth: { user: User | null };
    reservasHoy: Reserva[];
    fechaActual: string;
}

export default function Agenda({
    auth,
    reservasHoy,
    fechaActual,
}: AgendaProps) {
    const handleComplete = (reservationId: number) => {
        router.post(
            route('barbero.agenda.complete', reservationId),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-bold">Gestión de Citas</h2>}
        >
            <Head title="Agenda Barbero" />

            {/* El fondo y el color del texto principal ya se heredan del AppLayout, por lo que se eliminan clases redundantes */}
            <div className="py-12 font-sans">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="mb-16 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                        <div className="space-y-3">
                            {/* Usamos font-serif y text-primary para consistencia con el Dashboard */}
                            <h1 className="font-serif text-5xl leading-none font-black tracking-tight text-primary">
                                {fechaActual.split(',')[0]}
                            </h1>
                            <p className="text-lg font-medium text-muted-foreground">
                                Hoy tienes{' '}
                                <span className="font-bold text-primary">
                                    {reservasHoy.length} servicios
                                </span>{' '}
                                programados.
                            </p>
                        </div>
                        {/* Reemplazamos colores fijos con variables del tema (bg-card, text-card-foreground) */}
                        <div className="inline-flex items-center gap-2 rounded-2xl border bg-card px-5 py-2.5 text-sm font-bold text-card-foreground shadow-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            {fechaActual}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reservasHoy.length > 0 ? (
                            reservasHoy.map((reserva) => (
                                <Card
                                    key={reserva.id}
                                    className="group overflow-hidden rounded-[2rem] border-border bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)]"
                                >
                                    <div className="flex min-h-[160px] flex-col md:flex-row">
                                        <div className="flex flex-col items-center justify-center border-b border-border/60 bg-muted/50 p-8 md:w-40 md:border-r md:border-b-0">
                                            <span className="text-3xl leading-none font-black tracking-tighter text-foreground">
                                                {reserva.fecha_inicio_hora}
                                            </span>
                                            <span className="mt-3 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                                HORA INICIO
                                            </span>
                                        </div>

                                        <div className="flex flex-1 flex-col p-8 md:p-10">
                                            <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-start">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="rounded-full bg-primary/5 px-3 py-1 text-[10px] font-black tracking-widest text-primary uppercase">
                                                            {
                                                                reserva.servicio_name
                                                            }
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/60">
                                                            • {reserva.duration}{' '}
                                                            MIN
                                                        </span>
                                                    </div>
                                                    <CardTitle className="text-3xl font-black tracking-tight text-card-foreground">
                                                        {reserva.cliente_name}
                                                    </CardTitle>
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-full border-2 px-4 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                                                        reserva.estado ===
                                                        'confirmada'
                                                            ? 'border-emerald-100 bg-emerald-50/50 text-emerald-600'
                                                            : 'border-amber-100 bg-amber-50/50 text-amber-600'
                                                    } `}
                                                >
                                                    {reserva.estado}
                                                </Badge>
                                            </div>

                                            <div className="mb-8 flex flex-wrap items-center gap-8 text-muted-foreground">
                                                <div className="group/info flex items-center gap-3">
                                                    <div className="rounded-xl bg-muted p-2 transition-colors group-hover/info:bg-primary/10">
                                                        <Mail
                                                            size={16}
                                                            className="text-muted-foreground group-hover/info:text-primary"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold tracking-tight">
                                                        {reserva.cliente_email}
                                                    </span>
                                                </div>
                                                <div className="group/info flex items-center gap-3">
                                                    <div className="rounded-xl bg-muted p-2 transition-colors group-hover/info:bg-primary/10">
                                                        <Scissors
                                                            size={16}
                                                            className="text-muted-foreground group-hover/info:text-primary"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold tracking-tight">
                                                        REF: #{reserva.id}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-auto flex items-center justify-end border-t border-border/40 pt-8">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button className="h-12 rounded-2xl px-8 text-[11px] font-black tracking-widest uppercase shadow-lg transition-all duration-300 hover:scale-105">
                                                            Completar Servicio
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                ¿Servicio
                                                                terminado?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Confirmas que
                                                                has finalizado
                                                                el corte de{' '}
                                                                <span className="font-bold text-foreground">
                                                                    {
                                                                        reserva.cliente_name
                                                                    }
                                                                </span>
                                                                .
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancelar
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                asChild
                                                            >
                                                                <Button
                                                                    onClick={() =>
                                                                        handleComplete(
                                                                            reserva.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Confirmar
                                                                </Button>
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-card py-32">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Scissors
                                        size={32}
                                        className="text-muted-foreground"
                                    />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-card-foreground">
                                    Sin citas hoy
                                </h3>
                                <p className="max-w-xs text-center font-medium text-muted-foreground">
                                    Disfruta de tu tiempo libre o prepara tu
                                    equipo para mañana.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
