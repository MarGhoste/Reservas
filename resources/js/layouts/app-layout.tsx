import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import ChatbotFAQ from '@/components/ChatbotFAQ'; // Importación ya presente

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    header?: ReactNode; 
    user?: any; 
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
        
        {/* 🤖 AGREGAMOS EL CHATBOT AQUÍ */}
        {/* Como tiene posición 'fixed', flotará en la esquina inferior derecha */}
        <ChatbotFAQ />
    </AppLayoutTemplate>
);