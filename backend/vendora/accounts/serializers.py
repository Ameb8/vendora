from django.contrib.auth.models import User

from rest_framework import serializers

from addresses.models import Address
from addresses.serializers import AddressSerializer

from .models import AdminAccessRequest, UserAddress, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['profile_picture']

    def get_profile_picture(self, obj):
        return obj.profile_picture.url if obj.profile_picture else None

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    initials = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'profile', 'initials']

    def get_initials(self, obj):
        if obj.first_name and obj.last_name:
            return f'{obj.first_name[0]}{obj.last_name[0]}'.upper()

        return obj.username[0].upper()


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