from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

class Tenant(models.Model):
    # Unique identifier (e.g. used in subdomains or API keys)
    slug = models.SlugField(unique=True, help_text="Unique tenant identifier, e.g. 'tenant1'")

    # Tenant's display name / store name
    name = models.CharField(max_length=255)

    # Owner / admin user for this tenant
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tenants")

    # Branding / appearance
    image = CloudinaryField('image', folder='products', null=True, blank=True)
    color_secondary = models.CharField(max_length=7, default='#000000')
    color_accent = models.CharField(max_length=7, default='#000000')

    # Contact and business info
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Tenants subdomain
    domain = models.CharField(max_length=255, unique=True, help_text="Custom domain or subdomain")

    # Feature flags / subscription plan
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name