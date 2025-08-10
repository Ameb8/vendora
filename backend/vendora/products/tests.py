from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, ProductImages
from tenants.models import Tenant, TenantAdmin
import json

User = get_user_model()


class ProductViewSetTests(APITestCase):
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

        # Another tenant
        self.other_tenant = Tenant.objects.create(
            slug='tenant2',
            name='Tenant Two',
            owner=self.other_user,
            email='tenant2@example.com',
            domain='tenant2.example.com'
        )
        TenantAdmin.objects.create(user=self.other_user, tenant=self.other_tenant)

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

        # URLs
        self.list_url = reverse('products-list')  # 'products' is your basename
        self.detail_url = reverse('products-detail', kwargs={'pk': self.product.pk})
        self.max_price_url = reverse('max-price')

        # Sample product data
        self.valid_product_data = {
            "name": "New Product",
            "category": "NewCat",
            "price": "15.99",
            "image": self.dummy_image,
            "description": "New Description",
            "tenant": self.tenant.id,
            "amount": 10,
            "weight_value": "2.0",
            "weight_unit": "kg",
            "length": "10.0",
            "width": "5.0",
            "height": "3.0",
            "distance_unit": "cm"
        }

    def test_list_products_without_filter(self):
        """Test that listing products without tenant filter returns empty"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Expect empty list due to no tenant filter

    def test_list_products_with_tenant_filter(self):
        """Test listing products with tenant filter"""
        # Test with tenant slug
        response = self.client.get(f"{self.list_url}?tenant__slug={self.tenant.slug}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.product.name)

        # Test with tenant ID
        response = self.client.get(f"{self.list_url}?tenant_id={self.tenant.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # Test with domain
        response = self.client.get(f"{self.list_url}?tenant__domain={self.tenant.domain}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_product(self):
        """Test retrieving a single product"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.product.name)

    def test_create_product_unauthenticated(self):
        """Test that unauthenticated users cannot create products"""
        response = self.client.post(self.list_url, self.valid_product_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_product_non_admin(self):
        """Test that non-admin users cannot create products"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.list_url, self.valid_product_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_product_admin(self):
        """Test that tenant admins can create products"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.list_url, self.valid_product_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)  # Original + new one

    def test_update_product_unauthenticated(self):
        """Test that unauthenticated users cannot update products"""
        updated_data = {"name": "Updated Name"}
        response = self.client.patch(self.detail_url, updated_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_product_non_admin(self):
        """Test that non-admin users cannot update products"""
        self.client.force_authenticate(user=self.user)
        updated_data = {"name": "Updated Name"}
        response = self.client.patch(self.detail_url, updated_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_product_admin(self):
        """Test that tenant admins can update products"""
        self.client.force_authenticate(user=self.admin)
        updated_data = {"name": "Updated Name"}
        response = self.client.patch(self.detail_url, updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, "Updated Name")

    def test_update_product_wrong_admin(self):
        """Test that admins of other tenants cannot update products"""
        self.client.force_authenticate(user=self.other_user)
        updated_data = {"name": "Updated Name"}
        response = self.client.patch(self.detail_url, updated_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_product_unauthenticated(self):
        """Test that unauthenticated users cannot delete products"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_product_non_admin(self):
        """Test that non-admin users cannot delete products"""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_product_admin(self):
        """Test that tenant admins can delete products"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)

    def test_delete_product_wrong_admin(self):
        """Test that admins of other tenants cannot delete products"""
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Product.objects.count(), 1)

    def test_max_price_endpoint(self):
        """Test the max-price endpoint returns correct maximum price"""
        # Create another product with higher price
        Product.objects.create(
            name="Expensive Product",
            price=100.00,
            tenant=self.tenant,
            # Required fields
            weight_value=1.0,
            weight_unit='lb',
            length=1.0,
            width=1.0,
            height=1.0,
            distance_unit='in'
        )

        # Test with tenant slug
        response = self.client.get(f"{self.max_price_url}?tenant__slug={self.tenant.slug}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['max_price']), 100.00)

        # Test with tenant ID
        response = self.client.get(f"{self.max_price_url}?tenant_id={self.tenant.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['max_price']), 100.00)

        # Test with domain
        response = self.client.get(f"{self.max_price_url}?tenant__domain={self.tenant.domain}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['max_price']), 100.00)

    def test_max_price_no_tenant_filter(self):
        """Test that max-price endpoint requires tenant filter"""
        response = self.client.get(self.max_price_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_max_price_different_tenant(self):
        """Test that max-price only returns prices for requested tenant"""
        # Create product for other tenant
        Product.objects.create(
            name="Other Tenant Product",
            price=200.00,
            tenant=self.other_tenant,
            # Required fields
            weight_value=1.0,
            weight_unit='lb',
            length=1.0,
            width=1.0,
            height=1.0,
            distance_unit='in'
        )

        # Request max price for original tenant
        response = self.client.get(f"{self.max_price_url}?tenant__slug={self.tenant.slug}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['max_price']), 10.00)  # Only sees original product

    def test_max_price_no_products(self):
        """Test max-price with tenant that has no products"""
        # Create a new tenant with no products
        new_tenant = Tenant.objects.create(
            slug='new-tenant',
            name='New Tenant',
            owner=self.admin,
            email='new@example.com',
            domain='new.example.com'
        )

        response = self.client.get(f"{self.max_price_url}?tenant__slug={new_tenant.slug}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data['max_price'])


class ProductCategoriesEndpointTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test users
        self.admin = User.objects.create_user(username='admin1', password='pass1234')
        self.other_user = User.objects.create_user(username='user2', password='pass1234')

        # Create tenants
        self.tenant = Tenant.objects.create(
            slug='tenant1',
            name='Tenant One',
            owner=self.admin,
            email='tenant@example.com',
            domain='tenant1.example.com'
        )

        self.other_tenant = Tenant.objects.create(
            slug='tenant2',
            name='Tenant Two',
            owner=self.other_user,
            email='tenant2@example.com',
            domain='tenant2.example.com'
        )

        # Create initial product
        self.product = Product.objects.create(
            name="Test Product",
            category="TestCat",
            price=10.00,
            tenant=self.tenant,
            # Required fields
            weight_value=1.0,
            weight_unit='lb',
            length=5.0,
            width=2.0,
            height=1.0,
            distance_unit='in'
        )

        # Additional products for testing
        self.product2 = Product.objects.create(
            name="Product 2",
            category="Electronics",
            price=20.00,
            tenant=self.tenant,
            # Required fields
            weight_value=1.0,
            weight_unit='lb',
            length=1.0,
            width=1.0,
            height=1.0,
            distance_unit='in'
        )

        self.categories_url = reverse('tenant-categories')

    def test_get_categories_with_tenant_slug(self):
        """Test getting categories filtered by tenant slug"""
        response = self.client.get(
            self.categories_url,
            {'tenant__slug': self.tenant.slug}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['categories']), 2)  # TestCat + Electronics
        self.assertEqual(response.data['categories'][0]['name'], 'Electronics')
        self.assertEqual(response.data['categories'][0]['product_count'], 1)
        self.assertEqual(response.data['categories'][1]['name'], 'TestCat')
        self.assertEqual(response.data['categories'][1]['product_count'], 1)

    def test_get_categories_with_tenant_id(self):
        """Test getting categories filtered by tenant ID"""
        response = self.client.get(
            self.categories_url,
            {'tenant_id': self.tenant.id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['categories']), 2)

    def test_get_categories_with_tenant_domain(self):
        """Test getting categories filtered by tenant domain"""
        response = self.client.get(
            self.categories_url,
            {'tenant__domain': self.tenant.domain}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['categories']), 2)

    def test_no_tenant_filter_returns_error(self):
        """Test that missing tenant filter returns 400"""
        response = self.client.get(self.categories_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Must provide tenant filter')

    def test_categories_empty_for_tenant_with_no_products(self):
        """Test tenant with no products returns empty categories"""
        new_tenant = Tenant.objects.create(
            slug='new-tenant',
            name='New Tenant',
            owner=self.admin,
            email='new@example.com',
            domain='new.example.com'
        )

        response = self.client.get(
            self.categories_url,
            {'tenant__slug': new_tenant.slug}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['categories']), 0)

    def test_categories_exclude_null_values(self):
        """Test that products with null categories are excluded"""
        Product.objects.create(
            name="Null Category Product",
            category=None,
            price=50.00,
            tenant=self.tenant,
            # Required fields
            weight_value=1.0,
            weight_unit='lb',
            length=1.0,
            width=1.0,
            height=1.0,
            distance_unit='in'
        )

        response = self.client.get(
            self.categories_url,
            {'tenant__slug': self.tenant.slug}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['categories']), 2)  # Shouldn't include null

    def test_categories_are_sorted_alphabetically(self):
        """Test categories are returned in alphabetical order"""
        Product.objects.create(
            name="Aardvark Product",
            category="Aardvark",
            price=60.00,
            tenant=self.tenant,
            # Required fields
            weight_value=1.0,
            weight_unit='lb',
            length=1.0,
            width=1.0,
            height=1.0,
            distance_unit='in'
        )

        response = self.client.get(
            self.categories_url,
            {'tenant__slug': self.tenant.slug}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        categories = [item['name'] for item in response.data['categories']]
        self.assertEqual(categories, ['Aardvark', 'Electronics', 'TestCat'])

    def test_endpoint_is_public(self):
        """Test that endpoint doesn't require authentication"""
        self.client.logout()  # Ensure no user is authenticated
        response = self.client.get(
            self.categories_url,
            {'tenant__slug': self.tenant.slug}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

