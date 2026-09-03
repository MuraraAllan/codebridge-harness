[CmdletBinding()]
param()

$rawInput = [Console]::In.ReadToEnd()
$hookEventName = "PostToolUse"
$toolName = ""
$toolInput = $null
$toolResponse = ""

if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    $inputJson = $rawInput | ConvertFrom-Json
    if ($inputJson.hook_event_name) { $hookEventName = $inputJson.hook_event_name }
    if ($inputJson.tool_name) { $toolName = [string]$inputJson.tool_name }
    if ($inputJson.tool_input) { $toolInput = $inputJson.tool_input }
    if ($inputJson.tool_response) { $toolResponse = [string]$inputJson.tool_response }
}

if ($hookEventName -ne "PostToolUse") {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$seed = ""
if ($toolInput -and $toolInput.filePath) {
    $seed = [System.IO.Path]::GetFileNameWithoutExtension([string]$toolInput.filePath)
} elseif ($toolInput -and $toolInput.command) {
    $seed = [string]$toolInput.command
} else {
    $seed = $toolName
}
if ([string]::IsNullOrWhiteSpace($seed)) { $seed = "workspace change" }

$spaced = $seed -creplace '([a-z0-9])([A-Z])', '$1 $2'
$spaced = $spaced -replace '[_\-\.]', ' '
$words = ($spaced -split '\s+') | Where-Object { $_ -ne "" } | ForEach-Object {
    $_.Substring(0,1).ToUpper() + $_.Substring(1)
}

$fillerWords = @('Workspace', 'Applied', 'Pending', 'Update')
$fillerIndex = 0
while ($words.Count -lt 4) {
    $words += $fillerWords[$fillerIndex % $fillerWords.Count]
    $fillerIndex++
}
$fourWords = ($words | Select-Object -First 4) -join ' '
$title = "Node: ${fourWords}:Vertice:WIP"

$commitScriptPath = Join-Path $PSScriptRoot 'commit-context-changes.ps1'
$summary = "chore: $($fourWords.ToLower())"
$l1 = "Tool '$toolName' ran as part of this change."
$l2 = "Recorded as a changes-digraph node via emit-changes-digraph-node.ps1."
$l3 = "No git invocation; node is a WIP draft pending review through commit-context-harness."

$draftJson = & $commitScriptPath -Summary $summary -L1 $l1 -L2 $l2 -L3 $l3 2>$null
$draftObj = ($draftJson | Out-String).Trim() | ConvertFrom-Json

$workspaceRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$digraphDir = Join-Path $workspaceRoot 'changes-digraph'
if (-not (Test-Path -LiteralPath $digraphDir)) {
    New-Item -ItemType Directory -Path $digraphDir -Force | Out-Null
}

$fileNameSafe = (($title -replace ':', '') -replace '\s+', '-')
$nodePath = Join-Path $digraphDir "$fileNameSafe.md"

@"
# $title

$($draftObj.commitMessage)
"@ | Set-Content -LiteralPath $nodePath -Encoding utf8

@{
    hookSpecificOutput = @{
        hookEventName = 'PostToolUse'
        additionalContext = "commit-context-harness recorded changes-digraph node '$title' at $nodePath."
    }
} | ConvertTo-Json -Depth 4 -Compress
