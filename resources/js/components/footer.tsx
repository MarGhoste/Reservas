import { Separator } from '@/components/ui/separator';
import {
    Clock,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';

export function Footer() {
    return (
        <footer id="contact" className="border-t border-border bg-secondary/30">
            <div className="container px-4 py-12 lg:px-8 lg:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Location */}
                    <div>
                        <h3 className="mb-4 font-sans text-lg font-bold text-foreground">
                            Localizacion
                        </h3>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                            <address className="not-italic">
                                Callao
                                <br />
                                Ventanilla
                                <br />
                                Los Alamos, NY 10001
                            </address>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 font-sans text-lg font-bold text-foreground">
                            Contactanos
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="size-5 shrink-0 text-primary" />
                                <a
                                    href="tel:+12125551234"
                                    className="transition-colors hover:text-primary"
                                >
                                    +51 902079944
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="size-5 shrink-0 text-primary" />
                                <a
                                    href="mailto:info@gentlemanscut.com"
                                    className="transition-colors hover:text-primary"
                                >
                                    marcoscarpiocorazon@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="mb-4 font-sans text-lg font-bold text-foreground">
                            Horario de atencion:
                        </h3>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                            <div className="space-y-1 text-muted-foreground">
                                <p>Lunes - Viernes: 9am - 8pm</p>
                                <p>Sabado: 9am - 6pm</p>
                            </div>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="mb-4 font-sans text-lg font-bold text-foreground">
                            Siguenos
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                                aria-label="Facebook"
                            >
                                <Facebook className="size-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                                aria-label="Instagram"
                            >
                                <Instagram className="size-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                                aria-label="Twitter"
                            >
                                <Twitter className="size-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 bg-border" />

                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} {"Marco's Cut"}. Todo
                        lo derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
