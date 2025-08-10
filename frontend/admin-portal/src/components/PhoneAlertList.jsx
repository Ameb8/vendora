import { useEffect, useState } from 'react';
import { ListGroup, Button, Spinner, Alert, Container } from 'react-bootstrap';

export default function PhoneNumberList() {
    const [phoneAlerts, setPhoneAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch phone numbers on mount
    useEffect(() => {
        const fetchPhoneNumbers = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/order/phone-numbers/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error fetching phone numbers: ${res.statusText}`);
                }

                const data = await res.json();
                setPhoneAlerts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPhoneNumbers();
    }, []);

    const handleDelete = (number) => {
        // Empty handler for now
        console.log(`Delete clicked for: ${number}`);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center my-5">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4" style={{ maxWidth: '600px' }}>
            <h4 className="mb-3">Phone Alerts</h4>
            {phoneAlerts.length === 0 ? (
                <Alert variant="info">No phone numbers found.</Alert>
            ) : (
                <ListGroup>
                    {phoneAlerts.map(({ number, carrier }) => (
                        <ListGroup.Item
                            key={number}
                            className="d-flex justify-content-between align-items-center"
                            style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
                        >
                            <div>
                <span className="me-2" style={{ fontWeight: 600 }}>
                  {number}
                </span>
                                <span className="text-muted text-capitalize">
                  ({carrier.replace(/^\w/, (c) => c.toUpperCase())})
                </span>
                            </div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(number)}
                                aria-label={`Delete phone number ${number}`}
                            >
                                &times;
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}
