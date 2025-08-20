import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function Signup() {
    const [businessName, setBusinessName] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file)); // preview before upload
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!businessName || !image) {
            alert("Please fill out all fields.");
            return;
        }

        console.log("Business Name:", businessName);
        console.log("Image File:", image);

        alert("Signup successful! (stubbed)");
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Create Your Business Website</h2>
            <Form onSubmit={handleSubmit}>
                {/* Business Name */}
                <Form.Group className="mb-3" controlId="businessName">
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Upload Image */}
                <Form.Group className="mb-3" controlId="businessImage">
                    <Form.Label>Business Logo / Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
                </Form.Group>

                {/* Preview */}
                {preview && (
                    <div className="text-center mb-3">
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: "200px", borderRadius: "10px" }}
                        />
                    </div>
                )}

                <div className="d-grid">
                    <Button type="submit" variant="primary" size="lg">
                        Continue 🚀
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default Signup;
