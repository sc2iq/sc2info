#!/bin/sh

set -ex

# Check for required environment variables
if [ -z "$BALANCE_DATA_JSON_URL" ]; then
  echo "Error: BALANCE_DATA_JSON_URL environment variable is required but not set."
  exit 1
fi

if [ -z "$ICONS_CONTAINER_URL" ]; then
  echo "Error: ICONS_CONTAINER_URL environment variable is required but not set."
  exit 1
fi

npm run start
