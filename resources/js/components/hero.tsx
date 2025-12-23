import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

declare var route: (...args: any[]) => string;

export function Hero() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/luxury.jpg"
                    alt="Marco's Cut barber shop interior"
                    className="h-full w-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mt-16 px-4 py-32 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 font-sans text-5xl font-bold text-balance text-foreground md:text-6xl lg:text-7xl">
                        {"Bienvenido a Marco's Cut"}
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
                        Experimente la combinación perfecta de artesanía de
                        barbería tradicional y estilo contemporáneo. Donde cada
                        corte es una obra maestra.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="bg-primary text-base text-primary-foreground hover:bg-primary/90"
                        >
                            <Link href={route('register')}>
                                <Calendar className="mr-2 size-5" />
                                Registrarse
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-primary bg-transparent text-base text-primary hover:bg-primary/10"
                        >
                            <Link href={route('login')}>Ingresar</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute right-0 bottom-0 left-0 z-10 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
}
