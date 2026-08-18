$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$toolName = $inputJson.tool_name
$toolArgs = $inputJson.tool_input

if ($toolName -eq "run_in_terminal" -or $toolName -eq "execute_command") {
    $command = $toolArgs.command

    if ($command -match "rm\s+-rf" -or $command -match "DROP\s+TABLE" -or $command -match "git\s+push\s+--force") {
        @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                permissionDecision = "deny"
                permissionDecisionReason = "Blocked by security hook: destructive command detected ('$command')."
            }
        } | ConvertTo-Json -Depth 4 -Compress
        exit 0
    }
}

if ($toolName -eq "edit_file" -or $toolName -eq "write_file") {
    $filePath = $toolArgs.filePath

    if ($filePath -match "\.env$" -or $filePath -match "prod\.json$") {
        @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                permissionDecision = "ask"
                permissionDecisionReason = "Modifying sensitive configuration file ($filePath) requires manual confirmation."
            }
        } | ConvertTo-Json -Depth 4 -Compress
        exit 0
    }
}

@{
    hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        permissionDecision = "allow"
    }
} | ConvertTo-Json -Depth 4 -Compress
