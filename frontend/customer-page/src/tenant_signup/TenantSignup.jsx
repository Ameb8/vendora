import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import BasicInfo from './steps/BasicInfo.jsx';
import ColorSelector from './steps/ColorSelector.jsx';
import ContactInfo from "./steps/ContactInfo.jsx";

const LOCAL_STORAGE_KEY = 'tenant_data';

const TenantSignup = () => {
    const [step, setStep] = useState(1);
    const [tenant, setTenant] = useState({
        name: '',
        slug: '',
        email: '',
        phone: '',
        logo: '',
        primaryColor: '',
        secondaryColor: '',
        accentColor: '',

    });

    useEffect(() => {
        const storedTenant = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedTenant) {
            setTenant(JSON.parse(storedTenant));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tenant));
    }, [tenant]);

    const updateTenant = (data) => {
        setTenant((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Create Tenant</h2>

                {step === 1 && (
                    <BasicInfo
                        data={tenant}
                        update={updateTenant}
                        nextStep={nextStep}
                    />
                )}
                {step === 2 && (
                    <ContactInfo
                        data={tenant}
                        update={updateTenant}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )}

                {step === 3 && (
                    <ColorSelector
                        data={tenant}
                        update={updateTenant}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )}
            </div>
        </div>
    );
};

export default TenantSignup;
