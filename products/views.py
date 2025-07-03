from rest_framework import viewsets, filters
from django.db.models import Max
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from vendora import settings
from .permissions import IsAdminOrReadOnly
from tenants.models import Tenant
from .models import Product, ProductImages
from .serializers import ProductSerializer, ProductImagesSerializer
from vendora.permissions import IsTenantAdminOrReadOnly
from .filters import ProductFilter
import stripe

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsTenantAdminOrReadOnly]

    # Set filtering
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = ProductFilter
    ordering_fields = ['price', 'created_at', 'name']
    search_fields = ['name', 'description']

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


