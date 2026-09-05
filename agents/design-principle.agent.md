---
name: design-principle
description: "Apply design principles to visual design, accessibility, responsiveness, and frontend performance work."
user-invocable: false
tools: [read, search]
agents: []
hooks:
  SessionStart:
    - type: command
      command: "node .\\mcp-server\\src\\hooks\\inject-design-principle-context.js"
      cwd: "."
      timeout: 5
---

# Design Principle

Use [design-principle](../../.agents/skills/design-principle/SKILL.md) as the governing source. Return only design and accessibility findings relevant to the assigned task.
