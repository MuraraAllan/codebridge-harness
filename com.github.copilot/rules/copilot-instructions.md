# Codebridge React Router Harness Instructions

- This is the project-wide Copilot instruction layer packaged for Agent Plugins 1.0 import.
- Keep portable skills in `skills/` and `.agents/skills`; keep Copilot-specific agents, hooks, and rules under `com.github.copilot`.
- Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1` after changing hook behavior.
- Keep hook scripts compatible with VS Code's JSON-on-stdin and JSON-on-stdout contract.
- Add focused harness cases when changing hook decisions or MCP tool behavior. `PreToolUse` is enabled, and its validator must use `ask` rather than `deny` for risky actions.
- When the `PostToolUse` hook injects an error-report request, call `codebridge-harness/errorReport` and present its category, explanation, and next action to the user.
- Do not add credentials, tokens, or machine-specific paths to workspace customization files.
- For React Router work that includes harness integration, use `react-router-harness`; it delegates harness-specific work to `codebridge-harness`.
