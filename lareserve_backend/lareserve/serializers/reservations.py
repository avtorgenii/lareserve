from datetime import timedelta
from rest_framework import serializers
from django.utils import timezone
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from ..models import Reservation, Restaurant

# Default buffer time between reservations at the same table
RESERVATION_BUFFER_HOURS = 2

class ReservationSummarySerializer(serializers.ModelSerializer):
    guest_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = ['id', 'date', 'table_id', 'status', 'guest_name', 'email', 'phone', 'special_requests']

    @extend_schema_field(OpenApiTypes.STR)
    def get_guest_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return obj.guest_name

    @extend_schema_field(OpenApiTypes.STR)
    def get_email(self, obj):
        if obj.user:
            return obj.user.email
        return obj.guest_email

    @extend_schema_field(OpenApiTypes.STR)
    def get_phone(self, obj):
        if obj.user:
            return obj.user.phone
        return obj.guest_phone


class ReservationStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Reservation.Status.choices)


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = [
            'id', 'restaurant', 'table_id', 'date', 'special_requests',
            'guest_name', 'guest_email', 'guest_phone', 'status', 'user', 'created_at'
        ]
        read_only_fields = ['user', 'status', 'created_at']

    def validate(self, data):
        restaurant = data.get('restaurant')
        table_id = data.get('table_id')
        reservation_date = data.get('date')

        # 0. Check if date is in the past
        if reservation_date < timezone.now():
            raise serializers.ValidationError({"date": "Cannot book in the past."})

        # 1. Check if table_id exists in restaurant layout and is a table
        layout = restaurant.layout
        if not layout or 'floors' not in layout:
            raise serializers.ValidationError({"table_id": "Restaurant has no layout defined."})
        
        floors = layout['floors']
        table_element = None
        for element in floors.values():
            if str(element.get('id')) == str(table_id):
                table_element = element
                break
        
        if not table_element:
            raise serializers.ValidationError({"table_id": f"Table with ID '{table_id}' not found in restaurant layout."})
        
        if 'table' not in table_element.get('type', '').lower():
            raise serializers.ValidationError({"table_id": f"Element '{table_id}' is not a table (type: {table_element.get('type')})."})

        # 2. Check for time conflicts
        # A conflict exists if another reservation for the same table is within X hours
        buffer = timedelta(hours=RESERVATION_BUFFER_HOURS)
        # Use exclusive range to allow back-to-back reservations if they don't overlap
        start_range = reservation_date - buffer + timedelta(seconds=1)
        end_range = reservation_date + buffer - timedelta(seconds=1)

        conflicting_reservations = Reservation.objects.filter(
            restaurant=restaurant,
            table_id=table_id,
            status=Reservation.Status.CONFIRMED,
            date__range=(start_range, end_range)
        )

        # If updating, exclude the current reservation
        if self.instance:
            conflicting_reservations = conflicting_reservations.exclude(pk=self.instance.pk)

        if conflicting_reservations.exists():
            raise serializers.ValidationError(
                {"date": f"Table '{table_id}' is already reserved within {RESERVATION_BUFFER_HOURS} hours of this time."}
            )

        return data
