from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import stripe

import logging

from orders.models import Order
from .models import Payment

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_payment(request, order_id):
    order = get_object_or_404(Order, id=order_id) #, user=request.user)

    if order.paid:
        return Response({"detail": "Order is already paid"}, status=400)

    tenant = order.tenant
    if not tenant or not tenant.stripe_account_id:
        return Response({"detail": "Tenant is not configured for payments"}, status=400)

    logger.debug(f'Order Object Found, price: {order.total_amount} cents')

    payment = Payment.objects.create(
        order=order,
        tenant=tenant,
        user=request.user,
        amount=order.total_amount,
        status='pending'
    )

    logger.debug(f'Payment Object Created: \n{payment}\n\n')

    try:
        intent = stripe.PaymentIntent.create(
            amount=payment.amount,
            currency='usd',
            payment_method_types=['card'],
            transfer_data={"destination": tenant.stripe_account_id},
            metadata={"payment_id": str(payment.id), "order_id": str(order.id)},
            stripe_account=tenant.stripe_account_id,
        )

        logger.debug(f'Payment Intent: {intent}')

        payment.stripe_payment_intent_id = intent.id
        payment.save()

        return Response({'client_secret': intent.client_secret}, status=200)

    except stripe.error.StripeError as e:
        logger.debug(f'Stripe Error: {e}')
        payment.status = 'failed'
        payment.save()
        return Response({'detail': str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([])
def stripe_webhook(request):
    logger.debug("Payment Webhook received")
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_PAYMENT_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return HttpResponse(status=400)  # Invalid payload
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)  # Invalid signature

    # Handle event
    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        metadata = intent.get('metadata', {})
        payment_id = metadata.get('payment_id')

        try:
            payment = Payment.objects.get(id=payment_id)
            payment.status = 'succeeded'
            payment.method = intent['payment_method_types'][0]
            payment.save()

            # Mark the order as paid
            order = payment.order
            order.paid = True
            order.status = 'paid'
            order.save()

        except Payment.DoesNotExist:
            return HttpResponse(status=404)

    elif event['type'] == 'payment_intent.payment_failed':
        intent = event['data']['object']
        metadata = intent.get('metadata', {})
        payment_id = metadata.get('payment_id')

        Payment.objects.filter(id=payment_id).update(status='failed')

    return HttpResponse(status=200)

