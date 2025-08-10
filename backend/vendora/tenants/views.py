from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from .models import Tenant, TenantAdmin, AdminAccessRequest
from .serializers import TenantSerializer, TenantPublicSerializer, AdminAccessRequestSerializer
from .permissions import IsTenantAdmin, IsTenantAdminForAccessRequest


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
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

class PublicTenantDetailView(RetrieveAPIView):
    queryset = Tenant.objects.filter(is_active=True)
    serializer_class = TenantPublicSerializer
    lookup_field = 'slug'
    permission_classes = []


class AdminAccessRequestViewSet(viewsets.ModelViewSet):
    queryset = AdminAccessRequest.objects.all()
    serializer_class = AdminAccessRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Tenant Admins can only view requests for their own tenants.
        """
        user = self.request.user
        if self.action == 'list':
            tenant_id = self.request.query_params.get('tenant')
            if tenant_id:
                if TenantAdmin.objects.filter(user=user, tenant_id=tenant_id).exists():
                    return AdminAccessRequest.objects.filter(tenant_id=tenant_id)
            return AdminAccessRequest.objects.none()

        elif self.action in ['approve', 'deny', 'retrieve', 'update', 'partial_update', 'destroy']:
            tenant_admin_tenants = TenantAdmin.objects.filter(user=user).values_list('tenant_id', flat=True)
            return AdminAccessRequest.objects.filter(tenant_id__in=tenant_admin_tenants)

        return AdminAccessRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsTenantAdminForAccessRequest])
    def approve(self, request, pk=None):
        req = self.get_object()
        if req.approved:
            return Response({'detail': 'Request already approved.'}, status=400)

        req.approved = True
        req.save()
        TenantAdmin.objects.create(tenant=req.tenant, user=req.user)
        return Response({'detail': 'Request approved and user added to TenantAdmin.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsTenantAdminForAccessRequest])
    def deny(self, request, pk=None):
        req = self.get_object()
        req.approved = False
        req.save()
        return Response({'detail': 'Request denied.'})

