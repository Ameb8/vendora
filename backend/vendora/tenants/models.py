from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from cloudinary.models import CloudinaryField
import stripe

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

    @property
    def current_subscription(self):
        return self.subscriptions.filter(
            status='active',
            current_period_end__gt=timezone.now()
        ).order_by('-current_period_end').first()

    @property
    def is_subscribed(self):
        return self.current_subscription is not None

    def __str__(self):
        return self.name

    def has_admin_privilege(self, user: User) -> bool:
        """
        Returns True if the user is either the tenant owner or an admin of this tenant.
        """
        if user == self.owner:
            return True
        return TenantAdmin.objects.filter(tenant=self, user=user).exists()

    def link_stripe_account(self):
        if not self.stripe_account_id: # Create stripe account
            account = stripe.Account.create(
                type="express",
                email=self.email,
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True},
                }
            )
            self.stripe_account_id = account.id
            self.save()
        else:
            account = stripe.Account.retrieve(self.stripe_account_id)

            # Create onboarding link
        account_link = stripe.AccountLink.create(
            account=account.id,
            refresh_url="https://localhost:5173/admin/stripe/retry",
            return_url="https://localhost:5173/admin/stripe/connected",
            type="account_onboarding"
        )
        return account_link.url

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

