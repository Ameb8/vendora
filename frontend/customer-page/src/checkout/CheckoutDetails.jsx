import { useState } from 'react';

import SelectAddress from '../address/SelectAddress';
import Checkout from '../components/Checkout.jsx';

import { useUser } from '../contexts/UserContext';
import { useTenant } from '../contexts/TenantContext.jsx';

const CheckoutDetails = () => {
    const [selectedAddress, setSelectedAddress] = useState(null);

    const { user } = useUser();
    const { tenant } = useTenant

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
            <Checkout
                address={selectedAddress}
                setAddress={setSelectedAddress}
                email={user.email}
                tenant={tenant}
            />
        </div>
    );
};

export default CheckoutDetails;
