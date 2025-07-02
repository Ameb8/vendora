from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tenants', views.TenantViewSet, basename='tenant')
router.register(r'admin-access-requests', views.AdminAccessRequestViewSet, basename='admin-access-request')


urlpatterns = router.urls

urlpatterns += [
    path('tenants/<slug:slug>/public/', views.PublicTenantDetailView.as_view(), name='tenant-public'),
]
