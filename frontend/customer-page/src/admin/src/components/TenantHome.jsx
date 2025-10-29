import React from "react";
import { useTenant } from "../contexts/TenantContext";

const TenantHeader = () => {
    const { currentTenant, loading } = useTenant();

    if (loading) return <p>Loading tenant...</p>;

    if (!currentTenant) return <p>No tenant selected.</p>;

    return (
        <header style={{ textAlign: "center", margin: "2rem 0" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {currentTenant.name}
            </h1>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>
                <p>{currentTenant.phone}</p>
                <p>{currentTenant.email}</p>
                <p>{currentTenant.subscription.current_period_end}</p>
            </div>
        </header>
    );
};

export default TenantHeader;
