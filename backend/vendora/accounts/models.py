from django.db import models
from django.contrib.auth import get_user_model

from cloudinary.models import CloudinaryField

from addresses.models import Address

User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = CloudinaryField('image', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class AdminAccessRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_requests')
    reason = models.TextField(blank=True, null=True)
    approved = models.BooleanField(null=True)  # None = pending, True/False = approved/rejected
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {'Pending' if self.approved is None else 'Approved' if self.approved else 'Rejected'}"

class UserAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='user_addresses')

    class Meta:
        unique_together = ('user', 'address')

    def __str__(self):
        return f"{self.user.username} — {self.address}"
