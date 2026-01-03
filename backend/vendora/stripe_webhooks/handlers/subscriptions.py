from datetime import datetime
from django.utils import timezone
from tenants.models import Tenant
from subscriptions.models import Subscription, SubscriptionPlan
import logging

logger = logging.getLogger(__name__)

def handle(event_type, sub):
    if event_type == "customer.subscription.created":
        upsert_subscription(sub)

    elif event_type == "customer.subscription.updated":
        update_subscription(sub)

    elif event_type == "customer.subscription.deleted":
        Subscription.objects.filter(
            stripe_subscription_id=sub["id"]
        ).update(status="canceled")

def handle_invoice(event_type, invoice):
    if event_type != "invoice.payment_succeeded":
        return

    if not invoice.get("subscription"):
        return

    Subscription.objects.filter(
        stripe_subscription_id=invoice["subscription"]
    ).update(
        status="active",
        current_period_end=datetime.fromtimestamp(
            invoice["lines"]["data"][0]["period"]["end"],
            tz=timezone.utc,
        ),
    )

def upsert_subscription(sub):
    tenant = Tenant.objects.filter(
        stripe_customer_id=sub["customer"]
    ).first()

    if not tenant:
        return

    plan_price_id = sub["items"]["data"][0]["price"]["id"]
    plan = SubscriptionPlan.objects.get(stripe_price_id=plan_price_id)

    Subscription.objects.update_or_create(
        tenant=tenant,
        stripe_subscription_id=sub["id"],
        defaults={
            "stripe_customer_id": sub["customer"],
            "plan": plan,
            "status": sub["status"],
            "current_period_end": datetime.fromtimestamp(
                sub["current_period_end"], tz=timezone.utc
            ) if sub.get("current_period_end") else None,
        },
    )

def update_subscription(sub):
    Subscription.objects.filter(
        stripe_subscription_id=sub["id"]
    ).update(
        status=sub["status"],
        current_period_end=datetime.fromtimestamp(
            sub["current_period_end"], tz=timezone.utc
        ),
    )
