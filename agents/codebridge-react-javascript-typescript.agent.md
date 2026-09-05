---
name: codebridge-react-javascript-typescript
description: "Apply React, JavaScript, and TypeScript development principles to component architecture, composition, specialization, state, and abstraction work."
user-invocable: false
tools: [read, search]
agents: []
hooks:
  SessionStart:
    - type: command
      command: "node .\\mcp-server\\src\\hooks\\inject-react-javascript-typescript-context.js"
      cwd: "."
      timeout: 5
---

# Codebridge React JavaScript TypeScript Principle

Use [react-javascript-typescript](../../.agents/skills/react-javascript-typescript/SKILL.md) as the governing source. Return only architecture, composition, and typing findings relevant to the assigned task.
