from rest_framework.permissions import BasePermission, SAFE_METHODS
from tenants.models import TenantAdmin

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsTenantAdminOrReadOnly(BasePermission):
    """
    Allow safe methods to anyone.
    Allow unsafe methods only if user is authenticated and is an admin of the tenant.
    This class works with any model that has a `tenant` FK.
    """

    def has_permission(self, request, view):
        # Always allow safe methods
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Safe methods already handled in has_permission
        if request.method in SAFE_METHODS:
            return True

        tenant = getattr(obj, 'tenant', None)
        return tenant and TenantAdmin.objects.filter(tenant=tenant, user=request.user).exists()

    def has_create_permission(self, request):
        """
        Custom logic for create - because obj doesn't exist yet
        We check request.data['tenant'] for permission
        """
        tenant_id = request.data.get('tenant')
        return tenant_id and TenantAdmin.objects.filter(tenant_id=tenant_id, user=request.user).exists()

    def has_object_or_create_permission(self, request, obj=None):
        if request.method in SAFE_METHODS:
            return True
        if request.method == 'POST':
            return self.has_create_permission(request)
        return self.has_object_permission(request, None, obj)

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method == 'POST':
            return self.has_create_permission(request)
        return True