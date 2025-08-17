import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TenantContext = createContext();

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
    const { slug } = useParams();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTenant() {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/tenants/public/${slug}`);
                setTenant(response.data);
            } catch (error) {
                console.error('Error fetching tenant:', error);
                setTenant(null);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchTenant();
    }, [slug]);

    return (
        <TenantContext.Provider value={{ tenant, loading, slug }}>
            {children}
        </TenantContext.Provider>
    );
};



