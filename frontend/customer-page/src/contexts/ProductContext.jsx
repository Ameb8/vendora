import { createContext, useState, useEffect, useCallback } from 'react';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const baseURL = `${import.meta.env.VITE_API_URL}/inventory/products/` ;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Generate full URL with category and price filters
    const buildUrl = () => {
        const queryParams = [];

        if (categories.length > 0) {
            categories.forEach(cat => {
                queryParams.push(`category=${encodeURIComponent(cat)}`);
            });
        }

        if (minPrice !== null) {
            queryParams.push(`price_min=${minPrice}`);
        }

        if (maxPrice !== null) {
            queryParams.push(`price_max=${maxPrice}`);
        }

        if (searchQuery.trim() !== '') {
            queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);
        }

        return `${baseURL}${queryParams.length ? '?' + queryParams.join('&') : ''}`;
    };

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(buildUrl());
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [categories, minPrice, maxPrice, searchQuery]);

    // Run fetch on mount and whenever categories change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Methods to modify category filter
    const addCategory = (cat) => {
        setCategories(prev => prev.includes(cat) ? prev : [...prev, cat]);
    };

    const removeCategory = (cat) => {
        setCategories(prev => prev.filter(c => c !== cat));
    };

    const clearCategories = () => {
        setCategories([]);
    };

    const clearMinPrice = () => setMinPrice(null);
    const clearMaxPrice = () => setMaxPrice(null);
    const clearPrices = () => {
        setMinPrice(null);
        setMaxPrice(null);
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            addCategory,
            removeCategory,
            clearCategories,
            currentCategories: categories,
            minPrice,
            maxPrice,
            setMinPrice,
            setMaxPrice,
            clearMinPrice,
            clearMaxPrice,
            clearPrices,
            searchQuery,
            setSearchQuery
        }}>
            {children}
        </ProductContext.Provider>
    );
}
