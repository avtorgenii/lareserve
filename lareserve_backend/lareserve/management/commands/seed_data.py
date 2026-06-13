from django.core.management.base import BaseCommand
from django.utils import timezone
from lareserve.models import Restaurant, Reservation, User
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = "Seeds the database with mock data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # 1. Create a User
        user, created = User.objects.get_or_create(
            username="worker",
            email="worker@lareserve.com",
            defaults={
                "first_name": "Adam",
                "last_name": "Kowalski",
                "phone": "500600700",
                "is_staff": True,
            },
        )
        if created:
            user.set_password("password123")
            user.save()
            self.stdout.write(f"User {user.username} created.")

        # 2. Create a Restaurant
        layout = {
            "floors": {
                "1": [],
            }
        }

        restaurant, created = Restaurant.objects.get_or_create(
            name="La Reserve",
            defaults={
                "country": "Polska",
                "city": "Kraków",
                "street": "Rynek Główny",
                "building_number": "1",
                "postal_code": "31-001",
                "layout": layout,
            },
        )
        if created:
            self.stdout.write(f"Restaurant {restaurant.name} created.")
        else:
            restaurant.layout = layout
            restaurant.save()

        self.stdout.write(self.style.SUCCESS("Successfully seeded data!"))
