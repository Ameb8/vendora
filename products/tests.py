from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from tenants.models import Tenant, TenantAdmin
from products.models import Product, ProductImages
from django.urls import reverse


class ProductViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.admin = User.objects.create_user(username='admin1', password='pass1234')
        self.user = User.objects.create_user(username='user1', password='pass1234')
        self.other_user = User.objects.create_user(username='user2', password='pass1234')

        # Tenant and admin
        self.tenant = Tenant.objects.create(
            slug='tenant1',
            name='Tenant One',
            owner=self.admin,
            email='tenant@example.com',
            domain='tenant1.example.com'
        )
        TenantAdmin.objects.create(user=self.admin, tenant=self.tenant)

        # Dummy image URL
        self.dummy_image = "https://res.cloudinary.com/demo/image/upload/sample.jpg"

        # Product for tests
        self.product = Product.objects.create(
            name="Test Product",
            category="TestCat",
            price=10.00,
            image=self.dummy_image,
            description="Test Desc",
            tenant=self.tenant,
            amount=5,
            weight_value=1.0,
            weight_unit='lb',
            length=5.0,
            width=2.0,
            height=1.0,
            distance_unit='in'
        )

        # Add a related ProductImages entry
        ProductImages.objects.create(product=self.product, image=self.dummy_image)

    def test_list_products_for_tenant(self):
        url = reverse('tenant-products-list', kwargs={'tenant_pk': self.tenant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_non_admin_cannot_create_product(self):
        self.client.login(username="user1", password="pass1234")
        url = reverse('tenant-products-list', kwargs={'tenant_pk': self.tenant.pk})
        data = {
            "name": "Unauthorized Product",
            "description": "Test",
            "price": 5.99,
            "amount": 2,
            "category": "Fail",
            "weight_value": 1.0,
            "weight_unit": "lb",
            "length": 1,
            "width": 1,
            "height": 1,
            "distance_unit": "in"
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_product(self):
        self.client.login(username="admin1", password="pass1234")
        url = reverse('tenant-products-list', kwargs={'tenant_pk': self.tenant.pk})
        data = {
            "name": "New Product",
            "description": "Created by admin",
            "price": 20.00,
            "amount": 10,
            "category": "AdminStuff",
            "weight_value": 2.5,
            "weight_unit": "kg",
            "length": 12,
            "width": 6,
            "height": 4,
            "distance_unit": "cm",
            "image": self.dummy_image
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "New Product")

    def test_get_product_categories(self):
        url = reverse('tenant-products-get-categories', kwargs={'tenant_pk': self.tenant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("TestCat", response.data)

    def test_get_all_images_for_product(self):
        url = reverse('tenant-products-get-all-images', kwargs={
            'tenant_pk': self.tenant.pk,
            'pk': self.product.pk
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("images", response.data)
        self.assertEqual(len(response.data["images"]), 2)
        self.assertTrue(all("cloudinary.com" in img for img in response.data["images"]))

    def test_cross_tenant_product_access_fails(self):
        tenant2 = Tenant.objects.create(
            slug='tenant2',
            name='Tenant Two',
            owner=self.other_user,
            email='t2@example.com',
            domain='tenant2.example.com'
        )
        TenantAdmin.objects.create(user=self.other_user, tenant=tenant2)
        self.client.login(username='user2', password='pass1234')

        url = reverse('tenant-products-list', kwargs={'tenant_pk': self.tenant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


