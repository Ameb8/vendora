# subscriptions/serializers.py
from rest_framework import serializers
from .models import Subscription, SubscriptionPlan

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ["id", "name", "stripe_price_id", "description"]

class SubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer()

    class Meta:
        model = Subscription
        fields = ["id", "stripe_subscription_id", "plan", "current_period_end", "status", "is_active"]
