from django.db import models
from django.contrib.auth.models import User
from tenants.models import Tenant
from orders.models import Order

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_charge_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_transfer_id = models.CharField(max_length=255, blank=True, null=True)

    amount = models.IntegerField(help_text="Amount in cents")
    currency = models.CharField(max_length=10, default='usd')

    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ], default='pending')

    method = models.CharField(max_length=50, blank=True)  # e.g., card, apple_pay

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    metadata = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Payment {self.stripe_payment_intent_id} for Order {self.order_id}"
