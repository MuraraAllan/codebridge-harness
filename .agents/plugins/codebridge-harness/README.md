# Codebridge React Router Harness for Codex

This plugin packages the complete Codebridge React Router validation suite for Codex:

- Local MCP tools: `run_harness`, `errorReport`, and `commitContextChanges`.
- PowerShell hook scripts and the 13-case harness test suite.
- React Router, React principle, and harness-routing skills.
- VS Code and Claude agent/hook files as reference adapters.

## Use in Codex

After installation, start a new Codex thread and ask for one of the built-in tasks, for example:

```text
Run the Codebridge React Router harness.
```

```text
Validate the Codebridge customization composition.
```

```text
Use commitContextChanges to draft a commit message from these ContextChanges.
```

Codex discovers the skills and starts the local `codebridge-harness` MCP server from this plugin.

## Hook adapters

Codex plugins do not execute VS Code or Claude `PreToolUse`, `PostToolUse`, or `SessionStart` configuration automatically. The corresponding JSON files are bundled under `adapters/` so they can be copied into a VS Code or Claude workspace when that host is used.

In Codex, use `codebridge-harness/run_harness` or run the included test scripts directly:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\validate-customizations.ps1
```
