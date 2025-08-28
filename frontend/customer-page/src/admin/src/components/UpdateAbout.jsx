import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { useUser } from "../contexts/UserContext.jsx";
import { useTenant } from "../contexts/TenantContext.jsx";
import ImageManager from "./ImageManager";

export default function UpdateAbout() {
    const [header, setHeader] = useState('');
    const [body, setBody] = useState('');
    const { user } = useUser();
    const { currentTenant, loading } = useTenant();
    const imgURL = `${import.meta.env.VITE_API_URL}/designs/${currentTenant.slug}/images/`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(`\n\nTenant:\n\n${currentTenant}\n\n`)// DEBUG *****

        // Get user and token
        // const url = `${import.meta.env.VITE_API_URL}/designs/page-text/update_text/`;
        const url = `${import.meta.env.VITE_API_URL}/designs/page/${currentTenant.slug}/`;
        const token = user?.token || localStorage.getItem('token');

        try { // Attempt API call
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    about_us_title: header,
                    about_us_body: body
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
                    <label htmlFor="aboutHeader">About us Header:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="aboutHeader"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                        placeholder="Enter a short heading"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="aboutBody">About us Body:</label>
                    <textarea
                        className="form-control"
                        id="aboutBody"
                        rows="5"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Enter more detailed info here"
                    />
                </div>

                <button type="submit" className="btn btn-primary mb-4">
                    Submit
                </button>
            </form>

            <h5>Upload Images</h5>
            <ImageManager
                getURL={`${imgURL}?list_name=about`}
                addURL={`${imgURL}add_image_to_list/`}
                deleteURL={imgURL}
                orderURL={`${imgURL}reorder/`}
                list = {'about'}
            />

        </div>
    );
}

