import logging
from .handlers import subscriptions, connect

logger = logging.getLogger(__name__)

def dispatch_event(event):
    """
    Central router for all Stripe webhook events.
    """

    event_type = event["type"]
    data = event["data"]["object"]

    # Stripe Connect events (one-off payments to 3rd party vendors)
    if event.get("account"):
        connect.handle(event_type, data, event)
        return

    # 2Subscription events (recurring billing)
    if event_type.startswith("customer.subscription"):
        subscriptions.handle(event_type, data)
        return

    # Subscription invoices (to update subscription status after payment)
    if event_type.startswith("invoice."):
        subscriptions.handle_invoice(event_type, data)
        return

    # Unhandled events
    logger.info("Unhandled Stripe event: %s", event_type)
