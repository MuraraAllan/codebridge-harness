[CmdletBinding()]
param()

$rawInput = [Console]::In.ReadToEnd()
$hookEventName = "UserPromptSubmit"

if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    try {
        $inputJson = $rawInput | ConvertFrom-Json
        if ($inputJson.hook_event_name) {
            $hookEventName = $inputJson.hook_event_name
        }
    } catch {
        # ignore parse errors
    }
}

@{
    hookSpecificOutput = @{
        hookEventName = $hookEventName
        additionalContext = "Image/Picture Interpretation context: When user input contains images or visual assets, contextImageInterpret must be invoked to deflush image content into structured JSON (quadrant, object, objectDescription, colorTemperature, objectList, fourLinesDescription)."
    }
} | ConvertTo-Json -Depth 4 -Compress
exit 0
