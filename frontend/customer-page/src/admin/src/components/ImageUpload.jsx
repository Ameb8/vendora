// ImageUploader.jsx
import React, { useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';

export default function ImageUploader({ listName }) {
    const { user } = useUser();
    const token = user?.token || localStorage.getItem('token');
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // Get file
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Upload Image
    const handleUpload = async () => {
        if (!imageFile) { // No image selected
            alert('Please select an image first.');
            return;
        }
        if (!token) { // No valid token
            alert('You must be logged in to upload images.');
            return;
        }

        // Create Payload for upload
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('list_name', listName);

        // Get URL
        const url = `${import.meta.env.VITE_API_URL}/design/image-in-list/`;

        try { // Attempt upload
            const res = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Token ${token}` },
                body: formData,
            });

            if (!res.ok) { // Upload error
                const errData = await res.json().catch(() => ({}));
                console.error('Upload error:', errData);
                alert(errData.message || 'Failed to upload image.');
                return;
            }

            // Succesfull upload
            const data = await res.json();
            console.log('Image uploaded:', data);
            alert('Image uploaded successfully!');

            // reset file input + state
            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) { // Upload Error
            console.error('Network error:', err);
            alert('Network error. Could not upload image.');
        }
    };

    return (
        <div className="my-3">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control mb-2"
            />

            <button type="button" className="btn btn-secondary" onClick={handleUpload}>
                Upload to&nbsp;{listName}
            </button>
        </div>
    );
}
