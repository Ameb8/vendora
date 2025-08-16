from django.db import models
from django.conf import settings
from django.utils import timezone

from tenants.models import Tenant

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    stripe_price_id = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Subscription(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='subscriptions')
    stripe_customer_id = models.CharField(max_length=100)
    stripe_subscription_id = models.CharField(max_length=100, blank=True, null=True)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='inactive')  # active, canceled, etc.

    def __str__(self):
        return f"{self.tenant}'s subscription"

    @property
    def is_active(self) -> bool:
        return (
                self.status == 'active' and
                self.current_period_end is not None and
                self.current_period_end > timezone.now()
        )


