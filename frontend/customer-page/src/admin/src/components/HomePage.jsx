import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import ProductList from './ProductList';
import UpdateAbout from "./UpdateAbout.jsx";
import UpdateContact from "./UpdateContact.jsx";
import PaidOrders from "./PaidOrders.jsx";
import AdminRegisterForm from "./AdminRegisterForm.jsx";
import CreateProductForm from "./CreateProduct.jsx";
import OrderNotifications from "./OrderNotifications.jsx";
import MetricsDashboard from "./MetricsDashboard.jsx";
import { TenantProvider, useTenant } from '../contexts/TenantContext';
import SelectTenant from './SelectTenant';
import TenantDropdown from "./TenantDropdown.jsx";

function HomeContent() {
    const { tenants, currentTenant, setCurrentTenant, loading } = useTenant();

    if (loading) return <p>Loading tenants...</p>;
    if (!currentTenant) return <SelectTenant tenants={tenants} onSelect={setCurrentTenant} />;

    return (
        <div className="container-fluid content-with-sidebar">
            <Routes>
                <Route index element={<ProductList />} />
                <Route path="orders" element={<PaidOrders />} />
                <Route path="about" element={<UpdateAbout />} />
                <Route path="contact" element={<UpdateContact />} />
                <Route path="create-user" element={<AdminRegisterForm />} />
                <Route path="create-product" element={<CreateProductForm />} />
                <Route path="order-notifications" element={<OrderNotifications />} />
                <Route path="metrics" element={<MetricsDashboard />} />
            </Routes>
        </div>
    );
}

function HomePage() {
    return (
        <TenantProvider>
                <Navbar />
                <TenantDropdown />
                <HomeContent />
        </TenantProvider>
    );
}

export default HomePage;




