import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem, type User } from '@/types';
import { type ReactNode } from 'react';

interface AppSidebarLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: User | null;
}

export default function AppSidebarLayout({
    children,
    breadcrumbs,
    user, // <-- 2. RECIBIR LA PROP 'user'
}: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar user={user!} /> {/* <-- 3. PASAR 'user' AL SIDEBAR */}
            <div className="flex flex-1 flex-col">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <AppContent variant="sidebar">
                    <div className="w-full px-4 py-6 md:px-6 md:py-8">
                        {children}
                    </div>
                </AppContent>
            </div>
        </AppShell>
    );
}
