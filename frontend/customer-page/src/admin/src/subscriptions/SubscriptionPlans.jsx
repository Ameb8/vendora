import { useEffect, useState } from "react";
import { Button, Spinner, Card, Row, Col, Container } from "react-bootstrap";

export default function SubscriptionPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);

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
        console.log("Selected plan:", plan);
    };

    if (loading) {
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
