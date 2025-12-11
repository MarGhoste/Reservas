// resources/js/Pages/Calendario/Ausencias.tsx

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Calendar from 'react-calendar'; // Librería de calendario

// --- INTERFACES (Se mantienen igual) ---
interface DiaIndisponible {
    date: string; // YYYY-MM-DD
    title: string;
    type: 'cierre_total' | 'parcial';
    barberos: string;
}
interface AusenciasProps {
    auth: { user: any };
    diasIndisponibles: DiaIndisponible[];
}

// Clase base para colorear según el tipo de ausencia
const tileClassName = (type: string | undefined) => {
    if (!type) return null;
    if (type === 'cierre_total') {
        // Rojo: Cierre total
        return 'bg-red-200 hover:bg-red-300 !rounded-full'; 
    }
    if (type === 'parcial') {
        // Amarillo: Ausencia parcial
        return 'bg-yellow-200 hover:bg-yellow-300 !rounded-full'; 
    }
    return null;
};

export default function AusenciasIndex({ auth, diasIndisponibles }: AusenciasProps) {
    const [calendarDate, setCalendarDate] = useState(new Date());

    // Crear un mapa de fechas para acceso rápido (YYYY-MM-DD -> {type, title})
    const absenceMap = diasIndisponibles.reduce((acc, item) => {
        acc[item.date] = item;
        return acc;
    }, {} as Record<string, DiaIndisponible>);

    // Función que la librería de calendario usará para dar estilo a cada día
    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const absence = absenceMap[dateString];

            if (absence) {
                // Devolvemos un elemento que aplica la clase CSS y un tooltip
                return (
                    <div className={`tile-absence-marker ${tileClassName(absence.type)} absolute inset-0 rounded-full flex items-center justify-center`} 
                         title={absence.title}>
                        <div className="w-2 h-2 rounded-full bg-black opacity-70"></div> {/* Un pequeño punto o marca */}
                    </div>
                );
            }
        }
        return null;
    };
    
    // Función para aplicar clases CSS a cada día (para colorear el fondo)
   const setDayClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
        const dateString = date.toISOString().split('T')[0];
        const absence = absenceMap[dateString];
        
        if (!absence) return null;

        // Devuelve la clase CSS estática que definimos en app.css
        return absence.type === 'cierre_total' ? 'cierre-total' : 'ausencia-parcial';
    }
    return null;
};


    const getColorClass = (type: string) => {
        return type === 'cierre_total' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-yellow-50 border-yellow-200 text-yellow-800';
    };


    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Calendario de Días No Hábiles</h2>}>
            <Head title="Ausencias" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 bg-white p-8 shadow-xl rounded-lg">
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Disponibilidad del Personal
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Los días en **rojo** indican cierre total. Los días en **amarillo** indican ausencia parcial de barberos.
                    </p>

                    {/* --- CONTENEDOR DEL CALENDARIO (Implementación de react-calendar) --- */}
                    <div className="flex justify-center mb-10">
                        <div className="w-full">
                            <Calendar
                                onChange={setCalendarDate}
                                value={calendarDate}
                                locale="es-ES"
                                // Aquí se aplican las clases CSS para el marcado
                                tileClassName={setDayClassName} 
                            />
                        </div>
                    </div>
                    
                    
                    {/* --- LEYENDA ACTUALIZADA --- */}
                    <h3 className="text-xl font-semibold mb-3">Próximas Ausencias</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                        {diasIndisponibles.length > 0 ? (
                            diasIndisponibles.map(dia => (
                                <div key={dia.date} className={`p-3 rounded-md border ${getColorClass(dia.type)}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">
                                            {new Date(dia.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </span>
                                        <span className="px-2 py-1 text-xs rounded-full font-semibold bg-white shadow-sm">
                                            {dia.type === 'cierre_total' ? 'CERRADO TOTAL' : 'AUSENCIA PARCIAL'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm">{dia.title}</p>
                                    {dia.type === 'parcial' && (
                                        <p className="mt-1 text-xs text-gray-700">Barberos ausentes: {dia.barberos}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="p-3 text-center text-gray-500">No hay cierres ni ausencias futuras registradas.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}