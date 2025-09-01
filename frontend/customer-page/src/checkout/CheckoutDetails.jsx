import { useState } from 'react';
import SelectAddress from '../address/SelectAddress';

const CheckoutDetails = () => {
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        console.log("Selected Address:", address);
    };

    return (
        <div className="container">
            <h2>Your Address</h2>
            <SelectAddress onAddressSelect={handleAddressSelect} />
            {selectedAddress && (
                <div className="mt-4">
                    <h5>Selected Address:</h5>
                    <p>{selectedAddress.address.street_address}, {selectedAddress.address.city}</p>
                </div>
            )}
        </div>
    );
};

export default CheckoutDetails;
