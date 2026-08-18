[CmdletBinding()]
param(
    [string]$TestSuitePath,
    [string]$HookScriptPath
)

if (-not $TestSuitePath) {
    $TestSuitePath = Join-Path $PSScriptRoot "test-suite.json"
}

if (-not $HookScriptPath) {
    $HookScriptPath = Join-Path $PSScriptRoot "..\scripts\windows\validate-tool.ps1"
}

$suite = Get-Content -Raw -LiteralPath $TestSuitePath | ConvertFrom-Json
$resolvedHookScriptPath = (Resolve-Path -LiteralPath $HookScriptPath).Path
$suiteDirectory = Split-Path -Parent (Resolve-Path -LiteralPath $TestSuitePath).Path
$passedCount = 0
$failedCount = 0

Write-Host "Running Agent Hook Harness: $($suite.suiteName)"

foreach ($test in $suite.tests) {
    $jsonInput = $test.input | ConvertTo-Json -Depth 5 -Compress
    $testHookScriptPath = $resolvedHookScriptPath

    if ($test.hookScript) {
        $testHookScriptPath = (Resolve-Path -LiteralPath (Join-Path $suiteDirectory $test.hookScript)).Path
    }

    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "powershell.exe"
    $processInfo.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$testHookScriptPath`""
    $processInfo.RedirectStandardInput = $true
    $processInfo.RedirectStandardOutput = $true
    $processInfo.RedirectStandardError = $true
    $processInfo.UseShellExecute = $false
    $processInfo.CreateNoWindow = $true

    $process = [System.Diagnostics.Process]::Start($processInfo)
    $process.StandardInput.WriteLine($jsonInput)
    $process.StandardInput.Close()
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()

    if ($process.ExitCode -ne 0) {
        Write-Host "[FAIL] $($test.id): hook exited with code $($process.ExitCode). $stderr"
        $failedCount++
        continue
    }

    $actualOutput = $stdout | ConvertFrom-Json
    $actualDecision = $actualOutput.hookSpecificOutput.permissionDecision
    $actualReason = $actualOutput.hookSpecificOutput.permissionDecisionReason
    $actualEventName = $actualOutput.hookSpecificOutput.hookEventName
    $actualContext = $actualOutput.hookSpecificOutput.additionalContext
    $actualSystemMessage = $actualOutput.systemMessage
    $decisionMatches = -not $test.expected.permissionDecision -or $actualDecision -eq $test.expected.permissionDecision
    $reasonMatches = -not $test.expected.reasonContains -or $actualReason -like "*$($test.expected.reasonContains)*"
    $eventMatches = -not $test.expected.hookEventName -or $actualEventName -eq $test.expected.hookEventName
    $contextMatches = -not $test.expected.additionalContext -or $actualContext -like "*$($test.expected.additionalContext)*"
    $messageMatches = -not $test.expected.systemMessage -or $actualSystemMessage -eq $test.expected.systemMessage

    if ($decisionMatches -and $reasonMatches -and $eventMatches -and $contextMatches -and $messageMatches) {
        Write-Host "[PASS] $($test.id)"
        $passedCount++
    } else {
        Write-Host "[FAIL] $($test.id): hook output did not match expected values."
        $failedCount++
    }
}

Write-Host "Test Summary: $passedCount passed, $failedCount failed"

if ($failedCount -gt 0) {
    exit 1
}
