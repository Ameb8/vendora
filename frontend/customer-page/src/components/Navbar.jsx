import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar navbar-beige-bg shadow-sm justify-content-center">
            <ul className="nav flex-nowrap justify-content-center gap-navbar">
                <li className="nav-item">
                    <NavLink
                        to="/inventory"
                        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
                    >
                        Inventory
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/aboutus"
                        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
                    >
                        About Us
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
                    >
                        Contact
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/shipment"
                        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
                    >
                        Track Order
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;




/*

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ShopBy from './ShopBy';
import CartIcon from '../icons/CartIcon';

import './Navbar.css';



function Navbar() {
    const [showShopByDropdown, setShowShopByDropdown] = useState(false);
    const location = useLocation();

    // Show ShopBy dropdown only on /inventory route and when toggled
    const isInventoryPage = location.pathname === '/inventory';

    const toggleShopBy = () => {
        setShowShopByDropdown(prev => !prev);
    };

    // Hide ShopBy dropdown if route changes away from /inventory
    // (Optional: can add useEffect to close dropdown on route change)

    return (
        <>
            <nav className="navbar navbar-beige-bg shadow-sm justify-content-center">
                <ul className="nav flex-nowrap justify-content-center gap-navbar">
                    <li className="nav-item">
                        <NavLink
                            to="/inventory"
                            className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
                            onClick={() => setShowShopByDropdown(false)} // hide dropdown on nav
                        >
                            Inventory
                        </NavLink>
                    </li>
                    <li className="nav-item">
{isInventoryPage && (
    <button
        className={`nav-link btn btn-link ${showShopByDropdown ? 'active' : ''}`}
        onClick={toggleShopBy}
        type="button"
    >
        Shop By ▼
    </button>
)}
</li>
<li className="nav-item">
    <NavLink
        to="/aboutus"
        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
        onClick={() => setShowShopByDropdown(false)}
    >
        About Us
    </NavLink>
</li>
<li className="nav-item">
    <NavLink
        to="/contact"
        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
        onClick={() => setShowShopByDropdown(false)}
    >
        Contact
    </NavLink>
</li>
<li className="nav-item">
    <NavLink
        to="/shipment"
        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
        onClick={() => setShowShopByDropdown(false)}
    >
        Track Order
    </NavLink>
</li>
</ul>
</nav>

{isInventoryPage && showShopByDropdown && (
    <div className="shopby-dropdown bg-light shadow-sm p-3">
        <ShopBy />
    </div>
)}
</>
);
}

export default Navbar;




*/