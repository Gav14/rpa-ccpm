import { useEffect, useState } from 'react';

export function useDebounce<T>(valor: T, delayMs = 400): T {
    const [valorDebounced, setValorDebounced] = useState(valor);

    useEffect(() => {
        const timer = setTimeout(() => setValorDebounced(valor), delayMs);
        // Si el valor cambia antes de que se cumpla el delay,
        // se cancela el timer anterior y se arranca uno nuevo
        return () => clearTimeout(timer);
    }, [valor, delayMs]);

    return valorDebounced;
}