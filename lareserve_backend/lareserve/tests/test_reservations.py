from datetime import datetime, timedelta
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Restaurant, Reservation, User

class ReservationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='password123',
            first_name='John',
            last_name='Doe'
        )
        self.client.force_authenticate(user=self.user)

        self.layout = {
            'floors': {
                '1': {'id': 1, 'type': 'table', 'x': 0, 'y': 0, 'label': 'Table 1'},
                '2': {'id': 2, 'type': 'table', 'x': 10, 'y': 10, 'label': 'Table 2'}
            }
        }
        self.restaurant = Restaurant.objects.create(
            name='Test Restaurant', country='Poland', city='Warsaw', building_number='10',
            layout=self.layout
        )

    def test_reservation_create_with_special_requests(self):
        url = reverse('reservation-create')
        date = timezone.now() + timedelta(days=1)
        data = {
            'restaurant': self.restaurant.id,
            'table_id': 1,
            'date': date.isoformat(),
            'special_requests': 'Near the window'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['special_requests'], 'Near the window')

    def test_reservation_list_today(self):
        Reservation.objects.create(
            restaurant=self.restaurant, user=self.user, table_id=1,
            date=timezone.now(), special_requests='Today test'
        )
        url = reverse('reservation-list-today')
        response = self.client.get(url, {'restaurant_id': self.restaurant.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['guest_name'], 'John Doe')

    def test_reservation_update_status(self):
        res = Reservation.objects.create(
            restaurant=self.restaurant, user=self.user, table_id=1, date=timezone.now()
        )
        url = reverse('reservation-update-status', kwargs={'pk': res.pk})
        # Testing PUT as PATCH was removed
        response = self.client.put(url, {'status': 'FINISHED'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        res.refresh_from_db()
        self.assertEqual(res.status, 'FINISHED')

    def test_reservation_delete(self):
        res = Reservation.objects.create(
            restaurant=self.restaurant, user=self.user, table_id=1, date=timezone.now()
        )
        url = reverse('reservation-delete', kwargs={'pk': res.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Reservation.objects.count(), 0)

    def test_reservation_by_table(self):
        date = timezone.localdate()
        Reservation.objects.create(
            restaurant=self.restaurant,
            user=self.user,
            table_id=2,
            date=timezone.now()
        )
        url = reverse('reservation-by-table')
        response = self.client.get(url, {
            'restaurant_id': self.restaurant.id,
            'table_id': 2, 
            'date': date.isoformat()
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['table_id'], 2)
