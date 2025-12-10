import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

// 1. Ampliamos la interfaz AppLayoutProps para incluir las nuevas propiedades.
interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    // Añadimos 'header' como opcional
    header?: ReactNode; 
    // Añadimos 'user' como opcional. Si tienes un tipo 'User' definido en '@/types', úsalo aquí en lugar de 'any'.
    user?: any; 
}

// 2. El componente ahora acepta estas propiedades explícitamente y las pasa usando ...props
export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
