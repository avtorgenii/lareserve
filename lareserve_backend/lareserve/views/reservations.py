from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from ..models import Reservation
from ..serializers.reservations import ReservationSerializer


@extend_schema(responses={201: ReservationSerializer})
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


@extend_schema(responses={200: ReservationSerializer})
@api_view(['PUT', 'PATCH'])
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
    Cancel a reservation.
    """
    try:
        reservation = Reservation.objects.get(pk=pk, user=request.user)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    reservation.status = Reservation.Status.CANCELLED
    reservation.save()
    serializer = ReservationSerializer(reservation)
    return Response(serializer.data)
