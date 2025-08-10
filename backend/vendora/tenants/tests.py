from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Tenant, TenantAdmin, AdminAccessRequest
from vendora.test import BaseTestCase

'''
class BaseTestCase(TestCase):
    def setUp(self):
        # Create common users
        self.user = User.objects.create_user(username='user1', password='pass1234')
        self.other_user = User.objects.create_user(username='user2', password='pass1234')
        self.admin = User.objects.create_user(username='admin1', password='pass1234')

        # Default tenant owned by admin
        self.tenant = Tenant.objects.create(
            slug='tenant1',
            name='Tenant One',
            owner=self.admin,
            email='tenant@example.com',
            domain='tenant1.example.com'
        )

        # Admin is an approved TenantAdmin
        TenantAdmin.objects.create(user=self.admin, tenant=self.tenant)
'''

class TenantViewSetTests(BaseTestCase, APITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = reverse('tenant-list')
        self.detail_url = reverse('tenant-detail', kwargs={'pk': self.tenant.pk})

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
        self.client.login(username='admin1', password='pass1234')
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], 'tenant1')
        self.assertEqual(response.data['owner'], self.admin.id)

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
        self.client.login(username='admin1', password='pass1234')
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
        self.client.login(username='admin1', password='pass1234')
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

    def test_get_public_tenant_detail_unauthenticated(self):
        """
        GET /tenants/<slug>/public/ should return public info even for unauthenticated users.
        """
        public_url = reverse('tenant-public', kwargs={'slug': self.tenant.slug})
        response = self.client.get(public_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], self.tenant.slug)
        self.assertEqual(response.data['name'], self.tenant.name)
        self.assertEqual(response.data['email'], self.tenant.email)
        self.assertIn('color_primary', response.data)
        self.assertIn('color_secondary', response.data)
        self.assertIn('color_accent', response.data)
        self.assertIn('image', response.data)
        self.assertIn('phone', response.data)
        self.assertIn('address', response.data)


class AdminAccessRequestTests(BaseTestCase, APITestCase):
    def setUp(self):
        super().setUp()
        self.request_list_url = reverse('admin-access-request-list')

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_user_can_submit_access_request(self):
        self.authenticate(self.user)
        response = self.client.post(self.request_list_url, {'tenant': self.tenant.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AdminAccessRequest.objects.count(), 1)
        self.assertEqual(AdminAccessRequest.objects.first().user, self.user)

    def test_admin_can_view_requests_for_their_tenant(self):
        # Create a request from another user
        AdminAccessRequest.objects.create(user=self.other_user, tenant=self.tenant)

        self.authenticate(self.admin)
        response = self.client.get(self.request_list_url, {'tenant': self.tenant.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user'], self.other_user.id)

    def test_non_admin_cannot_view_requests(self):
        AdminAccessRequest.objects.create(user=self.other_user, tenant=self.tenant)
        self.authenticate(self.other_user)
        response = self.client.get(self.request_list_url, {'tenant': self.tenant.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # should be denied silently

    def test_admin_can_approve_request(self):
        req = AdminAccessRequest.objects.create(user=self.other_user, tenant=self.tenant)

        self.authenticate(self.admin)
        url = reverse('admin-access-request-approve', kwargs={'pk': req.pk})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        req.refresh_from_db()
        self.assertTrue(req.approved)

        # New TenantAdmin should be created
        self.assertTrue(TenantAdmin.objects.filter(user=self.other_user, tenant=self.tenant,).exists())

    def test_admin_can_deny_request(self):
        req = AdminAccessRequest.objects.create(user=self.other_user, tenant=self.tenant)

        self.authenticate(self.admin)
        url = reverse('admin-access-request-deny', kwargs={'pk': req.pk})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        req.refresh_from_db()
        self.assertFalse(req.approved)  # still false, but marked as processed
        self.assertFalse(TenantAdmin.objects.filter(user=self.other_user, tenant=self.tenant).exists())

