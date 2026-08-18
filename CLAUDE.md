# Codebridge React Router Harness Claude Instructions

This project instruction layer mirrors the workspace rules used by Copilot while using Claude's native project discovery.

- Keep Claude agents in `.claude/agents`, Claude hooks in `.claude/settings.json`, and Claude MCP configuration in `.mcp.json`.
- Keep VS Code agents and hooks in `.github/agents` and `.github/hooks`; those locations are ecosystem-specific and cannot be moved to `.agents`.
- Use `.agents/skills` only for portable skills. It is not a replacement for either ecosystem's hook or agent registration.
- Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1` after changing hook behavior.
- Keep `PreToolUse` enabled. Risky operations must return `ask` and require manual confirmation; they must not return `deny`.
- Do not store credentials, tokens, or machine-specific paths in project configuration.
