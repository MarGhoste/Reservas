import ChatbotFAQ from '@/components/ChatbotFAQ';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import '../../css/estilobarbeshop.css';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    header?: ReactNode;
    user?: any;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    // Aplicamos el tema a nivel de layout para que todas las páginas lo hereden.
    // Esto asegura una apariencia consistente en toda la aplicación.
    <div
        className="theme-barbershop min-h-screen bg-cover bg-fixed bg-center"
        style={{
            backgroundImage: "url('/luxury.jpg')",
        }}
    >
        <div className="min-h-screen bg-background/90 text-foreground backdrop-blur-[1px]">
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}

                {/* 🤖 AGREGAMOS EL CHATBOT AQUÍ */}
                {/* Como tiene posición 'fixed', flotará en la esquina inferior derecha */}
                <ChatbotFAQ />
            </AppLayoutTemplate>
        </div>
    </div>
);
