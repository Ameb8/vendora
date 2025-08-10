from django.db import models
from orders.models import Order

class Shipment(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='shipments')
    carrier = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    estimated_arrival = models.DateField(null=True, blank=True)
    is_delivered = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Shipment for Order {self.order.order_code}"


