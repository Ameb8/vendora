from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from addresses.models import Address
from .models import UserAddress

User = get_user_model()

class UserAddressViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.address_data = {
            "street_address": "123 Main St",
            "apartment_address": "Apt 4B",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "US"
        }

        self.user_address_data = {
            "label": "Home",
            "is_default": True,
            "address": self.address_data
        }

    def test_create_user_address(self):
        url = reverse('my-addresses-list')
        response = self.client.post(url, self.user_address_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(UserAddress.objects.count(), 1)
        self.assertEqual(Address.objects.count(), 1)

    def test_list_user_addresses(self):
        address = Address.objects.create(**self.address_data)
        UserAddress.objects.create(user=self.user, address=address)

        url = reverse('my-addresses-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_update_user_address(self):
        # Create address+link
        address = Address.objects.create(**self.address_data)
        user_address = UserAddress.objects.create(user=self.user, address=address, is_default=True)

        url = reverse('my-addresses-detail', args=[user_address.id])
        update_data = {
            "label": "Work",
            "is_default": False,
            "address": {
                **self.address_data,
                "city": "Brooklyn"  # change city
            }
        }

        response = self.client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, 200)
        user_address.refresh_from_db()
        self.assertEqual(user_address.address.city, "Brooklyn")
        self.assertEqual(user_address.label, "Work")

    def test_delete_user_address(self):
        address = Address.objects.create(**self.address_data)
        user_address = UserAddress.objects.create(user=self.user, address=address)

        url = reverse('my-addresses-detail', args=[user_address.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(UserAddress.objects.exists())
        self.assertFalse(Address.objects.exists())
