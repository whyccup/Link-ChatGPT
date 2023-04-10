$filePath = "..\src\keywords\medical.json"

# Load JSON file
$jsonContent = Get-Content -Path $filePath | ConvertFrom-Json

# Create an empty hashtable to store unique values
$uniqueValues = @{}

# Remove duplicates
$cleanedJson = $jsonContent | Where-Object {
    if ($uniqueValues.ContainsKey($_)) {
        Write-Host "Removing duplicate value: $_"
        $false
    } else {
        $uniqueValues.Add($_, $true)
        $true
    }
}

# Save cleaned JSON to file
$cleanedJson | ConvertTo-Json -Compress | Set-Content -Path $filePath

Write-Host "Duplicates removed and file saved."

