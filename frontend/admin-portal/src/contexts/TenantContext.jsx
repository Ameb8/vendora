import { createContext, useContext, useState, useEffect } from "react";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenants, setTenants] = useState([]);
    const [currentTenant, setCurrentTenant] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setTenants(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

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
