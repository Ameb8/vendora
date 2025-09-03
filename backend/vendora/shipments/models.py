from django.db import models
from orders.models import Order
from tenants.models import Tenant

class ShippingOption(models.Model):
    order = models.ForeignKey('shipment', on_delete=models.CASCADE, related_name='selected-shipment')
    method = models.ForeignKey('ShippingMethod', on_delete=models.CASCADE, related_name='selected-method')
    carrier = models.CharField(max_length=100, blank=True)
    price = models.IntegerField()

class Shipment(models.Model):
    selected = models.OneToOneField(ShippingOption)
    carrier = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    estimated_arrival = models.DateField(null=True, blank=True)
    is_delivered = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"Shipment for Order {self.order.order_code}"


class ShippingMethod(models.Model):
    class_name = models.CharField(max_length=100)
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=300)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class TenantShippingMethod(models.Model):
    allowed_method = models.ForeignKey('ShippingMethod', on_delete=models.CASCADE, related_name='shipping-method')
    tenant = models.ForeignKey('Tenant', on_delelte=models.CASCADE, related_name='shipping-methods')

    def __str__(self) -> str:
        return f"{self.tenant.name} - {self.allowed_method.name}"

