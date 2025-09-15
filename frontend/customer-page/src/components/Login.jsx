import './Login.css'
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import GoogleLoginButton from './GoogleLoginButton';
import LoginForm from '../forms/LoginForm.jsx';
import RegisterForm from '../forms/RegisterForm.jsx';

const Login = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="text-center d-flex flex-column align-items-center gap-3 bg-white p-3 rounded shadow">
            {/* Login button */}
            <Button
                className="google-style-btn"
                onClick={() => setShowLogin(true)}
            >
                Login
            </Button>

            {/* Create Account button */}
            <Button variant="success" size="lg" onClick={() => setShowRegister(true)}>
                Create Account
            </Button>

            {/* Google Login button */}
            <GoogleLoginButton />

            {/* Login Modal */}
            <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm />
                </Modal.Body>
            </Modal>

            {/* Register Modal */}
            <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegisterForm />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Login;


