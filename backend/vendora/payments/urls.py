from django.urls import path
from . import views

urlpatterns = [
    path('create/<uuid:order_id>/', views.create_payment, name='create-payment'),
    path('stripe/webhook/', views.stripe_webhook, name='stripe-webhook'),
]