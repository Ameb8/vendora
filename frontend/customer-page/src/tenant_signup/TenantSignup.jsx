import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import BasicInfo from './steps/BasicInfo.jsx';
import ColorSelector from './steps/ColorSelector.jsx';
import ContactInfo from "./steps/ContactInfo.jsx";

const LOCAL_STORAGE_KEY = 'tenant_data';

const TenantSignup = () => {
    const navigate = useNavigate();
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

    const createTenant = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tenants/view/`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: tenant.name,
                    slug: tenant.slug,
                    email: tenant.email,
                    phone: tenant.phone,
                    color_primary: tenant.primaryColor,
                    color_secondary: tenant.secondaryColor,
                    color_accent: tenant.accentColor,
                    domain: tenant.slug
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to create tenant:", errorData);
                alert("Error creating tenant: " + (errorData.detail || "Unknown error"));
                return;
            }

            const data = await response.json();
            console.log("Tenant created:", data);

            // Clear local storage and navigate away
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            navigate('/admin/tutorials');

        } catch (err) {
            console.error("Error creating tenant:", err);
            alert("Network or server error while creating tenant");
        }
    };


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

    const nextStep = () => {
        if (step === 3) { // Redirect when steps completed
            createTenant();
            navigate('/admin/tutorials'); 
        } else {
            setStep((prev) => prev + 1);
        }
    };
    
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
