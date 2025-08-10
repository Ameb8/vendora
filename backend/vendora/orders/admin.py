from django.contrib import admin
from . import models

class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ['order_code', 'created_at']

admin.site.register(models.Order)
admin.site.register(models.OrderItem)
admin.site.register(models.PhoneAlert)
admin.site.register(models.EmailAlert)
