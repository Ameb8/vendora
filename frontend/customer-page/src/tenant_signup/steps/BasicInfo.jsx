import { useState, useEffect } from 'react';

const BasicInfo = ({ data, update, nextStep }) => {
    const [name, setName] = useState(data.name || '');
    const [logo, setLogo] = useState(data.logo || null); // logo as base64 or URL
    const [slug, setSlug] = useState(data.slug || '');


    useEffect(() => {
        setName(data.name || '');
        setLogo(data.logo || null);
        setSlug(data.slug || '');
    }, [data]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setLogo(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        update({ name, slug, logo });
        nextStep();
    };

    return (
        <div>
            <div className="mb-4">
                <label className="form-label">Enter your business’s name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Acme Corp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="form-label">Tenant Slug</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., acme-corp"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
                <small className="text-muted">
                    This will be used in your tenant URL. Must be unique.
                </small>
            </div>

            <div className="mb-4">
                <label className="form-label">Your logo</label>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleLogoChange}
                />
                {logo && (
                    <div className="mt-3">
                        <p className="mb-1">Preview:</p>
                        <img
                            src={logo}
                            alt="Logo Preview"
                            style={{ maxHeight: '100px', border: '1px solid #ccc' }}
                        />
                    </div>
                )}
            </div>

            <button className="btn btn-primary" onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default BasicInfo;
