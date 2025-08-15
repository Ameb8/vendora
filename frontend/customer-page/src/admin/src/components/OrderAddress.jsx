import { useEffect, useState } from 'react';

export default function OrderAddress({ orderId }) {
    const [address, setAddress] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/order/admin/orders/${orderId}/address/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(setAddress)
            .catch(err => console.error('Error fetching address:', err));
    }, [orderId, token]);

    if (!address) return <p>Loading address...</p>;

    // Build full address string for map
    const fullAddress = `${address.street_address}${address.apartment_address ? `, ${address.apartment_address}` : ''}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`;
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

    return (
        <div>
            <p><strong>{address.full_name}</strong></p>
            <p>{address.street_address}{address.apartment_address ? `, ${address.apartment_address}` : ''}</p>
            <p>{address.city}, {address.state}, {address.postal_code}</p>
            <p>{address.country}</p>
            {address.phone_number && <p>Phone: {address.phone_number}</p>}

            <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
                <iframe
                    title="Google Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapSrc}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
