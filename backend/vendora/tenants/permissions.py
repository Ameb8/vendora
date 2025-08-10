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


class IsTenantAdminForAccessRequest(BasePermission):
    """
    Permission for AdminAccessRequest objects:
    Allow only users who are TenantAdmins of the tenant related to the request.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # obj is an AdminAccessRequest instance, so check obj.tenant
        return TenantAdmin.objects.filter(user=request.user, tenant=obj.tenant).exists()
