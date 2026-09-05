# Codebridge React Router Harness Claude Instructions

This is Claude's project instruction layer. It provides the same repository rules as Copilot while following Claude’s native project instruction discovery.

- Keep Claude-specific agents in `.claude/agents` and hook configuration in `.claude/settings.json`.
- Keep VS Code-specific agents and hooks in `.github/agents` and `.github/hooks`; those locations are not interchangeable. `.agents/skills` can hold portable skills but cannot replace either ecosystem's registrations.
- Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1` after changing hook behavior.
- Keep `PreToolUse` enabled. Risky actions must request confirmation with `ask` rather than block with `deny`.
- When a post-tool hook requests an error report, call `errorReport`, then state the category, error, and next action.
- Do not store credentials, tokens, or machine-specific paths in project configuration.
- For React Router work that includes harness integration, use `react-router-harness`; it delegates harness-specific work to `codebridge-harness`.
- Automatically select the smallest relevant React principle skill: `react-design-principle` for design and accessibility, `react-developer-principle` for architecture and composition, or `react-ux-principle` for interaction and navigation. The selection index is at `.agents/skills/react-principles/SKILL.md`.
- Ground each task in the active file, relevant workspace sources, visible diagnostics, and tool output before adding further context.
