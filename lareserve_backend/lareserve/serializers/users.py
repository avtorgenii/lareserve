from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "pk",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "is_staff",
        )
        read_only_fields = ("email", "is_staff")
