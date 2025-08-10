import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'
import CopyIcon from "../icons/CopyIcon.jsx";

export default function OrderSuccess() {
    const location = useLocation();
    const { orderCode } = location.state || {};

    const handleCopy = () => {
        if (orderCode) {
            navigator.clipboard.writeText(orderCode)
                .then(() => toast.success("Copied to clipboard!"))
                .catch(() => toast.error("Copy failed"));
        }
    };

    return (
        <div className="container my-5 text-center">
            <h2>Thank you for your order!</h2>
            <p>Your payment was successful.</p>
            {orderCode && (
                <p>
                    <strong>Order Code:</strong> {orderCode}
                    <button
                        onClick={handleCopy}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            marginLeft: "8px",
                            verticalAlign: "middle",
                        }}
                        aria-label="Copy order code"
                    >
                        <CopyIcon />
                    </button>
                </p>
            )}
        </div>
    );
}
