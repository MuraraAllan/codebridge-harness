[CmdletBinding()]
param()

$rawInput = [Console]::In.ReadToEnd()
$hookEventName = "SessionStart"

if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    $inputJson = $rawInput | ConvertFrom-Json

    if ($inputJson.hook_event_name) {
        $hookEventName = $inputJson.hook_event_name
    }
}

if ($hookEventName -eq "SessionStart") {
    @{
        hookSpecificOutput = @{
            hookEventName = "SessionStart"
            additionalContext = "1234"
        }
    } | ConvertTo-Json -Depth 4 -Compress
    exit 0
}

@{
    systemMessage = "1234"
} | ConvertTo-Json -Depth 4 -Compress
