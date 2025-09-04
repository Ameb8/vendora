from django.apps import AppConfig

import os

import shippo

class ShipmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shipments'


    def ready(self):
        shippo.api_key = os.getenv('SHIPPO_PRIVATE')