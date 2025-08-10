import { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const AdminRegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMsg, setStatusMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg(null);
        setErrorMsg(null);

        try {
            const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

                const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts/register-admin/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMsg(`Admin "${username}" created successfully.`);
                setUsername('');
                setPassword('');
            } else {
                setErrorMsg(data.error || 'Something went wrong');
            }
        } catch (error) {
            setErrorMsg('Unable to connect to the server.');
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '400px' }}>
            <h3>Create New Admin</h3>
            {statusMsg && <Alert variant="success">{statusMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formAdminUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter new admin username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAdminPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register Admin
                </Button>
            </Form>
        </Container>
    );
};

export default AdminRegisterForm;