from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    current_user,
    LoginView,
    RegisterAdminView,
    AdminAccessRequestView,
    AdminAccessApprovalView,
    UserAddressViewSet
)

router = DefaultRouter()
router.register(r'my-addresses', UserAddressViewSet, basename='my-addresses')
urlpatterns = [
    path('me/', current_user, name='current_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('register-admin/', RegisterAdminView.as_view(), name='register-admin'),
    path('request-admin/', AdminAccessRequestView.as_view(), name='request-admin'),
    path('review-admin-requests/', AdminAccessApprovalView.as_view(), name='review-admin-requests'),
] + router.urls
