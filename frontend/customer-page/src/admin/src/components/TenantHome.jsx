import { useNavigate } from "react-router-dom";

import { Card, Row, Col, Spinner, Badge, Image, Button } from "react-bootstrap";

import { useTenant } from "../contexts/TenantContext";

const TenantHome = () => {
    const { currentTenant, loading } = useTenant();
    const navigate = useNavigate();

    const handleCreateSubscription = () => {
        navigate("/admin/subscriptions");
    };


    if (loading)
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status" />
                <p className="mt-2">Loading tenant...</p>
            </div>
        );

    if (!currentTenant)
        return (
            <div className="text-center my-5 text-muted">
                <p>No tenant selected.</p>
            </div>
        );

    const {
        name,
        email,
        phone,
        image_url,
        slug,
        color_primary,
        color_accent,
        subscription,
    } = currentTenant;

    const plan = subscription?.plan;
    const isActive = subscription?.status === "active";

    // Format date safely
    const formattedDate = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
        : null;

    return (
        <Card
            className="shadow-sm my-4 mx-auto border-0"
            style={{
                maxWidth: "650px",
                backgroundColor: color_primary || "#fff",
            }}
        >
            <Card.Body className="text-center py-4">
                {/* Logo */}
                {image_url && (
                    <Image
                        src={image_url}
                        alt={name}
                        roundedCircle
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        className="mb-3 shadow-sm"
                    />
                )}

                {/* Tenant Name and Status */}
                <h2 className="fw-bold mb-1" style={{ color: color_accent || "#333" }}>
                    {name}
                </h2>

                {subscription ? (
                    <Badge bg={isActive ? "success" : "secondary"} className="mb-3">
                        {isActive ? "Active Subscription" : "Inactive"}
                    </Badge>
                ) : (
                    <Badge bg="warning" text="dark" className="mb-3">
                        No Subscription
                    </Badge>
                )}

                {/* Contact Info */}
                <Row className="justify-content-center text-muted mb-3">
                    <Col xs="auto">
                        {phone && <p className="mb-1">{phone}</p>}
                        {email && <p className="mb-1">{email}</p>}
                        {slug && (
                            <p className="mb-1">
                                <a
                                    href={`${import.meta.env.VITE_DOMAIN}/${slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {`${import.meta.env.VITE_DOMAIN}/${slug}`}
                                </a>
                            </p>
                        )}

                    </Col>
                </Row>

                <hr />

                {/* Subscription Info Section */}
                {subscription ? (
                    <div className="text-start px-3">
                        <h5 className="fw-semibold mb-2">Subscription Details</h5>

                        <Row>
                            <Col xs={6}>
                                <p className="mb-1 text-muted">Plan</p>
                                <p className="fw-semibold">{plan?.name || "Unknown"}</p>
                            </Col>
                            <Col xs={6}>
                                <p className="mb-1 text-muted">Price</p>
                                {plan ? (
                                    <p className="fw-semibold">
                                        ${plan.amount / 100} / {plan.interval}
                                    </p>
                                ) : (
                                    <p className="fw-semibold text-muted">—</p>
                                )}
                            </Col>
                        </Row>

                        {formattedDate && (
                            <Row>
                                <Col xs={12}>
                                    <p className="mb-1 text-muted">Renews On</p>
                                    <p className="fw-semibold text-primary">{formattedDate}</p>
                                </Col>
                            </Row>
                        )}

                        {!isActive && (
                            <div className="text-center mt-3">
                                <Button variant="outline-primary" size="sm">
                                    Reactivate Subscription
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-muted py-3">
                        <p>No active or existing subscription found.</p>
                        <Button variant="primary" size="sm" onClick={handleCreateSubscription}>
                            Subscribe Now
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default TenantHome;
