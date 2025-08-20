import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Login from './Login';
import Account from './Account';

const UserDropdown = () => {
    const { user, isAuthenticated, loading } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    if (loading) return null;

    return (
        <div className="dropdown">
            <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded={isOpen}
                onClick={toggleDropdown}
            >
                {isAuthenticated ? user.username : 'Log In'}
            </button>
            <ul className={`dropdown-menu${isOpen ? ' show' : ''}`} aria-labelledby="userDropdown">
                <li className="p-3">
                    {isAuthenticated ? <Account /> : <Login />}
                </li>
            </ul>
        </div>
    );
};

export default UserDropdown;
