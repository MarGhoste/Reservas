import { Footer } from '@/components/footer';
import InputError from '@/components/input-error';
import { Navigation } from '@/components/navigation';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import '../../../css/estilobarbeshop.css';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <div className="theme-barbershop relative flex min-h-screen flex-col bg-background text-foreground">
            <Head title="Log in" />
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
                        <h1 className="text-2xl font-bold">
                            Inicia sesión en tu cuenta
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ingresa tu correo y contraseña para iniciar sesión
                        </p>
                    </div>
                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Correo electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@ejemplo.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Contraseña
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm"
                                                    tabIndex={5}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Contraseña"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember">
                                            Recuérdame
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Ingresar
                                    </Button>
                                </div>

                                {canRegister && (
                                    <div className="text-center text-sm text-muted-foreground">
                                        ¿No tienes una cuenta?{' '}
                                        <TextLink
                                            href={register()}
                                            tabIndex={6}
                                        >
                                            Regístrate
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
