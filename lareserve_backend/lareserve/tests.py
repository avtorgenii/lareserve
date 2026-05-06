from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Restaurant

class RestaurantTests(APITestCase):
    def setUp(self):
        self.valid_layout = {
            'floors': {
                '1': {'id': 'table_1', 'type': 'table', 'x': 0, 'y': 0, 'label': 'Table 1'},
                '2': {'id': 'table_2', 'type': 'table', 'x': 10, 'y': 10, 'label': 'Table 2'}
            }
        }

    def test_create_restaurant(self):
        url = reverse('restaurant-create')
        data = {
            'name': 'Test Restaurant',
            'country': 'Test Country',
            'city': 'Test City',
            'street': 'Test Street',
            'building_number': '1',
            'postal_code': '12345',
            'layout': self.valid_layout
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Restaurant.objects.count(), 1)

    def test_delete_restaurant(self):
        restaurant = Restaurant.objects.create(
            name='To Be Deleted',
            country='Test Country',
            city='Test City',
            street='Test Street',
            building_number='1',
            postal_code='12345'
        )
        url = reverse('restaurant-delete', kwargs={'pk': restaurant.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Restaurant.objects.count(), 0)

    def test_update_restaurant(self):
        restaurant = Restaurant.objects.create(
            name='Old Name',
            country='Test Country',
            city='Test City',
            street='Test Street',
            building_number='1',
            postal_code='12345'
        )
        url = reverse('restaurant-update', kwargs={'pk': restaurant.pk})
        data = {
            'name': 'New Name',
            'country': 'Test Country',
            'city': 'Test City',
            'street': 'Test Street',
            'building_number': '1',
            'postal_code': '12345',
            'layout': self.valid_layout
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        restaurant.refresh_from_db()
        self.assertEqual(restaurant.name, 'New Name')

    def test_create_restaurant_invalid_layout_keys(self):
        url = reverse('restaurant-create')
        data = {
            'name': 'Invalid Keys',
            'country': 'C', 'city': 'C', 'street': 'S', 'building_number': '1', 'postal_code': '1',
            'layout': {'floors': {'1': {'type': 'floor'}}} # Missing id, x, y, label
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('layout', response.data)

    def test_create_restaurant_duplicate_ids(self):
        url = reverse('restaurant-create')
        data = {
            'name': 'Duplicate IDs',
            'country': 'C', 'city': 'C', 'street': 'S', 'building_number': '1', 'postal_code': '1',
            'layout': {
                'floors': {
                    '1': {'id': 'same_id', 'type': 'table', 'x': 0, 'y': 0, 'label': 'T1'},
                    '2': {'id': 'same_id', 'type': 'table', 'x': 1, 'y': 1, 'label': 'T2'}
                }
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Duplicate ID found', str(response.data['layout']))
