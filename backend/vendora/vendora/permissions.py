from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from tenants.models import TenantAdmin, Tenant


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


'''
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

            tenant_id = request.data.get('tenant_id')

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

        # DEBUG *******
        print("OBJ tenant:", obj.tenant.id)
        print("User admin tenants:", list(
            TenantAdmin.objects.filter(user=request.user).values_list('tenant_id', flat=True)
        ))
        # END DEBUG ***

        # Check if user is admin of the product's tenant
        return TenantAdmin.objects.filter(tenant=obj.tenant, user=request.user).exists()
'''

class IsTenantAdminOrReadOnly(BasePermission):
    """
    Allow safe (GET, HEAD, OPTIONS) requests to anyone.
    Allow unsafe methods (POST, PATCH, DELETE) only if the user is authenticated
    and is an admin or owner for the tenant associated with the object or view.
    """

    def has_permission(self, request, view) -> bool:
        # Allow read requests to everyone
        if request.method in SAFE_METHODS:
            return True

        # Deny unauthenticated users
        if not request.user or not request.user.is_authenticated:
            return False

        # For POST (creation), tenant_id should be in request data
        if request.method == 'POST':
            tenant_id = request.data.get('tenant_id')
            if not tenant_id:
                return False  # Tenant not specified

            try:
                tenant = Tenant.objects.get(id=tenant_id)
            except Tenant.DoesNotExist:
                return False

            return tenant.has_admin_privilege(request.user)

        # For other unsafe methods, allow has_object_permission to handle
        return True

    def has_object_permission(self, request, view, obj) -> bool:
        # Allow read access to all
        if request.method in SAFE_METHODS:
            return True

        # Check if user is admin or owner of the object's tenant
        tenant = getattr(obj, 'tenant', None)

        if not tenant:
            return False  # no tenant on object, deny

        return tenant.has_admin_privilege(request.user)
