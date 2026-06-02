from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..models import User

class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testworker',
            email='worker@example.com',
            password='password123',
            is_staff=True
        )

    def test_user_details_includes_is_staff(self):
        url = reverse('rest_user_details')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('is_staff', response.data)
        self.assertTrue(response.data['is_staff'])
        self.assertEqual(response.data['username'], 'testworker')
