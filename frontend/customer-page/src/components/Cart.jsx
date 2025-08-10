import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart({ isOpen, onClose }) {
    const { cart, removeItem } = useCart();
    const navigate = useNavigate();
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);


    // Close cart and navigate to checkout
    const handleCheckoutClick = () => {
        if (onClose) onClose();
        navigate('/checkout');
    };

    return (
        <div
            className={`cart-slideout ${isOpen ? 'open' : ''}`}
            style={{ backgroundColor: '#faf6ef' }}
        >
            <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5>Your Cart</h5>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={onClose}
                    aria-label="Close cart"
                >
                    ×
                </button>
            </div>

            <div className="cart-body p-3">
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>

                        <div className="cart-label-row d-flex align-items-center mb-2 px-2 fw-bold">
                            <div className="me-2" style={{ width: '40px' }}></div>
                            <div className="flex-grow-1">Item</div>
                            <div style={{ width: '70px', marginRight: '10px' }}>Price</div>
                            <div style={{ width: '70px', marginRight: '10px' }}>Amount</div>
                            <div style={{ width: '70px' }}>Total</div>
                        </div>


                        {cart.map(({ id, name, price, quantity, image }) => (
                            <div
                                key={id}
                                className="cart-item d-flex align-items-center px-2 py-2 border-top"
                            >
                                <img
                                    src={image}
                                    alt={name}
                                    className="me-2"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow-1">
                                    <div>{name}</div>
                                    <div
                                        className="remove-link"
                                        onClick={() => removeItem(id)}
                                    >
                                        remove
                                    </div>
                                </div>
                                <div style={{ width: '70px', marginRight: '10px' }}>${price}</div>
                                <div style={{ width: '70px', marginRight: '10px' }}>{quantity}</div>
                                <div style={{ width: '70px' }}>${(price * quantity)}</div>
                            </div>
                        ))}

                        <div className="d-flex justify-content-end border-top pt-3 mt-3 px-2">
                            <h5>Total: ${total.toFixed(2)}</h5>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={handleCheckoutClick}
                                disabled={cart.length === 0} // disable if cart empty
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}



