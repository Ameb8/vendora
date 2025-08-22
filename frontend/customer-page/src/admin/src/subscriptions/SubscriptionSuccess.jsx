import { useEffect } from "react";
import { Container } from "react-bootstrap";

export default function SuccessPage() {
    useEffect(() => {
        // fetch(`${import.meta.env.VITE_API_URL}/subscriptions/current/`)
    }, []);

    return (
        <Container className="mt-4 text-center">
            <h2>✅ Subscription Successful!</h2>
            <p>Thank you for subscribing. Your subscription is now active.</p>
        </Container>
    );
}
