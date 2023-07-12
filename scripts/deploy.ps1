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

Write-Step "Create Resource Group: $sc2infoResourceGroupName"
az group create -l $resourceGroupLocation -g $sc2infoResourceGroupName --query name -o tsv

$envFilePath = $(Resolve-Path "$repoRoot/scripts/.env").Path

Write-Step "Get ENV Vars from $envFilePath"
$storageConnectionString = $(az storage account show-connection-string -g $sharedResourceGroupName -n $($sharedResourceNames.storageAccount) --query "connectionString" -o tsv)

Write-Step "Fetch params from Azure"
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

# $nodeProcessorContainerName = $($batchProcessorResourceNames.containerAppNodeStorageQueue)
# $nodeProcessorImageTag = $(Get-Date -Format "yyyyMMddhhmm")
# $nodeProcessorImageName = "$($sharedResourceVars.registryUrl)/${nodeProcessorContainerName}:${nodeProcessorImageTag}"


$data = [ordered]@{
  "storageConnectionString"         = "$($storageConnectionString.Substring(0, 15))..."
  "blobContainerInput"              = $sc2infoResourceNames.blobContainerInput
  "blobContainerOutput"             = $sc2infoResourceNames.blobContainerOutput
  "containerAppBalanceDataUploader" = $sc2infoResourceNames.containerAppBalanceDataUploader

  "containerAppsEnvResourceId"      = $($sharedResourceVars.containerAppsEnvResourceId)
  "registryUrl"                     = $($sharedResourceVars.registryUrl)
  "registryUsername"                = $($sharedResourceVars.registryUsername)
  "registryPassword"                = "$($($sharedResourceVars.registryPassword).Substring(0, 5))..."
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

Write-Step "Provision $sc2infoResourceGroupName Resources (What-If: $($WhatIf))"

