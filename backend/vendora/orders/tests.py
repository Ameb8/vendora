from django.urls import reverse
from django.test import Client
from rest_framework.test import APITestCase
from unittest.mock import patch, Mock
from vendora.test import BaseTestCase
from orders.models import Order
import json
import uuid

class PurchaseOrderViewTests(BaseTestCase, APITestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('create-order')

    @patch('stripe.PaymentIntent.create')
    def test_create_order_success(self, mock_create_intent):
        # Mock Stripe payment intent object
        mock_intent = Mock()
        mock_intent.id = 'pi_test_123'
        mock_intent.client_secret = 'cs_test_123'
        mock_create_intent.return_value = mock_intent

        data = {
            "email": "test@example.com",
            "shipping_address": self.address.id,
            "tenant": self.tenant.id,
            "items": [
                {"product_id": self.product.id, "quantity": 2}
            ]
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)

        order = Order.objects.get(id=response.data['order_id'])
        self.assertEqual(order.total_amount, 2000)
        self.assertEqual(order.stripe_payment_intent_id, 'pi_test_123')
        self.assertEqual(order.status, 'pending')

class StripeWebhookTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.client = Client()
        self.order = Order.objects.create(
            email="user@example.com",
            tenant=self.tenant,
            total_amount=1200,
            order_code=uuid.uuid4()
        )
        self.url = reverse('stripe-webhook')

    @patch('stripe.Webhook.construct_event')
    def test_payment_succeeded_marks_order_paid(self, mock_construct_event):
        mock_intent = Mock()
        mock_intent.id = "pi_test_123"
        mock_intent.metadata = {"order_id": str(self.order.order_code)}

        mock_event = Mock()
        mock_event.type = "payment_intent.succeeded"
        mock_event.data = Mock(object=mock_intent)

        mock_construct_event.return_value = mock_event

        response = self.client.post(
            self.url,
            data=json.dumps({}),  # or data='' if you prefer
            content_type='application/json',
            **{'HTTP_STRIPE_SIGNATURE': 'fake_signature'}
        )

        self.assertEqual(response.status_code, 200)
        self.order.refresh_from_db()
        self.assertTrue(self.order.paid)
        self.assertEqual(self.order.status, 'paid')

