import { useState } from 'react'
import './App.css'
import AdminLogin from "./components/Login";
import { useUser } from './contexts/UserContext';
import HomePage from './components/HomePage';

function App() {
    const { user, loading } = useUser();
    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {user?.is_staff ? <HomePage /> : <AdminLogin />}
        </div>
    )
}

export default App
