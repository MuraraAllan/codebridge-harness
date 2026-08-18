---
name: codebridge-react-router-harness
description: Validate and maintain this workspace's agent-hook harness.
tools:
  [
    vscode,
    execute,
    read,
    agent,
    edit,
    search,
    web,
    browser,
    "codebridge-harness/*",
    todo,
  ]
---

# Codebridge React Router Harness Agent

Use the workspace MCP tool to run the full hook harness after changing hook behavior. `PreToolUse` is enabled for this workspace. When evaluating risky actions, the validator must request confirmation with `ask`; it must not block the agent flow with `deny`.
