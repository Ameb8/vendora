function SelectTenant({ tenants, onSelect }) {
    if (!tenants.length) {
        return <p>You have no tenants assigned. Contact an admin.</p>;
    }

    return (
        <div>
            <h2>Select a Tenant</h2>
            <ul>
                {tenants.map(t => (
                    <li key={t.slug}>
                        <button onClick={() => onSelect(t)}>
                            {t.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SelectTenant;
