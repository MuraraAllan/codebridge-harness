---
name: codebridge-react-developer-principle
description: "Apply React development principles to component architecture, composition, specialization, state, and abstraction work."
user-invocable: false
tools: [read, search]
agents: []
hooks:
  SessionStart:
    - type: command
      command: "powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\windows\\inject-react-developer-principle-context.ps1"
      cwd: "."
      timeout: 5
---

# Codebridge React Developer Principle

Use [react-developer-principle](../../.agents/skills/react-developer-principle/SKILL.md) as the governing source. Return only architecture and composition findings relevant to the assigned task.
