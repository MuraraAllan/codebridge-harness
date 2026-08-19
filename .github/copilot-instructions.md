# Codebridge React Router Harness Instructions

- This is the project-wide Copilot instruction layer. VS Code applies it to every chat request in this workspace.
- Keep VS Code customizations in their supported workspace locations: instructions and agents under `.github`, hooks under `.github/hooks`, skills under `.agents/skills`, and MCP servers under `.vscode`.
- Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1` after changing hook behavior.
- Keep hook scripts compatible with VS Code's JSON-on-stdin and JSON-on-stdout contract.
- Add focused harness cases when changing hook decisions or MCP tool behavior. `PreToolUse` is enabled, and its validator must use `ask` rather than `deny` for risky actions.
- When the `PostToolUse` hook injects an error-report request, call `codebridge-harness/errorReport` and present its category, explanation, and next action to the user.
- Do not add credentials, tokens, or machine-specific paths to workspace customization files.
- For React Router work that includes harness integration, use `react-router-harness`; it delegates harness-specific work to `codebridge-harness`.
- Automatically select the smallest relevant React principle skill: `react-design-principle` for design and accessibility, `react-developer-principle` for architecture and composition, or `react-ux-principle` for interaction and navigation. The selection index is at `.agents/skills/react-principles/SKILL.md`.
- Ground each task in the active file, relevant workspace sources, visible diagnostics, and tool output before adding further context.
