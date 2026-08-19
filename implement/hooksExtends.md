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

# https://code.visualstudio.com/docs/agents/reference/hooks-reference#_hook-command-properties

Each hook entry must have type: "command" and at least one command property:

Expand table
Property Type Description
type string Must be "command"
command string Default command to run (cross-platform)
windows string Windows-specific command override
linux string Linux-specific command override
osx string macOS-specific command override
cwd string Working directory (relative to repository root)
env object Additional environment variables
timeout number Timeout in seconds (default: 30)

# PreToolUse

The PreToolUse hook fires before the agent invokes a tool.

PreToolUse input
In addition to the common fields, PreToolUse hooks receive:

JSON

{
"tool_name": "editFiles",
"tool_input": { "files": ["src/main.ts"] },
"tool_use_id": "tool-123"
}
PreToolUse output
The PreToolUse hook can control tool execution through a hookSpecificOutput object:

JSON

{
"hookSpecificOutput": {
"hookEventName": "PreToolUse",
"permissionDecision": "deny",
"permissionDecisionReason": "Destructive command blocked by policy",
"updatedInput": { "files": ["src/safe.ts"] },
"additionalContext": "User has read-only access to production files"
}
}
Expand table
Field Values Description
permissionDecision "allow", "deny", "ask" Controls tool approval
permissionDecisionReason string Reason shown to user
updatedInput object Modified tool input (optional)
additionalContext string Extra context for the model
Permission decision priority: When multiple hooks run for the same tool invocation, the most restrictive decision wins:

deny (most restrictive): blocks tool execution
ask: requires user confirmation
allow (least restrictive): auto-approves execution
updatedInput format: To determine the format of updatedInput, open the agent logs and find the logged tool schema. If updatedInput doesn't match the expected schema, it will be ignored.

# PostToolUse

The PostToolUse hook fires after a tool completes successfully.

PostToolUse input
In addition to the common fields, PostToolUse hooks receive:

JSON

{
"tool_name": "editFiles",
"tool_input": { "files": ["src/main.ts"] },
"tool_use_id": "tool-123",
"tool_response": "File edited successfully"
}

# PostToolUse output

The PostToolUse hook can provide additional context to the model, or block further processing:

JSON

{
"decision": "block",
"reason": "Post-processing validation failed",
"hookSpecificOutput": {
"hookEventName": "PostToolUse",
"additionalContext": "The edited file has lint errors that need to be fixed"
}
}
Expand table
Field Values Description
decision "block" Block further processing (optional)
reason string Reason for blocking (shown to the model)
hookSpecificOutput.additionalContext string Extra context injected into the conversation
UserPromptSubmit
The UserPromptSubmit hook fires when the user submits a prompt.

UserPromptSubmit input
In addition to the common fields, UserPromptSubmit hooks receive a prompt field with the text the user submitted.

The UserPromptSubmit hook uses the common output format only.

SessionStart
The SessionStart hook fires when a new agent session begins.

SessionStart input
In addition to the common fields, SessionStart hooks receive:

JSON

{
"source": "new"
}
Expand table
Field Type Description
source string How the session was started. Currently always "new".
SessionStart output
The SessionStart hook can inject additional context into the agent's conversation:

JSON

{
"hookSpecificOutput": {
"hookEventName": "SessionStart",
"additionalContext": "Project: my-app v2.1.0 | Branch: main | Node: v20.11.0"
}
}
Expand table
Field Type Description
additionalContext string Context added to the agent's conversation

# Stop

The Stop hook fires when the current agent execution stops. When scoped to a custom agent, the Stop hook is also treated as SubagentStop.

The hook firing does not indicate stopping of a session or that the session has become inactive.

Stop input
In addition to the common fields, Stop hooks receive:

JSON

{
"stop_hook_active": false
}
Expand table
Field Type Description
stop_hook_active boolean true when the agent is already continuing as a result of a previous stop hook. Check this value to prevent the agent from running indefinitely.
Stop output
The Stop hook can prevent the agent from stopping:

JSON

{
"hookSpecificOutput": {
"hookEventName": "Stop",
"decision": "block",
"reason": "Run the test suite before finishing"
}
}
Expand table
Field Values Description
decision "block" Prevent the agent from stopping
reason string Required when decision is "block". Tells the agent why it should continue.
Important
When a Stop hook blocks the agent from stopping, the agent continues running and the additional turns consume AI credits. Always check the stop_hook_active field to prevent the agent from running indefinitely.

# SubagentStart

The SubagentStart hook fires when a subagent is spawned.

SubagentStart input
In addition to the common fields, SubagentStart hooks receive:

JSON

{
"agent_id": "subagent-456",
"agent_type": "Plan"
}

Expand table
Field Type Description
agent_id string Unique identifier for the subagent
agent_type string The agent name (for example, "Plan" for built-in agents or custom agent names)
SubagentStart output
The SubagentStart hook can inject additional context into the subagent's conversation:

JSON

{
"hookSpecificOutput": {
"hookEventName": "SubagentStart",
"additionalContext": "This subagent should follow the project coding guidelines"
}
}
Expand table
Field Type Description
additionalContext string Context added to the subagent's conversation
SubagentStop
The SubagentStop hook fires when a subagent completes.

SubagentStop input
In addition to the common fields, SubagentStop hooks receive:

JSON

{
"agent_id": "subagent-456",
"agent_type": "Plan",
"stop_hook_active": false
}
Expand table
Field Type Description
agent_id string Unique identifier for the subagent
agent_type string The agent name (for example, "Plan" for built-in agents or custom agent names)
stop_hook_active boolean true when the subagent is already continuing as a result of a previous stop hook. Check this value to prevent the subagent from running indefinitely.
SubagentStop output
The SubagentStop hook can prevent the subagent from stopping:

JSON

{
"decision": "block",
"reason": "Verify subagent results before completing"
}
Expand table
Field Values Description
decision "block" Prevent the subagent from stopping
reason string Required when decision is "block". Tells the subagent why it should continue.

# PreCompact

The PreCompact hook fires before conversation context is compacted.

PreCompact input
In addition to the common fields, PreCompact hooks receive:

JSON

{
"trigger": "auto"
}
Expand table
Field Type Description
trigger string How the compaction was triggered. "auto" when the conversation is too long for the prompt budget.
The PreCompact hook uses the common output format only.

---

# Hook lifecycle events

VS Code supports eight hook events that fire at specific points during an agent session:

Expand table
Hook Event When It Fires Common Use Cases
SessionStart User submits the first prompt of a new session Initialize resources, log session start, validate project state
UserPromptSubmit User submits a prompt Audit user requests, inject system context
PreToolUse Before agent invokes any tool Block dangerous operations, require approval, modify tool input
PostToolUse After tool completes successfully Run formatters, log results, trigger follow-up actions
PreCompact Before conversation context is compacted Export important context, save state before truncation
SubagentStart Subagent is spawned Track nested agent usage, initialize subagent resources
SubagentStop Subagent completes Aggregate results, cleanup subagent resources
Stop Agent session ends Generate reports, cleanup resources, send notifications
For the full input and output schema of each event, see the Hooks reference.

Configure hooks
Hooks are configured in JSON files stored in your workspace or user directory.

Hook file locations
VS Code searches for hook configuration files in these locations:

Tip
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

---

# Configure hooks

Hooks are configured in JSON files stored in your workspace or user directory.

Hook file locations
VS Code searches for hook configuration files in these locations:

Tip
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

Use the Agent Customizations editor:

Open the Agent Customizations editor by running the Chat: Open Customizations command.

Alternatively, select Open Customizations (gear icon) at the top of the Chat view.

Select the Hooks tab to view and manage your hooks.

Select Configure Hooks from the dropdown button.

Follow the prompts to select an event type, choose a file location, and configure the command.

The command creates a new hook file and opens it in the editor for you to customize. Save the file to load the hook.

Generate a hook with AI:

Type /create-hook in chat and describe the automation you want (for example, /create-hook run ESLint after every file edit).

Alternatively, run the Chat: Generate Hook command from the Command Palette (Ctrl+Shift+P) or select Generate Hook in the Agent Customizations editor.

The agent asks clarifying questions and generates a hook configuration file with the appropriate event type, command, and settings.

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
Each hook event provides its own input fields and supports event-specific output. For the full input and output schema of every event, including PreToolUse, PostToolUse, SessionStart, Stop, and more, see the Hooks reference
