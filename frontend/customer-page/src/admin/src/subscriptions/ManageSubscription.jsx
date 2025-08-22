import { Routes, Route } from "react-router-dom";
import SubscriptionPlans from "./SubscriptionPlans";
import CurrentSubscription from "./CurrentSubscription";
import SubscriptionSuccess from "./SubscriptionSuccess";
import SubscriptionCancel from "./SubscriptionCancel";

export default function ManageSubscription() {
    return (
        <div>
            <Routes>
                <Route
                    index
                    element={
                        <>
                            <CurrentSubscription />
                            <SubscriptionPlans />
                        </>
                    }
                />

                <Route path="success" element={<SubscriptionSuccess />} />
                <Route path="cancel" element={<SubscriptionCancel />} />
            </Routes>
        </div>
    );
}