from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# ##### USERS #####
class User(AbstractUser):
    """
    Custom User model.
    Django will add email, password, firstName, lastName etc. automatically.
    """
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.email} ({self.first_name})"


# ##### ASSETS & LAYOUTS #####
class AssetTemplate(models.Model):
    """Library of common elements (tables, chairs etc.)"""
    name = models.CharField(max_length=100)
    icon = models.URLField()
    scale_x = models.DecimalField(max_digits=10, decimal_places=4)
    scale_y = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return self.name


# ##### RESTAURANTS #####
class Restaurant(models.Model):
    name = models.CharField(max_length=255)

    # Address data
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=255)
    building_number = models.CharField(max_length=20)
    postal_code = models.CharField(max_length=10)

    # Storing list of objects [{template_id, floor, loc_x, loc_y, scale_x, scale_y, rotation}, ...]
    layout = models.JSONField(default=list, help_text="List of layout elements")

    def __str__(self):
        return self.name


# ##### RESERVATIONS #####
class Reservation(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = 'CONFIRMED'
        CANCELLED = 'CANCELLED'
        FINISHED = 'FINISHED'

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CONFIRMED
    )

    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservations'
    )

    def __str__(self):
        return f"Reservation #{self.id} - {self.user.email}"
