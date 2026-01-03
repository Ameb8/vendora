from django.urls import path
from .views import stripe_webhook

urlpatterns = [
    path("webhook/", stripe_webhook, name="stripe-webhook"),
]
