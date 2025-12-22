import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- INTERFACES (Se mantienen igual) ---
interface DiaIndisponible {
    date: string; // YYYY-MM-DD
    title: string;
    type: 'cierre_total' | 'parcial';
    barberos: string;
}
interface AusenciasProps {
    auth: { user: any };
    diasIndisponibles: DiaIndisponible[];
}

export default function AusenciasIndex({
    auth,
    diasIndisponibles,
}: AusenciasProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Crear un mapa de fechas para acceso rápido (YYYY-MM-DD -> {type, title})
    const absenceMap = useMemo(() => {
        return diasIndisponibles.reduce(
            (acc, item) => {
                acc[item.date] = item;
                return acc;
            },
            {} as Record<string, DiaIndisponible>,
        );
    }, [diasIndisponibles]);

    // Helper para obtener la ausencia de una fecha
    const getAbsence = (d: Date) => {
        const dateString = format(d, 'yyyy-MM-dd');
        return absenceMap[dateString];
    };

    // Modificadores para colorear el calendario
    const modifiers = {
        cierre_total: (d: Date) => getAbsence(d)?.type === 'cierre_total',
        parcial: (d: Date) => getAbsence(d)?.type === 'parcial',
    };

    const modifiersClassNames = {
        cierre_total:
            'bg-red-500 text-white hover:bg-red-600 rounded-md opacity-100',
        parcial:
            'bg-yellow-400 text-black hover:bg-yellow-500 rounded-md opacity-100',
    };

    const selectedAbsence = date ? getAbsence(date) : null;

    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Calendario de Días No Hábiles
                </h2>
            }
        >
            <Head title="Ausencias" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Columna Izquierda: Calendario */}
                        <Card className="h-fit md:col-span-5 lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Calendario</CardTitle>
                                <CardDescription>
                                    Rojo: Cierre total. Amarillo: Parcial.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center p-4">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    locale={es}
                                    modifiers={modifiers}
                                    modifiersClassNames={modifiersClassNames}
                                    className="rounded-md border shadow-sm"
                                />
                            </CardContent>
                        </Card>

                        {/* Columna Derecha: Detalles y Lista */}
                        <div className="space-y-6 md:col-span-7 lg:col-span-8">
                            {/* Detalle del día seleccionado */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {date
                                            ? format(
                                                  date,
                                                  "EEEE, d 'de' MMMM 'de' yyyy",
                                                  { locale: es },
                                              )
                                            : 'Selecciona una fecha'}
                                    </CardTitle>
                                    <CardDescription>
                                        Detalles de disponibilidad
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {selectedAbsence ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        selectedAbsence.type ===
                                                        'cierre_total'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        selectedAbsence.type ===
                                                        'parcial'
                                                            ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                                                            : ''
                                                    }
                                                >
                                                    {selectedAbsence.type ===
                                                    'cierre_total'
                                                        ? 'Cierre Total'
                                                        : 'Ausencia Parcial'}
                                                </Badge>
                                                <span className="text-lg font-semibold">
                                                    {selectedAbsence.title}
                                                </span>
                                            </div>
                                            {selectedAbsence.type ===
                                                'parcial' && (
                                                <p className="text-sm text-muted-foreground">
                                                    Barberos ausentes:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {
                                                            selectedAbsence.barberos
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            No hay ausencias registradas para
                                            este día.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Lista de próximas ausencias */}
                            <Card className="flex h-[400px] flex-col">
                                <CardHeader>
                                    <CardTitle>Próximas Ausencias</CardTitle>
                                    <CardDescription>
                                        Listado completo de días no hábiles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-hidden p-0">
                                    <ScrollArea className="h-full px-6 py-2">
                                        <div className="space-y-4 pb-4">
                                            {diasIndisponibles.length > 0 ? (
                                                diasIndisponibles.map((dia) => (
                                                    <div
                                                        key={dia.date}
                                                        className="flex flex-col justify-between gap-2 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {format(
                                                                    new Date(
                                                                        dia.date +
                                                                            'T00:00:00',
                                                                    ),
                                                                    "d 'de' MMMM, yyyy",
                                                                    {
                                                                        locale: es,
                                                                    },
                                                                )}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {dia.title}
                                                            </p>
                                                            {dia.type ===
                                                                'parcial' && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Ausentes:{' '}
                                                                    {
                                                                        dia.barberos
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                dia.type ===
                                                                'cierre_total'
                                                                    ? 'destructive'
                                                                    : 'outline'
                                                            }
                                                            className={
                                                                dia.type ===
                                                                'parcial'
                                                                    ? 'border-yellow-300 bg-yellow-100 text-yellow-800'
                                                                    : ''
                                                            }
                                                        >
                                                            {dia.type ===
                                                            'cierre_total'
                                                                ? 'Cerrado'
                                                                : 'Parcial'}
                                                        </Badge>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="py-4 text-center text-muted-foreground">
                                                    No hay registros.
                                                </p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
