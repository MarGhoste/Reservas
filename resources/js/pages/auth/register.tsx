import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';
import '../../../css/estilobarbeshop.css';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    return (
        <div className="theme-barbershop relative flex min-h-screen flex-col bg-background text-foreground">
            <Head title="Register" />
            <Navigation />

            <main className="relative flex flex-1 items-center justify-center overflow-hidden py-32">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/luxury.jpg"
                        alt="Marco's Cut barber shop interior"
                        className="h-full w-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
                </div>

                <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-background/95 p-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">Crear una cuenta</h1>

                        <p className="text-sm text-muted-foreground">
                            Ingrese sus datos a continuación para crear su
                            cuenta
                        </p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre</Label>

                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Nombre completo"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Dirección de correo electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@ejemplo.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="contraseña"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirmar contraseña
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirmar contraseña"
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full"
                                        tabIndex={5}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Crear una cuenta
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    ¿Ya tienes una cuenta?{' '}
                                    <TextLink href={login()} tabIndex={6}>
                                        Iniciar sesión
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
