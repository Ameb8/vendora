from django.urls import path, include
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from vendora.api_router import router
from tenants.views import TenantViewSet
from tenants.urls import router as tenant_router
from .views import ProductViewSet, max_price_available_product, ProductImagesViewSet

#router = DefaultRouter()
#router.register(r'tenants', TenantViewSet, basename='tenant')
#router.register(r'product-details', ProductImagesViewSet)

# Nested router under tenant
nested_router = NestedDefaultRouter(router, r'tenants', lookup='tenant')
nested_router.register(r'products', ProductViewSet, basename='tenant-products')


urlpatterns = [
    path('max-price/', max_price_available_product, name='max-price'),
] + nested_router.urls
