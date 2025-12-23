'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@inertiajs/react';
import { Menu, Scissors } from 'lucide-react';
import { useState } from 'react';

declare var route: (...args: any[]) => string;

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '#contact', label: 'Contacto' },
    ];

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Scissors className="size-6 text-primary" />
                        <span className="font-sans text-xl font-bold text-foreground">
                            {"Marco's Cut"}
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) =>
                            link.href.startsWith('#') ? (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ),
                        )}
                        <Button
                            asChild
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Link href={route('login')}>Ingresar</Link>
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="size-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[300px] sm:w-[400px]"
                        >
                            <div className="mt-8 flex flex-col gap-6">
                                {navLinks.map((link) =>
                                    link.href.startsWith('#') ? (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg text-foreground transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg text-foreground transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    ),
                                )}
                                <Button
                                    asChild
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href={route('login')}>Ingresar</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
