from django.urls import path
from .views import AddressCreateView

urlpatterns = [
    path('', AddressCreateView.as_view(), name='address-create'),
]