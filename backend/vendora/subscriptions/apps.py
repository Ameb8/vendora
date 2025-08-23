from django.apps import AppConfig
from django.conf import settings

import stripe

class SubscriptionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'subscriptions'

    def ready(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY

