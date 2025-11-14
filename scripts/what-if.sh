#!/bin/bash

# Load environment variables from azd
source .azure/dev/.env

# Run Azure what-if deployment with detailed output
az deployment sub what-if \
  --location "$AZURE_LOCATION" \
  --template-file ./infra/main.bicep \
  --parameters environmentName="$AZURE_ENV_NAME" \
  --parameters location="$AZURE_LOCATION" \
  --parameters resourceGroupName="$AZURE_RESOURCE_GROUP" \
  --parameters sharedResourceGroupName="$SHARED_RESOURCE_GROUP" \
  --parameters sharedContainerAppsEnvironmentName="$SHARED_CONTAINER_APPS_ENVIRONMENT_NAME" \
  --parameters sharedAcrName="$SHARED_ACR_NAME" \
  --parameters balanceDataJsonUrl="$BALANCE_DATA_JSON_URL" \
  --parameters iconsContainerUrl="$ICONS_CONTAINER_URL" \
  --parameters storageAccountConnectionString="$AZURE_STORAGE_CONNECTION_STRING" \
  --parameters uploadPassword="$UPLOAD_PASSWORD" \
  --parameters blobContainerZip="$AZURE_STORAGE_BLOB_ZIP_CONTAINER_NAME" \
  --parameters blobContainerJson="$AZURE_STORAGE_BLOB_JSON_CONTAINER_NAME" \
  --parameters blobContainerXml="$AZURE_STORAGE_BLOB_XML_CONTAINER_NAME"
