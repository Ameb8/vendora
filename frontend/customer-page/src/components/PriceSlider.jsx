import { useEffect, useState, useContext } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import './PriceSlider.css';

function PriceSlider() {
    const baseURL = import.meta.env.VITE_API_URL;
    const {
        setMinPrice,
        setMaxPrice,
        clearPrices,
    } = useContext(ProductContext);

    const [maxLimit, setMaxLimit] = useState(100);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);

    useEffect(() => {
        const fetchMax = async () => {
            try {
                const response = await fetch(`${baseURL}/inventory/max-price/`);
                const data = await response.json();
                const fetchedMax = data.max_price + 0.01 || 100;
                setMaxLimit(fetchedMax);
                setMinValue(0);
                setMaxValue(fetchedMax);
                setMinPrice(0);
                setMaxPrice(fetchedMax);
            } catch (err) {
                console.error('Failed to fetch max price:', err);
            }
        };
        fetchMax();
    }, [baseURL, setMinPrice, setMaxPrice]);

    const handleMinChange = (e) => {
        const val = parseInt(e.target.value);
        if (val <= maxValue) {
            setMinValue(val); // UI updates instantly
        }
    };

    const handleMaxChange = (e) => {
        const val = parseInt(e.target.value);
        if (val >= minValue) {
            setMaxValue(val); // UI updates instantly
        }
    };

    const handleMinCommit = () => {
        setMinPrice(minValue); // Updates product list when sliding stops
    };

    const handleMaxCommit = () => {
        setMaxPrice(maxValue); // Updates product list when sliding stops
    };

    const onReset = () => {
        clearPrices();
        setMinValue(0);
        setMaxValue(maxLimit);
        setMinPrice(0);
        setMaxPrice(maxLimit);
    };

    return (
        <div className="container my-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>Price Range:</strong> ${minValue} - ${maxValue}
                </div>
            </div>

            <div className="range-slider-container">
                <div className="range-slider-track"></div>
                <input
                    type="range"
                    className="form-range range-slider range-slider-min"
                    min="0"
                    max={maxLimit}
                    value={minValue}
                    onChange={handleMinChange}
                    onMouseUp={handleMinCommit}
                    onTouchEnd={handleMinCommit}
                />
                <input
                    type="range"
                    className="form-range range-slider range-slider-max"
                    min="0"
                    max={maxLimit}
                    value={maxValue}
                    onChange={handleMaxChange}
                    onMouseUp={handleMaxCommit}
                    onTouchEnd={handleMaxCommit}
                />
            </div>
        </div>
    );
}

export default PriceSlider;
