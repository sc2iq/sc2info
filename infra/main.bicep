targetScope = 'subscription'

param environmentName string
param location string

param sharedResourceGroupName string
param sharedContainerAppsEnvironmentName string
param sharedAcrName string

param resourceGroupName string

resource sharedRg 'Microsoft.Resources/resourceGroups@2025-04-01' existing = {
  name: sharedResourceGroupName
}

resource sharedContainerAppsEnv 'Microsoft.App/managedEnvironments@2025-02-02-preview' existing = {
  name: sharedContainerAppsEnvironmentName
  scope: sharedRg
}

resource sharedAcr 'Microsoft.ContainerRegistry/registries@2025-05-01-preview' existing = {
  name: sharedAcrName
  scope: sharedRg
}

var uniqueRgString = take(uniqueString(sharedRg.id), 6)

module storageBlobContainers 'modules/storageBlobContainers.bicep' = {
  name: 'storageBlobContainersModule'
  scope: sharedRg
  params: {
    uniqueRgString: uniqueRgString
  }
}

var tags = {
  'azd-env-name': '${resourceGroupName}-${environmentName}'
  project: resourceGroupName
}

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

var defaultImageName = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

param clientContainerAppName string = '${resourceGroupName}-viewer'
param clientContainerAppImageName string = ''

param balanceDataJsonUrl string
param iconsContainerUrl string

module infoViewerContainerApp 'modules/infoViewerContainerApp.bicep' = {
  name: 'infoViewerContainerAppModule'
  scope: rg
  params: {
    name: clientContainerAppName
    location: location
    tags: union(tags, { 'azd-service-name': 'client' })
    imageName: !empty(clientContainerAppImageName) ? clientContainerAppImageName : defaultImageName
    managedEnvironmentResourceId: sharedContainerAppsEnv.id
    containerName: clientContainerAppName
    registryUsername: sharedAcr.name
    registryPassword: sharedAcr.listCredentials().passwords[0].value
    balanceDataJsonUrl: balanceDataJsonUrl
    iconsContainerUrl: iconsContainerUrl
  }
}

param balanceDataUploadContainerAppName string = '${resourceGroupName}-balancedata-uploader'
param balanceDataUploadContainerAppImageName string = ''

@secure()
param storageAccountConnectionString string

param blobContainerZip string
param blobContainerJson string
param blobContainerXml string

@secure()
param uploadPassword string

module balanceDataUploaderContainerApp 'modules/balanceDataUploaderContainerApp.bicep' = {
  name: 'balanceDataUploaderContainerAppModule'
  scope: rg
  params: {
    name: balanceDataUploadContainerAppName
    location: location
    tags: union(tags, { 'azd-service-name': 'balance-data-upload' })
    imageName: !empty(balanceDataUploadContainerAppImageName) ? balanceDataUploadContainerAppImageName : defaultImageName
    managedEnvironmentResourceId: sharedContainerAppsEnv.id
    containerName: balanceDataUploadContainerAppName
    registryUsername: sharedAcr.name
    registryPassword: sharedAcr.listCredentials().passwords[0].value
    storageAccountConnectionString: storageAccountConnectionString
    blobContainerZip: blobContainerZip
    blobContainerJson: blobContainerJson
    blobContainerXml: blobContainerXml
    uploadPassword: uploadPassword
  }
}

// Outputs required by azd
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = rg.name

// Outputs for the services
output SERVICE_CLIENT_NAME string = infoViewerContainerApp.outputs.name
output SERVICE_CLIENT_ENDPOINT string = infoViewerContainerApp.outputs.appUrl
