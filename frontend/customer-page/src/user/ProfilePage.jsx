import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Container, Card, Row, Col, Button, Spinner, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaEnvelope, FaSignOutAlt, FaUserShield, FaBuilding } from 'react-icons/fa';

const ProfilePage = () => {
    const { user, loading, logout } = useUser();
    const [tenants, setTenants] = useState([]);
    const [tenantsLoading, setTenantsLoading] = useState(true);
    const [tenantsError, setTenantsError] = useState(null);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/tenants/public/`);
                if (!response.ok) throw new Error('Failed to fetch tenants');
                const data = await response.json();
                setTenants(data);
            } catch (error) {
                setTenantsError(error.message);
            } finally {
                setTenantsLoading(false);
            }
        };

        fetchTenants();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="text-center mt-5">
                <h4 className="text-danger">User not logged in</h4>
            </Container>
        );
    }

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex align-items-center mb-4">
                        <FaUserCircle size={64} className="text-primary me-3" />
                        <div>
                            <h4 className="mb-0">{user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</h4>
                            <small className="text-muted">@{user.username}</small>
                        </div>
                    </div>

                    <Row className="mb-3">
                        <Col xs={1}><FaEnvelope className="text-muted" /></Col>
                        <Col><strong>Email:</strong> {user.email || <span className="text-muted">Not provided</span>}</Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={1}><FaUserShield className="text-muted" /></Col>
                        <Col>
                            <strong>Staff:</strong> {user.is_staff ? 'Yes' : 'No'}
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={1}><span className="text-muted">🆔</span></Col>
                        <Col>
                            <strong>User ID:</strong> {user.id}
                        </Col>
                    </Row>

                    {/* My Businesses Dropdown */}
                    <Row className="mb-3">
                        <Col xs={1}><FaBuilding className="text-muted" /></Col>
                        <Col>
                            <strong>My Businesses:</strong>
                            {tenantsLoading ? (
                                <Spinner animation="border" size="sm" className="ms-2" />
                            ) : tenantsError ? (
                                <div className="text-danger ms-2">{tenantsError}</div>
                            ) : tenants.length > 0 ? (
                                <Dropdown className="mt-2">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-tenants">
                                        Select Business
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {tenants.map((tenant) => (
                                            <Dropdown.Item key={tenant.id}>
                                                {tenant.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <div className="text-muted ms-2">No businesses found</div>
                            )}
                        </Col>
                    </Row>

                    <div className="text-end mt-4">
                        <Button variant="outline-danger" onClick={logout}>
                            <FaSignOutAlt className="me-2" />
                            Logout
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfilePage;
