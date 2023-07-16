
function Get-LocalResourceNames {
    param (
        [Parameter(Mandatory = $true, Position = 0)]
        [string]$resourceGroupName,
        [Parameter(Mandatory = $true, Position = 1)]
        [string]$uniqueRgString
    )
    
    $resourceNames = [ordered]@{
        blobContainerZip = "sc2-balancedata-zip"
        blobContainerXml = "sc2-balancedata-xml"
        blobContainerJson = "sc2-balancedata-json"
        blobContainerJsonProcessed = "sc2-balancedata-json-processed"
        containerAppBalanceDataUploader = "sc2-info-balancedata-uploader"
    }

    return $resourceNames
}
