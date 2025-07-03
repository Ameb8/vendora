from rest_framework import viewsets, filters
from django.db.models import Max, Count
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from vendora import settings
from .permissions import IsAdminOrReadOnly
from tenants.models import Tenant
from .models import Product, ProductImages
from .serializers import ProductSerializer, ProductImagesSerializer
from vendora.permissions import IsTenantAdminOrReadOnly
from .filters import ProductFilter
import stripe


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsTenantAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tenant__slug', 'tenant_id', 'tenant__domain']

    def get_queryset(self):
        queryset = Product.objects.all()

        # Apply tenant filtering for list requests
        if self.action == 'list':
            tenant_slug = self.request.query_params.get('tenant__slug')
            tenant_id = self.request.query_params.get('tenant_id')
            domain = self.request.query_params.get('tenant__domain')

            # Return empty if no tenant filter is provided
            if not any([tenant_slug, tenant_id, domain]):
                return Product.objects.none()

        return queryset

class ProductImagesViewSet(viewsets.ModelViewSet):
    queryset = ProductImages.objects.all()
    serializer_class = ProductImagesSerializer
    permission_classes = [IsAdminOrReadOnly]


@api_view(['GET'])
@permission_classes([IsTenantAdminOrReadOnly])
def max_price_available_product(request):
    # Get tenant filter from query parameters
    tenant_slug = request.query_params.get('tenant__slug')
    tenant_id = request.query_params.get('tenant_id')
    tenant_domain = request.query_params.get('tenant__domain')

    if not any([tenant_slug, tenant_id, tenant_domain]):
        return Response({'error': 'Must provide tenant filter'}, status=400)

    # Build the filter
    filters = {}
    if tenant_slug:
        filters['tenant__slug'] = tenant_slug
    if tenant_id:
        filters['tenant__id'] = tenant_id
    if tenant_domain:
        filters['tenant__domain'] = tenant_domain

    # Get the max price
    max_price = Product.objects.filter(**filters).aggregate(
        max_price=Max('price')
    )['max_price']

    return Response({'max_price': max_price})


@api_view(['GET'])
@permission_classes([AllowAny])  # Make it publicly accessible
def tenant_product_categories(request):
    # Get tenant filter from query parameters
    tenant_slug = request.query_params.get('tenant__slug')
    tenant_id = request.query_params.get('tenant_id')
    tenant_domain = request.query_params.get('tenant__domain')

    if not any([tenant_slug, tenant_id, tenant_domain]):
        return Response({'error': 'Must provide tenant filter'}, status=400)

    # Build the filter
    filters = {}
    if tenant_slug:
        filters['tenant__slug'] = tenant_slug
    if tenant_id:
        filters['tenant__id'] = tenant_id
    if tenant_domain:
        filters['tenant__domain'] = tenant_domain

    # Get distinct categories with product counts
    categories = Product.objects.filter(
        **filters,
        category__isnull=False  # Exclude null categories
    ).values('category').annotate(
        product_count=Count('id')
    ).order_by('category')

    return Response({
        'categories': [{
            'name': item['category'],
            'product_count': item['product_count']
        } for item in categories]
    })

'''
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsTenantAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tenant__slug', 'tenant_id', 'tenant__domain']

    def get_queryset(self):
        queryset = Product.objects.all()

        # Apply tenant filtering for list requests
        if self.action == 'list':
            tenant_slug = self.request.query_params.get('tenant__slug')
            tenant_id = self.request.query_params.get('tenant_id')
            domain = self.request.query_params.get('tenant__domain')

            # Return empty if no tenant filter is provided
            if not any([tenant_slug, tenant_id, domain]):
                return Product.objects.none()

        return queryset

    def perform_create(self, serializer):
        tenant_pk = self.kwargs.get('tenant_pk')
        tenant = get_object_or_404(Tenant, pk=tenant_pk)
        serializer.save(tenant=tenant)

    def get_queryset(self):
        tenant_pk = self.kwargs.get('tenant_pk')
        tenant = get_object_or_404(Tenant, pk=tenant_pk)
        return Product.objects.filter(tenant=tenant, amount__gte=1)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'], url_path='categories')
    def get_categories(self, request, tenant_pk=None):
        tenant = get_object_or_404(Tenant, pk=tenant_pk)
        categories = Product.objects.filter(tenant=tenant).values_list('category', flat=True).distinct()
        unique_categories = sorted([cat for cat in categories if cat])
        return Response(unique_categories)

    @action(detail=True, methods=['get'], url_path='all-images')
    def get_all_images(self, request, tenant_pk=None, pk=None):
        tenant = get_object_or_404(Tenant, pk=tenant_pk)

        # Ensure product belongs to the tenant
        product = get_object_or_404(Product, pk=pk, tenant=tenant)

        base_image_url = product.image if product.image else None
        related_images = product.images.all()
        image_urls = [img.image for img in related_images if img.image]

        if base_image_url:
            image_urls.insert(0, base_image_url)

        return Response({'images': image_urls})

class ProductImagesViewSet(viewsets.ModelViewSet):
    queryset = ProductImages.objects.all()
    serializer_class = ProductImagesSerializer
    permission_classes = [IsAdminOrReadOnly]

@api_view(['GET'])
def max_price_available_product(request):
    max_price = Product.objects.filter(amount__gte=1).aggregate(Max('price'))['price__max']
    return Response({'max_price': max_price})

stripe.api_key = settings.base.STRIPE_SECRET_KEY

@api_view(['POST'])
def create_checkout_session(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        # Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': product.name,
                    },
                    'unit_amount': int(product.price * 100),  # Stripe expects cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/cancel',
        )
        return Response({'id': session.id})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
'''

