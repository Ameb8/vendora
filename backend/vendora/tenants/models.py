from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

class Tenant(models.Model):
    # Unique identifier (e.g. used in subdomains or API keys)
    slug = models.SlugField(unique=True, help_text="Unique tenant identifier, e.g. 'tenant1'")

    # Tenant's display name
    name = models.CharField(max_length=255)

    # Administrative info
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tenants")
    stripe_account_id = models.CharField(max_length=255, blank=True, null=True)

    # Branding / appearance
    image = CloudinaryField('image', folder='products', null=True, blank=True)
    color_primary = models.CharField(max_length=7, default='#000000')
    color_secondary = models.CharField(max_length=7, default='#000000')
    color_accent = models.CharField(max_length=7, default='#000000')

    # Contact and business info
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Tenants subdomain
    domain = models.CharField(max_length=255, unique=True, help_text="Custom domain or subdomain")

    # Active User
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def admin_users(self):
        return User.objects.filter(tenant_links__tenant=self)

    def __str__(self):
        return self.name


class TenantAdmin(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='admin_links')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_links')

    class Meta:
        unique_together = ('tenant', 'user')  # Prevent duplicates

    def __str__(self):
        return f"{self.user.username} - {self.tenant.name}"

class AdminAccessRequest(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)

