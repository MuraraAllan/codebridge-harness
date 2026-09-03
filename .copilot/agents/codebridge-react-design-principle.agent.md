---
name: codebridge-react-design-principle
description: "Apply React design principles to visual design, accessibility, responsiveness, and frontend performance work."
user-invocable: false
tools: [read, search]
agents: []
hooks:
  SessionStart:
    - type: command
      command: "powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\windows\\inject-react-design-principle-context.ps1"
      cwd: "."
      timeout: 5
---

# Codebridge React Design Principle

Use [react-design-principle](../../.agents/skills/react-design-principle/SKILL.md) as the governing source. Return only design and accessibility findings relevant to the assigned task.
