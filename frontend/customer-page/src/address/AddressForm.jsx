import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddressForm = ({ onSubmit }) => {
    const [address, setAddress] = useState({
        street_address: '',
        apartment_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(address);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="street_address">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter street address"
                    name="street_address"
                    value={address.street_address}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="apartment_address">
                <Form.Label>Apartment Address (optional)</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter apartment number or unit"
                    name="apartment_address"
                    value={address.apartment_address}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="postal_code">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter postal code"
                    name="postal_code"
                    value={address.postal_code}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                    as="select"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Country</option>
                    {/* Add country options here */}
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    {/* You can dynamically populate this list from a country API */}
                </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default AddressForm;
