import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductBuy from './ProductBuy';

function ProductList({ tenant }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const url = `${import.meta.env.VITE_API_URL}/inventory/products/?tenant__slug=${tenant.slug}`;

    // Fetch products on mount or when tenant changes
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    params: {
                        tenant__slug: tenant.slug
                    }
                });

                // DEBUG *******
                console.log(`\n\nProductList\n\nurl:\t${url}\n`)
                // END DEBUG ***

                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        if (tenant?.slug) {
            fetchProducts();
        }
    }, [tenant]);

    // Filtering logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
        } else {
            const q = searchQuery.toLowerCase();
            setFilteredProducts(
                products.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
                )
            );
        }
    }, [searchQuery, products]);

    if (selectedProduct) {
        return <ProductBuy product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
    }

    return (
        <div>
            {loading ? (
                <div className="text-center mt-5">Loading products...</div>
            ) : (
                <>
                    <div className="container mt-3">
                        <input
                            className="form-control"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center mt-5">No products found.</div>
                    ) : (
                        <div className="container-fluid mt-4 px-4 mb-5">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="col">
                                        <ProductCard
                                            product={product}
                                            onClick={() => setSelectedProduct(product)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProductList;





/*

import { useContext, useState } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import ProductCard from './ProductCard';
import ProductBuy from './ProductBuy';

function ProductList({ tenant }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {
        products,
        loading,
        searchQuery,
        setSearchQuery,
        clearCategories,
        clearPrices,
        currentCategories,
        minPrice,
        maxPrice
    } = useContext(ProductContext);

    if (selectedProduct) {
        return <ProductBuy product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
    }

    const filtersActive =
        searchQuery.trim() !== '' ||
        currentCategories.length > 0 ||
        minPrice !== null ||
        maxPrice !== null;

    return (
        <div>
            {loading ? (
                <div className="text-center mt-5">Loading products...</div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center mt-5">No products found.</div>
                    ) : (
                        <div className="container-fluid mt-4 px-4 mb-5">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {products.map((product) => (
                                    <div key={product.id} className="col">
                                        <ProductCard
                                            product={product}
                                            onClick={() => setSelectedProduct(product)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {filtersActive && (
                <div
                    className="position-fixed bottom-0 start-50 translate-middle-x mb-4"
                    style={{ zIndex: 1030 }}
                >
                    <button
                        className="btn btn-outline-danger shadow"
                        onClick={() => {
                            setSearchQuery('');
                            clearCategories();
                            clearPrices();
                        }}
                        style={{ backgroundColor: '#faf6ef' }}
                    >
                        Remove Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductList;

*/