from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'view', views.TenantViewSet)
router.register(
    r'admin-access-requests',
    views.AdminAccessRequestViewSet,
    basename='admin-access-request'
)

urlpatterns = [
    path('public/', views.PublicTenantDetailView.as_view(), name='tenant-list'),
    path('public/<slug:slug>', views.PublicTenantDetailView.as_view(), name='tenant-public'),
    path('my-tenants/', views.MyTenantView.as_view(), name='my-tenants'),
] + router.urls
