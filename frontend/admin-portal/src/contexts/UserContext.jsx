import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // e.g. { is_staff: true, username: 'admin', ... }
    const [loading, setLoading] = useState(true);
    const baseURL = import.meta.env.VITE_API_URL;

    // Fetch current user info on mount to check session cookie
    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${baseURL}/accounts/me/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }


        fetchUser();
    }, [baseURL]);

    // login function - after successful login API call, refetch user info
    const login = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        try { // Get user info
            const response = await fetch(`${baseURL}/accounts/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Login fetch error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // logout function - call logout endpoint and clear user state
    const logout = async () => {
        setLoading(true);
        try {
            await fetch(`${baseURL}/accounts/logout/`, {
                method: 'POST', // or 'GET' depending on your API
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
