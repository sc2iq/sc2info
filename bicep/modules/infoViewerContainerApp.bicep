param name string = '${resourceGroup().name}-viewer'
param location string = resourceGroup().location

param managedEnvironmentResourceId string

param imageName string
param containerName string

param balanceDataJsonUrl string
param iconsContainerUrl string

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
              name: 'BALANCE_DATA_JSON_URL'
              value: balanceDataJsonUrl
            }
            {
              name: 'ICONS_CONTAINER_URL'
              value: iconsContainerUrl
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
