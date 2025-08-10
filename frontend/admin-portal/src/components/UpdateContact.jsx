import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { useUser } from "../contexts/UserContext.jsx";
import ImageManager from "./ImageManager";

export default function UpdateAbout() {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const { user } = useUser();
    const imgURL = `${import.meta.env.VITE_API_URL}/design/image-in-list/`

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user and token
        const url = `${import.meta.env.VITE_API_URL}/design/page-text/update_text/`;
        const token = user?.token || localStorage.getItem('token');

        try { // Attempt API call
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    contact_num: phone,
                    contact_mail: email
                })
            });

            const data = await response.json(); // Await response

            if (!response.ok) { // Error Occurred
                throw new Error(data.detail || 'Update failed');
            }

            console.log('Success:', data);
            alert('Updated successfully!');
        } catch (error) { // Error occurred
            console.error('Error:', error);
            alert('Error updating page design.');
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="contactNum">Phone Number:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="contactNum"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                    />
                </div>

                <button type="submit" className="btn btn-primary mb-4">
                    Submit
                </button>
            </form>

            <h5>Upload Images</h5>
            {/* <ImageUpload listName="about"/> */}
            <ImageManager
                getURL={`${imgURL}?list_name=contact`}
                addURL={`${imgURL}add_image_to_list/`}
                deleteURL={imgURL}
                orderURL={`${imgURL}reorder/`}
                list = {'contact'}
            />

        </div>
    );
}

