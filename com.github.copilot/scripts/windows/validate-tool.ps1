[CmdletBinding()]
param()

$inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
$toolName = [string]$inputJson.tool_name
$toolArgs = $inputJson.tool_input

function Write-PreToolUseDecision {
    param(
        [Parameter(Mandatory)]
        [ValidateSet("allow", "ask")]
        [string]$Decision,
        [string]$Reason
    )

    $output = @{
        hookSpecificOutput = @{
            hookEventName = "PreToolUse"
            permissionDecision = $Decision
        }
    }

    if ($Reason) {
        $output.hookSpecificOutput.permissionDecisionReason = $Reason
    }

    $output | ConvertTo-Json -Depth 4 -Compress
    exit 0
}

if ($toolName -in @("run_in_terminal", "execute_command", "runTerminalCommand")) {
    $command = [string]$toolArgs.command

    if ($command -match "(?i)(?:\brm\s+(?:-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b|\bremove-item\b.*(?:-recurse|-r)\b.*(?:-force|-f)\b|\bdrop\s+table\b|\bgit\s+push\s+--force(?:-with-lease)?\b)") {
        Write-PreToolUseDecision -Decision "ask" -Reason "Destructive command detected ('$command') requires manual confirmation."
    }
}

if ($toolName -in @("edit_file", "write_file", "editFiles", "createFile")) {
    $filePaths = @()

    if ($toolArgs.filePath) {
        $filePaths += [string]$toolArgs.filePath
    }

    if ($toolArgs.path) {
        $filePaths += [string]$toolArgs.path
    }

    if ($toolArgs.files) {
        $filePaths += @($toolArgs.files | ForEach-Object { [string]$_ })
    }

    foreach ($filePath in $filePaths) {
        if ($filePath -match "(?i)(?:^|[\\/])\.env(?:\..+)?$|(?:^|[\\/])prod\.json$") {
            Write-PreToolUseDecision -Decision "ask" -Reason "Modifying sensitive configuration file ($filePath) requires manual confirmation."
        }
    }
}

Write-PreToolUseDecision -Decision "allow"
