import { useEffect, useState } from "react";
import { Button, Spinner, Card, Row, Col, Container } from "react-bootstrap";
import { useTenant } from "../contexts/TenantContext.jsx";

export default function SubscriptionPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [subscribing, setSubscribing] = useState(false);
    const { currentTenant, loading: tenantLoading } = useTenant();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/subscriptions/plans/`
                );

                if (!response.ok) throw new Error("Failed to load subscription plans");
                const data = await response.json();
                setPlans(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleSubscribe = async () => {
        if (!selectedPlan) return;
        setSubscribing(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/subscriptions/create-checkout-session/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`,
                    },
                    body: JSON.stringify({ plan_id: selectedPlan.id }),
                }
            );

            if (!response.ok) throw new Error("Failed to create checkout session");
            const data = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = data.checkout_url;
        } catch (err) {
            console.error("Error creating checkout session:", err);
            setSubscribing(false);
        }
    };

    if (loading || tenantLoading) {
        return (
            <div className="d-flex justify-content-center p-4">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="g-4">
                {plans.map((plan) => (
                    <Col key={plan.id} md={6} lg={4}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold">{plan.name}</Card.Title>
                                <Card.Text className="text-muted flex-grow-1">
                                    {plan.description || "No description available."}
                                </Card.Text>
                                <Button
                                    variant={selectedPlan?.id === plan.id ? "success" : "primary"}
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    {selectedPlan?.id === plan.id
                                        ? "Selected"
                                        : "Choose this plan"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
