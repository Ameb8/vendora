from rest_framework import routers
from .views import TenantViewSet

router = routers.DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenant')

