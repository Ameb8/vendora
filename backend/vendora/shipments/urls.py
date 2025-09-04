from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ShipmentViewSet, shipping_estimate_view

router = DefaultRouter()
router.register(r'shipments', ShipmentViewSet, basename='shipment')

urlpatterns = [
    path('', include(router.urls)),
    path('price/<int:order_id>/', shipping_estimate_view, name='shipping-estimate'),
]