import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    category = django_filters.AllValuesMultipleFilter(field_name='category')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Product
        fields = ['category', 'price_min', 'price_max']