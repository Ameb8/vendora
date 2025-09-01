import { useEffect, useState} from "react";
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import ProductList from './components/ProductList.jsx'
import Appbar from "./components/Appbar.jsx";
import Navbar from "./components/Navbar.jsx";
import AboutUs from "./components/AboutUs.jsx"
import ContactUs from './components/ContactUs';
//import Checkout from "./components/Checkout.jsx";
import CheckoutDetails from "./checkout/CheckoutDetails.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import ViewOrder from "./components/ViewOrder.jsx"
import { useTenant } from './contexts/TenantContext.jsx';
import FilterCategory from "./components/FilterMenu.jsx";
import './App.css';
import axios from 'axios'
import Header from "./components/Header.jsx";


function App() {
    // Tenant pages
    const { tenant, slug, loading } = useTenant();

    if (loading) return <div>Loading tenant...</div>;
    if (!tenant) return <div>Tenant not found</div>;

    // Tracks current page to display
    const [selectedPage, setSelectedPage] = useState('inventory');


    return (
        <div
            className="d-flex flex-column vh-100"
            style={{ backgroundColor: tenant.color_secondary}}
        >
            <div>
                <Header />
            </div>
            <div className="flex-grow-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<Navigate to={`/${slug}/inventory`} replace />} />
                    <Route path="/inventory" element={<ProductList />} />
                    <Route path="/shopby" element={<ProductList />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/checkout" element={<CheckoutDetails/>} />
                    <Route path="/success" element={<OrderSuccess />} />
                    <Route path="/shipment" element={<ViewOrder />} />
                </Routes>
            </div>
        </div>
    );
}

export default App


