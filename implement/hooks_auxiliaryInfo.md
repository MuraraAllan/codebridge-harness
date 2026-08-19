VS Code searches for hook configuration files in these locations:
In a monorepo, enable
chat.useCustomizationsInParentRepositories
to discover hooks from the parent repository root. Learn more about parent repository discovery.
Expand table
Scope Default file location
Workspace .github/hooks/\*.json
Workspace (Claude format) .claude/settings.json, .claude/settings.local.json
User ~/.copilot/hooks, ~/.claude/settings.json
Custom agent hooks field in .agent.md frontmatter (see Agent-scoped hooks)
Plugin hooks.json or hooks/hooks.json, depending on the plugin format (see Hooks in plugins)
Workspace hooks take precedence over user hooks for the same event type.

Use the
chat.hookFilesLocations
setting to customize which files are loaded. Specify folders (all \*.json files in the folder are loaded) or individual .json files, using relative or tilde (~) paths. The default value includes these locations:
JSON

"chat.hookFilesLocations": {
".github/hooks": true,
".claude/settings.local.json": true,
".claude/settings.json": true,
"~/.claude/settings.json": true
}
To customize, add an entry for a new location, or set a path to false to disable a location (including the defaults):

Jsonc

"chat.hookFilesLocations": {
"custom/hooks": true, // load all \*.json files in a folder
"~/my-hooks/security.json": true, // load a specific file
".claude/settings.json": false // stop loading Claude Code hooks
}
Hook configuration format
Create a JSON file with a hooks object containing arrays of hook commands for each event type. VS Code uses the same hook format as Claude Code and Copilot CLI for compatibility:

JSON

{
"hooks": {
"PreToolUse": [
{
"type": "command",
"command": "./scripts/validate-tool.sh",
"timeout": 15
}
],
"PostToolUse": [
{
"type": "command",
"command": "npx prettier --write ."
}
]
}
}
Hook command properties
Each hook entry must specify type: "command" and a command to run. You can also configure a working directory (cwd), environment variables (env), a timeout, and OS-specific overrides (windows, linux, osx). For the full list of properties, see the Hook command properties reference.

Note
OS-specific commands are selected based on the extension host platform. In remote development scenarios (SSH, Containers, WSL), this might differ from your local operating system.

OS-specific commands
Specify different commands for each operating system:

JSON

{
"hooks": {
"PostToolUse": [
{
"type": "command",
"command": "./scripts/format.sh",
"windows": "powershell -File scripts\\format.ps1",
"linux": "./scripts/format-linux.sh",
"osx": "./scripts/format-mac.sh"
}
]
}
}
The execution service selects the appropriate command based on your OS. If no OS-specific command is defined, it falls back to the command property.

Agent-scoped hooks
Note
Agent-scoped hooks are currently in preview.

You can define hooks directly in a custom agent's YAML frontmatter. Agent-scoped hooks only run when that custom agent is active, either selected by the user or invoked as a subagent. Agent-scoped hooks run in addition to any workspace or user-level hooks configured for the same event.

To enable agent-scoped hooks, set
chat.useCustomAgentHooks
to true.
Add a hooks field to the agent frontmatter with the same structure as hook configuration files: event names mapped to arrays of hook command objects.

Markdown

---

name: "Strict Formatter"
description: "Agent that auto-formats code after every edit"
hooks:
PostToolUse: - type: command
command: "./scripts/format-changed-files.sh"

---

You are a code editing agent. After making changes, files are automatically formatted.
Create and edit hooks
You have multiple options for creating and editing hooks. You can create hook configuration files manually in one of the supported locations, use commands to create a new hook, or generate a hook with AI.

Manually manage hook files:

Create or edit a .json file in a supported location (for example, .github/hooks/security.json) and add your hook configuration.
Save the file and it is automatically loaded by VS Code.
Use commands to manage hooks

Run the Chat: Configure Hooks command from the Command Palette (Ctrl+Shift+P).

You can also type /hooks in the chat input and press Enter to open the configure hooks menu.

Follow the prompts to select an event type, choose a file location, and configure the command.

The command creates a new hook file and opens it in the editor for you to customize. Save the file to load the hook.

Hook input and output
Hooks communicate with VS Code through stdin (input) and stdout (output) using JSON.

Common input fields
Every hook receives a JSON object via stdin with these common fields:

Expand table
Field Type Description
timestamp string ISO 8601 timestamp when the hook fired
cwd string (Optional) Working directory for the agent session
session_id string (Optional) Unique identifier for the current agent session
hook_event_name string Name of the hook event (for example, PreToolUse)
transcript_path string (Optional) Absolute path to a file containing the session conversation transcript
Note
transcript_path is provided for convenience — for example, logging, auditing, or lightweight checks such as whether a file was read during the session. The transcript file format is not a stable hook API and may change in future VS Code releases. Prefer the documented hook input fields (tool_name, tool_input, prompt, and so on) whenever possible.

Common output format
Hooks can return JSON via stdout to influence agent behavior. All hooks support these output fields:

JSON

{
"continue": true,
"stopReason": "Security policy violation",
"systemMessage": "Unit tests failed"
}
Expand table
Field Type Description
continue boolean Set to false to stop processing (default: true)
stopReason string Reason for stopping, when continue is false (shown to the user)
systemMessage string Warning message displayed to the user
Exit codes
The hook's exit code determines how VS Code handles the result:

Expand table
Exit Code Behavior
0 Success: parse stdout as JSON
2 Blocking error: stop processing and show error to model
Other Non-blocking warning: show warning to user, continue processing
Choosing how to return data
Hooks have several ways to control agent behavior: exit codes, top-level output fields (continue, stopReason), and hook-specific output fields (hookSpecificOutput). Use them in combination as follows:

Exit code 2 is the simplest way to block an operation. The hook's stderr is shown to the model as context. No JSON output is needed.
continue: false in the JSON output stops the entire agent session. Use stopReason to tell the user why. This is more drastic than blocking a single tool call.
hookSpecificOutput provides fine-grained control specific to each hook event. For example, PreToolUse hooks use permissionDecision to allow, deny, or prompt for a single tool call without stopping the session.
systemMessage displays a warning to the user in the chat, regardless of other decisions.
When multiple control mechanisms are used together, the most restrictive wins. For example, if a hook returns continue: false and permissionDecision: "allow", the session still stops.

Per-event input and output
Each hook event provides its own input fields and supports event-specific output. For the full input and output schema of every event, including PreToolUse, PostToolUse, SessionStart, Stop, and more, see the Hooks reference.

Usage scenarios
The following examples demonstrate common hook patterns.

Block dangerous terminal commands
Auto-format code after edits
Log tool usage for auditing
Require approval for specific tools
Inject project context at session start
Safety
If the agent has access to edit scripts run by hooks, then it has the ability to modify those scripts during its own run, and execute the code it writes. We recommend using the chat.tools.edits.autoApprove to disallow the agent from editing hook scripts without manual approval.

Troubleshooting
View hook diagnostics
To see which hooks are loaded and check for configuration errors:

Select View Logs to view all logs.

Look for "Load Hooks" to see loaded hooks and which locations they were loaded from.

View hook output
To review hook output and errors:

Open the Output panel.

Select GitHub Copilot Chat Hooks from the channel list.

Tip
You can also run the Developer: Show Agent Debug Logs command to view hook input and output in the agent debug logs.

Common issues
Hook not executing: Verify the hook file is in .github/hooks/ and has a .json extension. Check that the type property is set to "command".

Permission denied errors: Ensure your hook scripts have execute permissions (chmod +x script.sh).

Timeout errors: Increase the timeout value or optimize your hook script. The default is 30 seconds.

JSON parse errors: Verify your hook script outputs valid JSON to stdout. Use jq or a JSON library to construct output.

Frequently asked questions
How does VS Code handle Claude Code hook configurations?
VS Code reads hook configurations from .claude/settings.json, .claude/settings.local.json, and ~/.claude/settings.json by default. VS Code parses Claude Code's hook configuration format, including matcher syntax. Currently, VS Code ignores matcher values, so hooks run on all tool invocations regardless of the matcher.

If you are adapting a Claude Code hook for VS Code, be aware of the following differences:

Tool input property names: Claude Code uses snake_case for tool input properties (for example, tool_input.file_path), while VS Code tools use camelCase (for example, tool_input.filePath). Update your hook scripts to read the correct property names.
Tool names: Claude Code and VS Code use different tool names. For example, Claude Code uses Write and Edit for file operations, while VS Code uses tool names like create_file and replace_string_in_file. Check the tool name in the tool_name input field and update your hook logic accordingly.
Matchers are ignored: Hook matchers like "Edit|Write" are parsed but not applied. All hooks run on every matching event, regardless of the tool name in the matcher.
How does VS Code handle Copilot CLI hook configurations?
VS Code parses Copilot CLI hook configurations and converts the lowerCamelCase hook event names (like preToolUse) to the PascalCase format used by VS Code (PreToolUse). The bash and powershell command properties are mapped to OS-specific commands: powershell maps to windows, and bash maps to osx and linux.

Security considerations
Caution
Hooks execute shell commands with the same permissions as VS Code. Review hook configurations carefully, especially when using hooks from untrusted sources.

Review hook scripts: Inspect all hook scripts before enabling them, especially in shared repositories.

Limit hook permissions: Use the principle of least privilege. Hooks should only have access to what they need.

Validate input: Hook scripts receive input from the agent. Validate and sanitize all input to prevent injection attacks.

Secure credentials: Never hardcode secrets in hook scripts. Use environment variables or secure credential storage.

Related resources
Use tools with agents - Learn about tool approval and execution
Custom agents - Create specialized agent configurations
Subagents - Delegate tasks to context-isolated subagents
Security considerations - Best practices for AI security in VS Code
