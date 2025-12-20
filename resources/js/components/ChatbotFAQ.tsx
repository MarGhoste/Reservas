import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react'; // O la librería de iconos que prefieras

export default function ChatbotFAQ() {
    const [isOpen, setIsOpen] = useState(false);

    // Array temporal con Lorem Ipsum para las 4 preguntas
    const faqs = [
        { q: "¿Cómo puedo agendar una cita?", a: "Es muy sencillo: ve a la sección de Catálogo, selecciona el servicio que deseas, elige a tu barbero de preferencia y el horario que mejor te quede. ¡Recibirás una confirmación inmediata!" },
        { q: "¿Cuál es el horario de atención?", a: "Atendemos de lunes a sábado de 9:00 AM a 8:00 PM. Los domingos permanecemos cerrados para que nuestro equipo descanse y regrese con la mejor energía el lunes." },
        { q: "¿Puedo cancelar o cambiar mi cita?", a: "¡Claro! Puedes hacerlo desde tu panel en Mis Citas. Te pedimos realizar cualquier cambio con al menos 2 horas de anticipación para que otro cliente pueda aprovechar ese espacio" },
        { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos pagos en efectivo, tarjetas de débito/crédito y transferencias móviles (Yape/Plin). El pago se realiza directamente en la barbería al finalizar tu servicio" },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Ventana del Chat */}
            {isOpen && (
                <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
                    {/* Header del Chat */}
                    <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <span className="font-bold">Asistente FAQ</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 rounded-full p-1">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Contenido de Preguntas */}
                    <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
                        <p className="text-sm text-gray-500 mb-4">Hola 👋, ¿en qué podemos ayudarte hoy?</p>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <details className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
                                        <summary className="flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 list-none">
                                            {faq.q}
                                            <ChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="p-3 text-xs text-gray-600 border-t border-gray-100 bg-gray-50/50">
                                            {faq.a}
                                        </div>
                                    </details>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Botón Flotante (Burbuja) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}