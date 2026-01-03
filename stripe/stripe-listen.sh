#!/bin/sh
set -e

echo "Starting Stripe listeners..."

stripe listen \
  --forward-to http://host.docker.internal:8000/subscriptions/stripe/webhook/ \
  --api-key "$STRIPE_SECRET_KEY" \
  &

stripe listen \
  --forward-to http://host.docker.internal:8000/payments/stripe/webhook/ \
  --api-key "$STRIPE_SECRET_KEY" \
  &

wait
