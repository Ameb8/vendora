#!/bin/sh

set -e  # exit on error

# Log in to Stripe CLI
stripe login --api-key "$STRIPE_PRIVATE"

# Initialize listening and get webhook secret
WH_SECRET=$(stripe listen \
  --forward-to "http://backend:8000/subscriptions/stripe/webhook/" \
  --print-secret \
  --events customer.subscription.created,invoice.payment_failed)

echo "Stripe webhook secret: $WH_SECRET"

# Export webhook secret to .env file
echo "export STRIPE_WEBHOOK_SECRET=$WH_SECRET" > ./stripe/webhook.env

# Start listening to events continuously
stripe listen \
  --forward-to "http://backend:8000/subscriptions/stripe/webhook/" \
  --events customer.subscription.created,invoice.payment_failed


