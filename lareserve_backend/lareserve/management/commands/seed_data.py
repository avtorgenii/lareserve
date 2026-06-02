from django.core.management.base import BaseCommand
from django.utils import timezone
from lareserve.models import Restaurant, Reservation, User
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Seeds the database with mock data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create a User
        user, created = User.objects.get_or_create(
            username='worker',
            email='worker@lareserve.com',
            defaults={
                'first_name': 'Adam',
                'last_name': 'Kowalski',
                'phone': '500600700',
                'is_staff': True,
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(f'User {user.username} created.')

        # 2. Create a Restaurant
        layout = {
            'floors': {
                '1': {'id': 1, 'type': 'table', 'x': 100, 'y': 100, 'label': 'T1 (2 os.)'},
                '2': {'id': 2, 'type': 'table', 'x': 200, 'y': 100, 'label': 'T2 (4 os.)'},
                '3': {'id': 3, 'type': 'table', 'x': 100, 'y': 200, 'label': 'T3 (2 os.)'},
                '4': {'id': 4, 'type': 'table', 'x': 200, 'y': 200, 'label': 'T4 (6 os.)'},
                '5': {'id': 5, 'type': 'wall', 'x': 50, 'y': 50, 'label': 'Ściana'},
            }
        }
        
        restaurant, created = Restaurant.objects.get_or_create(
            name='La Reserve',
            defaults={
                'country': 'Polska',
                'city': 'Kraków',
                'street': 'Rynek Główny',
                'building_number': '1',
                'postal_code': '31-001',
                'layout': layout
            }
        )
        if created:
            self.stdout.write(f'Restaurant {restaurant.name} created.')
        else:
            restaurant.layout = layout
            restaurant.save()

        # 3. Create Reservations
        now = timezone.now()
        
        # Today's reservations
        today_12 = now.replace(hour=12, minute=0, second=0, microsecond=0)
        today_15 = now.replace(hour=15, minute=0, second=0, microsecond=0)
        today_18 = now.replace(hour=18, minute=0, second=0, microsecond=0)

        # Guest reservation
        Reservation.objects.get_or_create(
            restaurant=restaurant,
            table_id=1,
            date=today_12,
            defaults={
                'guest_name': 'Jan Kowalski',
                'guest_email': 'jan@example.com',
                'guest_phone': '111222333',
                'special_requests': 'Przy oknie poproszę.'
            }
        )

        # Authenticated reservation
        Reservation.objects.get_or_create(
            restaurant=restaurant,
            table_id=2,
            date=today_15,
            defaults={
                'user': user,
                'special_requests': 'Rocznica ślubu.'
            }
        )

        # Another guest
        Reservation.objects.get_or_create(
            restaurant=restaurant,
            table_id=4,
            date=today_18,
            defaults={
                'guest_name': 'Anna Nowak',
                'special_requests': 'Wózek dziecięcy.'
            }
        )

        # Tomorrow
        tomorrow_19 = (now + timedelta(days=1)).replace(hour=19, minute=0, second=0, microsecond=0)
        Reservation.objects.get_or_create(
            restaurant=restaurant,
            table_id=2,
            date=tomorrow_19,
            defaults={
                'guest_name': 'Marek Mostowiak'
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded data!'))
