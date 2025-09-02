import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';

export default function Checkout({ address, setAddress, email: propEmail, tenant: propTenant }) {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState(propEmail || "");
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [orderCode, setOrderCode] = useState(null);

    const { cart, clearCart } = useCart();
    const { tenant: contextTenant } = useTenant();
    const tenant = propTenant || contextTenant;

    const url = `${import.meta.env.VITE_API_URL}/orders/create-order/`;

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
    }));

    // Create order on render
    useEffect(() => {
        const createOrder = async () => {
            if (!email || !address?.id || !tenant?.id || cart.length === 0) {
                let dbg = `Console Log Failed: email: ${email}, address: ${address}, tenant: ${tenant}, cart: ${cart.length}`;
                console.log(dbg);
                return;
            }

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        shipping_address: address.id,
                        tenant: tenant.id,
                        items,
                    }),
                });

                if (!res.ok) {
                    throw new Error("Failed to create order");
                }

                const data = await res.json();
                setClientSecret(data.clientSecret);
                setOrderCode(data.orderCode);

            } catch (err) {
                console.error(err);
                alert("Error creating order. Please try again.");
            }
        };

        createOrder();
    }, [email, address?.id, tenant?.id, cart.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderCode) {
            alert("Order not created yet. Please wait.");
            return;
        }

        setIsProcessing(true);

        try {
            // Call api to get client secret
            const paymentRes = await fetch(
                `${import.meta.env.VITE_API_URL}/payments/create/${orderCode}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    },
                }
            );

            if (!paymentRes.ok) {
                const errorData = await paymentRes.json();
                throw new Error(errorData.detail || "Failed to create payment.");
            }

            const paymentData = await paymentRes.json();
            const { client_secret } = paymentData;

            // Confirm the payment with Stripe
            const result = await stripe.confirmCardPayment(client_secret, {
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
                    state: { orderCode },
                });
            }

        } catch (err) {
            alert(err.message || "Payment failed.");
        }

        setIsProcessing(false);
    };

    return (
        <div className="container my-5">
            <div className="card shadow-sm p-4" style={{ backgroundColor: tenant.color_primary }}>
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
                        disabled={!stripe || isProcessing || !clientSecret}
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}








/*

import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext';
import AddressForm from './AddressForm';

export default function Checkout({ address, setAddress, email}) {
    const navigate = useNavigate()
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { cart, clearCart } = useCart();
    const { tenant } = useTenant();

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
                    state: { orderCode }
                });
            }
        } catch (err) {
            alert(err.message);
        }

        setIsProcessing(false);
    };

    return (
        <div
            className="container my-5">
            <div className="card shadow-sm p-4" style={{ backgroundColor: tenant.color_primary }}>
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


*/
