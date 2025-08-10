import { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';

const CARRIER_OPTIONS = [
    { value: 'verizon', label: 'Verizon' },
    { value: 'att', label: 'AT&T' },
    { value: 'tmobile', label: 'T-Mobile' },
    { value: 'sprint', label: 'Sprint' },
    { value: 'boost', label: 'Boost' },
];

export default function PhoneNumberForm() {
    const [rawNumber, setRawNumber] = useState('');
    const [carrier, setCarrier] = useState('');

    // Format number as xxx-xxx-xxxx
    const formatPhoneNumber = (digits) => {
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    const handlePhoneChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
        setRawNumber(digitsOnly);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rawNumber.length < 10 || !carrier) return;

        const formattedNumber = rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/order/phone-numbers/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    number: formattedNumber,
                    carrier: carrier,
                }),
            });

            if (response.ok) {
                alert('Phone number added!');
                setRawNumber('');
                setCarrier('');
            } else {
                alert('Failed to add number.');
            }
        } catch (err) {
            console.error(err);
            alert('Error sending request.');
        }
    };

    return (
        <Form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
            <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="text"
                    value={formatPhoneNumber(rawNumber)}
                    onChange={handlePhoneChange}
                    placeholder="123-456-7890"
                    inputMode="numeric"
                />
            </Form.Group>

            <Form.Group controlId="carrier">
                <Form.Label>Carrier</Form.Label>
                <Form.Select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                >
                    <option value="">Select a carrier...</option>
                    {CARRIER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                disabled={rawNumber.length !== 10 || !carrier}
                className="mt-3"
            >
                Add
            </Button>
        </Form>
    );
}
