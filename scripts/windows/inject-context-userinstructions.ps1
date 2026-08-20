[CmdletBinding()]
param()

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$userInstructionsPath = Join-Path $workspaceRoot "..\rules\user-context.instructions.md"
if (-not (Test-Path -LiteralPath $userInstructionsPath)) {
    $userInstructionsPath = Join-Path $workspaceRoot "..\rules\user-context.instructions.md"
}

$userInstructions = ""
if (Test-Path -LiteralPath $userInstructionsPath) {
    $userInstructions = Get-Content -Raw -LiteralPath $userInstructionsPath
}

@{
    hookSpecificOutput = @{
        source = "user-context.instructions.md"
        path = $userInstructionsPath
        content = $userInstructions
    }
} | ConvertTo-Json -Depth 6 -Compress
exit 0
