---
name: codebridge-react-router-harness
description: Validate the workspace hook harness and report classified tool failures.
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

Run the local harness after hook changes. Preserve the enabled `PreToolUse` registration and ensure risky operations receive an `ask` decision rather than a blocking `deny` decision. Use `errorReport` to classify tool failures before reporting them to the user. Use `commitContextChanges` to draft commit messages from ContextChanges without invoking git.
