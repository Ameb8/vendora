import { useRef, useState, useEffect } from 'react';

import './Banner.css';
//import UserDropdown from './UserDropdown';

import { useUser } from '../contexts/UserContext.jsx';


import UserIcon from '../user/UserIcon.jsx';
import UserDropdown from '../user/UserDropdown.jsx';
import LoginDropdown from '../user/LoginDropdown.jsx';
import Login from './Login';

const Banner = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userIconRef = useRef(null);
    const { isAuthenticated } = useUser();

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownOpen &&
                !isModalOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !userIconRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header className="banner-container position-relative">
            <div className="logo-text">Vendora</div>

            <div ref={userIconRef} onClick={() => setDropdownOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
                <UserIcon />
            </div>

            {dropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="position-absolute end-0 mt-2 bg-white p-3 rounded shadow"
                    style={{ top: '100%', zIndex: 999 }}
                >
                    {isAuthenticated ? (
                        <UserDropdown onClose={() => setDropdownOpen(false)} />
                    ) : (
                        <Login />
                    )}
                </div>
            )}
        </header>
    );
};

export default Banner;


/*

const Banner = () => {
    return (
        <header className="banner-container">
            <div className="logo-text">Vendora</div>
            <UserDropdown />
        </header>
    );
};

export default Banner;
*/