[CmdletBinding()]
param(
    [string]$TestSuitePath,
    [string]$HookScriptPath
)

if (-not $TestSuitePath) {
    $TestSuitePath = Join-Path $PSScriptRoot "test-suite.json"
}

if (-not $HookScriptPath) {
    $HookScriptPath = Join-Path $PSScriptRoot "..\scripts\validate-tool.ps1"
}

$suite = Get-Content -Raw -LiteralPath $TestSuitePath | ConvertFrom-Json
$resolvedHookScriptPath = (Resolve-Path -LiteralPath $HookScriptPath).Path
$passedCount = 0
$failedCount = 0

Write-Host "Running Agent Hook Harness: $($suite.suiteName)"

foreach ($test in $suite.tests) {
    $jsonInput = $test.input | ConvertTo-Json -Depth 5 -Compress
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "powershell.exe"
    $processInfo.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$resolvedHookScriptPath`""
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
    $decisionMatches = $actualDecision -eq $test.expected.permissionDecision
    $reasonMatches = -not $test.expected.reasonContains -or $actualReason -like "*$($test.expected.reasonContains)*"

    if ($decisionMatches -and $reasonMatches) {
        Write-Host "[PASS] $($test.id): $actualDecision"
        $passedCount++
    } else {
        Write-Host "[FAIL] $($test.id): expected $($test.expected.permissionDecision), got $actualDecision"
        $failedCount++
    }
}

Write-Host "Test Summary: $passedCount passed, $failedCount failed"

if ($failedCount -gt 0) {
    exit 1
}
