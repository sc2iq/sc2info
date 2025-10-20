param name string = '${resourceGroup().name}-balancedata-uploader'
param location string = resourceGroup().location

param managedEnvironmentResourceId string

param imageName string
param containerName string

var storageAccountConnectionStringSecretName = 'storage-account-connection-string'
@secure()
param storageAccountConnectionString string
param blobContainerZip string
param blobContainerJson string
param blobContainerXml string

var uploadPasswordSecretName = 'upload-password'
@secure()
param uploadPassword string

param registryUrl string
param registryUsername string
var registryPasswordName = 'container-registry-password'
@secure()
param registryPassword string

resource containerApp 'Microsoft.App/containerApps@2025-02-02-preview' = {
  name: name
  location: location
  properties: {
    managedEnvironmentId: managedEnvironmentResourceId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8080
      }
      registries: [
        {
          server: registryUrl
          username: registryUsername
          passwordSecretRef: registryPasswordName
        }
      ]
      secrets: [
        {
          name: registryPasswordName
          value: registryPassword
        }
        {
          name: storageAccountConnectionStringSecretName
          value: storageAccountConnectionString
        }
        {
          name: uploadPasswordSecretName
          value: uploadPassword
        }
      ]
    }
    template: {
      containers: [
        {
          image: imageName
          name: containerName
          // https://learn.microsoft.com/en-us/azure/container-apps/containers#configuration
          resources: {
            cpu: any('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'AZURE_STORAGE_CONNECTION_STRING'
              secretRef: storageAccountConnectionStringSecretName
            }
            {
              name: 'AZURE_STORAGE_BLOB_ZIP_CONTAINER_NAME'
              value: blobContainerZip
            }
            {
              name: 'AZURE_STORAGE_BLOB_XML_CONTAINER_NAME'
              value: blobContainerXml
            }
            {
              name: 'AZURE_STORAGE_BLOB_JSON_CONTAINER_NAME'
              value: blobContainerJson
            }
            {
              name: 'UPLOAD_PASSWORD'
              secretRef: uploadPasswordSecretName
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

output fqdn string = containerApp.properties.configuration.ingress.fqdn
