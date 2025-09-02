import React, { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => {
    return useContext(CheckoutContext);
};

export const CheckoutProvider = ({ children }) => {
    const [address, setAddress] = useState(null);


    const updateAddress = (newAddress) => {
        setAddress(newAddress);
    };

    const value = {
        address,
        updateAddress,
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
};
