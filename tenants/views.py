from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from .models import Tenant, TenantAdmin
from .serializers import TenantSerializer
from .permissions import IsTenantAdmin

class TenantViewSet(viewsets.ModelViewSet):
    serializer_class = TenantSerializer
    permission_classes = [IsTenantAdmin]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Tenant.objects.none()

        if self.action == 'list':
            # No tenants listed publicly
            return Tenant.objects.none()

        # For detail views: return tenants where the user is TenantAdmin
        return Tenant.objects.filter(admin_links__user=user)

    def get_object(self): # Get single tenant object
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    # Allow authenticated users to create Tenant
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated("You must be logged in to create a tenant.")

        # Save the tenant with this user as the owner
        tenant = serializer.save(owner=user)

        # Create TenantAdmin entry for this user and the new tenant
        TenantAdmin.objects.create(user=user, tenant=tenant)
