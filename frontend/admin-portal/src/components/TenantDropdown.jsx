import { useTenant } from "../contexts/TenantContext";

export default function TenantDropdown() {
    const { tenants, currentTenant, setCurrentTenant, loading } = useTenant();

    if (loading) return <p>Loading tenants...</p>;
    if (!tenants.length) return <p>No tenants found</p>;

    const handleChange = (event) => {
        const selected = tenants.find(t => t.slug === event.target.value);
        setCurrentTenant(selected);

        // DEBUG *******
        console.log("Tenant selected: ", selected);
        console.log("Selection stored: ", currentTenant);
        // END DEBUG ***
    };

    return (
        <select
            value={currentTenant?.slug || ""}
            onChange={handleChange}
        >
            <option value="">Select a tenant...</option>
            {tenants.map((tenant) => (
                <option key={tenant.slug} value={tenant.slug}>
                    {tenant.name}
                </option>
            ))}
        </select>
    );
}
