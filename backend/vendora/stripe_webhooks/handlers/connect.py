import logging
from django.db import transaction
from payments.models import Payment
from orders.models import Order

logger = logging.getLogger(__name__)


@transaction.atomic
def handle(event_type, obj, event):
    """
    Handles Stripe Connect events (one-off payments to vendor accounts).

    event_type: e.g., "payment_intent.succeeded", "transfer.created", "payout.paid"
    obj: the Stripe object payload
    event: the full Stripe event
    """

    account_id = event.get("account")  # Stripe account id of the connected account

    if event_type == "payment_intent.succeeded":
        payment_intent_id = obj.get("id")
        logger.info(f"Connect PaymentIntent succeeded: {payment_intent_id}")

        # Update your Payment object (find by stripe_payment_intent_id)
        try:
            payment = Payment.objects.select_for_update().get(stripe_payment_intent_id=payment_intent_id)
            payment.status = "succeeded"
            payment.method = obj.get("payment_method_types", [None])[0]
            payment.save()

            # Mark the order as paid
            order = payment.order
            order.paid = True
            order.status = "paid"
            order.save()

        except Payment.DoesNotExist:
            logger.warning(f"No Payment found for PaymentIntent {payment_intent_id}")

    elif event_type == "payment_intent.payment_failed":
        payment_intent_id = obj.get("id")
        logger.warning(f"Connect PaymentIntent failed: {payment_intent_id}")

        Payment.objects.filter(stripe_payment_intent_id=payment_intent_id).update(status="failed")

    elif event_type == "transfer.created":
        transfer_id = obj.get("id")
        payment_intent_id = obj.get("payment_intent")
        logger.info(f"Transfer created: {transfer_id} for PaymentIntent {payment_intent_id}")

        if payment_intent_id:
            Payment.objects.filter(stripe_payment_intent_id=payment_intent_id).update(stripe_transfer_id=transfer_id)

    elif event_type == "payout.paid":
        payout_id = obj.get("id")
        logger.info(f"Payout paid to connected account {account_id}: {payout_id}")
        # You can store payout_id if you want to track vendor payouts, e.g.,
        # Payment.objects.filter(stripe_transfer_id=related_transfer_id).update(stripe_payout_id=payout_id)

    else:
        logger.info(f"Unhandled Connect event: {event_type}")
