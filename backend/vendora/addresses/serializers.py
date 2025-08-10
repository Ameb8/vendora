from rest_framework import serializers
from django_countries.serializer_fields import CountryField
from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    country = CountryField()

    class Meta:
        model = Address
        fields = '__all__'