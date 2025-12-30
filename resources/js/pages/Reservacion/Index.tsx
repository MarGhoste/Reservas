// resources/js/Pages/Reservacion/Index.tsx

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios'; // Importamos Axios para la llamada API asíncrona
import React, { useEffect, useState } from 'react';

// --- INTERFACES DE TYPESCRIPT (Se mantienen igual) ---
interface ServicioProps {
    id: number;
    nombre: string;
    duracion_minutos: number;
    precio: number;
}
interface BarberoProps {
    id: number;
    name: string;
}

interface ReservacionProps {
    auth: { user: User | null };
    servicio: ServicioProps;
    barberos: BarberoProps[];
}

interface FormData {
    servicio_id: number;
    barbero_id: number | null;
    fecha_inicio: string | null;
    cliente_id?: number | null;
}

// --- CONSTANTES ---
const STEPS = {
    BARBERO: 1,
    FECHA_HORA: 2,
    CONFIRMACION: 3,
};

// --- COMPONENTES AUXILIARES (Se mantienen igual) ---
const StepIndicator: React.FC<{
    step: number;
    currentStep: number;
    label: string;
}> = ({ step, currentStep, label }) => {
    // ... (El código de StepIndicator se mantiene)
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;
    const baseClasses =
        'w-10 h-10 flex items-center justify-center rounded-full font-bold';
    const colorClasses = isCompleted
        ? 'bg-green-600 text-primary-foreground'
        : isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground';

    return (
        <div className="flex flex-col items-center">
            <div className={`${baseClasses} ${colorClasses}`}>
                {isCompleted ? '✓' : step}
            </div>
            <span
                className={`mt-2 text-sm ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
            >
                {label}
            </span>
        </div>
    );
};

// --- PASO 1: SELECCIÓN DE BARBERO (Se mantiene igual, solo se usa en renderStep) ---
const PasoBarbero: React.FC<{
    barberos: BarberoProps[];
    onSelectBarbero: (id: number | null) => void;
}> = ({ barberos, onSelectBarbero }) => {
    // ... (El código de PasoBarbero se mantiene)
    return (
        <div>
            <h3 className="mb-6 text-2xl font-semibold">
                Paso 1: ¿Con quién deseas reservar?
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Opción 1: Cualquier Barbero */}
                <button
                    onClick={() => onSelectBarbero(null)}
                    className="rounded-lg border-2 border-primary bg-primary/10 p-4 shadow-md transition duration-150 hover:bg-primary/20"
                >
                    <div className="text-center">
                        <svg
                            className="mx-auto mb-2 h-8 w-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                        </svg>
                        <p className="text-lg font-bold text-primary">
                            Cualquier Barbero
                        </p>
                        <p className="text-sm text-primary/80">
                            El primero disponible.
                        </p>
                    </div>
                </button>

                {/* Lista de Barberos Específicos */}
                {barberos.map((barbero) => (
                    <button
                        key={barbero.id}
                        onClick={() => onSelectBarbero(barbero.id)}
                        className="rounded-lg border p-4 shadow-md transition duration-150 hover:border-primary hover:bg-muted/50"
                    >
                        <div className="text-center">
                            <svg
                                className="mx-auto mb-2 h-8 w-8 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14h.01M12 14v4M16 14v4M8 14v4"
                                ></path>
                            </svg>
                            <p className="text-lg font-bold">{barbero.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Barbero Profesional
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- NUEVO COMPONENTE: PASO 2 - SELECCIÓN DE FECHA Y HORA ---
const PasoFechaHora: React.FC<{
    formData: FormData;
    servicio: ServicioProps;
    barberos: BarberoProps[];
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    setCurrentStep: (step: number) => void;
    onBack: () => void;
}> = ({
    formData,
    servicio,
    barberos,
    setFormData,
    setCurrentStep,
    onBack,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>(''); // Formato YYYY-MM-DD
    const [availableSlots, setAvailableSlots] = useState<string[]>([]); // Lista de horarios "HH:mm"
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Encuentra el nombre del barbero seleccionado para el título
    const barberoSeleccionado = formData.barbero_id
        ? barberos.find((b) => b.id === formData.barbero_id)?.name
        : 'Cualquier Barbero';

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        if (newDate) {
            setIsLoading(true);
            setError(null);
            setAvailableSlots([]);
        } else {
            // Si se limpia la fecha, reseteamos todo
            setIsLoading(false);
            setError(null);
            setAvailableSlots([]);
        }
    };

    // Hook para obtener horarios disponibles al cambiar fecha o barbero
    useEffect(() => {
        if (!selectedDate) {
            return; // No hacer nada si no hay fecha seleccionada
        }

        const controller = new AbortController();

        axios
            .get(route('horarios.disponibles'), {
                params: {
                    servicio_id: formData.servicio_id,
                    fecha: selectedDate,
                    barbero_id: formData.barbero_id,
                },
                signal: controller.signal,
            })
            .then((response) => {
                setAvailableSlots(response.data.slots);
                if (response.data.slots.length === 0) {
                    setError('No hay horarios disponibles para este día.');
                }
            })
            .catch((err) => {
                if (axios.isCancel(err)) return; // Ignorar errores de cancelación
                console.error(err);
                setError(
                    'Error al cargar los horarios. Intenta con otra fecha.',
                );
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [selectedDate, formData.barbero_id, formData.servicio_id]);

    // Manejar la selección final del slot
    const handleSlotSelect = (time: string) => {
        // Combinamos la fecha y la hora para formar el datetime de inicio
        const fechaHora = `${selectedDate} ${time}`;

        setFormData((prev) => ({ ...prev, fecha_inicio: fechaHora }));
        setCurrentStep(STEPS.CONFIRMACION);
    };

    return (
        <div>
            <h3 className="mb-4 text-2xl font-semibold">
                Paso 2: Fecha y Hora
            </h3>
            <p className="mb-6 text-muted-foreground">
                Barbero:{' '}
                <span className="font-medium text-primary">
                    {barberoSeleccionado}
                </span>{' '}
                | Servicio:{' '}
                <span className="font-medium text-primary">
                    {servicio.nombre} ({servicio.duracion_minutos} min)
                </span>
            </p>

            <div className="grid gap-6 md:grid-cols-3">
                {/* COLUMNA 1: SELECCIÓN DE FECHA */}
                <div className="md:col-span-1">
                    <label
                        htmlFor="date-picker"
                        className="mb-2 block text-lg font-medium"
                    >
                        Selecciona un Día
                    </label>
                    <input
                        type="date"
                        id="date-picker"
                        min={new Date().toISOString().split('T')[0]} // Mínimo hoy
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full rounded-lg border border-input bg-background shadow-sm focus-visible:ring-ring"
                    />
                </div>

                {/* COLUMNA 2/3: HORARIOS DISPONIBLES */}
                <div className="md:col-span-2">
                    <label className="mb-2 block text-lg font-medium">
                        Horarios Libres
                    </label>

                    {isLoading && (
                        <p className="py-4 text-center text-primary">
                            Cargando horarios...
                        </p>
                    )}

                    {error && (
                        <p className="py-4 text-center text-destructive">
                            {error}
                        </p>
                    )}

                    {selectedDate &&
                        !isLoading &&
                        !error &&
                        availableSlots.length > 0 && (
                            <div className="grid max-h-64 grid-cols-3 gap-3 overflow-y-auto rounded-lg border bg-muted p-2 sm:grid-cols-4">
                                {availableSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleSlotSelect(time)}
                                        className="rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary shadow-sm transition duration-150 hover:bg-primary hover:text-primary-foreground"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}

                    {!selectedDate && !isLoading && (
                        <div className="py-6 text-center text-muted-foreground">
                            Selecciona una fecha para ver los horarios.
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => onBack()}
                className="mt-8 text-muted-foreground hover:text-primary"
            >
                ← Volver a la Selección de Barbero
            </button>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const ReservacionIndex: React.FC<ReservacionProps> = ({
    auth,
    servicio,
    barberos,
}) => {
    // ... (El estado y las constantes se mantienen)
    const [currentStep, setCurrentStep] = useState(STEPS.BARBERO);
    const [formData, setFormData] = useState<FormData>({
        servicio_id: servicio.id,
        barbero_id: null,
        fecha_inicio: null, // Almacena el datetime final
    });

    const handleBarberoSelect = (barberoId: number | null) => {
        setFormData({ ...formData, barbero_id: barberoId });
        setCurrentStep(STEPS.FECHA_HORA);
    };

    const handleBack = () => {
        // Si volvemos, reiniciamos la fecha/hora
        setFormData((prev) => ({ ...prev, fecha_inicio: null }));
        setCurrentStep(STEPS.BARBERO);
    };

    const handleFinalSubmit = () => {
        // Paso 3: Lógica para enviar la reserva a Laravel

        // Antes de enviar, necesitamos obtener la información del cliente
        // Si el usuario NO está autenticado, aquí pediríamos Nombre, Email y Teléfono

        const finalData = {
            ...formData,
            // Si está autenticado:
            cliente_id: auth.user ? auth.user.id : null,
            // Otros datos si no está autenticado...
        };

        router.post(route('reservacion.store'), finalData, {
            // Manejo de éxito/fallo
        });

        // Simulación:
        setCurrentStep(4); // Creamos un paso final de agradecimiento
    };

    const renderStep = () => {
        switch (currentStep) {
            case STEPS.BARBERO:
                return (
                    <PasoBarbero
                        barberos={barberos}
                        onSelectBarbero={handleBarberoSelect}
                    />
                );

            case STEPS.FECHA_HORA:
                return (
                    <PasoFechaHora
                        key={formData.barbero_id} // Clave para forzar reseteo de estado al cambiar de barbero
                        formData={formData}
                        servicio={servicio}
                        barberos={barberos}
                        setFormData={setFormData}
                        setCurrentStep={setCurrentStep}
                        onBack={handleBack}
                    />
                );

            case STEPS.CONFIRMACION:
                return (
                    <div>
                        <h3 className="mb-6 text-2xl font-semibold">
                            Paso 3: Confirmación de Cita
                        </h3>
                        <p className="mb-4">
                            Revisa los detalles antes de finalizar:
                        </p>
                        <ul className="space-y-2 rounded-lg border bg-muted p-4">
                            <li>**Servicio:** {servicio.nombre}</li>
                            <li>**Barbero:** {barberoSeleccionado}</li>
                            <li>
                                **Fecha/Hora:**{' '}
                                {formData.fecha_inicio
                                    ? new Date(
                                          formData.fecha_inicio,
                                      ).toLocaleString()
                                    : 'N/A'}
                            </li>
                        </ul>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="mt-6 rounded bg-primary px-6 py-3 text-primary-foreground transition hover:bg-primary/90">
                                    Finalizar Reserva
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        ¿Confirmar Reserva?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Estás a punto de confirmar tu cita.
                                        Revisa que los detalles sean correctos:
                                        <ul className="my-3 list-inside list-disc space-y-1 rounded-md bg-muted p-4 text-left text-sm">
                                            <li>
                                                <strong>Servicio:</strong>{' '}
                                                {servicio.nombre}
                                            </li>
                                            <li>
                                                <strong>Barbero:</strong>{' '}
                                                {barberoSeleccionado}
                                            </li>
                                            <li>
                                                <strong>Fecha y Hora:</strong>{' '}
                                                {formData.fecha_inicio
                                                    ? new Date(
                                                          formData.fecha_inicio,
                                                      ).toLocaleString([], {
                                                          dateStyle: 'long',
                                                          timeStyle: 'short',
                                                      })
                                                    : 'N/A'}
                                            </li>
                                        </ul>
                                        ¿Deseas continuar?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Modificar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleFinalSubmit}
                                    >
                                        Confirmar y Reservar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button
                            onClick={() => setCurrentStep(STEPS.FECHA_HORA)}
                            className="ml-4 text-muted-foreground hover:text-primary"
                        >
                            ← Modificar Hora
                        </button>
                    </div>
                );

            // Paso de Agradecimiento (Simulación)
            case 4:
                return (
                    <div className="py-10 text-center">
                        <h3 className="mb-4 text-3xl font-bold text-green-600 dark:text-green-500">
                            ¡Reserva Exitosa!
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            Tu cita ha sido agendada. Recibirás una confirmación
                            por correo.
                        </p>
                        <Link
                            href={route('dashboard')}
                            className="mt-8 inline-block font-medium text-primary hover:text-primary/80"
                        >
                            Volver al Catálogo
                        </Link>
                    </div>
                );

            default:
                return null;
        }
    };

    // Buscar el barbero seleccionado para la barra de título en Confirmación
    const barberoSeleccionado = formData.barbero_id
        ? barberos.find((b) => b.id === formData.barbero_id)?.name
        : 'Cualquier Barbero';

    return (
        <AppLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold">
                    Reservar: {servicio.nombre}
                </h2>
            }
        >
            <Head title={`Reservar: ${servicio.nombre}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl rounded-lg bg-card p-8 text-card-foreground shadow-xl sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-3xl font-bold">
                        Proceso de Reserva
                    </h1>

                    {/* Barra de Pasos */}
                    <div className="mb-10 flex items-center justify-between text-center">
                        <StepIndicator
                            step={1}
                            currentStep={currentStep}
                            label="Barbero"
                        />
                        <StepIndicator
                            step={2}
                            currentStep={currentStep}
                            label="Fecha y Hora"
                        />
                        <StepIndicator
                            step={3}
                            currentStep={currentStep}
                            label="Confirmación"
                        />
                    </div>

                    {/* Contenido del Paso Actual */}
                    <div className="min-h-[350px] rounded-lg border p-6">
                        {renderStep()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ReservacionIndex;
