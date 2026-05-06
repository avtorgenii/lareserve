from rest_framework import serializers
from ..models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

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

        floors = value.get('floors')
        if floors is None:
            # If layout is provided, it should at least have a 'floors' key
            # or be an empty dict if allowed by the logic.
            return value

        if not isinstance(floors, dict):
            raise serializers.ValidationError("'floors' must be an object/dictionary.")

        required_keys = ['id', 'type', 'x', 'y', 'label']
        seen_ids = set()

        for floor_id, floor_data in floors.items():
            if not isinstance(floor_data, dict):
                raise serializers.ValidationError(f"Data for floor '{floor_id}' must be an object.")

            for key in required_keys:
                if key not in floor_data:
                    raise serializers.ValidationError(f"Floor '{floor_id}' is missing required field: '{key}'.")

            element_id = floor_data['id']
            if element_id in seen_ids:
                raise serializers.ValidationError(f"Duplicate ID found: '{element_id}'. IDs must be unique across all floors.")
            seen_ids.add(element_id)

        return value

