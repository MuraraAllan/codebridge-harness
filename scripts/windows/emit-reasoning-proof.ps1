[CmdletBinding()]
param()

$rawInput = [Console]::In.ReadToEnd()
$hookEventName = "PreToolUse"
$toolName = ""

if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    $inputJson = $rawInput | ConvertFrom-Json
    if ($inputJson.hook_event_name) { $hookEventName = [string]$inputJson.hook_event_name }
    if ($inputJson.tool_name) { $toolName = [string]$inputJson.tool_name }
}

if ($hookEventName -ne "PreToolUse") {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$marker = "12345677"
$toolLabel = if ([string]::IsNullOrWhiteSpace($toolName)) { "unknown tool" } else { $toolName }

@{
    hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        proofMarker = $marker
        additionalContext = "Reasoning proof marker $marker emitted before executing '$toolLabel'. The agent must preserve this marker in the next visible progress/output summary and the PostToolUse reasoning record."
    }
    systemMessage = "Reasoning proof marker: $marker"
} | ConvertTo-Json -Depth 4 -Compress
