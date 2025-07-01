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
from .models import Order, OrderItem, Address, Shipment, PhoneAlert, EmailAlert
from products.models import Product
from vendora.permissions import IsAdminOrReadOnly
from .serializers import (
    CreateOrderSerializer,
    OrderSerializer,
    OrderItemDetailSerializer,
    AddressSerializer,
    ShipmentSerializer,
    PublicOrderSummarySerializer,
    PhoneAlertSerializer,
    EmailAlertSerializer,
    ShippingRateRequestSerializer,
)

stripe.api_key = settings.STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET

@csrf_exempt
def stripe_webhook(request):
    print("Payment Successful")
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    # Handle successful payment
    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        order_id = intent['metadata'].get('order_id')

        try: # Update order object
            order = Order.objects.get(id=order_id)
            notify_order(order)
            order.paid = True
            order.status = 'paid'
            order.stripe_payment_intent_id = intent['id']
            order.save()


            # Update amounts for each Product in inventory
            for item in order.items.all():
                product = item.product
                if product.amount is not None:
                    product.amount = max(product.amount - item.quantity, 0)
                    product.save()
        except Order.DoesNotExist:
            return HttpResponse(status=404)

    return HttpResponse(status=200)

class CreateOrderView(APIView):
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        items = serializer.validated_data['items']
        address_data = serializer.validated_data['shipping_address']

        # Create address object
        shipping_address = Address.objects.create(**address_data)

        # Create order and calculate total
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            email=email,
            paid=False,
            total_amount=0,
            shipping_address = shipping_address
        )

        total = 0
        for item in items:
            product = Product.objects.get(id=item['product_id'])
            quantity = item['quantity']
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
            total += product.price * quantity  # assuming product.price is in cents

        order.total_amount = total
        order.save()

        # Create Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency='usd',
            metadata={'order_id': str(order.id)}
        )

        return Response({
            'clientSecret': intent.client_secret,
            'orderCode': order.order_code
        }, status=status.HTTP_201_CREATED)

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
