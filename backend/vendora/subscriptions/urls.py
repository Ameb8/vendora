# subscriptions/urls.py
from django.urls import path
from .views import SubscriptionPlanListView, create_checkout_session, stripe_webhook, get_current_subscription

urlpatterns = [
    path("checkout/", create_checkout_session, name="create-checkout-session"),
    path("webhook/", stripe_webhook, name="stripe-webhook"),
    path("current/", get_current_subscription, name="current-subscription"),
    path("plans/", SubscriptionPlanListView.as_view(), name="subscription-plans"),
]
