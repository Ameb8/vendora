import { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCheckout } from './CheckoutContext';
import { useUser } from '../contexts/UserContext';
import { Spinner, Alert } from 'react-bootstrap';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: 'Arial, sans-serif',
            '::placeholder': {
                color: '#a0aec0',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
};

const MakePayment = () => {
    const { order } = useCheckout();
    const { user } = useUser();
    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchClientSecret = async () => {
            if (!order?.id) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/create/${order.id}/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to create payment');
                }

                const data = await res.json();
                setClientSecret(data.client_secret);
            } catch (err) {
                console.error(err);
                setError('Could not initiate payment. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchClientSecret();
    }, [order, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!stripe || !elements || !clientSecret) return;

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: user?.name || 'Customer',
                    email: user?.email,
                },
            },
        });

        if (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        } else {
            if (paymentIntent.status === 'succeeded') {
                setPaymentSuccess(true);
                // Webhook will update order/payment status
            } else {
                setError('Payment did not succeed.');
            }
            setLoading(false);
        }
    };

    if (loading && !clientSecret) return <Spinner animation="border" />;

    return (
        <div>
            <h4>Enter your payment details:</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            {paymentSuccess && <Alert variant="success">Payment succeeded! 🎉</Alert>}

            <form onSubmit={handleSubmit}>
                <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || !elements || loading || paymentSuccess}
                    className="btn btn-primary"
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default MakePayment;
