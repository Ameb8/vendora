import { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { useTenant } from "../contexts/TenantContext.jsx";

const CurrentSubscription = () => {
    const { currentTenant, loading: tenantLoading } = useTenant();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tenantLoading || !currentTenant) return;

        const fetchSubscription = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/subscriptions/current/${currentTenant.slug}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch subscription");
                }

                const data = await res.json();
                setSubscription(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [tenantLoading, currentTenant]);

    if (tenantLoading || loading) {
        return (
            <div className="d-flex justify-content-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-4">
                {error}
            </Alert>
        );
    }

    if (!subscription) {
        return (
            <Alert variant="info" className="mt-4">
                You do not have an active subscription.
            </Alert>
        );
    }

    return (
        <Card className="mt-4 shadow-sm">
            <Card.Body>
                <Card.Title>Current Subscription</Card.Title>
                <Card.Text>
                    <strong>Plan:</strong> {subscription.plan.name} <br />
                    <strong>Description:</strong> {subscription.plan.description} <br />
                    <strong>Status:</strong>{" "}
                    <span
                        className={
                            subscription.is_active ? "text-success" : "text-warning"
                        }
                    >
            {subscription.status}
          </span>{" "}
                    <br />
                    <strong>Expires on:</strong>{" "}
                    {new Date(subscription.current_period_end).toLocaleString()}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default CurrentSubscription;
