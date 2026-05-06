from datetime import timedelta
from rest_framework import serializers
from django.utils import timezone
from ..models import Reservation, Restaurant

# Default buffer time between reservations at the same table
RESERVATION_BUFFER_HOURS = 2

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']

    def validate(self, data):
        restaurant = data.get('restaurant')
        table_id = data.get('table_id')
        reservation_date = data.get('date')

        # 1. Check if table_id exists in restaurant layout and is a table
        layout = restaurant.layout
        if not layout or 'floors' not in layout:
            raise serializers.ValidationError({"table_id": "Restaurant has no layout defined."})
        
        floors = layout['floors']
        table_element = None
        for element in floors.values():
            if element.get('id') == table_id:
                table_element = element
                break
        
        if not table_element:
            raise serializers.ValidationError({"table_id": f"Table with ID '{table_id}' not found in restaurant layout."})
        
        if 'table' not in table_element.get('type', '').lower():
            raise serializers.ValidationError({"table_id": f"Element '{table_id}' is not a table (type: {table_element.get('type')})."})

        # 2. Check for time conflicts
        # A conflict exists if another reservation for the same table is within X hours
        buffer = timedelta(hours=RESERVATION_BUFFER_HOURS)
        start_range = reservation_date - buffer
        end_range = reservation_date + buffer

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
