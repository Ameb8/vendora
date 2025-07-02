from rest_framework import serializers
from .models import Tenant, AdminAccessRequest

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'
        read_only_fields = ['owner']


class TenantPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            'slug',
            'name',
            'image',
            'color_primary',
            'color_secondary',
            'color_accent',
            'email',
            'phone',
            'address'
        ]

class AdminAccessRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminAccessRequest
        fields = ['id', 'tenant', 'user', 'created_at', 'approved']
        read_only_fields = ['id', 'created_at', 'approved', 'user']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['user'] = request.user
        return super().create(validated_data)

