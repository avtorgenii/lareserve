from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Restaurant, User
from django.utils import timezone
from datetime import timedelta

class RestaurantTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin', 
            email='admin@example.com', 
            password='password123',
            is_staff=True
        )
        self.client.force_authenticate(user=self.user)
        
        self.valid_layout = {
            'floors': {
                '1': {'id': 1, 'type': 'table', 'x': 0, 'y': 0, 'label': 'Table 1'},
                '2': {'id': 2, 'type': 'table', 'x': 10, 'y': 10, 'label': 'Table 2'}
            }
        }

    def test_create_restaurant(self):
        url = reverse('restaurant-create')
        data = {
            'name': 'Test Restaurant',
            'country': 'Poland',
            'city': 'Warsaw',
            'street': 'Main St',
            'building_number': '10',
            'postal_code': '00-001',
            'layout': self.valid_layout
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_restaurant_list_pagination(self):
        Restaurant.objects.create(name='A', country='C', city='C', building_number='1')
        url = reverse('restaurant-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_restaurant_get_layout(self):
        res = Restaurant.objects.create(name='A', country='C', city='C', building_number='1', layout=self.valid_layout)
        url = reverse('restaurant-get-layout', kwargs={'pk': res.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.valid_layout)

    def test_restaurant_update_layout(self):
        res = Restaurant.objects.create(name='A', country='C', city='C', building_number='1', layout=self.valid_layout)
        url = reverse('restaurant-update-layout', kwargs={'pk': res.pk})
        new_layout = {'floors': {'1': {'id': 1, 'type': 'table', 'x': 5, 'y': 5, 'label': 'Updated'}}}
        response = self.client.put(url, new_layout, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_available_dates(self):
        res = Restaurant.objects.create(name='A', country='C', city='C', building_number='1')
        url = reverse('restaurant-available-dates', kwargs={'pk': res.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # It's now wrapped in 'available_dates'
        self.assertEqual(len(response.data['available_dates']), 14)

    def test_available_times(self):
        res = Restaurant.objects.create(name='A', country='C', city='C', building_number='1', layout=self.valid_layout)
        url = reverse('restaurant-available-times', kwargs={'pk': res.pk})
        date_str = timezone.localdate().isoformat()
        response = self.client.get(url, {'date': date_str})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # It's now wrapped in 'time_slots'
        self.assertIn('11:00', response.data['time_slots'])

    def test_available_tables(self):
        res = Restaurant.objects.create(name='A', country='C', city='C', building_number='1', layout=self.valid_layout)
        url = reverse('restaurant-available-tables', kwargs={'pk': res.pk})
        date_str = (timezone.localdate() + timedelta(days=1)).isoformat()
        time_str = "12:00"
        response = self.client.get(url, {'date': date_str, 'time': time_str})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # IDs are 1 and 2 in valid_layout, let's try integer keys
        self.assertTrue(response.data['tables'][1])
        self.assertTrue(response.data['tables'][2])
