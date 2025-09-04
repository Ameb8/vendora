from django.db import models
from cloudinary.models import CloudinaryField
from tenants.models import Tenant
from dataclasses import dataclass

@dataclass(frozen=True)
class Size:
    height_in: float
    width_in: float
    depth_in: float
    weight_lb: float

class Product(models.Model):
    # Product info
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=60, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    image = CloudinaryField('image', folder='products', null=True, blank=True)
    description = models.TextField(null=True)

    # Tenant data
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Weight
    weight_value = models.DecimalField(max_digits=6, decimal_places=2)  # e.g., 1.25
    weight_unit = models.CharField(max_length=2, choices=[('lb', 'Pounds'), ('oz', 'Ounces'), ('kg', 'Kilograms'), ('g', 'Grams')])

    # Dimensions
    length = models.DecimalField(max_digits=6, decimal_places=2)  # e.g., 4.00
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)
    distance_unit = models.CharField(max_length=2, choices=[('in', 'Inches'), ('cm', 'Centimeters')])

    def __str__(self):
        return self.name

    _weight_conversion_to_lb: dict[str, float] = {
        'lb': 1.0,
        'kg': 1.0 / 16.0,
        'g': 2.20462,
        'oz': 0.00220462,
    }

    _height_conversion: dict[str, float] = {
        'in': 1.0,
        'cm': 1.0 / 2.54
    }

    @property
    def size(self) -> Size:
        conv = self._dimension_conversion_to_in[self.distance_unit]
        weight_conv = self._weight_conversion_to_lb[self.weight_unit]

        return Size(
            height_in=round(float(self.height) * conv, 2),
            width_in=round(float(self.width) * conv, 2),
            depth_in=round(float(self.length) * conv, 2),  # "length" = "depth"
            weight_lb=round(float(self.weight_value) * weight_conv, 2),
        )

class ProductImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return f"Image for {self.product.name}"

