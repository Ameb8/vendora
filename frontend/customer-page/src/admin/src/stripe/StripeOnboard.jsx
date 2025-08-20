import axios from 'axios';

const StripeOnboardingButton = ({ tenant }) => {
    const handleStripeConnect = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/tenants/${tenant.slug}/stripe/onboard/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.url) {
                window.location.href = response.data.url; // Redirect to Stripe onboarding
            } else {
                alert("Unable to connect to Stripe.");
            }
        } catch (error) {
            console.error("Stripe onboarding error", error);
            alert("An error occurred during Stripe onboarding.");
        }
    };

    return (
        <button onClick={handleStripeConnect} className="btn btn-primary">
            Connect Stripe Account
        </button>
    );
};

export default StripeOnboardingButton;
