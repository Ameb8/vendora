from rest_framework import serializers
import stripe
from .models import Subscription, SubscriptionPlan

import logging
logger = logging.getLogger(__name__)

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    interval = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = ["id", "name", "stripe_price_id", "description", "amount", "currency", "interval"]

    def get_stripe_price(self, obj):
        try:
            price = stripe.Price.retrieve(obj.stripe_price_id)
            logger.debug(f"Stripe price for {obj.stripe_price_id}: {price}")
            return price
        except Exception as e:
            # DEBUG *******
            logger.error(f"\n\n\n\n\n\n\n\n\nUsing Stripe API key: {stripe.api_key}\n\n\n\n\n\n\n\n")
            logger.error(f"Failed to fetch Stripe price for {obj.stripe_price_id}: {e}")
            # END DEBUG ***

            return None

    def get_amount(self, obj):
        price = self.get_stripe_price(obj)
        return price.unit_amount if price else None

    def get_currency(self, obj):
        price = self.get_stripe_price(obj)
        return price.currency if price else None

    def get_interval(self, obj):
        price = self.get_stripe_price(obj)
        return price.recurring.interval if price and price.recurring else None

class SubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer()

    class Meta:
        model = Subscription
        fields = ["id", "stripe_subscription_id", "plan", "current_period_end", "status", "is_active"]
