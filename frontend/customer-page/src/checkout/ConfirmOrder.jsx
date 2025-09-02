import { useCheckout } from './CheckoutContext';
import { Button } from 'react-bootstrap';

const ConfirmOrder = () => {
    const { address } = useCheckout(); // Get the selected address from context

    // Handle the custom action (e.g., API call) on confirmation
    const handleConfirm = () => {
        // Placeholder for any action you'd like to perform
        console.log("Address confirmed:", address);
        // Here you would make an API call or trigger any other action you want.
    };

    if (!address) {
        return <p>Please select an address first.</p>;
    }

    return (
        <div className="confirm-address">
            <h4>Confirm Order</h4>
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
