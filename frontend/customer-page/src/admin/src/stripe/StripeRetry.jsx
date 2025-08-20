export default function StripeRetry({ tenant }) {
    const handleRetry = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/tenants/${tenant.slug}/stripe/onboard/`,
                {},
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                alert("Could not generate onboarding link.");
            }
        } catch (err) {
            console.error(err);
            alert("Error retrying onboarding.");
        }
    };

    return (
        <div>
            <p>Looks like your Stripe onboarding wasn't completed.</p>
            <button onClick={handleRetry} className="btn btn-primary">
                Retry Stripe Onboarding
            </button>
        </div>
    );
}

