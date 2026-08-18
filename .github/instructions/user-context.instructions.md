---
name: User context
description: Workspace-level guidance for reporting task progress, contextual changes, and failures.
applyTo: "**"
---

# User Context Instructions

This is a workspace-level user instruction file, not a global user-profile setting.

- Start work by restating the immediate user intent in one sentence when the task has multiple parts.
- For meaningful changes, report `ContextChanges` at three levels: `L1` changed files and visible behavior, `L2` integration and validation impact, and `L3` scope, assumptions, and remaining user action.
- When a tool fails, use `codebridge-harness/errorReport` if it is available, and report its category: `fixable`, `userIntervention`, or `unknown`.
- Do not treat workspace instructions as private user preferences. Put truly global personal preferences in `~/.copilot/instructions` for Copilot or `~/.claude/rules` for Claude.
