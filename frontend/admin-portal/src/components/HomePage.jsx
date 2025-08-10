import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import ProductList from './ProductList';
import UpdateAbout from "./UpdateAbout.jsx";
import UpdateContact from "./UpdateContact.jsx";
import PaidOrders from "./PaidOrders.jsx";
import AdminRegisterForm from "./AdminRegisterForm.jsx";
import CreateProductForm from "./CreateProduct.jsx";
import OrderNotifications from "./OrderNotifications.jsx";
import MetricsDashboard from "./MetricsDashboard.jsx";

function HomePage() {
    return (
        <Router>
            <Navbar />
            <div className="container-fluid content-with-sidebar">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/orders" element={<PaidOrders />} />
                    <Route path="/about" element={<UpdateAbout />} />
                    <Route path="/contact" element={<UpdateContact />} />
                    <Route path="/create-user" element={<AdminRegisterForm />} />
                    <Route path="/create-product" element={<CreateProductForm />} />
                    <Route path="/order-notifications" element={<OrderNotifications />} />
                    <Route path="/metrics" element={<MetricsDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default HomePage;
