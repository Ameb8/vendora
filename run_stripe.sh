#!/bin/sh
set -e

# Authenticate first
stripe login --api-key "$STRIPE_PRIVATE"

# Extract secret without blocking
WH_SECRET=$(stripe listen --print-secret | head -n 1 | tr -d '\n')

echo "STRIPE_WEBHOOK_SECRET=$WH_SECRET" > /app/stripe/webhook.env
echo "Webhook secret written"

# Start listeners (no --print-secret here)
stripe listen \
  --forward-to http://host.docker.internal:8000/subscriptions/stripe/webhook/ \
  --events customer.subscription.created,invoice.payment_failed &

stripe listen \
  --forward-to http://host.docker.internal:8000/payments/stripe/webhook/ \
  --events payment_intent.succeeded,payment_intent.payment_failed &

wait

