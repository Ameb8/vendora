import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TenantCarousel.css';

function TenantCarousel({ parentWidth = '100%' }) {
    const [tenants, setTenants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/tenants/public/`)
            .then((res) => res.json())
            .then((data) => setTenants(data))
            .catch((err) => console.error('Error fetching tenants:', err));
    }, []);

    const handleCardClick = (slug) => {
        navigate(`/${slug}`);
    };

    return (
        <div className="tenant-carousel-container" style={{ width: parentWidth }}>
            <div className="tenant-carousel d-flex overflow-auto">
                {tenants.map((tenant) => (
                    <div
                        key={tenant.id}
                        className="tenant-card card text-center m-2 flex-shrink-0"
                        style={{
                            width: '200px',
                            backgroundColor: tenant.color_primary,
                            color: tenant.color_secondary,
                            borderColor: tenant.color_secondary,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                        }}
                        onClick={() => handleCardClick(tenant.slug)}
                    >
                        <img
                            src={tenant.image_url}
                            alt={`${tenant.name} logo`}
                            className="card-img-top"
                            style={{ objectFit: 'cover', height: '120px' }}
                        />
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                            <h5 className="card-title">{tenant.name}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TenantCarousel;
