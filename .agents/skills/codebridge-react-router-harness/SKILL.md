---
name: codebridge-react-router-harness
description: Run and maintain the Codebridge React Router agent-hook harness. Use when validating hook decisions, debugging hook output, or changing the bundled PowerShell hook scripts.
argument-hint: "[test-suite-path] [hook-script-path]"
---

# Codebridge React Router Harness

Use this skill to validate and update the agent-hook harness in this workspace.

## Running the harness

Run the bundled test suite from the workspace root with an execution-policy override:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1
```

To test a different suite or hook script, pass both paths explicitly:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1 `
  -TestSuitePath <path-to-suite.json> `
  -HookScriptPath <path-to-hook.ps1>
```

## Maintaining hook behavior

- Keep hook input and output compatible with the JSON structure in [test-suite.json](../../../tests/test-suite.json).
- The tool validation hook is [validate-tool.ps1](../../../scripts/validate-tool.ps1). Its response must provide `hookSpecificOutput.permissionDecision` with `allow`, `ask`, or `deny`.
- Add a focused test case to [test-suite.json](../../../tests/test-suite.json) whenever hook decision logic changes.
- Invoke PowerShell scripts with `-NoProfile -ExecutionPolicy Bypass`; direct invocation can be blocked by the local execution policy.
- Preserve the `emit-1234.ps1` session-start output unless the hook contract is intentionally changed.