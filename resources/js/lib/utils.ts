import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de CSS (Tailwind) de forma segura.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Compara si dos URLs son la misma.
 * Útil para resaltar enlaces activos en la navegación.
 */
export function isSameUrl(url1: string, url2: string): boolean {
    const cleanUrl = (url: string) => url.split('?')[0].replace(/\/$/, '');
    return cleanUrl(url1) === cleanUrl(url2);
}

/**
 * Resuelve una URL (mantenida por compatibilidad con tu código previo).
 */
export function resolveUrl(url: string) {
    return url;
}