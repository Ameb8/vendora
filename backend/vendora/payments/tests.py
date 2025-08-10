from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from orders.models import Order, OrderItem
from payments.models import Payment
from unittest.mock import patch
import uuid
import json
from vendora.test import BaseTestCase

class CreatePaymentTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

        self.order = Order.objects.create(
            user=self.user,
            tenant=self.tenant,
            total_amount=1000,
            shipping_address=self.address,
        )
        OrderItem.objects.create(order=self.order, product=self.product, quantity=2)

        # Set tenant stripe_id for testing
        self.tenant.stripe_id = "acct_test_stripe123"
        self.tenant.save()

    @patch('stripe.PaymentIntent.create')
    def test_create_payment_success(self, mock_create_intent):
        mock_create_intent.return_value = type('obj', (object,), {
            "id": "pi_test_123",
            "client_secret": "secret_test_123",
            "payment_method_types": ["card"]
        })

        self.client.login(username='user1', password='pass1234')
        url = reverse('create-payment', args=[self.order.id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn('client_secret', response.data)

        payment = Payment.objects.get(order=self.order)
        self.assertEqual(payment.stripe_payment_intent_id, "pi_test_123")
        self.assertEqual(payment.amount, 1000)

    def test_create_payment_missing_stripe_id(self):
        self.tenant.stripe_id = None
        self.tenant.save()

        self.client.login(username='user1', password='pass1234')
        url = reverse('create-payment', args=[self.order.id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Tenant is not configured", response.data["detail"])

class StripeWebhookTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()

        self.order = Order.objects.create(
            user=self.user,
            tenant=self.tenant,
            total_amount=1500,
            shipping_address=self.address,
        )

        self.payment = Payment.objects.create(
            order=self.order,
            tenant=self.tenant,
            user=self.user,
            amount=1500,
            status='pending',
            stripe_payment_intent_id="pi_test_webhook"
        )

        self.url = reverse('stripe-webhook')
        self.secret = settings.STRIPE_WEBHOOK_SECRET

    @patch('stripe.Webhook.construct_event')
    def test_webhook_payment_succeeded(self, mock_construct_event):
        event = {
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": "pi_test_webhook",
                    "payment_method_types": ["card"],
                    "metadata": {
                        "payment_id": str(self.payment.id),
                        "order_id": str(self.order.id)
                    }
                }
            }
        }

        mock_construct_event.return_value = event

        payload = json.dumps(event)
        signature = 'dummy_signature'

        response = self.client.post(
            self.url,
            data=payload,
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE=signature
        )

        self.assertEqual(response.status_code, 200)
        self.payment.refresh_from_db()
        self.order.refresh_from_db()
        self.assertEqual(self.payment.status, 'succeeded')
        self.assertTrue(self.order.paid)
        self.assertEqual(self.order.status, 'paid')
