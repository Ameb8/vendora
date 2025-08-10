import { useEffect, useState, useContext } from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { ProductContext } from '../contexts/ProductContext';

function FilterCategory() {
    const [categoryList, setCategoryList] = useState([]);
    const {
        addCategory,
        removeCategory,
        currentCategories
    } = useContext(ProductContext);
    const baseURL = import.meta.env.VITE_API_URL;

    // Fetch category list from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${baseURL}/inventory/products/categories`);
                const data = await res.json();
                setCategoryList(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    // Handle toggle
    const handleToggle = (category) => {
        if (currentCategories.includes(category)) {
            removeCategory(category);
        } else {
            addCategory(category);
        }
    };

    return (
        <div className="my-3 text-center">
            <h5>Filter by Category</h5>
            <ButtonGroup className="d-flex flex-wrap justify-content-center gap-2">
                {categoryList.map((category, idx) => (
                    <ToggleButton
                        key={idx}
                        type="checkbox"
                        variant={currentCategories.includes(category) ? 'primary' : 'outline-primary'}
                        checked={currentCategories.includes(category)}
                        value={category}
                        onChange={() => handleToggle(category)}
                    >
                        {category}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </div>
    );
}

export default FilterCategory;
