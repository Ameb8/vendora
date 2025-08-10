from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from django.db.models import Count, Sum
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from orders.models import Order, OrderItem

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def orders_over_time(request):
    granularity = request.query_params.get('granularity', 'daily').lower()

    if granularity == 'daily':
        trunc_func = TruncDay
    elif granularity == 'weekly':
        trunc_func = TruncWeek
    elif granularity == 'monthly':
        trunc_func = TruncMonth
    elif granularity == 'yearly':
        trunc_func = TruncYear
    else:
        return Response({'error': 'Invalid granularity'}, status=400)

    orders_by_date = (
        Order.objects
        .annotate(period=trunc_func('created_at'))
        .values('period')
        .annotate(count=Count('id'))
        .order_by('period')
    )

    dates = [entry['period'].isoformat() if entry['period'] else None for entry in orders_by_date]
    counts = [entry['count'] for entry in orders_by_date]

    return Response({
        'dates': dates,
        'counts': counts,
    })

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def revenue_over_time(request):
    granularity = request.query_params.get('granularity', 'daily').lower()

    if granularity == 'daily':
        trunc_func = TruncDay
    elif granularity == 'weekly':
        trunc_func = TruncWeek
    elif granularity == 'monthly':
        trunc_func = TruncMonth
    elif granularity == 'yearly':
        trunc_func = TruncYear
    else:
        return Response({'error': 'Invalid granularity'}, status=400)

    revenue_by_date = (
        Order.objects
        .filter(paid=True)  # Only include paid orders
        .annotate(period=trunc_func('created_at'))
        .values('period')
        .annotate(total_revenue=Sum('total_amount'))
        .order_by('period')
    )

    dates = [entry['period'].isoformat() if entry['period'] else None for entry in revenue_by_date]
    revenues = [entry['total_revenue'] / 100 for entry in revenue_by_date]  # Convert cents to dollars

    return Response({
        'dates': dates,
        'revenues': revenues,
    })

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def orders_by_category(request):
    data = (
        OrderItem.objects
        .values('product__category')
        .annotate(total_quantity=Sum('quantity'))
        .order_by('product__category')
    )

    # Data to track
    categories = [entry['product__category'] or 'Uncategorized' for entry in data]
    quantities = [entry['total_quantity'] for entry in data]

    return Response({
        'categories': categories,
        'quantities': quantities,
    })
