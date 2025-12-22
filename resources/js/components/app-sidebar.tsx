import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
// Añadimos íconos necesarios para el panel Barbero
import {
    AlertTriangle,
    Calendar,
    History,
    LayoutGrid,
    Scissors,
} from 'lucide-react';
import AppLogo from './app-logo';

declare var route: (...args: any[]) => string;

// --- INTERFAZ DE USUARIO (NECESARIA PARA TIPADO EN TYPESCRIPT) ---
interface User {
    id: number;
    name: string;
    email: string;
    es_personal: boolean;
    // Esto es vital si usas Spatie y lo expones al frontend
    hasRole: (role: string | string[]) => boolean;
    // Si no expones hasRole, usaríamos solo es_personal: boolean
}

const mainNavItems: NavItem[] = [
    //// 1. Catálogo de Servicios (Dashboard)
    {
        title: 'Servicios',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    // 2. Catalogo (Showcase)
    {
        title: 'Catalogo',
        href: route('barberia.servicios.showcase'),
        icon: Scissors,
    },
    // 3. Mi Programación
    {
        title: 'Mi Programación',
        href: route('barberia.programacion'),
        icon: Calendar,
    },
    // 4. Días No Hábiles (Calendario público/general)
    {
        title: 'Días No Hábiles',
        href: route('barberia.calendario.ausencias'),
        icon: AlertTriangle,
    },
];

// --- MODIFICACIÓN CLAVE: ACEPTAR EL OBJETO 'user' ---
// Debes asegurarte de que tu AuthenticatedLayout le pase la prop 'user' a AppSidebar.
export function AppSidebar({ user }: { user: User }) {
    // --- DEBUG: Imprime el objeto de usuario en la consola del navegador ---
    console.log('Usuario recibido en AppSidebar:', user);

    // LÓGICA DE ROLES: Determina si el menú del barbero debe mostrarse.
    const isBarber = user ? user.es_personal : false;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* 1. MENÚ PRINCIPAL (CLIENTE/PÚBLICO) */}
                <NavMain items={mainNavItems} />

                {/* 2. MENÚ DEL BARBERO (CONDICIONAL) */}
                {isBarber && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                            Panel Operativo
                        </h4>
                        <SidebarMenu>
                            {/* AGENDA PERSONAL */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={route('barbero.agenda')}
                                        prefetch
                                    >
                                        <Calendar className="h-5 w-5" />
                                        <span>Agenda de Hoy</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* HISTORIAL DE CITAS */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={route('barbero.historial')}
                                        prefetch
                                    >
                                        <History className="h-5 w-5" />
                                        <span>Mi Historial</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* GESTIÓN DE DISPONIBILIDAD */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={route('barbero.disponibilidad')}
                                        prefetch
                                    >
                                        <AlertTriangle className="h-5 w-5" />
                                        <span>Mi Disponibilidad</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
