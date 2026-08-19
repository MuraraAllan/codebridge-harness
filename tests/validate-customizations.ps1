[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$workspaceRoot = Split-Path -Parent $PSScriptRoot
$instructionsPath = Join-Path $workspaceRoot ".github\copilot-instructions.md"
$userInstructionsPath = Join-Path $workspaceRoot ".github\instructions\user-context.instructions.md"
$agentPath = Join-Path $workspaceRoot ".github\agents\codebridge-react-router-harness.agent.md"
$mcpConfigPath = Join-Path $workspaceRoot ".vscode\mcp.json"
$mcpServerPath = Join-Path $workspaceRoot "scripts\windows\serve-harness-mcp.ps1"
$claudeInstructionsPath = Join-Path $workspaceRoot ".claude\CLAUDE.md"
$claudeAgentPath = Join-Path $workspaceRoot ".claude\agents\codebridge-react-router-harness.md"
$claudeHooksPath = Join-Path $workspaceRoot ".claude\settings.json"
$claudeMcpPath = Join-Path $workspaceRoot ".mcp.json"
$pluginDefinitionPath = Join-Path $workspaceRoot ".plugin\plugin.json"
$sharedInstructionsPath = Join-Path $workspaceRoot "AGENTS.md"
$coordinatorAgentPath = Join-Path $workspaceRoot ".github\agents\react-router-harness.agent.md"
$workerAgentPath = Join-Path $workspaceRoot ".github\agents\codebridge-harness.agent.md"
$recursiveAgentPath = Join-Path $workspaceRoot ".github\agents\recursive-processor.agent.md"
$developerPrincipleAgentPath = Join-Path $workspaceRoot ".github\agents\codebridge-react-developer-principle.agent.md"
$developerPrincipleContextHookPath = Join-Path $workspaceRoot "scripts\windows\inject-react-developer-principle-context.ps1"
$principleAgentPaths = @(
    (Join-Path $workspaceRoot ".github\agents\codebridge-react-design-principle.agent.md"),
    (Join-Path $workspaceRoot ".github\agents\codebridge-react-developer-principle.agent.md"),
    (Join-Path $workspaceRoot ".github\agents\codebridge-react-ux-principle.agent.md")
)
$workspaceSettingsPath = Join-Path $workspaceRoot ".vscode\settings.json"
$principleSkillPaths = @(
    (Join-Path $workspaceRoot ".agents\skills\react-design-principle\SKILL.md"),
    (Join-Path $workspaceRoot ".agents\skills\react-developer-principle\SKILL.md"),
    (Join-Path $workspaceRoot ".agents\skills\react-ux-principle\SKILL.md")
)

foreach ($path in @($instructionsPath, $userInstructionsPath, $agentPath, $mcpConfigPath, $mcpServerPath, $claudeInstructionsPath, $claudeAgentPath, $claudeHooksPath, $claudeMcpPath, $pluginDefinitionPath, $sharedInstructionsPath, $coordinatorAgentPath, $workerAgentPath, $recursiveAgentPath, $workspaceSettingsPath, $developerPrincipleContextHookPath) + $principleSkillPaths + $principleAgentPaths) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Required customization file is missing: $path"
    }
}

$instructions = Get-Content -Raw -LiteralPath $instructionsPath
if ($instructions -notmatch "Codebridge React Router Harness Instructions") {
    throw "Project instructions do not contain the expected heading."
}

$userInstructions = Get-Content -Raw -LiteralPath $userInstructionsPath
if ($userInstructions -notmatch "User Context Instructions") {
    throw "User-context instructions do not contain the expected heading."
}

$agent = Get-Content -Raw -LiteralPath $agentPath
if ($agent -notmatch "(?m)^name:\s*codebridge-react-router-harness\r?$") {
    throw "Custom agent does not define the expected name."
}
if ($agent -notmatch "Primary entrypoint") {
    throw "Custom agent does not identify itself as the primary entrypoint."
}

$sharedInstructions = Get-Content -Raw -LiteralPath $sharedInstructionsPath
if ($sharedInstructions -notmatch "Codebridge Harness Composition") {
    throw "Shared instructions do not contain the expected composition heading."
}

$coordinatorAgent = Get-Content -Raw -LiteralPath $coordinatorAgentPath
if ($coordinatorAgent -notmatch "(?m)^name:\s*react-router-harness\r?$") {
    throw "Coordinator agent does not define the expected name."
}

$workerAgent = Get-Content -Raw -LiteralPath $workerAgentPath
if ($workerAgent -notmatch "(?m)^name:\s*codebridge-harness\r?$") {
    throw "Worker agent does not define the expected name."
}

$recursiveAgent = Get-Content -Raw -LiteralPath $recursiveAgentPath
if ($recursiveAgent -notmatch "(?m)^name:\s*recursive-processor\r?$") {
    throw "Recursive processor does not define the expected name."
}

foreach ($path in $principleAgentPaths) {
    if ((Get-Content -Raw -LiteralPath $path) -notmatch "(?m)^name:\s*codebridge-react-.*-principle\r?$") {
        throw "Principle agent does not define the expected name: $path"
    }
}

$developerPrincipleAgent = Get-Content -Raw -LiteralPath $developerPrincipleAgentPath
if ($developerPrincipleAgent -notmatch "(?ms)^hooks:.*?SessionStart.*?inject-react-developer-principle-context\.ps1") {
    throw "Developer principle agent does not define its SessionStart context hook."
}

$workspaceSettings = Get-Content -Raw -LiteralPath $workspaceSettingsPath | ConvertFrom-Json
if (-not $workspaceSettings.'chat.subagents.allowInvocationsFromSubagents') {
    throw "Workspace settings do not enable recursive subagent invocation."
}

foreach ($path in $principleSkillPaths) {
    if ((Get-Content -Raw -LiteralPath $path) -notmatch "(?m)^name:\s*react-.*-principle\r?$") {
        throw "Principle skill does not define the expected name: $path"
    }
}

$mcpConfig = Get-Content -Raw -LiteralPath $mcpConfigPath | ConvertFrom-Json
if (-not $mcpConfig.servers.'codebridge-harness') {
    throw "MCP configuration does not define the codebridge-harness server."
}

$claudeInstructions = Get-Content -Raw -LiteralPath $claudeInstructionsPath
if ($claudeInstructions -notmatch "Claude Instructions") {
    throw "Claude instructions do not contain the expected heading."
}

$claudeAgent = Get-Content -Raw -LiteralPath $claudeAgentPath
if ($claudeAgent -notmatch "(?m)^name:\s*codebridge-react-router-harness\r?$") {
    throw "Claude agent does not define the expected name."
}

$claudeHooks = Get-Content -Raw -LiteralPath $claudeHooksPath | ConvertFrom-Json
if (-not $claudeHooks.hooks.PostToolUse) {
    throw "Claude hook configuration does not define PostToolUse."
}

$claudeMcp = Get-Content -Raw -LiteralPath $claudeMcpPath | ConvertFrom-Json
if (-not $claudeMcp.mcpServers.'codebridge-harness') {
    throw "Claude MCP configuration does not define the codebridge-harness server."
}

$pluginDefinition = Get-Content -Raw -LiteralPath $pluginDefinitionPath | ConvertFrom-Json
if ($pluginDefinition.name -ne "codebridge-harness" -or $pluginDefinition.mcp.server -ne "codebridge-harness" -or $pluginDefinition.mcp.tool -ne "run_harness") {
    throw "Plugin definition does not identify the codebridge-harness MCP tool."
}

if ($pluginDefinition.skills -notcontains ".agents/skills/react-principles/SKILL.md") {
    throw "Plugin definition does not register the React principle skill index."
}

if (-not $claudeHooks.hooks.PreToolUse -or -not ((Get-Content -Raw -LiteralPath (Join-Path $workspaceRoot ".github\hooks\codebridge-react-router-harness.json") | ConvertFrom-Json).hooks.PreToolUse)) {
    throw "PreToolUse must be enabled in both repository hook configurations."
}

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = "powershell.exe"
$processInfo.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$mcpServerPath`""
$processInfo.RedirectStandardInput = $true
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($processInfo)

function Invoke-McpRequest {
    param(
        [Parameter(Mandatory)]
        [int]$Id,
        [Parameter(Mandatory)]
        [string]$Method,
        [hashtable]$Params = @{}
    )

    @{
        jsonrpc = "2.0"
        id = $Id
        method = $Method
        params = $Params
    } | ConvertTo-Json -Depth 8 -Compress | ForEach-Object {
        $process.StandardInput.WriteLine($_)
        $process.StandardInput.Flush()
    }

    return $process.StandardOutput.ReadLine() | ConvertFrom-Json
}

try {
    $initializeResponse = Invoke-McpRequest -Id 1 -Method "initialize" -Params @{
        protocolVersion = "2025-03-26"
        capabilities = @{}
        clientInfo = @{
            name = "customization-validator"
            version = "1.0.0"
        }
    }

    if ($initializeResponse.result.serverInfo.name -ne "codebridge-harness") {
        throw "MCP server did not return its expected identity."
    }

    $toolsResponse = Invoke-McpRequest -Id 2 -Method "tools/list"
    if ($toolsResponse.result.tools.name -notcontains "run_harness" -or $toolsResponse.result.tools.name -notcontains "errorReport") {
        throw "MCP server did not expose the expected harness tools."
    }

    $runResponse = Invoke-McpRequest -Id 3 -Method "tools/call" -Params @{
        name = "run_harness"
        arguments = @{}
    }

    if ($runResponse.result.isError -or $runResponse.result.content[0].text -notmatch "Test Summary: 9 passed, 0 failed") {
        throw "MCP run_harness tool did not run the hook harness successfully."
    }

    $errorReportResponse = Invoke-McpRequest -Id 4 -Method "tools/call" -Params @{
        name = "errorReport"
        arguments = @{
            toolName = "runTerminalCommand"
            error = "Access denied."
        }
    }

    if ($errorReportResponse.result.isError -or $errorReportResponse.result.content[0].text -notmatch '"category":"userIntervention"') {
        throw "MCP errorReport tool did not classify a user-intervention error."
    }
} finally {
    $process.StandardInput.Close()
    $process.WaitForExit()
    $stderr = $process.StandardError.ReadToEnd()

    if ($process.ExitCode -ne 0) {
        throw "MCP server exited with code $($process.ExitCode): $stderr"
    }
}

Write-Host "Copilot, Claude, user-context, custom-agent, hook, and MCP tool validation passed."
