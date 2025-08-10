from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework import status, viewsets, permissions, filters
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
import stripe
import shippo
import json
from .order_alert import notify_order
from .models import Order, OrderItem, Address, PhoneAlert, EmailAlert
from products.models import Product
from vendora.permissions import IsAdminOrReadOnly
from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    OrderItemDetailSerializer,
    AddressSerializer,
    PublicOrderSummarySerializer,
    PhoneAlertSerializer,
    EmailAlertSerializer,
    ShippingRateRequestSerializer,
)


stripe.api_key = settings.STRIPE_SECRET_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return HttpResponse(status=400)  # Invalid payload
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)  # Invalid signature

    # Handle successful payment
    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        payment_intent_id = intent.id
        metadata = intent.get('metadata', {})
        order_code = metadata.get('order_id')

        try:
            order = Order.objects.get(order_code=order_code)
            order.paid = True
            order.status = 'paid'
            order.save()

            notify_order(order)
        except Order.DoesNotExist:
            return HttpResponse(status=404)

    return HttpResponse(status=200)


class CreateOrderView(APIView):
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()

            # Optional: create Stripe PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=order.total_amount,
                currency='usd',
                metadata={'order_id': str(order.order_code)}
            )
            order.stripe_payment_intent_id = intent.id
            order.save()

            return Response({
                'order_id': order.id,
                'stripe_client_secret': intent.client_secret,
                'order_code': str(order.order_code)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'total_amount', 'status']

    def get_queryset(self):
        status_param = self.request.query_params.get('status')
        if status_param:
            return Order.objects.filter(status=status_param)
        return Order.objects.all()

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        status_value = request.data.get('status')
        if status_value not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = status_value
        order.save()
        return Response({'status': 'updated'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def products(self, request, pk=None):
        order = self.get_object()
        items = order.items.select_related('product').all()
        serializer = OrderItemDetailSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def address(self, request, pk=None):
        try:
            order = self.get_object()
            address = order.shipping_address
            serializer = AddressSerializer(address, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Address.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)


class PublicOrderLookupView(APIView):
    permission_classes = []

    def get(self, request, order_code):
        order = get_object_or_404(Order.objects.prefetch_related('items__product', 'shipments'), order_code=order_code)
        serializer = PublicOrderSummarySerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PhoneAlertViewSet(viewsets.ModelViewSet):
    queryset = PhoneAlert.objects.all()
    serializer_class = PhoneAlertSerializer
    permission_classes = [IsAdminUser]

class EmailAlertViewSet(viewsets.ModelViewSet):
    queryset = EmailAlert.objects.all()
    serializer_class = EmailAlertSerializer
    permission_classes = [IsAdminUser]
