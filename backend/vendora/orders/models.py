from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
import uuid
from tenants.models import Tenant


class Address(models.Model):
    full_name = models.CharField(max_length=255, null=True, blank=True)
    street_address = models.CharField(max_length=255)
    apartment_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.full_name}, {self.street_address}, {self.city}"

class Order(models.Model):
    # User info
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # Order info
    order_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.SET_NULL, null=True)

    # Stripe info
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Order status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('fulfilled', 'Fulfilled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Order summary
    total_amount = models.IntegerField(help_text="In cents")

    @property
    def products(self):
        return [item.product for item in self.items.all()]

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class PhoneAlert(models.Model):
    CARRIER_CHOICES = [
        ('verizon', 'Verizon'),
        ('att', 'AT&T'),
        ('tmobile', 'T-Mobile'),
        ('sprint', 'Sprint'),
        ('boost', 'Boost'),
    ]

    number = PhoneNumberField(max_length=20)
    carrier = models.CharField(max_length=20, choices=CARRIER_CHOICES)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.phone_number} ({self.get_carrier_display()})"

class EmailAlert(models.Model):
    email = models.EmailField(unique=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True)

