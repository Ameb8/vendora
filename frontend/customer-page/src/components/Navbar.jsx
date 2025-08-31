import { NavLink } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext.jsx';
import './Navbar.css';
import {useContext} from "react";

function Navbar() {
    const { tenant } = useTenant();

    return (
        <nav
            className="navbar shadow-sm justify-content-center"
            style={{backgroundColor: tenant.color_primary}}
        >
            <ul className="nav flex-nowrap justify-content-center gap-navbar">
                <li className="nav-item">
                    <NavLink
                        to={`/${tenant.slug}/inventory`}
                        className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}
                    >
                        Inventory
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to={`/${tenant.slug}/aboutus`} className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}>
                        About Us
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to={`/${tenant.slug}/contact`} className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}>
                        Contact
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to={`/${tenant.slug}/shipment`} className={({ isActive }) => "nav-link btn btn-link " + (isActive ? "active" : "")}>
                        Track Order
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
