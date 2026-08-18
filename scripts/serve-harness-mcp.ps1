[CmdletBinding()]
param()

function Write-JsonRpcResponse {
    param(
        [Parameter(Mandatory)]
        $Id,
        [Parameter(Mandatory)]
        [hashtable]$Result
    )

    @{
        jsonrpc = "2.0"
        id = $Id
        result = $Result
    } | ConvertTo-Json -Depth 8 -Compress
}

function Invoke-Harness {
    $harnessPath = Join-Path $PSScriptRoot "..\tests\run-harness.ps1"
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "powershell.exe"
    $processInfo.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$harnessPath`""
    $processInfo.RedirectStandardOutput = $true
    $processInfo.RedirectStandardError = $true
    $processInfo.UseShellExecute = $false
    $processInfo.CreateNoWindow = $true

    $process = [System.Diagnostics.Process]::Start($processInfo)
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()

    @{
        exitCode = $process.ExitCode
        output = ($stdout + $stderr).Trim()
    }
}

function Get-ErrorCategory {
    param(
        [Parameter(Mandatory)]
        [string]$ErrorText
    )

    if ($ErrorText -match "(?i)\b(access denied|permission denied|unauthorized|forbidden|authentication|credential|token|approval|required|confirm)\b") {
        return "userIntervention"
    }

    if ($ErrorText -match "(?i)\b(not found|does not exist|missing|invalid|parse|syntax|failed|error|exception|cannot)\b") {
        return "fixable"
    }

    return "unknown"
}

function Get-ErrorNextAction {
    param(
        [Parameter(Mandatory)]
        [string]$Category
    )

    switch ($Category) {
        "fixable" { return "Inspect the failing tool input or workspace file, apply a targeted correction, and retry the tool." }
        "userIntervention" { return "Ask the user to grant approval, provide the required credential, or complete the external action before retrying." }
        default { return "Collect the tool output and relevant logs, then ask the user for guidance before making speculative changes." }
    }
}

while (($line = [Console]::In.ReadLine()) -ne $null) {
    if ([string]::IsNullOrWhiteSpace($line)) {
        continue
    }

    $request = $line | ConvertFrom-Json

    switch ($request.method) {
        "initialize" {
            if ($null -ne $request.id) {
                Write-JsonRpcResponse -Id $request.id -Result @{
                    protocolVersion = "2025-03-26"
                    capabilities = @{
                        tools = @{
                            listChanged = $false
                        }
                    }
                    serverInfo = @{
                        name = "codebridge-harness"
                        version = "1.0.0"
                    }
                }
            }
        }
        "tools/list" {
            if ($null -ne $request.id) {
                Write-JsonRpcResponse -Id $request.id -Result @{
                    tools = @(
                        @{
                            name = "run_harness"
                            description = "Run the Codebridge React Router hook harness and return its test output."
                            inputSchema = @{
                                type = "object"
                                properties = @{}
                                additionalProperties = $false
                            }
                        }
                        @{
                            name = "errorReport"
                            description = "Classify a tool error as fixable, userIntervention, or unknown and provide the next action."
                            inputSchema = @{
                                type = "object"
                                properties = @{
                                    toolName = @{ type = "string" }
                                    error = @{ type = "string" }
                                }
                                required = @("error")
                                additionalProperties = $false
                            }
                        }
                    )
                }
            }
        }
        "tools/call" {
            if ($null -ne $request.id) {
                if ($request.params.name -eq "run_harness") {
                    $harnessResult = Invoke-Harness
                    Write-JsonRpcResponse -Id $request.id -Result @{
                        content = @(
                            @{
                                type = "text"
                                text = $harnessResult.output
                            }
                        )
                        isError = ($harnessResult.exitCode -ne 0)
                    }
                } elseif ($request.params.name -eq "errorReport") {
                    $errorText = [string]$request.params.arguments.error
                    $category = Get-ErrorCategory -ErrorText $errorText
                    $toolName = [string]$request.params.arguments.toolName
                    $report = @{
                        category = $category
                        toolName = $toolName
                        error = $errorText
                        nextAction = Get-ErrorNextAction -Category $category
                    } | ConvertTo-Json -Compress

                    Write-JsonRpcResponse -Id $request.id -Result @{
                        content = @(
                            @{
                                type = "text"
                                text = $report
                            }
                        )
                        isError = $false
                    }
                } else {
                    @{
                        jsonrpc = "2.0"
                        id = $request.id
                        error = @{
                            code = -32602
                            message = "Unknown tool: $($request.params.name)"
                        }
                    } | ConvertTo-Json -Depth 6 -Compress
                }
            }
        }
    }
}
