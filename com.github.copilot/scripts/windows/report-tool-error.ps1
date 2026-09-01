[CmdletBinding()]
param()

$rawInput = [Console]::In.ReadToEnd()

if ([string]::IsNullOrWhiteSpace($rawInput)) {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$inputJson = $rawInput | ConvertFrom-Json
$toolName = [string]$inputJson.tool_name
$toolResponse = [string]$inputJson.tool_response

if ([string]::IsNullOrWhiteSpace($toolResponse) -or $toolResponse -notmatch "(?i)\b(error|failed|failure|exception|denied|cannot|unable|not found|invalid)\b") {
    @{ continue = $true } | ConvertTo-Json -Compress
    exit 0
}

$category = "unknown"

if ($toolResponse -match "(?i)\b(access denied|permission denied|unauthorized|forbidden|authentication|credential|token|approval|required|confirm)\b") {
    $category = "userIntervention"
} elseif ($toolResponse -match "(?i)\b(not found|does not exist|missing|invalid|parse|syntax|failed|error|exception|cannot|unable)\b") {
    $category = "fixable"
}

@{
    hookSpecificOutput = @{
        hookEventName = "PostToolUse"
        additionalContext = "A $category tool error occurred in '$toolName'. Call codebridge-harness/errorReport with toolName '$toolName' and the exact tool_response, then print the resulting category, error, and next action for the user."
    }
} | ConvertTo-Json -Depth 4 -Compress
