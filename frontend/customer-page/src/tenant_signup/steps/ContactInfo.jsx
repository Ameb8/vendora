import { useState, useEffect } from 'react';

const ContactInfo = ({ data, update, nextStep, prevStep }) => {
    const [phone, setPhone] = useState(data.phone || '');
    const [email, setEmail] = useState(data.email || '');

    useEffect(() => {
        setPhone(data.phone || '');
        setEmail(data.email || '');
    }, [data]);

    const handleNext = () => {
        update({ phone, email });
        nextStep();
    };

    const handlePrev = () => {
        update({ phone, email });
        prevStep();
    };

    return (
        <div>
            <div className="mb-4">
                <label className="form-label">Enter your business’s phone number</label>
                <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="form-label">Enter your business’s email</label>
                <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button className="btn btn-primary" onClick={handleNext}>
                Next
            </button>

            <button className="btn btn-primary" onClick={handlePrev}>
                Previous
            </button>
        </div>
    );
};

export default ContactInfo;
