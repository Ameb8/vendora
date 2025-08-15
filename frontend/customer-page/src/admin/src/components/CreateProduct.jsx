import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTenant } from '../contexts/TenantContext';

function appendDefaultFormData(formData) {
    formData.append('weight_value', 1);
    formData.append('weight_unit', 'lb');
    formData.append('length', 3);
    formData.append('width', 3);
    formData.append('height', 7);
    formData.append('distance_unit', 'in');
}


function CreateProductForm() {
    const { currentTenant, loading } = useTenant();

    if (loading) return <div>Loading...</div>;

    const { user } = useUser();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        image: null,
        amount: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
    };

    const incrementAmount = () => {
        setFormData(prev => ({ ...prev, amount: prev.amount + 1 }));
    };

    const decrementAmount = () => {
        setFormData(prev => ({ ...prev, amount: Math.max(1, prev.amount - 1) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseURL = import.meta.env.VITE_API_URL;
        const url = `${baseURL}/inventory/products/`;
        console.log('CreateProduct call url:', url)

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('category', formData.category);
        payload.append('description', formData.description);
        payload.append('price', formData.price);
        payload.append('image', formData.image);
        payload.append('amount', formData.amount);
        payload.append('tenant', currentTenant.id);
        payload.append('tenant_id', currentTenant.id);

        appendDefaultFormData(payload);

        try {
            console.log(`Token: ${token}`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: payload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating product:', errorData);
                alert('Failed to create product.');
                return;
            }

            const result = await response.json();
            console.log('Product created:', result);
            alert('Product created successfully!');

            // Reset form
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                image: null,
                amount: 1,
            });

        } catch (err) {
            console.error('Network error:', err);
            alert('Network error. Could not create product.');
        }
    };


    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Create Product</h2>

            <label>
                Product Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <br />

            <label>
                Category:
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
            </label>

            <br />

            <label>
                Description:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </label>

            <br />

            <label>
                Price:
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                />
            </label>

            <br />

            <label>
                Product Image:
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
            </label>

            <br />

            <label>
                Quantity:
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button type="button" onClick={decrementAmount}>-</button>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        min="1"
                        readOnly
                        style={{ width: '60px', textAlign: 'center' }}
                    />
                    <button type="button" onClick={incrementAmount}>+</button>
                </div>
            </label>

            <br /><br />

            <button type="submit">Create Product</button>
        </form>
    );
}

export default CreateProductForm;
