from django.utils import timezone
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer
from drf_spectacular.types import OpenApiTypes

from ..models import Reservation
from ..serializers.reservations import ReservationSerializer, ReservationSummarySerializer


@extend_schema(request=ReservationSerializer, responses={201: ReservationSerializer})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reservation_create(request):
    """
    Create a new reservation.
    """
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(request=ReservationSerializer, responses={200: ReservationSerializer})
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reservation_move(request, pk):
    """
    Move (update) an existing reservation (change date or table).
    """
    try:
        reservation = Reservation.objects.get(pk=pk, user=request.user)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReservationSerializer(reservation, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(responses={200: ReservationSerializer})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reservation_cancel(request, pk):
    """
    Cancel a reservation (Change status to CANCELLED).
    """
    try:
        reservation = Reservation.objects.get(pk=pk, user=request.user)
    except Reservation.DoesNotExist:
        # Also allow staff to cancel
        if request.user.is_staff:
            try:
                reservation = Reservation.objects.get(pk=pk)
            except Reservation.DoesNotExist:
                return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    reservation.status = Reservation.Status.CANCELLED
    reservation.save()
    serializer = ReservationSerializer(reservation)
    return Response(serializer.data)


@extend_schema(
    parameters=[
        OpenApiParameter(name="restaurant_id", type=OpenApiTypes.INT, location=OpenApiParameter.QUERY, required=True),
    ],
    responses={200: ReservationSummarySerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reservation_list_today(request):
    """
    Get list of reservations for today for a specific restaurant (Employee Panel).
    """
    restaurant_id = request.query_params.get('restaurant_id')
    if not restaurant_id:
        return Response({"error": "restaurant_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    today = timezone.localdate()
    reservations = Reservation.objects.filter(
        restaurant_id=restaurant_id,
        date__date=today
    ).order_by('date')

    serializer = ReservationSummarySerializer(reservations, many=True)
    return Response(serializer.data)


@extend_schema(
    parameters=[
        OpenApiParameter(name="restaurant_id", type=OpenApiTypes.INT, location=OpenApiParameter.QUERY, required=True),
        OpenApiParameter(name="table_id", type=OpenApiTypes.STR, location=OpenApiParameter.QUERY, required=True),
        OpenApiParameter(name="date", type=OpenApiTypes.DATE, location=OpenApiParameter.QUERY, required=True),
    ],
    responses={200: ReservationSummarySerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reservation_by_table(request):
    """
    Get detailed reservation info for a specific table in a restaurant on a given day.
    """
    restaurant_id = request.query_params.get('restaurant_id')
    table_id = request.query_params.get('table_id')
    date_str = request.query_params.get('date')

    if not all([restaurant_id, table_id, date_str]):
        return Response({"error": "restaurant_id, table_id and date are required"}, status=status.HTTP_400_BAD_REQUEST)

    reservations = Reservation.objects.filter(
        restaurant_id=restaurant_id,
        table_id=table_id,
        date__date=date_str
    ).order_by('date')

    serializer = ReservationSummarySerializer(reservations, many=True)
    return Response(serializer.data)

@extend_schema(
    request=inline_serializer(
        name='ReservationStatusUpdateSerializer',
        fields={
            'status': serializers.ChoiceField(choices=Reservation.Status.choices)
        }
    ),
    responses={200: ReservationSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reservation_update_status(request, pk):
    """
    Change reservation status (e.g., to FINISHED).
    """
    try:
        reservation = Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in Reservation.Status.values:
        return Response({"error": f"Invalid status. Choose from {Reservation.Status.values}"}, status=status.HTTP_400_BAD_REQUEST)

    reservation.status = new_status
    reservation.save()
    serializer = ReservationSerializer(reservation)
    return Response(serializer.data)


@extend_schema(responses={204: None})
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reservation_delete(request, pk):
    """
    Delete a reservation.
    """
    try:
        reservation = Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    reservation.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

