from django.urls import reverse
from django.test import TestCase
from django.contrib.auth.models import User
from tenants.models import Tenant, TenantAdmin
from orders.models import Address
from products.models import Product


class BaseTestCase(TestCase):
    def setUp(self):
        # Create users
        self.user = User.objects.create_user(username='user1', password='pass1234')
        self.other_user = User.objects.create_user(username='user2', password='pass1234')
        self.admin = User.objects.create_user(username='admin1', password='pass1234')

        # Create tenant
        self.tenant = Tenant.objects.create(
            slug='tenant1',
            name='Tenant One',
            owner=self.admin,
            email='tenant@example.com',
            domain='tenant1.example.com'
        )

        # Tenant admin
        TenantAdmin.objects.create(user=self.admin, tenant=self.tenant)

        self.address = Address.objects.create(
            full_name="John Doe",
            street_address="123 Test St",
            apartment_address="Unit 4",
            city="Testville",
            state="TS",
            postal_code="12345",
            country="USA",
            phone_number="555-1234"
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
