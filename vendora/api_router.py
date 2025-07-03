from rest_framework.routers import DefaultRouter
from tenants.views import TenantViewSet, AdminAccessRequestViewSet

router = DefaultRouter()
router.register(r'tenants', TenantViewSet, basename='tenant')
router.register(r'admin-access-requests', AdminAccessRequestViewSet, basename='admin-access-request')

urlpatterns = router.urls