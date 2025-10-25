var uniqueRgString = take(uniqueString(subscription().id, resourceGroup().id), 6)

module storageBlobContainers 'modules/storageBlobContainers.bicep' = {
  name: 'storageBlobContainersModule'
  params: {
    uniqueRgString: uniqueRgString
  }
}
