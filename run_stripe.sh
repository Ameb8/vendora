#!/bin/sh

set -e  # exit on error

# Log in to Stripe CLI
stripe login --api-key "$STRIPE_PRIVATE"

# Get the webhook secret
WEBHOOK_SECRET_FILE=./stripe/webhook.env

if [ ! -f "$WEBHOOK_SECRET_FILE" ]; then
  WH_SECRET=$(stripe listen --print-secret)
  echo "STRIPE_WEBHOOK_SECRET=$WH_SECRET" > "$WEBHOOK_SECRET_FILE"
  echo "Stripe webhook secret written to $WEBHOOK_SECRET_FILE"
fi

# Start listening and forwarding
stripe listen \
  --forward-to "http://host.docker.internal:8000/subscriptions/stripe/webhook/" \
  --events customer.subscription.created,invoice.payment_failed \
  --forward-to "http://host.docker.internal:8000/payments/stripe/webhook/" \
  --events payment_intent.succeeded,payment_intent.payment_failed
