from django.urls import path
from . import views

urlpatterns = [
    path('orders/', views.orders_over_time, name='orders-over-time'),
    path('revenue/',views.revenue_over_time, name='revenue-over-time'),
    path('categories/', views.orders_by_category, name='orders_by_category')
]