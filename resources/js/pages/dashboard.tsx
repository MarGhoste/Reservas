import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* El tema 'theme-barbershop' ahora se aplica en AppLayout, por lo que no es necesario aquí. */}
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Encabezado visible para confirmar que la fuente y colores funcionan */}
                <div className="mb-2">
                    <h1 className="font-serif text-2xl font-bold text-primary">
                        Panel de Control
                    </h1>
                    <p className="text-muted-foreground">
                        Bienvenido al sistema de gestión.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                        <h3 className="font-serif text-lg font-semibold text-primary">
                            Clientes
                        </h3>
                        <div className="mt-2 text-3xl font-bold">128</div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                        <h3 className="font-serif text-lg font-semibold text-primary">
                            Citas Hoy
                        </h3>
                        <div className="mt-2 text-3xl font-bold">12</div>
                    </div>
                    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                        <h3 className="font-serif text-lg font-semibold text-primary">
                            Ingresos
                        </h3>
                        <div className="mt-2 text-3xl font-bold">$450</div>
                    </div>
                </div>
                <div className="min-h-[60vh] flex-1 rounded-xl border bg-card p-6 text-card-foreground shadow-sm" />
            </div>
        </AppLayout>
    );
}
