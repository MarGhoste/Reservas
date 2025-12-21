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
import { Head } from '@inertiajs/react';
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
    auth: { user: any };
    reservasHoy: Reserva[];
    fechaActual: string;
}

function handleComplete(reservationId: number) {
    // Implementation for handling completion of a reservation
}

export default function Agenda({
    auth,
    reservasHoy,
    fechaActual,
}: AgendaProps) {
    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Gestión de Citas
                </h2>
            }
        >
            <Head title="Agenda Barbero" />

            <div className="min-h-screen bg-background py-16 font-sans text-foreground">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="mb-16 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                        <div className="space-y-3">
                            <h1 className="text-5xl leading-none font-black tracking-tight text-slate-900">
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
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
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
                                        <div className="flex flex-col items-center justify-center border-b border-border/60 bg-slate-50/50 p-8 md:w-40 md:border-r md:border-b-0">
                                            <span className="text-3xl leading-none font-black tracking-tighter text-slate-900">
                                                {reserva.fecha_inicio_hora}
                                            </span>
                                            <span className="mt-3 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                                HOLA INICIO
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
                                                    <CardTitle className="text-3xl font-black tracking-tight text-slate-900">
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
                                                    <div className="rounded-xl bg-slate-100 p-2 transition-colors group-hover/info:bg-primary/10">
                                                        <Mail
                                                            size={16}
                                                            className="text-slate-400 group-hover/info:text-primary"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold tracking-tight">
                                                        {reserva.cliente_email}
                                                    </span>
                                                </div>
                                                <div className="group/info flex items-center gap-3">
                                                    <div className="rounded-xl bg-slate-100 p-2 transition-colors group-hover/info:bg-primary/10">
                                                        <Scissors
                                                            size={16}
                                                            className="text-slate-400 group-hover/info:text-primary"
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
                                                        <Button className="h-12 rounded-2xl bg-slate-900 px-8 text-[11px] font-black tracking-widest text-white uppercase shadow-lg shadow-slate-200 transition-all duration-300 hover:scale-105 hover:bg-primary">
                                                            Completar Servicio
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-2xl border-slate-200 bg-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-xl font-bold text-slate-900">
                                                                ¿Servicio
                                                                terminado?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-slate-500">
                                                                Confirmas que
                                                                has finalizado
                                                                el corte de{' '}
                                                                <span className="font-bold text-slate-900">
                                                                    {
                                                                        reserva.cliente_name
                                                                    }
                                                                </span>
                                                                .
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-lg border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                                                                Cancelar
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleComplete(
                                                                        reserva.id,
                                                                    )
                                                                }
                                                                className="rounded-lg bg-slate-900 text-[10px] font-bold text-white uppercase hover:bg-indigo-600"
                                                            >
                                                                Confirmar
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
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                                    <Scissors
                                        size={32}
                                        className="text-slate-300"
                                    />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-slate-900">
                                    Sin citas hoy
                                </h3>
                                <p className="max-w-xs text-center font-medium text-slate-500">
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
