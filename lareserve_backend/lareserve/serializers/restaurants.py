from rest_framework import serializers
from ..models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = "__all__"

    def validate_layout(self, value):
        """
        Validate the layout structure.
        Expected format:
        {
            "floors": {
                "1": {'id': , 'type': , 'x': , 'y': , 'label':  ...},
            }
        }
        """
        if not value:
            return value

        if not isinstance(value, dict):
            raise serializers.ValidationError("Layout must be a dictionary.")

        floors = value.get("floors")
        if floors is None:
            # If layout is provided, it should at least have a 'floors' key
            # or be an empty dict if allowed by the logic.
            return value

        if not isinstance(floors, dict):
            raise serializers.ValidationError("'floors' must be an object/dictionary.")

        for floor_id, floor_data in floors.items():
            if not isinstance(floor_data, list):
                raise serializers.ValidationError(
                    f"Data for floor '{floor_id}' must be an object."
                )

        return value


class RestaurantLayoutUpdateSerializer(serializers.Serializer):
    floors = serializers.DictField(
        child=serializers.DictField(
            child=serializers.JSONField(),
            help_text="Floor element data (id, type, x, y, label, etc.)",
        )
    )


class AvailableDatesResponseSerializer(serializers.Serializer):
    available_dates = serializers.ListField(child=serializers.DateField())


class AvailableTablesResponseSerializer(serializers.Serializer):
    tables = serializers.DictField(
        child=serializers.BooleanField(),
        help_text="Key is table ID, value is availability (true/false)",
    )


class AvailableTimesResponseSerializer(serializers.Serializer):
    time_slots = serializers.DictField(
        child=serializers.BooleanField(),
        help_text="Key is time (e.g. '11:00'), value is availability (true/false)",
    )
