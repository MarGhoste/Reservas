// resources/js/Components/Pagination.tsx

import { Link } from '@inertiajs/react';
import React from 'react';

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: LinkItem[];
}

export default function Pagination({ links }: PaginationProps) {
    // Excluye los links que tienen el label '...' (puntos suspensivos)
    const visibleLinks = links.filter(link => link.label !== '...');

    return (
        <div className="flex flex-wrap gap-1">
            {visibleLinks.map((link, key) => {
                const labelText = link.label.replace('&laquo; Previous', 'Anterior').replace('Next &raquo;', 'Siguiente');

                return (
                    <Link
                        key={key}
                        href={link.url || '#'} // Usa '#' si la URL es nula (deshabilitado)
                        className={`
                            px-4 py-2 text-sm leading-4 border rounded 
                            ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100'}
                            ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        // Deshabilita la navegación si la URL es nula
                        aria-disabled={!link.url}
                    >
                        {/* Renderiza el label limpio */}
                        <span dangerouslySetInnerHTML={{ __html: labelText }} />
                    </Link>
                );
            })}
        </div>
    );
}