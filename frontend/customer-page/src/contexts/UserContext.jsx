import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(!!token); // only loading if we have a token to validate

    useEffect(() => {
        if (token) {
            // Attach token to all future requests
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUser();
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts/me/`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (authToken) => {
        localStorage.setItem('token', authToken);
        axios.defaults.headers.common['Authorization'] = `Token ${authToken}`;
        axios.defaults.headers.common['Authorization'] = `Token ${authToken}`;
        setToken(authToken);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts/me/`);
            setUser(response.data);
        } catch (error) {
            console.error('Login fetch user failed', error);
        }
        setLoading(false);

    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);


