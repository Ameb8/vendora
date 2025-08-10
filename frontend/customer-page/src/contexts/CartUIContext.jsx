import { createContext, useContext, useState, useCallback } from 'react';

const CartUIContext = createContext();

export function CartUIProvider({ children }) {
    const [shouldWiggle, setShouldWiggle] = useState(false);

    const triggerWiggle = useCallback(() => {
        setShouldWiggle(true);
        setTimeout(() => setShouldWiggle(false), 500); // Set animation duration
    }, []);

    return (
        <CartUIContext.Provider value={{ shouldWiggle, triggerWiggle }}>
            {children}
        </CartUIContext.Provider>
    );
}

export const useCartUI = () => useContext(CartUIContext);
