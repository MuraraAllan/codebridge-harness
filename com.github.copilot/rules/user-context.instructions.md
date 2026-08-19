---
name: User context
description: Workspace-level guidance for reporting task progress, contextual changes, and failures.
applyTo: "**"
---

# User Context Instructions

Adopt the repository's ContextChanges reporting convention for meaningful changes:

- `L1`: changed files and visible behavior.
- `L2`: integration and validation impact.
- `L3`: scope, assumptions, and remaining user action.

When a tool fails, use `codebridge-harness/errorReport` if it is available and report its category: `fixable`, `userIntervention`, or `unknown`.
