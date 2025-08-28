from django.db.models import Max
from rest_framework import serializers
from .models import PageDesign, DesignImage, ImageList, ImageInList

class PageDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageDesign
        fields = ['id', 'tenant', 'about_us_title', 'about_us_body', 'contact_num', 'contact_mail']
        read_only_fields = ['tenant']
'''
class PageDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageDesign
        fields = '__all__'
'''

class DesignImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()  # writable

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = instance.image.url if instance.image else None
        return representation

    class Meta:
        model = DesignImage
        fields = ['id', 'image']

class ImageInListSerializer(serializers.ModelSerializer):
    image = DesignImageSerializer()

    class Meta:
        model = ImageInList
        fields = ['id', 'image', 'image_list', 'order']

class ImageInListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageInList
        fields = ['id', 'image', 'image_list']

