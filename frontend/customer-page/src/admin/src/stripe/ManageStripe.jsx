import { Routes, Route } from 'react-router-dom';

import { useTenant } from "../contexts/TenantContext.jsx";

import StripeOnboard from "./StripeOnboard.jsx";
import StripeSuccess from "./StripeSuccess.jsx";
import StripeRetry from "./StripeRetry.jsx";

export default function ManageStripe() {
    const {currentTenant, loading} = useTenant();

    if (loading) return <div>Loading...</div>;

    return(
        <Routes>
            <Route index element={<StripeOnboard tenant={currentTenant} />} />
            <Route path="success" element={<StripeSuccess tenant={currentTenant} />} />
            <Route path="retry" element={<StripeRetry tenant={currentTenant} />} />
        </Routes>
    );
}