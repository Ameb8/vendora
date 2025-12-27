#!/usr/bin/env bash
set -e

SERVICE_NAME="db_dev"

# Load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run DB and enter shell
docker compose exec "$SERVICE_NAME" \
  mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"
