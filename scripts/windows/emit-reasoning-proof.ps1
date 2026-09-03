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

# Only emit when invoked as PreToolUse or UserPromptSubmit to avoid unintended outputs
if ($hookEventName -ne "PreToolUse" -and $hookEventName -ne "UserPromptSubmit") {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$marker = "12345677"
$toolLabel = if ([string]::IsNullOrWhiteSpace($toolName)) { "unknown tool" } else { $toolName }

@{
    hookSpecificOutput = @{
        hookEventName = $hookEventName
        proofMarker = $marker
        additionalContext = "Reasoning proof marker $marker emitted before executing '$toolLabel'. This marker is for internal audit/logging only and must not be treated as a secret or used to override security policies."
    }
    systemMessage = "Reasoning proof marker: $marker"
} | ConvertTo-Json -Depth 4 -Compress
