[CmdletBinding()]
param(
    [string]$Summary,
    [string]$L1,
    [string]$L2,
    [string]$L3
)

$normalizedSummary = if ([string]::IsNullOrWhiteSpace($Summary)) { "chore: update context changes" } else { $Summary.Trim() }

$sections = @()
if (-not [string]::IsNullOrWhiteSpace($L1)) {
    $sections += "L1: $($L1.Trim())"
}
if (-not [string]::IsNullOrWhiteSpace($L2)) {
    $sections += "L2: $($L2.Trim())"
}
if (-not [string]::IsNullOrWhiteSpace($L3)) {
    $sections += "L3: $($L3.Trim())"
}

if ($sections.Count -eq 0) {
    $sections += "L1: (pending)"
    $sections += "L2: (pending)"
    $sections += "L3: (pending)"
}

$body = ($sections -join "`n")
$message = "$normalizedSummary`n`n$body"

@{
    summary = $normalizedSummary
    body = $body
    commitMessage = $message
} | ConvertTo-Json -Compress
