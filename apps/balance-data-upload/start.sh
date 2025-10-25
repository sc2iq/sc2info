#!/bin/sh

set -ex

if [ -z "$AZURE_STORAGE_CONNECTION_STRING" ]; then
  echo "Error: AZURE_STORAGE_CONNECTION_STRING environment variable is required but not set."
  exit 1
fi

npm run start
