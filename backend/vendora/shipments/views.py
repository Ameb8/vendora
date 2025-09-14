from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

import logging

import shippo
# from shippo.error import ShippoError

from vendora.permissions import IsAdminOrReadOnly
from orders.models import Order

from .models import Shipment
from .serializers import ShipmentSerializer

logger = logging.getLogger(__name__)

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

@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Public endpoint
def shipping_estimate_view(request, order_id):
    order = get_object_or_404(Order, pk=order_id)

    # DEBUG *******
    logger.critical(f"FROM ADR: {order.from_adr}")
    logger.critical(f"TO ADR: {order.to_adr}")
    # END DEBUG ***

    if not order.package:
        return Response({"error": "Package information is missing or incomplete."}, status=400)

    if not order.from_adr or not order.to_adr:
        return Response({"error": "Address information is missing or incomplete."}, status=400)

    try:
        # Create shipment (rates will be calculated)
        shipment = shippo.Shipment.create(
            address_from=order.from_adr,
            address_to=order.to_adr,
            parcels=[order.package]
        )

        # Extract rates (sorted by price, cheapest first)
        rates = shipment.get("rates", [])
        if not rates:
            return Response({"error": "No rates found"}, status=400)

        rates_sorted = sorted(rates, key=lambda r: float(r["amount"]))

        cheapest_rate = rates_sorted[0]

        return Response({
            "order_id": order_id,
            "from": order.from_adr,
            "to": order.to_adr,
            "estimated_cost": float(cheapest_rate["amount"]),
            "currency": cheapest_rate["currency"],
            "provider": cheapest_rate["provider"],
            "servicelevel": cheapest_rate["servicelevel"]["name"],
        })

    #except ShippoError as e:
    #    return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

