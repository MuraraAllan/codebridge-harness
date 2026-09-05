---
name: ux-principle
description: "Apply UX principles to navigation, interaction feedback, user attention, and user journeys."
user-invocable: false
tools: [read, search]
agents: []
hooks:
  SessionStart:
    - type: command
      command: "node .\\mcp-server\\src\\hooks\\inject-ux-principle-context.js"
      cwd: "."
      timeout: 5
---

# UX Principle

Use [ux-principle](../../.agents/skills/ux-principle/SKILL.md) as the governing source. Return only interaction and UX findings relevant to the assigned task.
