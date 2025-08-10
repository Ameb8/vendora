import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { ProductContext } from '../contexts/ProductContext.jsx';
import PriceSlider from '../components/PriceSlider';

function ShopBy({ onClose }) {
    const { addCategory, removeCategory, currentCategories } = useContext(ProductContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseURL = import.meta.env.VITE_API_URL;

    // Fetch categories list on mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch(`${baseURL}/inventory/products/categories`);
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    // Handler for toggling category selection
    const toggleCategory = (category) => {
        if (currentCategories.includes(category)) {
            removeCategory(category);
        } else {
            addCategory(category);
        }
    };

    if (loading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-start mb-3">
                <Button variant="outline-secondary" size="sm" onClick={onClose}>
                    &larr; Back
                </Button>
            </div>

            <div className="d-flex gap-3 flex-wrap">
                {categories.map((category) => {
                    const isActive = currentCategories.includes(category);
                    return (
                        <button
                            key={category}
                            type="button"
                            className={`btn ${isActive ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => toggleCategory(category)}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            <PriceSlider />
        </div>
    );
}

export default ShopBy;
