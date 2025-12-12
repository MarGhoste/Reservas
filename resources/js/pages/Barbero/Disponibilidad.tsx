// resources/js/Pages/Barbero/Disponibilidad.tsx

import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// Asumo que tienes componentes básicos como estos en tu proyecto:
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton'; 
import DangerButton from '@/Components/DangerButton'; 

// --- INTERFACES ---
interface Ausencia {
    id: number;
    fecha: string; // Formato legible (dddd, D de MMMM YYYY)
    motivo: string;
    fecha_raw: string; // YYYY-MM-DD
}

interface DisponibilidadProps {
    auth: { user: any };
    misAusencias: Ausencia[];
}

export default function Disponibilidad({ auth, misAusencias }: DisponibilidadProps) {
    
    // Configuración del formulario con Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        fecha: '',
        motivo: '',
    });

    // Manejar el envío del formulario (Crear nueva ausencia)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Llama a la ruta POST para almacenar el día no disponible
        post(route('barbero.disponibilidad.store'), {
            onSuccess: () => reset('fecha', 'motivo'), // Limpia el formulario al éxito
        });
    };

    // Manejar la eliminación de una ausencia
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta ausencia? El día volverá a estar disponible para reservas.')) {
            // Llama a la ruta DELETE
            router.delete(route('barbero.disponibilidad.destroy', id), {
                preserveScroll: true, // Mantiene la posición del scroll
            });
        }
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Disponibilidad Personal</h2>}>
            <Head title="Disponibilidad Barbero" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl sm:rounded-lg">
                        
                        {/* SECCIÓN 1: Formulario para Añadir Ausencia */}
                        <div className="p-6 md:p-10 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                                🗓️ Bloquear un Día Personal (Ausencia)
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                                <div>
                                    <InputLabel htmlFor="fecha" value="Fecha de Ausencia" />
                                    <TextInput
                                        id="fecha"
                                        type="date"
                                        name="fecha"
                                        value={data.fecha}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('fecha', e.target.value)}
                                        required
                                        min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                                    />
                                    <InputError message={errors.fecha} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="motivo" value="Motivo de la Ausencia (Ej: Cita médica, día libre)" />
                                    <TextInput
                                        id="motivo"
                                        type="text"
                                        name="motivo"
                                        value={data.motivo}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('motivo', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.motivo} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton processing={processing}>
                                        Bloquear Día
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                        
                        {/* SECCIÓN 2: Lista de Ausencias Futuras */}
                        <div className="p-6 md:p-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                                🚫 Mis Días Bloqueados (Futuros)
                            </h2>
                            
                            {misAusencias.length > 0 ? (
                                <ul className="space-y-3">
                                    {misAusencias.map((ausencia) => (
                                        <li key={ausencia.id} className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-800">{ausencia.fecha}</p>
                                                <p className="text-sm text-gray-600 italic">Motivo: {ausencia.motivo}</p>
                                            </div>
                                            <DangerButton
                                                onClick={() => handleDelete(ausencia.id)}
                                                className="h-9"
                                            >
                                                Eliminar
                                            </DangerButton>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic text-center p-4 bg-gray-50 rounded-lg">
                                    ✨ ¡Genial! No tienes días de ausencia registrados. Tu agenda está completamente abierta.
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}