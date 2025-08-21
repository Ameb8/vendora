import SubscriptionPlans from "./SubscriptionPlans";
import CurrentSubscription from "./CurrentSubscription";

export default function ManageSubscription() {
    return (
        <div>
            <CurrentSubscription />
            <SubscriptionPlans />
        </div>
    )
}