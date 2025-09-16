import { Button } from 'react-bootstrap';
import { useCheckout } from './CheckoutContext';
import { fmtUSD } from '../utils/formatCurrency.js';

const ConfirmOrder = () => {
    const { address, order } = useCheckout();

    const handleConfirm = () => {
        console.log("Address confirmed:", address);
    };

    if (!address) {
        return <p>Please select an address first.</p>;
    }

    return (
        <div className="confirm-address">
            <h2>Confirm Order</h2>

            <h4>Shipping Cost:</h4>
            {order ? (
                <p>{fmtUSD(order.shipping_cost)}</p>
            ) : (
                <p>Calculating shipping...</p>
            )}

            <h4>Address:</h4>
            <p><strong>Street:</strong> {address.address.street_address}</p>
            <p><strong>Apartment:</strong> {address.address.apartment_address}</p>
            <p><strong>City:</strong> {address.address.city}</p>
            <p><strong>State:</strong> {address.address.state}</p>
            <p><strong>Postal Code:</strong> {address.address.postal_code}</p>
            <p><strong>Country:</strong> {address.address.country}</p>
        </div>
    );
};

export default ConfirmOrder;






/*
import { Button } from 'react-bootstrap';

import { useCheckout } from './CheckoutContext';
import { fmtUSD } from '../utils/formatCurrency.js';

const ConfirmOrder = () => {
    const { address, order } = useCheckout();

    const handleConfirm = () => {
        console.log("Address confirmed:", address);
    };

    if (!address) {
        return <p>Please select an address first.</p>;
    }

    return (
        <div className="confirm-address">
            <h2>Confirm Order</h2>
            <h4>Shipping Cost:</h4>
            <p>{fmtUSD(order.shipping_cost)}</p>
            <h4>Address:</h4>
            <p><strong>Street:</strong> {address.address.street_address}</p>
            <p><strong>Apartment:</strong> {address.address.apartment_address}</p>
            <p><strong>City:</strong> {address.address.city}</p>
            <p><strong>State:</strong> {address.address.state}</p>
            <p><strong>Postal Code:</strong> {address.address.postal_code}</p>
            <p><strong>Country:</strong> {address.address.country}</p>

        </div>
    );
};

export default ConfirmOrder;

*/