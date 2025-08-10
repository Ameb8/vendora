import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Reducer Function
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': { // Add Product to Cart
            const existing = state.find(item => item.id === action.payload.id);
            if (existing) {
                return state.map(item => // Increment quantity or add Product
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            }
            return [...state, action.payload];
        }

        case 'REMOVE_ITEM': // Remove all products of a type
            return state.filter(item => item.id !== action.payload.id);

        case 'CLEAR_CART': // Reset cart to empty
            return [];

        default: // Unrecognized input
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

const CART_STORAGE_KEY = 'cart'; // Local storage key

const loadCartFromStorage = () => { // Get from storage
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveCartToStorage = (cart) => { // Save to storage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const CartContext = createContext(); // Create context

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, [], loadCartFromStorage);

    // Sync to localStorage on any change
    useEffect(() => {
        saveCartToStorage(cart);
    }, [cart]);

    // Context functions
    const addItem = (product, quantity = 1) => {
        dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
    };

    const removeItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
