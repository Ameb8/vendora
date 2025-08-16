from django.contrib import admin

from django.contrib import admin
from .models import Subscription, SubscriptionPlan

admin.site.register(Subscription)
admin.site.register(SubscriptionPlan)

