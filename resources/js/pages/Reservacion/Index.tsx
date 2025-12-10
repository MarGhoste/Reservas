// resources/js/Pages/Reservacion/Index.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios'; // Importamos Axios para la llamada API asíncrona
import { formatCurrency } from '@/Utils/formatters'; 

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
    auth: { user: any };
    servicio: ServicioProps;
    barberos: BarberoProps[];
}
interface HorarioSlot {
    time: string; // Formato "HH:mm"
}

// --- CONSTANTES ---
const STEPS = {
    BARBERO: 1,
    FECHA_HORA: 2,
    CONFIRMACION: 3,
};

// --- COMPONENTES AUXILIARES (Se mantienen igual) ---
const StepIndicator: React.FC<{ step: number, currentStep: number, label: string }> = ({ step, currentStep, label }) => {
    // ... (El código de StepIndicator se mantiene)
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;
    
    let baseClasses = "w-10 h-10 flex items-center justify-center rounded-full font-bold";
    let colorClasses = isCompleted ? "bg-green-500 text-white" : isActive ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500";
    
    return (
        <div className="flex flex-col items-center">
            <div className={`${baseClasses} ${colorClasses}`}>
                {isCompleted ? '✓' : step}
            </div>
            <span className={`mt-2 text-sm ${isActive ? 'font-semibold text-indigo-600' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
};

// --- PASO 1: SELECCIÓN DE BARBERO (Se mantiene igual, solo se usa en renderStep) ---
const PasoBarbero: React.FC<{ barberos: BarberoProps[], onSelectBarbero: (id: number | null) => void }> = ({ barberos, onSelectBarbero }) => {
    // ... (El código de PasoBarbero se mantiene)
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6">Paso 1: ¿Con quién deseas reservar?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Opción 1: Cualquier Barbero */}
                <button 
                    onClick={() => onSelectBarbero(null)} 
                    className="p-4 border-2 border-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-md transition duration-150"
                >
                    <div className="text-center">
                        <svg className="w-8 h-8 mx-auto text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <p className="font-bold text-lg text-indigo-700">Cualquier Barbero</p>
                        <p className="text-sm text-indigo-500">El primero disponible.</p>
                    </div>
                </button>

                {/* Lista de Barberos Específicos */}
                {barberos.map((barbero) => (
                    <button 
                        key={barbero.id} 
                        onClick={() => onSelectBarbero(barbero.id)}
                        className="p-4 border border-gray-300 hover:border-indigo-500 hover:bg-gray-50 rounded-lg shadow-md transition duration-150"
                    >
                        <div className="text-center">
                             <svg className="w-8 h-8 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14h.01M12 14v4M16 14v4M8 14v4"></path></svg>
                            <p className="font-bold text-lg">{barbero.name}</p>
                            <p className="text-sm text-gray-500">Barbero Profesional</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- NUEVO COMPONENTE: PASO 2 - SELECCIÓN DE FECHA Y HORA ---
const PasoFechaHora: React.FC<{ 
    formData: any, 
    servicio: ServicioProps, 
    barberos: BarberoProps[], 
    setFormData: Function,
    setCurrentStep: Function,
    onBack: Function 
}> = ({ formData, servicio, barberos, setFormData, setCurrentStep, onBack }) => {
    
    const [selectedDate, setSelectedDate] = useState<string>(''); // Formato YYYY-MM-DD
    const [availableSlots, setAvailableSlots] = useState<string[]>([]); // Lista de horarios "HH:mm"
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Encuentra el nombre del barbero seleccionado para el título
    const barberoSeleccionado = formData.barbero_id 
        ? barberos.find(b => b.id === formData.barbero_id)?.name 
        : 'Cualquier Barbero';
        
    // Hook para obtener horarios disponibles al cambiar fecha o barbero
    useEffect(() => {
        if (!selectedDate) return;
        
        setIsLoading(true);
        setError(null);
        setAvailableSlots([]);

        // Llama al nuevo endpoint de API
        axios.get(route('horarios.disponibles'), {
            params: {
                servicio_id: formData.servicio_id,
                fecha: selectedDate,
                barbero_id: formData.barbero_id, // Puede ser null
            }
        }).then(response => {
            setAvailableSlots(response.data.slots);
            if (response.data.slots.length === 0) {
                 setError('No hay horarios disponibles para este día.');
            }
        }).catch(err => {
            console.error(err);
            setError('Error al cargar los horarios. Intenta con otra fecha.');
        }).finally(() => {
            setIsLoading(false);
        });

    }, [selectedDate, formData.barbero_id, formData.servicio_id]);

    // Manejar la selección final del slot
    const handleSlotSelect = (time: string) => {
        // Combinamos la fecha y la hora para formar el datetime de inicio
        const fechaHora = `${selectedDate} ${time}`; 
        
        setFormData((prev: any) => ({ ...prev, fecha_inicio: fechaHora }));
        setCurrentStep(STEPS.CONFIRMACION);
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">Paso 2: Fecha y Hora</h3>
            <p className="text-gray-600 mb-6">Barbero: <span className="font-medium text-indigo-600">{barberoSeleccionado}</span> | Servicio: <span className="font-medium text-indigo-600">{servicio.nombre} ({servicio.duracion_minutos} min)</span></p>

            <div className="grid md:grid-cols-3 gap-6">
                {/* COLUMNA 1: SELECCIÓN DE FECHA */}
                <div className="md:col-span-1">
                    <label htmlFor="date-picker" className="block text-lg font-medium text-gray-700 mb-2">Selecciona un Día</label>
                    <input 
                        type="date" 
                        id="date-picker"
                        min={new Date().toISOString().split('T')[0]} // Mínimo hoy
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* COLUMNA 2/3: HORARIOS DISPONIBLES */}
                <div className="md:col-span-2">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Horarios Libres</label>
                    
                    {isLoading && <p className="text-center py-4 text-indigo-600">Cargando horarios...</p>}
                    
                    {error && <p className="text-center py-4 text-red-500">{error}</p>}

                    {selectedDate && !isLoading && !error && availableSlots.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                            {availableSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => handleSlotSelect(time)}
                                    className="px-3 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-600 hover:text-white transition duration-150 shadow-sm"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {!selectedDate && !isLoading && (
                        <div className="text-center py-6 text-gray-500">Selecciona una fecha para ver los horarios.</div>
                    )}
                </div>
            </div>
            
            <button onClick={() => onBack()} className="mt-8 text-gray-600 hover:text-indigo-600">
                ← Volver a la Selección de Barbero
            </button>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const ReservacionIndex: React.FC<ReservacionProps> = ({ auth, servicio, barberos }) => {
    
    // ... (El estado y las constantes se mantienen)
    const [currentStep, setCurrentStep] = useState(STEPS.BARBERO);
    const [formData, setFormData] = useState({
        servicio_id: servicio.id,
        barbero_id: null as number | null,
        fecha_inicio: null as string | null, // Almacena el datetime final
    });

    const handleBarberoSelect = (barberoId: number | null) => {
        setFormData({ ...formData, barbero_id: barberoId });
        setCurrentStep(STEPS.FECHA_HORA);
    };
    
    const handleBack = () => {
         // Si volvemos, reiniciamos la fecha/hora
         setFormData((prev: any) => ({ ...prev, fecha_inicio: null })); 
         setCurrentStep(STEPS.BARBERO);
    }
    
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
        
        alert(`Simulación de Reserva:\nBarbero: ${formData.barbero_id}\nFecha/Hora: ${formData.fecha_inicio}\n¡Reserva en progreso!`);
        // Simulación:
        setCurrentStep(4); // Creamos un paso final de agradecimiento
    }

    const renderStep = () => {
        switch (currentStep) {
            case STEPS.BARBERO:
                return <PasoBarbero barberos={barberos} onSelectBarbero={handleBarberoSelect} />;
            
            case STEPS.FECHA_HORA:
                return <PasoFechaHora 
                    formData={formData}
                    servicio={servicio}
                    barberos={barberos}
                    setFormData={setFormData}
                    setCurrentStep={setCurrentStep}
                    onBack={handleBack}
                />;
            
            case STEPS.CONFIRMACION:
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6">Paso 3: Confirmación de Cita</h3>
                        <p className='mb-4'>
                            Revisa los detalles antes de finalizar:
                        </p>
                         <ul className='space-y-2 p-4 bg-gray-50 border rounded-lg'>
                            <li>**Servicio:** {servicio.nombre}</li>
                            <li>**Barbero:** {barberoSeleccionado}</li>
                            <li>**Fecha/Hora:** {formData.fecha_inicio ? new Date(formData.fecha_inicio).toLocaleString() : 'N/A'}</li>
                         </ul>
                        
                        <button onClick={handleFinalSubmit} className="bg-indigo-600 text-white px-6 py-3 rounded mt-6 hover:bg-indigo-700 transition">
                            Finalizar Reserva
                        </button>
                        <button onClick={() => setCurrentStep(STEPS.FECHA_HORA)} className="ml-4 text-gray-600 hover:text-indigo-600">
                            ← Modificar Hora
                        </button>
                    </div>
                );
            
            // Paso de Agradecimiento (Simulación)
            case 4:
                return (
                    <div className="text-center py-10">
                        <h3 className="text-3xl font-bold text-green-600 mb-4">¡Reserva Exitosa!</h3>
                        <p className="text-lg text-gray-600">Tu cita ha sido agendada. Recibirás una confirmación por correo.</p>
                        <Link href={route('dashboard')} className="mt-8 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                            Volver al Catálogo
                        </Link>
                    </div>
                )
            
            default:
                return null;
        }
    };
    
    // Buscar el barbero seleccionado para la barra de título en Confirmación
    const barberoSeleccionado = formData.barbero_id 
        ? barberos.find(b => b.id === formData.barbero_id)?.name 
        : 'Cualquier Barbero';

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reservar: {servicio.nombre}</h2>}>
            <Head title={`Reservar: ${servicio.nombre}`} />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 bg-white p-8 shadow-xl rounded-lg">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Proceso de Reserva
                    </h1>

                    {/* Barra de Pasos */}
                    <div className="flex justify-between items-center mb-10 text-center">
                         <StepIndicator step={1} currentStep={currentStep} label="Barbero" />
                         <StepIndicator step={2} currentStep={currentStep} label="Fecha y Hora" />
                         <StepIndicator step={3} currentStep={currentStep} label="Confirmación" />
                    </div>
                    
                    {/* Contenido del Paso Actual */}
                    <div className="border p-6 rounded-lg min-h-[350px]">
                        {renderStep()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ReservacionIndex;