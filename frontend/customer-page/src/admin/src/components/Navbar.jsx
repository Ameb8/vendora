import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './Navbar.css';

import UserIcon from '../../../user/UserIcon.jsx';
import UserDropdown from '../../../user/UserDropdown.jsx';
import HomeIcon from '../../../icons/HomeIcon.jsx';

function Navbar() {
    const navigate = useNavigate();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => { // Close User menu when click outside
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowUserDropdown(false);
            }
        };

        if (showUserDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserDropdown]);

    return (
        <>
            <div className="vertical-navbar navbar text-white d-flex flex-column align-items-center">
                <button
                    className="navbar-toggler custom-toggler mt-3"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasMenu"
                    aria-controls="offcanvasMenu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="user-icon"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                    style={{ cursor: 'pointer' }}
                >
                    <UserIcon />
                </div>

                <button className="btn-home" onClick={() => {
                    navigate('home');
                }}>
                    <HomeIcon
                        width={24}
                        height={24}
                        style={{ backgroundColor: 'transparent' }}
                    />
                </button>
            </div>

            {showUserDropdown && (
                <div className="user-dropdown-overlay">
                    <div ref={dropdownRef}>
                        <UserDropdown onClose={() => setShowUserDropdown(false)} />
                    </div>
                </div>
            )}

            <div
                className="offcanvas offcanvas-start bg-dark text-white"
                tabIndex="-1"
                id="offcanvasMenu"
                aria-labelledby="offcanvasMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasMenuLabel">Admin Menu</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body d-flex flex-column gap-3">
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        🏠 Product List
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('orders');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📦 Paid Orders
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('about');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📝 Update About
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('contact');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📞 Update Contact
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('create-user');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        👤 Create Admin Account
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('create-product');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        ➕ Create New Product
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('order-notifications');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        🔔 Manage Order Alerts
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('metrics');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📊 Business Metrics
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('stripe');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        🔌 Connect Payments
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('subscriptions');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        🛒 Manage Subscriptions
                    </button>

                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('tutorials');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📚 Tutorials
                    </button>
                </div>
            </div>
        </>
    );
}

export default Navbar;


