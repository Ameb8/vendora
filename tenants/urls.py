from rest_framework import routers
from django.urls import path, include
from .views import TenantViewSet

router = routers.DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenant')

urlpatterns = [
    path('api/', include(router.urls)),
]