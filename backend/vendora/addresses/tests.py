from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Address

class AddressCreateViewTest(APITestCase):

    def test_create_address_success(self):
        url = reverse('address-create')  # Make sure this matches your urls.py name

        data = {
            "street_address": "123 Main St",
            "apartment_address": "Apt 4B",
            "city": "New York",
            "state": "NY",
            "postal_code": "10001",
            "country": "US"  # ISO 3166-1 alpha-2 code, as expected by django-countries
        }

        response = self.client.post(url, data, format='json')

        # Assert that the response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert the address was created in the database
        self.assertEqual(Address.objects.count(), 1)

        # Check if the stored data matches what was sent
        address = Address.objects.first()
        self.assertEqual(address.street_address, data["street_address"])
        self.assertEqual(address.apartment_address, data["apartment_address"])
        self.assertEqual(address.city, data["city"])
        self.assertEqual(address.state, data["state"])
        self.assertEqual(address.postal_code, data["postal_code"])
        self.assertEqual(address.country.code, data["country"])  # django-countries stores country as a Country object
