import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Mail, Scissors, CheckCircle2, ChevronRight } from "lucide-react";

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

export default function Agenda({ auth, reservasHoy, fechaActual }: AgendaProps) {
    
    const handleComplete = (id: number) => {
        // En un futuro paso, cambiaremos este confirm por un Modal de Shadcn
        if (window.confirm('¿Estás seguro de que quieres marcar esta cita como completada?')) {
            router.put(route('reservas.completar', id), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tu Agenda de Hoy</h2>}>
            <Head title="Agenda Barbero" />

            <div className="py-12 bg-slate-50/50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header de la Agenda */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                {fechaActual}
                            </h1>
                            <p className="text-slate-500 text-lg mt-1">
                                Tienes <span className="font-bold text-indigo-600">{reservasHoy.length} citas</span> programadas para hoy.
                            </p>
                        </div>
                    </div>

                    {/* --- LISTADO DE CITAS --- */}
                    <div className="grid gap-6">
                        {reservasHoy.length > 0 ? (
                            reservasHoy.map(reserva => (
                                <Card key={reserva.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row">
                                        
                                        {/* Barra Lateral de Hora */}
                                        <div className="bg-slate-900 md:w-32 flex flex-col justify-center items-center p-4 text-white">
                                            <span className="text-2xl font-bold">{reserva.fecha_inicio_hora}</span>
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">Inicio</span>
                                        </div>

                                        <div className="flex-1">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-xl text-indigo-700 flex items-center gap-2">
                                                            <Scissors size={18} />
                                                            {reserva.servicio_name}
                                                        </CardTitle>
                                                        <CardDescription className="flex items-center gap-1 mt-1">
                                                            <Clock size={14} />
                                                            Termina a las {reserva.fecha_fin_hora} ({reserva.duration} min)
                                                        </CardDescription>
                                                    </div>
                                                    <Badge 
                                                        variant={reserva.estado === 'confirmada' ? 'default' : 'secondary'}
                                                        className={reserva.estado === 'confirmada' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                                                    >
                                                        {reserva.estado.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="grid md:grid-cols-2 gap-4 py-2 text-sm">
                                                    <div className="flex items-center gap-3 text-slate-600">
                                                        <div className="p-2 bg-slate-100 rounded-full">
                                                            <User size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{reserva.cliente_name}</p>
                                                            <p className="text-xs">Cliente</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-600">
                                                        <div className="p-2 bg-slate-100 rounded-full">
                                                            <Mail size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{reserva.cliente_email}</p>
                                                            <p className="text-xs">Contacto</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Acciones */}
                                                <div className="mt-6 flex flex-wrap gap-3 justify-end border-t pt-4">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        Ver Detalles <ChevronRight size={14} />
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleComplete(reserva.id)}
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                                                    >
                                                        <CheckCircle2 size={16} /> Marcar Completada
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-dashed border-2 bg-slate-50/50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                        <CheckCircle2 size={48} className="text-slate-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">¡Día Libre de Citas!</h2>
                                    <p className="text-slate-500 max-w-xs mt-2">
                                        No tienes citas programadas para hoy, {fechaActual}. Aprovecha para descansar o organizar tu espacio.
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