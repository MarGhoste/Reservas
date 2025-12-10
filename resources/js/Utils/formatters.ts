export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency',
        currency: 'USD', 
    }).format(amount);
};