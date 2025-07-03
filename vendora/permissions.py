from rest_framework.permissions import BasePermission, SAFE_METHODS
from tenants.models import TenantAdmin

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

from rest_framework.permissions import BasePermission, SAFE_METHODS
from tenants.models import TenantAdmin


class IsTenantAdminOrReadOnly(BasePermission):
    """
    Allow safe (GET, HEAD, OPTIONS) requests to anyone.
    Allow unsafe methods (POST, PATCH, DELETE) only if the user is authenticated
    and is an admin for the tenant associated with the object or view.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        # Handle creation
        if request.method == 'POST':
            tenant_pk = view.kwargs.get('tenant_pk')
            return tenant_pk and TenantAdmin.objects.filter(tenant_id=tenant_pk, user=request.user).exists()

        # Allow permission check to proceed to has_object_permission for detail views
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        tenant = getattr(obj, 'tenant', None)
        return tenant and TenantAdmin.objects.filter(tenant=tenant, user=request.user).exists()


