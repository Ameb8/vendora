from rest_framework import viewsets
from vendora.permissions import IsAdminOrReadOnly
from .models import Shipment
from .serializers import ShipmentSerializer

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        # Save the shipment first
        shipment = serializer.save()

        # Update the related order's status
        order = shipment.order
        order.status = 'fulfilled'
        order.save()
