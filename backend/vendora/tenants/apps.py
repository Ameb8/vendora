from django.apps import AppConfig
from django.conf import settings

import stripe


class TenantsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tenants'

    def ready(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
