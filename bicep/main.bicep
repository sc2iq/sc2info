var uniqueRgString = take(uniqueString(resourceGroup().id), 6)

module storageBlobContainers 'modules/storageBlobContainers.bicep' = {
  name: 'storageBlobContainersModule'
  params: {
    uniqueRgString: uniqueRgString
  }
}
