from rest_framework import permissions
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
        print("User:", request.user, "Authenticated?", request.user.is_authenticated) # DEBUG*****

        # Allow read requests
        if request.method in SAFE_METHODS:
            return True

    # Deny unauthenticated users
        if not request.user or not request.user.is_authenticated:
            return False

        # Handle POST (creation)
        if request.method == 'POST':

            tenant_id = int(request.data.get('tenant_id'))

            print("Received tenant_id:", tenant_id) # DEBUG *****

            if not tenant_id:
                return False  # Tenant not specified
            return TenantAdmin.objects.filter(tenant_id=tenant_id, user=request.user).exists()

        # Allow permission check to proceed to has_object_permission for detail views
        return True

    def has_object_permission(self, request, view, obj):
        # Allow read access to all
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if user is admin of the product's tenant
        return TenantAdmin.objects.filter(tenant=obj.tenant, user=request.user).exists()

