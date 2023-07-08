
function Get-LocalResourceNames {
    param (
        [Parameter(Mandatory = $true, Position = 0)]
        [string]$resourceGroupName,
        [Parameter(Mandatory = $true, Position = 1)]
        [string]$uniqueRgString
    )
    
    $resourceNames = [ordered]@{
        blobContainerInput = "sc2-balancedata-xml"
        blobContainerOutput = "sc2-balancedata-json"
        containerAppBalanceDataUploader = "sc2-balancedata-uploader"
    }

    return $resourceNames
}
