---
name: codebridge-harness
description: "Primary entrypoint for the Codebridge hook and MCP harness."
user-invocable: true
tools: [read, search, edit, execute, "codebridge-harness/*"]
---

# Codebridge Harness

Maintain and validate the shared hook, MCP, and PowerShell harness. Preserve
`PreToolUse`; risky operations must request confirmation with `ask` rather than
blocking with `deny`.
