import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from '../contexts/CartContext';
import AddressForm from './AddressForm';

export default function Checkout() {
    const navigate = useNavigate()
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { cart, clearCart } = useCart();

    const [address, setAddress] = useState({
        full_name: "",
        street_address: "",
        apartment_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone_number: ""
    });

    const url = `${import.meta.env.VITE_API_URL}/order/create-order/`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        setIsProcessing(true);

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
        }));

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    items,
                    shipping_address: address
                }),
            });

            if (!res.ok)
                throw new Error("Server error during order creation");

            const { clientSecret, orderCode } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { email },
                },
            });

            if (result.error) {
                alert(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                clearCart();
                navigate('/success', {
                    state: { orderCode }  // 👈 just this
                });
            }
        } catch (err) {
            alert(err.message);
        }

        setIsProcessing(false);
    };

    return (
        <div className="container my-5">
            <div className="card shadow-sm p-4" style={{ backgroundColor: "#fffdf9" }}>
                <h3 className="mb-3 text-center">Checkout</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            className="form-control"
                        />
                    </div>

                    <AddressForm address={address} setAddress={setAddress} />

                    <div className="my-4">
                        <label className="form-label">Card Information</label>
                        <div className="form-control py-2">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#32325d',
                                            fontFamily: 'Arial, sans-serif',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#fa755a',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={!stripe || isProcessing}
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}



