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
        <div className="text-center d-flex flex-column align-items-center gap-3">
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



/*

import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import GoogleLoginButton from './GoogleLoginButton';
import LoginForm from '../forms/LoginForm.jsx';

const Login = () => {
    const [show, setShow] = useState(false);

    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <div className="text-center d-flex flex-column align-items-center gap-3">
            <Button variant="primary" size="lg" onClick={handleOpen}>
                Login
            </Button>

            <GoogleLoginButton />

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Login;


 */