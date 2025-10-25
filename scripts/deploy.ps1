Param([switch]$WhatIf = $True)

$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path $scriptPath

# Find repo root by searching upward for README.md
$currentDir = $scriptDir
$repoRoot = $null
while ($currentDir -and -not $repoRoot) {
  if (Test-Path (Join-Path $currentDir "README.md")) {
    $repoRoot = $currentDir
  }
  else {
    $currentDir = Split-Path $currentDir
  }
}
if (-not $repoRoot) {
  throw "Could not find repo root (no README.md found in parent directories)."
}

echo "Script Path: $scriptPath"
echo "Script Dir: $scriptDir"
echo "Repo Root: $repoRoot"

$sharedModulePath = Resolve-Path "$repoRoot/../../shared-resources/pipelines/scripts/common.psm1"
$localModulePath = Resolve-Path "$repoRoot/scripts/common.psm1"

echo "Shared Module Path: $sharedModulePath"
echo "Local Module Path: $localModulePath"

Import-Module $sharedModulePath -Force
Import-Module $localModulePath -Force

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
$balanceDataJsonUrl = $(Get-EnvVarFromFile $envFilePath "BALANCE_DATA_JSON_URL")
$iconsContainerUrl = $(Get-EnvVarFromFile $envFilePath "ICONS_CONTAINER_URL")

Write-Step "Fetch params from Azure"
$storageConnectionString = $(az storage account show-connection-string -g $sharedResourceGroupName -n $($sharedResourceNames.storageAccount) --query "connectionString" -o tsv)
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString


$balanceDataUploaderContainerName = "$sc2infoResourceGroupName-balancedata-uploader"
$balanceDataUploaderImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$balanceDataUploaderImageName = "$($sharedResourceVars.registryUrl)/${balanceDataUploaderContainerName}:${balanceDataUploaderImageTag}"

$infoAppContainerName = "$sc2infoResourceGroupName-app"
$infoAppImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$infoAppImageName = "$($sharedResourceVars.registryUrl)/${infoAppContainerName}:${infoAppImageTag}"

$data = [ordered]@{
  "storageConnectionString"      = "$($storageConnectionString.Substring(0, 30))..."
  "blobContainerZip"             = $sc2infoResourceNames.blobContainerZip
  "blobContainerXml"             = $sc2infoResourceNames.blobContainerXml
  "blobContainerJson"            = $sc2infoResourceNames.blobContainerJson
  "blobContainerJsonProcessed"   = $sc2infoResourceNames.blobContainerJsonProcessed
  "uploadPassword"               = "$($uploadPassword.Substring(0, 10))..."

  "balanceDataJsonUrl"           = $balanceDataJsonUrl
  "iconsContainerUrl"            = $iconsContainerUrl

  "balanceDataUploaderImageName" = $balanceDataUploaderImageName
  "infoAppImageName"             = $infoAppImageName

  "containerAppsEnvResourceId"   = $($sharedResourceVars.containerAppsEnvResourceId)
  "registryUrl"                  = $($sharedResourceVars.registryUrl)
  "registryUsername"             = $($sharedResourceVars.registryUsername)
  "registryPassword"             = "$($($sharedResourceVars.registryPassword).Substring(0, 10))..."
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

Write-Step "Deploy Functions App (What-If: $($WhatIf))"
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

Write-Step "Deploy $balanceDataUploaderContainerName Container App (What-If: $($WhatIf))"
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
      uploadPassword=$uploadPassword `
      --query "properties.outputs.fqdn.value" `
      -o tsv)

  $clientUrl = "https://$clientFqdn"
  Write-Output $clientUrl
}

Write-Step "Build $infoAppImageName Image (What-If: $($WhatIf))"
docker build -t $infoAppImageName "$repoRoot/apps/client-remix"

if ($WhatIf -eq $False) {
  Write-Step "Push $infoAppImageName Image (What-If: $($WhatIf))"
  docker push $infoAppImageName
}
else {
  Write-Step "Skipping Push $infoAppImageName Image (What-If: $($WhatIf))"
}

Write-Step "Get Top Image from $($sharedResourceVars.registryUrl) respository $infoAppContainerName to Verify Push (What-If: $($WhatIf))"
az acr repository show-tags --name $($sharedResourceVars.registryUrl)  --repository $infoAppContainerName --orderby time_desc --top 1 -o tsv

Write-Step "Deploy $infoAppContainerName Container App (What-If: $($WhatIf))"
$infoBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/infoViewerContainerApp.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sc2infoResourceGroupName `
    -f $infoBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$infoAppImageName `
    containerName=$infoAppContainerName `
    balanceDataJsonUrl=$balanceDataJsonUrl `
    iconsContainerUrl=$iconsContainerUrl `
    --what-if
}
else {
  $clientFqdn = $(az deployment group create `
      -g $sc2infoResourceGroupName `
      -f $infoBicepContainerDeploymentFilePath `
      -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
      registryUrl=$($sharedResourceVars.registryUrl) `
      registryUsername=$($sharedResourceVars.registryUsername) `
      registryPassword=$($sharedResourceVars.registryPassword) `
      imageName=$infoAppImageName `
      containerName=$infoAppContainerName `
      balanceDataJsonUrl=$balanceDataJsonUrl `
      iconsContainerUrl=$iconsContainerUrl `
      --query "properties.outputs.fqdn.value" `
      -o tsv)

  $clientUrl = "https://$clientFqdn"
  Write-Output $clientUrl
}
