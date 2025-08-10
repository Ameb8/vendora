import './ProductCard.css';

function ProductCard({ product, onClick }) {
    function formatPrice(price) {
        const num = Number(price);
        return !isNaN(num) ? `${num.toFixed(2)}` : 'N/A';
    }

    return (
        <div
            className="card h-100 shadow-sm border-0 product-card"
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            {product.image ? (
                <div className="card-img-container">
                    <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                        style={{ objectFit: 'cover', height: '380px', width: '100%' }}
                    />
                </div>
            ) : (
                <div className="card-img-container">
                    <div
                        className="bg-secondary d-flex align-items-center justify-content-center"
                        style={{ height: '200px', color: 'white' }}
                    >
                        No Image
                    </div>
                </div>
            )}

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>

                {/* Description hidden by default, shown on hover */}
                <p className="card-description text-muted">{product.description}</p>

                <p className="card-text mt-auto fw-bold">${formatPrice(product.price)}</p>
            </div>
        </div>
    );
}

export default ProductCard;
