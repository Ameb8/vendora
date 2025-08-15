import { useEffect, useState} from "react";
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import ProductList from './components/ProductList.jsx'
import Appbar from "./components/Appbar.jsx";
import Navbar from "./components/Navbar.jsx";
import AboutUs from "./components/AboutUs.jsx"
import ContactUs from './components/ContactUs';
import Checkout from "./components/Checkout.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import ViewOrder from "./components/ViewOrder.jsx"
import FilterCategory from "./components/FilterMenu.jsx";
import './App.css';
import axios from 'axios'


function App() {
    // Tenant pages
    const { slug } = useParams();
    const [tenant, setTenant] = useState(null);

    // Tracks current page to display
    const [selectedPage, setSelectedPage] = useState('inventory');

    // Load tenants
    useEffect(() => {
        async function fetchTenant() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/tenants/public/${slug}`);
                setTenant(response.data);

                console.log(`Tenant Products: ${response.data}`); // DEBUG *****
            } catch (err) {
                console.error("Failed to load tenant data:", err);
            }
        }
        fetchTenant();
    }, [slug]);

    if (!tenant)
        return <div>Loading tenant...</div>;

    return (
        <div
            className="d-flex flex-column vh-100"
            style={{ backgroundColor: tenant.color_secondary }}
        >
            <div>
                <Appbar tenant={tenant} />
                <Navbar
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                    tenant={tenant}
                    slug={slug}
                />
            </div>
            <div className="flex-grow-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<Navigate to={`/${slug}/inventory`} replace />} />
                    <Route path="/inventory" element={<ProductList tenant={tenant} />} />
                    <Route path="/shopby" element={<ProductList tenant={tenant} />} />
                    <Route path="/aboutus" element={<AboutUs tenant={tenant} />} />
                    <Route path="/contact" element={<ContactUs tenant={tenant} />} />
                    <Route path="/checkout" element={<Checkout tenant={tenant} />} />
                    <Route path="/success" element={<OrderSuccess tenant={tenant} />} />
                    <Route path="/shipment" element={<ViewOrder tenant={tenant} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App


