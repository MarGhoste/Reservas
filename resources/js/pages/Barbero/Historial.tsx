import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/Utils/formatters';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, History, User } from 'lucide-react';

// --- INTERFACES ---
interface HistorialCita {
    id: number;
    fecha_hora: string;
    servicio_name: string;
    servicio_precio: number;
    cliente_name: string;
    duration: number;
    estado: string;
}

// La prop 'historialCitas' viene paginada (Inertia/Laravel)
interface HistorialProps {
    auth: { user: any };
    historialCitas: {
        data: HistorialCita[];
        links: any[]; // Links de paginación
        // ... otras propiedades de paginación (current_page, last_page, etc.)
    };
}

export default function Historial({ auth, historialCitas }: HistorialProps) {
    // Función auxiliar para renderizar el badge de estado
    const renderStatusBadge = (estado: string) => {
        const label =
            estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ');

        switch (estado) {
            case 'completada':
                return (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">
                        {label}
                    </Badge>
                );
            case 'cancelada':
                return <Badge variant="destructive">{label}</Badge>;
            case 'no_show':
                return (
                    <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                        {label}
                    </Badge>
                );
            default:
                return <Badge variant="outline">{label}</Badge>;
        }
    };

    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold">
                    Mi Historial de Servicios
                </h2>
            }
        >
            <Head title="Historial Barbero" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Historial de Citas Pasadas
                            </CardTitle>
                            <CardDescription>
                                Consulta el registro de todos tus servicios
                                realizados.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha y Hora</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Servicio</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historialCitas.data.length > 0 ? (
                                            historialCitas.data.map((cita) => (
                                                <TableRow key={cita.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {cita.fecha_hora}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            {cita.cliente_name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {
                                                                    cita.servicio_name
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Clock className="h-3 w-3" />{' '}
                                                                {cita.duration}{' '}
                                                                min
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(
                                                            cita.servicio_precio,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {renderStatusBadge(
                                                            cita.estado,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="h-24 text-center text-muted-foreground"
                                                >
                                                    No hay historial de citas
                                                    completadas.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginación */}
                            <div className="mt-6">
                                <Pagination links={historialCitas.links} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
