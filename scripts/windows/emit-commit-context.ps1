[CmdletBinding()]
param()

$rawInput = ""
if ([Console]::IsInputRedirected) {
    $rawInput = [Console]::In.ReadToEnd()
}

$hookEventName = "SessionStart"

if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    try {
        $inputJson = $rawInput | ConvertFrom-Json
        if ($inputJson.hook_event_name) {
            $hookEventName = $inputJson.hook_event_name
        }
    } catch {}
}

if ($hookEventName -ne "SessionStart") {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$scriptPath = Join-Path $PSScriptRoot "commit-context-changes.ps1"

$summary = "chore: session start routing"
$l1 = "SessionStart hook fired; commit-context-harness must handle commit drafting."
$l2 = "Route commit-message drafting through codebridge-harness/commitContextChanges and store WIP context in the repository changes-digraph folder."
$l3 = "No git invocation is available. Retrieve a draft only, then persist node files with title format Node: Four Words Semantic Change:Vertice:WIP."

$draftJson = & $scriptPath -Summary $summary -L1 $l1 -L2 $l2 -L3 $l3 2>$null
$draftObj  = ($draftJson | Out-String).Trim() | ConvertFrom-Json

$contextNote = "commit-context-harness is active. Delegate commit drafting to commit-context-harness, retrieve the draft commit message, and keep changes-digraph nodes in sync. Draft commit message retrieved: $($draftObj.commitMessage)"

@{
    hookSpecificOutput = @{
        hookEventName = "SessionStart"
        additionalContext = $contextNote
    }
} | ConvertTo-Json -Depth 4 -Compress
