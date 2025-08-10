from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin/orders', views.AdminOrderViewSet, basename='admin-orders')
# router.register(r'shipments', views.ShipmentViewSet)
router.register(r'phone-numbers', views.PhoneAlertViewSet)
router.register(r'email', views.EmailAlertViewSet, basename='email-alert')

urlpatterns = [
    path('create-order/', views.CreateOrderView.as_view(), name='create-order'),
    path('stripe/webhook/', views.stripe_webhook, name='stripe-webhook'),
    path('details/<uuid:order_code>/', views.PublicOrderLookupView.as_view(), name='order-details'),
] + router.urls

