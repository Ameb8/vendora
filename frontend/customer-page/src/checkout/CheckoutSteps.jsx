import { useState } from 'react';
import { Button, ProgressBar, Row, Col } from 'react-bootstrap';

import SelectAddress from '../address/SelectAddress';
import Checkout from '../components/Checkout.jsx';
import ConfirmOrder from './ConfirmOrder.jsx';

import { useCheckout } from '../checkout/CheckoutContext';

const CheckoutSteps = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { address } = useCheckout(); // Get the address from context

    const steps = [
        { label: 'Select Address', component: <SelectAddress /> },
        { label: 'Checkout', component: <Checkout /> },
        { label: 'Confirm Order', component: <ConfirmOrder /> },
    ];

    // Custom next step logic for each step
    const nextStep = () => {
        if (currentStep === steps.length - 1) {
            // Custom logic for the "Confirm Order" step
            handleConfirmOrder();
        } else {
            // Default next step behavior
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleConfirmOrder = () => {
        console.log("Proceeding with payment after confirming address", address);
        // Add your API call or other logic here
        // After confirming, move to the next step (e.g., Checkout or Payment)
        setCurrentStep(currentStep + 1);
    };

    // Determine the button text based on the current step
    const getButtonText = () => {
        if (currentStep === steps.length - 2) {
            return 'Proceed to Payment'; // Custom text for the Confirm Order step
        }
        return 'Next'; // Default text for other steps
    };

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
                        disabled={currentStep === steps.length - 1}
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
import { useState } from 'react';
import { Button, ProgressBar, Row, Col } from 'react-bootstrap';

import SelectAddress from '../address/SelectAddress';
import Checkout from '../components/Checkout.jsx';
import ConfirmOrder from './ConfirmOrder.jsx'

const CheckoutSteps = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { label: 'Select Address', component: <SelectAddress /> },
        { label: 'Checkout', component: <Checkout /> },
        { label: 'ConfirmOrder', component: <ConfirmOrder /> },
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

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
                        disabled={currentStep === steps.length - 1}
                    >
                        Next
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutSteps;
*/