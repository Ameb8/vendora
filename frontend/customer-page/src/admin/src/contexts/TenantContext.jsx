import { createContext, useContext, useState, useEffect } from "react";

import { setSetCurrentTenant } from '../../../TenantManager.js';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenants, setTenants] = useState([]);
    const [currentTenant, setCurrentTenant] = useState(() => {
        // Load previously selected tenant from sessionStorage on first render
        const savedTenant = sessionStorage.getItem("currentTenant");
        return savedTenant ? JSON.parse(savedTenant) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSetCurrentTenant(setCurrentTenant);
    }, [setCurrentTenant]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/tenants/my-tenants/`, {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch tenants");
                const data = await response.json();
                console.log(data); // DEBUG *******
                setTenants(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

    useEffect(() => {
        if (currentTenant) {
            sessionStorage.setItem("currentTenant", JSON.stringify(currentTenant));
        }
    }, [currentTenant]);

    return (
        <TenantContext.Provider
            value={{
                tenants,
                currentTenant,
                setCurrentTenant,
                loading
            }}
        >
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
