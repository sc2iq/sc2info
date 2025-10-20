param name string = 'sc2-info-functions'
param location string = 'West US 3'
param serverFarmResourceId string = '/subscriptions/375b0f6d-8ad5-412d-9e11-15d36d14dc63/resourceGroups/sc2-info/providers/Microsoft.Web/serverfarms/ASP-sc2info-92cc'

param applicaitonInsightsName string = 'shared-appinsights'

// TODO: Remove hardcoding of keys
// Find alternate way to link AppInsights to FunctionApp
param applicationInsightsKey string = '22f64bbb-bffc-4661-b83c-4d93fba0c081'
param applicationInsightsConnectionString string = 'InstrumentationKey=22f64bbb-bffc-4661-b83c-4d93fba0c081;IngestionEndpoint=https://westus3-1.in.applicationinsights.azure.com/'

resource applicationInsightsResource 'Microsoft.Insights/components@2020-02-02' existing = {
  name: applicaitonInsightsName
  scope: resourceGroup('shared')
}

resource functionsAppResource 'Microsoft.Web/sites@2024-11-01' = {
  name: name
  location: location
  tags: {
    'hidden-link: /app-insights-resource-id': applicationInsightsResource.id
    'hidden-link: /app-insights-instrumentation-key': applicationInsightsKey
    'hidden-link: /app-insights-conn-string': applicationInsightsConnectionString
  }
  kind: 'functionapp,linux'
  properties: {
    enabled: true
    serverFarmId: serverFarmResourceId
    publicNetworkAccess: 'Enabled'
  }
}
