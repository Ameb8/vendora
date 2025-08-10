import { useState } from 'react';

export default function ModifyProduct({ product, onClose }) {
    const [name, setName] = useState(product.name || '');
    const [category, setCategory] = useState(product.category || '');
    const [price, setPrice] = useState(product.price || '');
    const [description, setDescription] = useState(product.description || '');
    const [amount, setAmount] = useState(product.amount || 0);
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('amount', amount);

        if (image) { // Append image if updated
            formData.append('image', image);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/products/${product.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`, // or however you store it
                },
                body: formData,
            });

            if (!res.ok) { // Error
                const errData = await res.json();
                console.error('Update failed:', errData);
                alert('Failed to update product');
            } else { // close modal on success
                console.log('Product updated successfully');
                onClose();
            }
        } catch (error) { // Error
            console.error('Network error:', error);
            alert('Network error');
        }
    };


    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Modify Product</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Amount in Stock</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
