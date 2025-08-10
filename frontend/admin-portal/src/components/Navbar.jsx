import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();

    return (
        <>
            {/* Skinny vertical bar with hamburger */}
            <div className="vertical-navbar navbar text-white d-flex flex-column align-items-center">
                <button
                    className="navbar-toggler custom-toggler mt-3"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasMenu"
                    aria-controls="offcanvasMenu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>

            {/* Offcanvas full menu */}
            <div
                className="offcanvas offcanvas-start bg-dark text-white"
                tabIndex="-1"
                id="offcanvasMenu"
                aria-labelledby="offcanvasMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasMenuLabel">Admin Menu</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body d-flex flex-column gap-3">
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        🏠 Product List
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/orders');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📦 Paid Orders
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/about');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📝 Update About
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/contact');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📞 Update Contact
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/create-user');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        👤 Create Admin Account
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/create-product');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        ➕ Create New Product
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/order-notifications');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        🔔 Manage Order Alerts
                    </button>
                    <button className="btn btn-outline-light text-start" onClick={() => {
                        navigate('/metrics');
                        document.querySelector('#offcanvasMenu .btn-close').click();
                    }}>
                        📊 Business Metrics
                    </button>

                </div>
            </div>
        </>
    );
}

export default Navbar;
