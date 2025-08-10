import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

function CreateShipmentForm({ orderId }) {
    const [formData, setFormData] = useState({
        carrier: '',
        tracking_number: '',
        shipped_at: '',
        estimated_arrival: '',
        is_delivered: false,
        notes: '',
    });

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/order/shipments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ ...formData, order: orderId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(JSON.stringify(errorData));
            }

            setSuccessMsg('Shipment created successfully!');
            setFormData({
                carrier: '',
                tracking_number: '',
                shipped_at: '',
                estimated_arrival: '',
                is_delivered: false,
                notes: '',
            });
        } catch (err) {
            setErrorMsg('Error creating shipment: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4 mb-4">
            <h4>Create Shipment</h4>
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Carrier</Form.Label>
                    <Form.Control
                        type="text"
                        name="carrier"
                        value={formData.carrier}
                        onChange={handleChange}
                        placeholder="e.g. USPS, FedEx"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tracking Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="tracking_number"
                        value={formData.tracking_number}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Row>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Shipped At</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="shipped_at"
                                value={formData.shipped_at}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Estimated Arrival</Form.Label>
                            <Form.Control
                                type="date"
                                name="estimated_arrival"
                                value={formData.estimated_arrival}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        name="is_delivered"
                        label="Mark as Delivered"
                        checked={formData.is_delivered}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                    {loading ? <><Spinner animation="border" size="sm" /> Creating...</> : 'Create Shipment'}
                </Button>
            </Form>
        </Container>
    );
}

export default CreateShipmentForm;
