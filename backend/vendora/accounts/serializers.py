from rest_framework import serializers
from django.contrib.auth.models import User
from addresses.models import Address
from addresses.serializers import AddressSerializer
from .models import AdminAccessRequest, UserAddress

class AdminAccessRequestSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = AdminAccessRequest
        fields = '__all__'
        read_only_fields = ['approved', 'reviewed_by', 'reviewed_at']

class UserAddressSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = UserAddress
        fields = ['__all__']

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        return UserAddress.objects.create(user=self.context['request'].user, address=address, **validated_data)

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        if address_data:
            for field, value in address_data.items():
                setattr(instance.address, field, value)
            instance.address.save()

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance