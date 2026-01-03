#!/bin/bash
# stripe_listen.sh

# Fail on errors
set -e

# Stripe CLI key
export STRIPE_API_KEY="${STRIPE_PRIVATE}"

# Forward to your unified webhook
WEBHOOK_URL="http://host.docker.internal:8000/stripe/webhook/"

# List of events to listen for
EVENTS=(
  checkout.session.completed
  customer.subscription.created
  customer.subscription.updated
  customer.subscription.deleted
  invoice.payment_succeeded
  invoice.payment_failed
  payment_intent.succeeded
  payment_intent.payment_failed
  transfer.created
  payout.paid
)

# Join array into comma-separated string
EVENTS_LIST=$(IFS=, ; echo "${EVENTS[*]}")

# Run stripe listen
stripe listen --forward-to "$WEBHOOK_URL" --events "$EVENTS_LIST"
