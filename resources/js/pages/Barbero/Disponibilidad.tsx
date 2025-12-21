// resources/js/Pages/Barbero/Disponibilidad.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import React from 'react';
// Shadcn UI Components
import InputError from '@/components/InputError'; // Keep this for now
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
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarOff, CalendarPlus, Trash2 } from 'lucide-react';

// --- INTERFACES ---
interface Ausencia {
    id: number;
    fecha: string; // Formato legible (dddd, D de MMMM YYYY)
    motivo: string;
    fecha_raw: string; // YYYY-MM-DD
}

interface DisponibilidadProps {
    auth: { user: any };
    misAusencias: Ausencia[];
}

export default function Disponibilidad({
    auth,
    misAusencias,
}: DisponibilidadProps) {
    // Configuración del formulario con Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        fecha: '',
        motivo: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('barbero.disponibilidad.store'), {
            onSuccess: () => reset('fecha', 'motivo'),
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(route('barbero.disponibilidad.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold">
                    Mi Disponibilidad Personal
                </h2>
            }
        >
            <Head title="Disponibilidad Barbero" />

            <div className="grid gap-8 md:grid-cols-2">
                {/* SECCIÓN 1: Formulario para Añadir Ausencia */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarPlus className="size-5" />
                            Bloquear un Día Personal
                        </CardTitle>
                        <CardDescription>
                            Añade una fecha en la que no estarás disponible. Los
                            clientes no podrán reservar en este día.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fecha">Fecha de Ausencia</Label>
                                <Input
                                    id="fecha"
                                    type="date"
                                    name="fecha"
                                    value={data.fecha}
                                    onChange={(e) =>
                                        setData('fecha', e.target.value)
                                    }
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <InputError message={errors.fecha} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="motivo">
                                    Motivo de la Ausencia
                                </Label>
                                <Input
                                    id="motivo"
                                    type="text"
                                    name="motivo"
                                    value={data.motivo}
                                    placeholder="Ej: Cita médica, día libre..."
                                    onChange={(e) =>
                                        setData('motivo', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.motivo} />
                            </div>

                            <div className="flex items-center justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Bloqueando...'
                                        : 'Bloquear Día'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* SECCIÓN 2: Lista de Ausencias Futuras */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarOff className="size-5" />
                            Mis Días Bloqueados
                        </CardTitle>
                        <CardDescription>
                            Estos son los días que has marcado como no
                            disponibles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {misAusencias.length > 0 ? (
                            <ul className="space-y-3">
                                {misAusencias.map((ausencia) => (
                                    <li
                                        key={ausencia.id}
                                        className="flex items-center justify-between rounded-lg border bg-secondary/30 p-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-secondary-foreground">
                                                {ausencia.fecha}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {ausencia.motivo}
                                            </p>
                                        </div>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        ¿Estás seguro?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede
                                                        deshacer. Se eliminará
                                                        la ausencia para el día{' '}
                                                        <span className="font-bold">
                                                            {ausencia.fecha}
                                                        </span>{' '}
                                                        y volverá a estar
                                                        disponible para
                                                        reservas.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                ausencia.id,
                                                            )
                                                        }
                                                        // Prueba eliminando 'bg-destructive' y usando la clase de botón directamente
                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                    >
                                                        Sí, eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
                                <p className="font-medium">
                                    ¡Genial! No tienes días de ausencia.
                                </p>
                                <p className="text-sm">
                                    Tu agenda está completamente abierta para
                                    reservas.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
