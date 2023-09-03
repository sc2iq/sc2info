Param([switch]$WhatIf = $True)

echo "PScriptRoot: $PScriptRoot"
$repoRoot = If ('' -eq $PScriptRoot) {
  "$PSScriptRoot/.."
}
else {
  "."
}

echo "Repo Root: $repoRoot"

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force
Import-Module "$repoRoot/scripts/common.psm1" -Force

$inputs = @{
  "WhatIf" = $WhatIf
}

Write-Hash "Inputs" $inputs

$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'
$resourceGroupLocation = "westus3"
$sc2infoResourceGroupName = "sc2-info"

$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString
$sc2infoResourceNames = Get-LocalResourceNames $sc2infoResourceGroupName 'unused'

$envFilePath = $(Resolve-Path "$repoRoot/scripts/.env").Path

Write-Step "Get ENV Vars from $envFilePath"
$uploadPassword = $(Get-EnvVarFromFile $envFilePath "UPLOAD_PASSWORD")

Write-Step "Fetch params from Azure"
$storageConnectionString = $(az storage account show-connection-string -g $sharedResourceGroupName -n $($sharedResourceNames.storageAccount) --query "connectionString" -o tsv)
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

# $nodeProcessorContainerName = $($batchProcessorResourceNames.containerAppNodeStorageQueue)
# $nodeProcessorImageTag = $(Get-Date -Format "yyyyMMddhhmm")
# $nodeProcessorImageName = "$($sharedResourceVars.registryUrl)/${nodeProcessorContainerName}:${nodeProcessorImageTag}"

$balanceDataUploaderContainerName = "$sc2infoResourceGroupName-balancedata-uploader"
$balanceDataUploaderImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$balanceDataUploaderImageName = "$($sharedResourceVars.registryUrl)/${balanceDataUploaderContainerName}:${balanceDataUploaderImageTag}"

$data = [ordered]@{
  "storageConnectionString"      = "$($storageConnectionString.Substring(0, 30))..."
  "blobContainerZip"             = $sc2infoResourceNames.blobContainerZip
  "blobContainerXml"             = $sc2infoResourceNames.blobContainerXml
  "blobContainerJson"            = $sc2infoResourceNames.blobContainerJson
  "blobContainerJsonProcessed"   = $sc2infoResourceNames.blobContainerJsonProcessed
  "uploadPassword"               = "$($uploadPassword.Substring(0, 5))..."

  "balanceDataUploaderImageName" = $balanceDataUploaderImageName

  "containerAppsEnvResourceId"   = $($sharedResourceVars.containerAppsEnvResourceId)
  "registryUrl"                  = $($sharedResourceVars.registryUrl)
  "registryUsername"             = $($sharedResourceVars.registryUsername)
  "registryPassword"             = "$($($sharedResourceVars.registryPassword).Substring(0, 5))..."
}

Write-Hash "Data" $data

Write-Step "Provision Additional $sharedResourceGroupName Resources (What-If: $($WhatIf))"
$mainBicepFile = "$repoRoot/bicep/main.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sharedResourceGroupName `
    -f $mainBicepFile `
    --what-if
}
else {
  az deployment group create `
    -g $sharedResourceGroupName `
    -f $mainBicepFile `
    --query "properties.provisioningState" `
    -o tsv
}

Write-Step "Create Resource Group $sc2infoResourceGroupName"
az group create -l $resourceGroupLocation -g $sc2infoResourceGroupName --query name -o tsv

Write-Step "Provision $sc2infoResourceGroupName Resources (What-If: $($WhatIf))"

Write-Step "Deploy $clientImageName Container App (What-If: $($WhatIf))"
$functionsAppDeploymentFilePath = "$repoRoot/bicep/modules/functionsApp.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sc2infoResourceGroupName `
    -f $functionsAppDeploymentFilePath `
    --what-if
}
else {
  $provisioningState = $(az deployment group create `
      -g $sc2infoResourceGroupName `
      -f $functionsAppDeploymentFilePath `
      --query "properties.provisioningState")

  Write-Output "Provisioning State: $provisioningState"
}


Write-Step "Build $balanceDataUploaderImageName Image (What-If: $($WhatIf))"
docker build -t $balanceDataUploaderImageName "$repoRoot/apps/balance-data-upload"

if ($WhatIf -eq $False) {
  Write-Step "Push $balanceDataUploaderImageName Image (What-If: $($WhatIf))"
  docker push $balanceDataUploaderImageName
}
else {
  Write-Step "Skipping Push $balanceDataUploaderImageName Image (What-If: $($WhatIf))"
}

Write-Step "Get Top Image from $($sharedResourceVars.registryUrl) respository $balanceDataUploaderContainerName to Verify Push (What-If: $($WhatIf))"
az acr repository show-tags --name $($sharedResourceVars.registryUrl)  --repository $balanceDataUploaderContainerName --orderby time_desc --top 1 -o tsv

Write-Step "Deploy $clientImageName Container App (What-If: $($WhatIf))"
$balanceDataUploaderBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/balanceDataUploaderContainerApp.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sc2infoResourceGroupName `
    -f $balanceDataUploaderBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$balanceDataUploaderImageName `
    containerName=$balanceDataUploaderContainerName `
    storageAccountConnectionString=$storageConnectionString `
    blobContainerZip=$($sc2infoResourceNames.blobContainerZip) `
    blobContainerJson=$($sc2infoResourceNames.blobContainerJson) `
    blobContainerXml=$($sc2infoResourceNames.blobContainerXml) `
    blobContainerJsonProcessed=$($sc2infoResourceNames.blobContainerJsonProcessed) `
    uploadPassword=$uploadPassword `
    --what-if
}
else {
  $clientFqdn = $(az deployment group create `
      -g $sc2infoResourceGroupName `
      -f $balanceDataUploaderBicepContainerDeploymentFilePath `
      -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
      registryUrl=$($sharedResourceVars.registryUrl) `
      registryUsername=$($sharedResourceVars.registryUsername) `
      registryPassword=$($sharedResourceVars.registryPassword) `
      imageName=$balanceDataUploaderImageName `
      containerName=$balanceDataUploaderContainerName `
      storageAccountConnectionString=$storageConnectionString `
      blobContainerZip=$($sc2infoResourceNames.blobContainerZip) `
      blobContainerJson=$($sc2infoResourceNames.blobContainerJson) `
      blobContainerXml=$($sc2infoResourceNames.blobContainerXml) `
      blobContainerJsonProcessed=$($sc2infoResourceNames.blobContainerJsonProcessed) `
      uploadPassword=$uploadPassword `
      --query "properties.outputs.fqdn.value" `
      -o tsv)

  $clientUrl = "https://$clientFqdn"
  Write-Output $clientUrl
}

