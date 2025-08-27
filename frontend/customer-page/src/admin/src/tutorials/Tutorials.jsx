import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

import { getCreateProductTutorialSteps } from './createProductTutorial';


export default function Tutorials() {
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);

    const startTutorial = () => {
        navigate('/admin/create-product');

        setTimeout(() => {
            const newTour = new Shepherd.Tour({
                useModalOverlay: true,
                defaultStepOptions: {
                    scrollTo: true,
                    cancelIcon: { enabled: true },
                    classes: 'shepherd-theme-arrows'
                }
            });

            const steps = getCreateProductTutorialSteps(newTour);
            steps.forEach(step => newTour.addStep(step));
            newTour.start();

            setTour(newTour);
        }, 500);
    };

    useEffect(() => {
        return () => {
            tour?.cancel();
        };
    }, [tour]);

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
            <h2>Tutorials</h2>
            <button className="btn btn-primary" onClick={startTutorial}>
                Start Create Product Tutorial
            </button>
            <p style={{ marginTop: '1rem' }}>
                This tutorial will guide you step-by-step through creating a new product.
            </p>
        </div>
    );
}

/*

export default function Tutorials() {
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);

    const startTutorial = () => {
        // Navigate to create product page
        navigate('/admin/create-product');

        // Wait until routing complete to start tutorial
        setTimeout(() => {
            const newTour = new Shepherd.Tour({
                useModalOverlay: true,
                defaultStepOptions: {
                    scrollTo: true,
                    cancelIcon: { enabled: true },
                    classes: 'shepherd-theme-arrows'
                }
            });

            createProductTutorialSteps.forEach(step => newTour.addStep(step));
            newTour.start();

            setTour(newTour);
        }, 500); // 500ms delay, can be tweaked
    };

    // Cleanup if you want when component unmounts
    useEffect(() => {
        return () => {
            if (tour) {
                tour.cancel();
            }
        };
    }, [tour]);

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
            <h2>Tutorials</h2>
            <button className="btn btn-primary" onClick={startTutorial}>
                Start Create Product Tutorial
            </button>
            <p style={{ marginTop: '1rem' }}>
                This tutorial will guide you step-by-step through creating a new product.
            </p>
        </div>
    );
}
*/