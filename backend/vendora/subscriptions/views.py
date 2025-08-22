from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from datetime import datetime
import stripe

from vendora.permissions import IsTenantAdminOrReadOnly
from tenants.models import Tenant
from .models import Subscription, SubscriptionPlan
from .serializers import SubscriptionSerializer, SubscriptionPlanSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    tenant = request.user.tenant
    plan_id = request.data.get('plan_id')

    plan = SubscriptionPlan.objects.get(id=plan_id)

    if not tenant.stripe_customer_id:
        customer = stripe.Customer.create(email=request.user.email)
        tenant.stripe_customer_id = customer.id
        tenant.save()
    else:
        customer = stripe.Customer.retrieve(tenant.stripe_customer_id)

    session = stripe.checkout.Session.create(
        customer=customer.id,
        payment_method_types=['card'],
        line_items=[{
            'price': plan.stripe_price_id,
            'quantity': 1,
        }],
        mode='subscription',
        success_url=f'{settings.FRONTEND_URL}/admin/subscriptions/success',
        cancel_url=f'{settings.FRONTEND_URL}/admin/subscriptions/cancel'
    )

    return Response({'checkout_url': session.url})

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception:
        return Response(status=400)

    if event['type'] == 'customer.subscription.created':
        sub_data = event['data']['object']
        customer_id = sub_data['customer']
        stripe_subscription_id = sub_data['id']
        plan_price_id = sub_data['items']['data'][0]['price']['id']
        current_period_end = datetime.fromtimestamp(sub_data['current_period_end'])

        tenant = Tenant.objects.get(stripe_customer_id=customer_id)
        plan = SubscriptionPlan.objects.get(stripe_price_id=plan_price_id)

        Subscription.objects.update_or_create(
            tenant=tenant,
            stripe_subscription_id=stripe_subscription_id,
            defaults={
                'plan': plan,
                'current_period_end': current_period_end,
                'status': sub_data['status'],
            }
        )

    elif event['type'] == 'invoice.payment_failed':
        sub_id = event['data']['object']['subscription']
        Subscription.objects.filter(stripe_subscription_id=sub_id).update(status='past_due')

    return Response(status=200)


class SubscriptionPlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        # Only return active plans
        return SubscriptionPlan.objects.filter(active=True)

'''
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_subscription(request):
    tenant = request.user.tenant

    # grab latest subscription for tenant
    subscription = (
        Subscription.objects.filter(tenant=tenant)
        .order_by("-current_period_end")
        .first()
    )

    if subscription and subscription.is_active:
        return Response(SubscriptionSerializer(subscription).data)
    return Response(None)
'''

class CurrentSubscriptionView(RetrieveAPIView):
    queryset = Subscription.objects.all()
    permission_classes = [IsTenantAdminOrReadOnly]
    serializer_class = SubscriptionSerializer  # You need to define this

    def get_object(self):
        slug = self.kwargs["slug"]
        tenant = get_object_or_404(Tenant, slug=slug)
        return Subscription.objects.filter(tenant=tenant).order_by("-current_period_end").first()
