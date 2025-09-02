import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Button, Modal, Spinner } from 'react-bootstrap';

import AddressForm from './AddressForm.jsx';

import { useCheckout } from '../checkout/CheckoutContext';

const AddressDropdown = () => {
    const { address, updateAddress } = useCheckout();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch addresses from the API
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts/my-addresses/`);
                setAddresses(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch addresses');
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    // Handle address selection
    const handleSelect = (address) => {
        setSelectedAddress(address);
        updateAddress(address);
    };

    // Open address creator
    const handleAddAddress = () => {
        setShowModal(true);
    };

    // Close create address pop-up
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Submit new address form
    const handleAddressSubmit = async (newAddress) => {
        try {
            const fullAddress = {
                address: {
                    street_address: newAddress.street_address,
                    apartment_address: newAddress.apartment_address,
                    city: newAddress.city,
                    state: newAddress.state,
                    postal_code: newAddress.postal_code,
                    country: newAddress.country
                }
            };

            // Make a POST request to create a new address
            await axios.post(`${import.meta.env.VITE_API_URL}/accounts/my-addresses/`, fullAddress);
            // Refresh the address list after adding the new address
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts/my-addresses`);
            setAddresses(response.data);
            setShowModal(false);  // Close the modal
        } catch (err) {
            setError('Failed to add new address');
        }
    };


    return (
        <div className="address-dropdown-container">
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="w-100">
                    {selectedAddress ? `${selectedAddress.address.street_address}, ${selectedAddress.address.city}` : 'Select an Address'}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                    {loading && (
                        <Dropdown.Item disabled>
                            <Spinner animation="border" size="sm" />
                            Loading addresses...
                        </Dropdown.Item>
                    )}

                    {error && (
                        <Dropdown.Item disabled>
                            Error: {error}
                        </Dropdown.Item>
                    )}

                    {addresses.map((entry) => (
                        <Dropdown.Item
                            key={entry.id}
                            onClick={() => handleSelect(entry)}
                        >
                            {entry.address.street_address}, {entry.address.city}
                        </Dropdown.Item>
                    ))}

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleAddAddress} className="text-center">
                        <Button variant="outline-primary" className="w-100">
                            Add New Address
                        </Button>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {/* Modal for creating a new address */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddressForm onSubmit={handleAddressSubmit} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AddressDropdown;
