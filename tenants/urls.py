from django.urls import path
from rest_framework.routers import DefaultRouter
from vendora.api_router import router
from . import views


urlpatterns = [
    path('<slug:slug>', views.PublicTenantDetailView.as_view(), name='tenant-public'),
] + router.urls
