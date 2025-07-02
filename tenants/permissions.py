from rest_framework.permissions import BasePermission
from .models import TenantAdmin, Tenant

class IsTenantAdmin(BasePermission):
    """
    Allow access only to authenticated users who are TenantAdmins of the tenant being accessed.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return TenantAdmin.objects.filter(user=request.user, tenant=obj).exists()

