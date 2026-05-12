from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer
from drf_spectacular.types import OpenApiTypes

from ..models import Restaurant, Reservation
from ..serializers.restaurants import RestaurantSerializer

AVAILABLE_TIMES = [
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00',
]


@extend_schema(responses={200: RestaurantSerializer(many=True)})
@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_list(request):
    """
    Get list of all restaurants with pagination.
    """
    paginator = PageNumberPagination()
    restaurants = Restaurant.objects.all().order_by('name')
    result_page = paginator.paginate_queryset(restaurants, request)
    serializer = RestaurantSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@extend_schema(request=RestaurantSerializer, responses={201: RestaurantSerializer})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restaurant_create(request):
    """
    Create a new restaurant.
    """
    serializer = RestaurantSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(request=RestaurantSerializer, responses={200: RestaurantSerializer})
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def restaurant_update(request, pk):
    """
    Update an existing restaurant.
    """
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = RestaurantSerializer(restaurant, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(responses={204: None})
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def restaurant_delete(request, pk):
    """
    Delete a restaurant by ID.
    """
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    restaurant.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(responses={200: inline_serializer(
    name='RestaurantLayoutUpdateSerializer',
    fields={
        'floors': serializers.DictField(
            child=serializers.DictField(
                child=serializers.JSONField(),
                help_text="Floor element data (id, type, x, y, label, etc.)"
            )
        )
    }
)})
@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_get_layout(request, pk):
    """
    Get the layout of a restaurant.
    """
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(restaurant.layout)


@extend_schema(
    request=inline_serializer(
        name='RestaurantLayoutUpdateSerializer',
        fields={
            'floors': serializers.DictField(
                child=serializers.DictField(
                    child=serializers.JSONField(),
                    help_text="Floor element data (id, type, x, y, label, etc.)"
                )
            )
        }
    ),
    responses={200: OpenApiTypes.OBJECT}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def restaurant_update_layout(request, pk):
    """
    Update the layout of a restaurant.
    """
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    # We can use the serializer to validate the layout specifically
    serializer = RestaurantSerializer(restaurant, data={'layout': request.data}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(restaurant.layout)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    responses={
        200: serializers.ListField(child=serializers.DateField())
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_available_dates(request, pk):
    """
    Get available dates for reservations (next 14 days).
    Returns a simple list of ISO date strings.
    """
    try:
        Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    today = timezone.localdate()
    dates = [(today + timedelta(days=i)).isoformat() for i in range(14)]
    return Response(dates)


@extend_schema(
    parameters=[
        OpenApiParameter(name="date", type=OpenApiTypes.DATE, location=OpenApiParameter.QUERY, required=True),
    ],
    responses={
        200: inline_serializer(
            name='AvailableTimesResponse',
            fields={
                'time_slot': serializers.DictField(
                    child=serializers.BooleanField(),
                    help_text="Key is time (e.g. '11:00'), value is availability (true/false)"
                )
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_available_times(request, pk):
    """
    Get available times for a specific date with their availability status.
    Format: {"11:00": True, "12:00": False, ...}
    """
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    date_str = request.query_params.get('date')
    if not date_str:
        return Response({"error": "Date parameter is required (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    layout = restaurant.layout or {}
    floors = layout.get('floors', {})
    table_ids = [
        elem.get('id') for elem in floors.values()
        if 'table' in elem.get('type', '').lower()
    ]

    if not table_ids:
        return Response({time: False for time in AVAILABLE_TIMES})

    # Availability logic:
    # For each time slot, check if ANY table is available.
    # A table is unavailable if it has a confirmed reservation within 2 hours.
    from ..serializers.reservations import RESERVATION_BUFFER_HOURS
    buffer = timedelta(hours=RESERVATION_BUFFER_HOURS)

    results = {}
    for time_str in AVAILABLE_TIMES:
        slot_time = timezone.make_aware(datetime.combine(target_date, datetime.strptime(time_str, '%H:%M').time()))

        # Count tables that have conflicts at this slot
        conflicts_count = Reservation.objects.filter(
            restaurant=restaurant,
            table_id__in=table_ids,
            status=Reservation.Status.CONFIRMED,
            date__range=(slot_time - buffer + timedelta(seconds=1), slot_time + buffer - timedelta(seconds=1))
        ).values('table_id').distinct().count()

        results[time_str] = conflicts_count < len(table_ids)

    return Response(results)
