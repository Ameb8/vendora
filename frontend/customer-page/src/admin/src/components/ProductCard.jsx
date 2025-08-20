import './ProductCard.css';

function ProductCard({ product, onEditClick, onDeleteClick }) {
    function formatPrice(price) {
        const num = Number(price);
        return !isNaN(num) ? `${num.toFixed(2)}` : 'N/A';
    }

    return (
        <div className="card h-100 shadow-sm border-0 product-card">
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary position-absolute"
                style={{ top: '0.5rem', left: '0.5rem', zIndex: 10 }}
                onClick={() => onEditClick(product)}
                aria-label={`Edit ${product.name}`}
            >
                🔧
            </button>

            <button
                type="button"
                className="btn btn-sm btn-outline-danger position-absolute"
                style={{ top: '0.5rem', right: '0.5rem', zIndex: 10 }}
                onClick={() => onDeleteClick(product)}
                aria-label={`Delete ${product.name}`}
            >
                🗑️
            </button>

            {product.image_url ? (
                <img
                    src={product.image_url}
                    className="card-img-top"
                    alt={product.name}
                    style={{ objectFit: 'cover'}}
                />
            ) : (
                <div
                    className="bg-secondary d-flex align-items-center justify-content-center"
                    style={{ height: '200px', color: 'white' }}
                >
                    No Image
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
