from django.contrib import admin
from .models import Tenant, TenantAdmin

admin.site.register(Tenant)
admin.site.register(TenantAdmin)
