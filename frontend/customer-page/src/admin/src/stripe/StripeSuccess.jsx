// admin/stripe/StripeSuccess.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function StripeSuccess({ tenant }) {
    const [status, setStatus] = useState("Checking Stripe status...");

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/tenants/${tenant.slug}/stripe/status/`,
                    {
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const { charges_enabled, payouts_enabled } = res.data;

                if (charges_enabled && payouts_enabled) {
                    setStatus("✅ Stripe account connected successfully.");
                } else {
                    setStatus("⚠️ Stripe account not fully active yet.");
                }
            } catch (err) {
                console.error(err);
                setStatus("❌ Error checking Stripe account status.");
            }
        };

        checkStatus();
    }, [tenant.slug]);

    return <div>{status}</div>;
}
