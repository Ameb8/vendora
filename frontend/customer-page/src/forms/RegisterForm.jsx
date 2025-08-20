import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const RegisterForm = () => {
    const { login } = useUser();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/accounts/register/`,
                { username, email, password }
            );
            const token = response.data.token;
            login(token); // immediately log them in after registration
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                />
            </Form.Group>

            <Button type="submit" variant="success" disabled={loading} className="w-100">
                {loading ? <Spinner animation="border" size="sm" /> : 'Create Account'}
            </Button>
        </Form>
    );
};

export default RegisterForm;
