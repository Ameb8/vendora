from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField as SerializerPhoneNumberField

from decimal import Decimal, ROUND_HALF_UP

from products.models import Product
from products.serializers import ProductSerializer

from .models import Order, OrderItem, PhoneAlert, EmailAlert

'''
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'full_name', 'street_address', 'apartment_address',
            'city', 'state', 'postal_code', 'country', 'phone_number'
        ]
'''

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = OrderItem
        fields = ['product_id', 'quantity']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['email', 'shipping_address', 'tenant', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        total = Decimal('0.00')

        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            total += product.price * item['quantity']

        total_cents = int((total * 100).to_integral_value(rounding=ROUND_HALF_UP))

        # Instantiate Order object
        order = Order(total_amount=total_cents, **validated_data)

        # Calculate shipping cost
        order.estimate_shipping()


        # Create the order in database
        order.save()

        # Add order items
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            OrderItem.objects.create(order=order, product=product, quantity=item['quantity'])

        return order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class PublicOrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name')
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['name', 'price', 'image', 'quantity']

    def get_image(self, obj):
        return obj.product.image.url if obj.product.image else None

'''
class PublicShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['carrier', 'tracking_number', 'shipped_at', 'estimated_arrival', 'is_delivered', 'notes']
'''

class PublicOrderSummarySerializer(serializers.ModelSerializer):
    items = PublicOrderItemSerializer(many=True, read_only=True)
    shipment = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'order_code', 'created_at', 'status', 'total_amount', 'items', 'shipment']

    def get_shipment(self, obj):
        shipment = obj.shipments.first()
        return PublicShipmentSerializer(shipment).data if shipment else None

class PhoneAlertSerializer(serializers.ModelSerializer):
    number = SerializerPhoneNumberField(region='US')

    class Meta:
        model = PhoneAlert
        fields = '__all__'

class EmailAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailAlert
        fields = ['email']

class ShippingRateRequestSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    to_name = serializers.CharField()
    to_street1 = serializers.CharField()
    to_city = serializers.CharField()
    to_state = serializers.CharField()
    to_zip = serializers.CharField()
    to_country = serializers.CharField()