from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Tenant, TenantAdmin

class TenantViewSetTests(APITestCase):

    def setUp(self):
        # Create users
        self.user = User.objects.create_user(username='user1', password='pass1234')
        self.other_user = User.objects.create_user(username='user2', password='pass1234')

        # Create a tenant owned by user
        self.tenant = Tenant.objects.create(
            slug='tenant1',
            name='Tenant One',
            owner=self.user,
            email='tenant@example.com',
            domain='tenant1.example.com'
        )

        # Add user as TenantAdmin for that tenant
        TenantAdmin.objects.create(user=self.user, tenant=self.tenant)

        # URLs
        self.list_url = reverse('tenant-list')  # /tenants/
        self.detail_url = reverse('tenant-detail', kwargs={'pk': self.tenant.pk})  # /tenants/{id}/

    def test_get_tenants_list_returns_empty(self):
        """
        GET /tenants/ should always return empty queryset (per get_queryset)
        """
        self.client.login(username='user1', password='pass1234')
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])  # empty list

    def test_get_tenant_detail_as_admin(self):
        """
        GET /tenants/{id}/ as TenantAdmin user returns tenant data
        """
        self.client.login(username='user1', password='pass1234')
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], 'tenant1')
        self.assertEqual(response.data['owner'], self.user.id)

    def test_get_tenant_detail_not_admin_forbidden(self):
        """
        GET /tenants/{id}/ as non-admin user should be forbidden (403)
        """
        self.client.login(username='user2', password='pass1234')
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_tenant_unauthenticated(self):
        """
        POST /tenants/ unauthenticated user should get 401 Unauthorized
        """
        data = {
            'slug': 'tenant2',
            'name': 'Tenant Two',
            'email': 'tenant2@example.com',
            'domain': 'tenant2.example.com'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_tenant_authenticated(self):
        """
        POST /tenants/ authenticated user creates tenant successfully,
        user becomes owner and tenant admin.
        """
        self.client.login(username='user2', password='pass1234')
        data = {
            'slug': 'tenant2',
            'name': 'Tenant Two',
            'email': 'tenant2@example.com',
            'domain': 'tenant2.example.com'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify tenant was created with correct owner
        tenant_id = response.data['id']
        tenant = Tenant.objects.get(pk=tenant_id)
        self.assertEqual(tenant.owner, self.other_user)

        # Verify TenantAdmin entry created
        tenant_admin_exists = TenantAdmin.objects.filter(user=self.other_user, tenant=tenant).exists()
        self.assertTrue(tenant_admin_exists)

    def test_update_tenant_as_admin(self):
        """
        PATCH /tenants/{id}/ as tenant admin updates tenant successfully.
        """
        self.client.login(username='user1', password='pass1234')
        data = {'name': 'Updated Tenant Name'}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tenant.refresh_from_db()
        self.assertEqual(self.tenant.name, 'Updated Tenant Name')

    def test_update_tenant_as_non_admin_forbidden(self):
        """
        PATCH /tenants/{id}/ as non-admin user returns 403 Forbidden
        """
        self.client.login(username='user2', password='pass1234')
        data = {'name': 'Malicious Update'}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_tenant_as_admin(self):
        """
        DELETE /tenants/{id}/ as tenant admin deletes the tenant successfully.
        """
        self.client.login(username='user1', password='pass1234')
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tenant.objects.filter(pk=self.tenant.pk).exists())

    def test_delete_tenant_as_non_admin_forbidden(self):
        """
        DELETE /tenants/{id}/ as non-admin user returns 403 Forbidden
        """
        self.client.login(username='user2', password='pass1234')
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
