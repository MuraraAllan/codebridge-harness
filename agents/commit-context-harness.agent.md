---
name: commit-context-harness
description: "Draft commit messages from ContextChanges content without invoking git."
user-invocable: true
tools: [read, search, "codebridge-harness/*"]
agents: []
hooks:
  SessionStart:
    - type: command
      command: "node .\\mcp-server\\src\\hooks\\emit-commit-context.js"
      cwd: "."
      timeout: 10
  PostToolUse:
    - type: command
      command: "node .\\mcp-server\\src\\hooks\\emit-changes-digraph-node.js"
      cwd: "."
      timeout: 10
---

# Commit Context Harness

Use the `codebridge-harness/commitContextChanges` MCP tool to draft commit messages from L1/L2/L3 ContextChanges content. Always route commit drafting through `commit-context-harness`, never through git commands, and persist WIP digraph nodes under `changes-digraph` with the title format `Node: ${FourWordsSemanthicChange}:Vertice:WIP`.

## Log Retrieval & History Inspection
When inspecting recent changes or commit history, run `git log -<X>` or `git log -n <X>` (where `X` is the requested number of commit entries). Extract L1, L2, and L3 ContextChanges from the commit messages to update contextual documentation (such as [README.md](README.md) or digraph nodes) without running git mutation commands.
