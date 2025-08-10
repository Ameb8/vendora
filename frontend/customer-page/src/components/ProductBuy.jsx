import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useCartUI } from '../contexts/CartUIContext';

function QuantitySelector({ quantity, setQuantity }) {
    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    return (
        <div className="d-flex align-items-center gap-2 my-2">
            <button className="btn btn-outline-secondary" onClick={decrement}>-</button>
            <div style={{ minWidth: 30, textAlign: 'center' }}>{quantity}</div>
            <button className="btn btn-outline-secondary" onClick={increment}>+</button>
        </div>
    );
}

function ProductBuy({ product, onBack }) {
    const { triggerWiggle } = useCartUI();
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart()

    const handleAddToCart = () => {
        addItem(product, quantity);
        triggerWiggle();
    };

    return (
        <div className="container-fluid d-flex flex-column p-4" style={{ minHeight: '100vh' }}>
            <button
                className="btn btn-secondary mb-3 align-self-start"
                onClick={onBack}
            >
                &larr; Back to products
            </button>

            <div className="d-flex flex-column flex-grow-1 gap-4" style={{ minHeight: 0 }}>
                <div style={{ width: '100%' }}>
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                    ) : (
                        <div
                            className="bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{ height: '300px' }}
                        >
                            No Image
                        </div>
                    )}
                </div>

                <div className="flex-grow-1 d-flex flex-column">
                    <h2>{product.name}</h2>
                    <h4 className="text-muted mb-3">${Number(product.price).toFixed(2)} USD</h4>

                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

                    <button className="btn btn-primary mt-2" style={{ maxWidth: '200px' }} onClick={handleAddToCart}>
                        Add to cart
                    </button>
                </div>
            </div>

            <div className="mt-4" style={{ overflowY: 'auto' }}>
                <h5>Description</h5>
                <p>{product.description || 'No description available.'}</p>
            </div>
        </div>
    );
}

export default ProductBuy;


