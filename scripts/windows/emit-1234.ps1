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
            additionalContext = "Codebridge composition: select codebridge-react-design-principle for design and accessibility, codebridge-react-developer-principle for architecture and composition, codebridge-react-ux-principle for interaction and navigation; use recursive-processor for more than four comparable independent subtasks."
        }
    } | ConvertTo-Json -Depth 4 -Compress
    exit 0
}

@{
    systemMessage = "Codebridge composition context is available."
} | ConvertTo-Json -Depth 4 -Compress
