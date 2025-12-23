import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Navigation } from '@/components/navigation';

// Importamos los estilos específicos para esta página
import '../../css/estilobarbeshop.css';

export default function Page() {
    return (
        /* 
           Aplicamos 'theme-barberia' y 'dark' aquí una sola vez.
           Esto inyecta tus colores en TODO lo que esté adentro.
        */
        <main className="theme-barbershop min-h-screen bg-background text-foreground">
            <Navigation />
            <Hero />

            <Footer />
        </main>
    );
}
