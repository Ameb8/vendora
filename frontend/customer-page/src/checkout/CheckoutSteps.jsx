import { useState, useEffect } from 'react';
import { Button, ProgressBar, Row, Col } from 'react-bootstrap';

import SelectAddress from '../address/SelectAddress';
import Checkout from '../components/Checkout.jsx';
import ConfirmOrder from './ConfirmOrder.jsx';

import { useCheckout } from '../checkout/CheckoutContext';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext.jsx';
import { useUser } from '../contexts/UserContext.jsx';

const CheckoutSteps = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [canProceedState, setCanProceedState] = useState(false);

    const { address } = useCheckout();
    const { cart } = useCart()
    const { tenant } = useTenant();
    const { user } = useUser();
    const { setOrder } = useCheckout();

    const email = 'test@test.com';
    const baseURL = `${import.meta.env.VITE_API_URL}`
    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
    }));

    const createOrder = async () => {
        // DEBUG ****
        console.log(address)
        for (const key in address) {
            if (address.hasOwnProperty(key)) {
                console.log(`${key}: ${address[key]}`);
            }
        }
        try {
            // DEBUG *******
            console.log("Shipping address ID:", address.id);
            console.log("Request body:", JSON.stringify({
                email,
                shipping_address: address.id,
                tenant: tenant.id,
                items,
            }));
            // END DEBUG ***

            const res = await fetch(`${baseURL}/orders/create-order/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    shipping_address: address.id,
                    tenant: tenant.id,
                    items,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create order");
            }

            const data = await res.json();
            setOrder(data);
            console.log(`\n\nOrder Object Created:\n\n${data}\n\n`);
        } catch (err) {
            console.error(err);
            alert("Error creating order. Please try again.");
        }
    }

    const steps = [
        {
            label: 'Select Address',
            component: <SelectAddress />,
            onNext: createOrder,
            // canProceed: () => Boolean(address && address.id)
        },
        {
            label: 'Confirm Order',
            component: <ConfirmOrder />,
            buttonText: 'Proceed to Payment'
        },
        {
            label: 'Checkout',
            component: <Checkout />
        },

    ];

    const nextStep = async () => {
        const step = steps[currentStep];

        if (step.onNext) {
            step.onNext()
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleConfirmOrder = () => {
        setCurrentStep(currentStep + 1);
    };

    const canProceed = () => {
        if (currentStep === 0) {
            return Boolean(address /*&& address.id*/);
        }
        return true;
    };

    useEffect(() => {
        console.log("Use effect Ran"); // DEBUG *******
        console.log(`Address: ${address}`);
        /*
        const step = steps[currentStep];
        if (step.canProceed) {
            const canProceedNow = step.canProceed();
            setCanProceedState(canProceedNow);
        }
         */
    }, [address, currentStep]);

    // Determine the button text based on the current step
    const getButtonText = () => steps[currentStep].buttonText || 'Next';

    return (
        <div className="container my-5">
            <h2>Checkout Process</h2>

            {/* Progress Bar */}
            <Row className="mb-4">
                <Col>
                    <ProgressBar
                        now={((currentStep + 1) / steps.length) * 100}
                        label={`${currentStep + 1} of ${steps.length}`}
                    />
                </Col>
            </Row>

            {/* Step Content */}
            <div className="step-content">
                {steps[currentStep].component}
            </div>

            {/* Navigation Buttons */}
            <Row className="mt-4">
                <Col className="d-flex justify-content-between">
                    <Button
                        variant="secondary"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        Back
                    </Button>
                    <Button
                        variant="primary"
                        onClick={nextStep}
                        disabled={!canProceed() || currentStep === steps.length - 1}
                    >
                        {getButtonText()}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutSteps;






/*
import { useState, useEffect } from 'react';
import { Button, ProgressBar, Row, Col } from 'react-bootstrap';

import SelectAddress from '../address/SelectAddress';
import Checkout from '../components/Checkout.jsx';
import ConfirmOrder from './ConfirmOrder.jsx';

import { useCheckout } from '../checkout/CheckoutContext';
import { useCart } from '../contexts/CartContext';
import { useTenant } from '../contexts/TenantContext.jsx';
import { useUser } from '../contexts/UserContext.jsx';

const CheckoutSteps = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [canProceedState, setCanProceedState] = useState(false);

    const { address } = useCheckout();
    const { cart } = useCart()
    const { tenant } = useTenant();
    const { user } = useUser();

    const email = 'test@test.com';
    const baseURL = `${import.meta.env.VITE_API_URL}`
    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
    }));

    const createOrder = async () => {
        // DEBUG ****
        console.log(address)
        try {
            const res = await fetch(`${baseURL}/orders/create-order/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    shipping_address: address.id,
                    tenant: tenant.id,
                    items,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create order");
            }

            const data = await res.json();
            console.log(`\n\nOrder Object Created:\n\n${data}\n\n`);
        } catch (err) {
            console.error(err);
            alert("Error creating order. Please try again.");
        }
    }

    const steps = [
        {
            label: 'Select Address',
            component: <SelectAddress />,
            onNext: createOrder,
            canProceed: () => Boolean(address && address.id)
        },
        {
            label: 'Confirm Order',
            component: <ConfirmOrder />,
            buttonText: 'Proceed to Payment'
        },
        {
            label: 'Checkout',
            component: <Checkout />
        },

    ];

    const nextStep = async () => {
        const step = steps[currentStep];

        if (step.onNext) {
            step.onNext()
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleConfirmOrder = () => {
        setCurrentStep(currentStep + 1);
    };

    useEffect(() => {
        console.log("Use effect Ran"); // DEBUG *******
        console.log(`Address: ${address}`);

        const step = steps[currentStep];
        if (step.canProceed) {
            const canProceedNow = step.canProceed();
            setCanProceedState(canProceedNow);
        }

}, [address, currentStep]);

// Determine the button text based on the current step
const getButtonText = () => steps[currentStep].buttonText || 'Next';

return (
    <div className="container my-5">
        <h2>Checkout Process</h2>


        <Row className="mb-4">
            <Col>
                <ProgressBar
                    now={((currentStep + 1) / steps.length) * 100}
                    label={`${currentStep + 1} of ${steps.length}`}
                />
            </Col>
        </Row>


        <div className="step-content">
            {steps[currentStep].component}
        </div>


        <Row className="mt-4">
            <Col className="d-flex justify-content-between">
                <Button
                    variant="secondary"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    Back
                </Button>
                <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={!steps[currentStep].canProceed() || currentStep === steps.length - 1}
                >
                    {getButtonText()}
                </Button>
            </Col>
        </Row>
    </div>
);
};

export default CheckoutSteps;



*/