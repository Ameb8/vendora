# subscriptions/urls.py
from django.urls import path
from .views import SubscriptionPlanListView, create_checkout_session, stripe_webhook, CurrentSubscriptionView, \
    CurrentSubscriptionView

urlpatterns = [
    path("checkout/", create_checkout_session, name="create-checkout-session"),
    path("webhook/", stripe_webhook, name="stripe-webhook"),
    path("current/<slug:slug>/", CurrentSubscriptionView.as_view(), name="current-subscription"),
    path("plans/", SubscriptionPlanListView.as_view(), name="subscription-plans"),
]
