from django.db import models
from django.utils import timezone

from rest_framework import viewsets, status, generics, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView

import traceback
import logging
import stripe

from .models import Tenant, TenantAdmin, AdminAccessRequest
from .serializers import TenantSerializer, TenantPublicSerializer, MyTenantsSerializer, AdminAccessRequestSerializer
from .permissions import IsTenantAdmin, IsTenantAdminForAccessRequest


logger = logging.getLogger(__name__)

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsTenantAdmin]

    def get_permissions(self):
        # Allow *any authenticated* user to create a Tenant
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        # All other actions require TenantAdmin
        return [IsTenantAdmin()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Tenant.objects.none()

        if self.action == 'list':
            # No tenants listed publicly
            return Tenant.objects.filter(owner=user)

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

class PublicTenantDetailView(APIView):
    permission_classes = []

    def get(self, request, slug=None):
        now = timezone.now()

        if slug: # Get specified tenant
            try:
                tenant = Tenant.objects.get( # Filter for active tenant with slug
                    slug=slug,
                    subscriptions__status='active',
                    subscriptions__current_period_end__gt=now
                )

                # Return specified tenant
                serializer = TenantPublicSerializer(tenant)
                return Response(serializer.data)

            except Tenant.DoesNotExist: # No active tenant with specified slug
                return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        else: # Get all active tenants
            tenants = Tenant.objects.filter( # Filter with active subscription
                subscriptions__status='active',
                subscriptions__current_period_end__gt=now
            ).distinct()

            # Return active tenants
            serializer = TenantPublicSerializer(tenants, many=True)
            return Response(serializer.data)


'''
class PublicTenantDetailView(RetrieveAPIView):
    queryset = Tenant.objects.filter(is_active=True)
    serializer_class = TenantPublicSerializer
    lookup_field = 'slug'
    permission_classes = []
'''

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


class MyTenantView(generics.ListAPIView):
    serializer_class = MyTenantsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tenant.objects.filter(
            models.Q(owner=user) |
            models.Q(admin_links__user=user)
        ).distinct()

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def link_stripe(request, slug):
    try:
        tenant = Tenant.objects.get(slug=slug)

        # Ensure only the owner or admin can access
        if not tenant.has_admin_privilege(request.user):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        onboarding_url = tenant.link_stripe_account()
        return Response({"url": onboarding_url})

    except Tenant.DoesNotExist:
        return Response({"detail": "Tenant not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        traceback.print_exc()
        logger.exception("Stripe onboarding failed")
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stripe_status(request, slug):
    try:
        tenant = Tenant.objects.get(slug=slug)

        if not tenant.has_admin_privilege(request.user):
            return Response({"detail": "Permission denied"}, status=403)

        if not tenant.stripe_account_id:
            return Response({"detail": "No Stripe account connected"}, status=400)

        account = stripe.Account.retrieve(tenant.stripe_account_id)

        return Response({
            "charges_enabled": account.charges_enabled,
            "payouts_enabled": account.payouts_enabled,
            "details_submitted": account.details_submitted,
        })

    except Tenant.DoesNotExist:
        return Response({"detail": "Tenant not found"}, status=404)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)

