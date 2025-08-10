import { useEffect, useState } from 'react';

export default function OrderDetails({ orderId }) {
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const token = localStorage.getItem('token');
    console.log(`${import.meta.env.VITE_API_URL}/order/admin/orders/${orderId}/products/`);

    useEffect(() => {
        // Fetch order data
        fetch(`${import.meta.env.VITE_API_URL}/order/admin/orders/${orderId}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(setOrder)
            .catch(err => console.error('Error fetching order:', err));

        // Fetch products in order
        fetch(`${import.meta.env.VITE_API_URL}/order/admin/orders/${orderId}/products/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(setItems)
            .catch(err => console.error('Error fetching products:', err));
    }, [orderId, token]);

    if (!order) return <div className="p-3">Loading order...</div>;

    return (
        <ul className="list-group list-group-flush">
            <li className="list-group-item">
                <strong>Order Code:</strong> {order.order_code}
            </li>
            <li className="list-group-item">
                <strong>Email:</strong> {order.email || 'None'}
            </li>
            <li className="list-group-item">
                <strong>Total:</strong> ${(order.total_amount / 100).toFixed(2)}
            </li>
            <li className="list-group-item">
                <strong>Items:</strong>
                <div className="mt-2">
                    {items.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        items.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-2">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                                />
                                <div>
                                    <div>{item.product.name}</div>
                                    <div className="text-muted">Quantity: {item.quantity}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </li>
        </ul>
    );
}
