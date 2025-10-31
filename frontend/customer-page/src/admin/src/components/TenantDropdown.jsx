import { useState } from "react";
import { useTenant } from "../contexts/TenantContext";
import { Dropdown, Spinner } from "react-bootstrap";

export default function TenantDropdown() {
    const { tenants, currentTenant, setCurrentTenant, loading } = useTenant();
    const [open, setOpen] = useState(false);

    if (loading)
        return (
            <div className="text-center my-3">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Loading tenants...</span>
            </div>
        );

    if (!tenants.length)
        return <p className="text-muted text-center">No tenants found</p>;

    const handleSelect = (slug) => {
        const selected = tenants.find((t) => t.slug === slug);
        setCurrentTenant(selected);
        setOpen(false);
    };

    const isActive = (tenant) => {
        if (!tenant.subscription || !tenant.subscription.is_active)
            return false;

        const subEnd = new Date(tenant.subscription.current_period_end);
        const now = new Date();

        console.log(`Now: ${now}\tsub end: ${subEnd}`); // DEBUG *******

        if (now > subEnd)
            return false;

        return true;
    };

    return (
        <Dropdown show={open} onToggle={() => setOpen(!open)} className="my-3">
            <Dropdown.Toggle className="shadow-sm" variant="light">
                {currentTenant?.name || "Choose a tenant..."}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {tenants.map((tenant) => (
                    <Dropdown.Item
                        key={tenant.slug}
                        onClick={() => handleSelect(tenant.slug)}
                        className="d-flex justify-content-between align-items-center"
                    >
                        {tenant.name}
                        <span
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: isActive(tenant) ? "green" : "red",
                            }}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}









/*

import { useTenant } from "../contexts/TenantContext";
import { Form, Spinner } from "react-bootstrap";

export default function TenantDropdown() {
    const { tenants, currentTenant, setCurrentTenant, loading } = useTenant();

    if (loading)
        return (
            <div className="text-center my-3">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Loading tenants...</span>
            </div>
        );

    if (!tenants.length)
        return <p className="text-muted text-center">No tenants found</p>;

    const handleChange = (event) => {
        const selected = tenants.find((t) => t.slug === event.target.value);
        setCurrentTenant(selected);
    };

    return (
        <Form className="my-3">
            <Form.Group controlId="tenantSelect">
                <Form.Label className="fw-semibold mb-2 text-secondary">
                    Select Tenant
                </Form.Label>
                <Form.Select
                    value={currentTenant?.slug || ""}
                    onChange={handleChange}
                    className="shadow-sm"
                >
                    <option value="">Choose a tenant...</option>
                    {tenants.map((tenant) => (
                        <option key={tenant.slug} value={tenant.slug}>
                            {tenant.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </Form>
    );
}


*/