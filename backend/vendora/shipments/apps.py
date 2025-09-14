from django.apps import AppConfig

import os
import logging

import shippo

logger = logging.getLogger(__name__)

class ShipmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shipments'


    def ready(self):
        shippo.api_key = os.getenv('SHIPPO_PRIVATE')
        logger.critical(f"Shippo API Key (partial): {os.getenv('SHIPPO_PRIVATE')[:6]}")



