import { useEffect, useState } from 'react';
import { Card, Container, Spinner, Alert, Image, Table, Button } from 'react-bootstrap';

function OrderDetails({ orderCode, onShowAddress }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/order/details/${orderCode}/`);
                if (!response.ok) throw new Error('Failed to fetch order');
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderCode) {
            fetchOrder();
        }
    }, [orderCode]);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-4" />;
    }

    if (error) {
        return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
    }

    if (!order) return null;

    return (
        <Container className="my-4">
            <Card>
                <Card.Body>
                    <Card.Title className="text-center mb-3">Order Details</Card.Title>
                    <p><strong>Order Code:</strong> {order.order_code}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Total Amount:</strong> ${order.total_amount}</p>

                    <h5 className="mt-4">Items</h5>
                    <Table responsive size="sm" className="mt-2">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Qty</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        thumbnail
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>${parseFloat(item.price).toFixed(2)}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <h5 className="mt-4">Shipment</h5>
                    <p><strong>Carrier:</strong> {order.shipment.carrier}</p>
                    <p><strong>Tracking Number:</strong> {order.shipment.tracking_number}</p>
                    <p><strong>Shipped At:</strong> {new Date(order.shipment.shipped_at).toLocaleString()}</p>
                    <p><strong>Estimated Arrival:</strong> {order.shipment.estimated_arrival}</p>
                    <p><strong>Delivered:</strong> {order.shipment.is_delivered ? 'Yes' : 'No'}</p>
                    {order.shipment.notes && <p><strong>Notes:</strong> {order.shipment.notes}</p>}

                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="mb-3"
                        onClick={() => onShowAddress(order.id)}
                    >
                        View Shipping Address
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderDetails;


