from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tenants.views import TenantViewSet
from tenants.urls import router as tenant_router
from .views import ProductViewSet, max_price_available_product, ProductImagesViewSet, tenant_product_categories


router = DefaultRouter()
router.register(r'view', ProductViewSet, basename = 'products')

urlpatterns = [
    path('max-price/', max_price_available_product, name='max-price'),
    path('categories/', tenant_product_categories, name='tenant-categories'),
] + router.urls
