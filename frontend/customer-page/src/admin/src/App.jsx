import { useState } from 'react'

import './App.css'

import AdminLogin from "./components/Login";
import HomePage from './components/HomePage';
import { useUser } from '../../contexts/UserContext.jsx';


function App() {
    const { user, loading } = useUser();
    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {user ? <HomePage /> : <AdminLogin />}
        </div>
    )
}

export default App
