// TenantCarousel.jsx
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TenantCarousel.css';

function TenantCarousel({ parentWidth = '100%' }) {
    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/tenants/public/`)
            .then((res) => res.json())
            .then((data) => setTenants(data))
            .catch((err) => console.error('Error fetching tenants:', err));
    }, []);

    return (
        <div className="tenant-carousel-container" style={{ width: parentWidth }}>
            <div className="tenant-carousel d-flex overflow-auto">
                {tenants.map((tenant) => (
                    <div key={tenant.id} className="tenant-card card text-center m-2 flex-shrink-0">
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <h5 className="card-title">{tenant.name}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TenantCarousel;
