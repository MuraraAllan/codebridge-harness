Our objective :

Provide context: instructions describe coding standards, architecture decisions, and other rules the agent should follow.
Define repeatable work: agent skills and prompt files package task-specific guidance so you don't have to describe the same process in every conversation.
Configure roles: custom agents combine instructions, tools, and a language model into a specialized agent persona.
Add capabilities: MCP servers give the agent tools for interacting with external systems such as databases, browsers, and APIs.
Enforce actions: hooks run commands at specific points in the agent loop, independent of whether the model chooses to run them.
Adopt a ready-made setup: agent plugins let you install multiple related customization types as one package.
Wether injectContext or dont : customizations focused because their content also consumes space in the model's context window.

Hooks are deterministic. A hook runs when its configured lifecycle event occurs. Use a hook when an action must happen consistently, such as validating a command before it runs or starting a formatter after an edit. Use instructions when you want to guide how the agent reasons or writes code.

# INSTRUCTIONS

Instructions provide the Agent, SubAgent, project and repository's coding standards and pull request conventions.
A custom agent gives the agent a focused role and limits it to the tools needed for the task.
An agent skill supplies the steps, scripts, and templates for preparing the pull request.
An MCP server provides tools to retrieve the related issue from an external issue tracker.
You can configure custom instructions to apply automatically to all chat requests or to specific files only. Alternatively, you can manually attach custom instructions to a specific chat prompt.

Types of instruction files

# VS Code supports two categories of custom instructions. If you have multiple instruction files in your project, VS Code combines and adds them to the chat context, no specific order is guaranteed.

# Always-on instructions

Always-on instructions are automatically included in every chat request. Use them for project-wide coding standards, architecture decisions, and conventions that apply to all code.
A single .github/copilot-instructions.md file
Automatically applies to all chat requests in the workspace
Stored within the workspace
One or more AGENTS.md files

Automatically applies to all chat requests in the workspace or to specific subfolders (experimental)
Stored in the root of the workspace or in subfolders (experimental)
Organization-level instructions

# Share instructions across multiple workspaces and repositories within a GitHub organization

Defined at the GitHub organization level
CLAUDE.md file

# For compatibility with Claude Code and other Claude-based tools

# Stored in the workspace root, .claude folder, or user home directory

# File-based instructions

File-based instructions are applied when files that the agent is working on match a specified pattern or if the description matches the current task. Use file-based instructions for language-specific conventions, framework patterns, or rules that only apply to certain parts of your codebase.

One or more .instructions.md files
Conditionally apply instructions based on file type or location by using glob patterns
Stored in the workspace or user profile
To reference specific context in your instructions, such as files or URLs, you can use Markdown links.

# Which approach should you use?

Start with a single .github/copilot-instructions.md file for project-wide coding standards. Add .instructions.md files when you need different rules for different file types or frameworks. Use AGENTS.md if you work with multiple AI agents in your workspace.

Use a .github/copilot-instructions.md file
VS Code automatically detects a .github/copilot-instructions.md Markdown file in the root of your workspace and applies the instructions in this file to all chat requests within this workspace.

Use copilot-instructions.md for:

Coding style and naming conventions that apply across the project
Technology stack declarations and preferred libraries
Architectural patterns to follow or avoid
Security requirements and error handling approaches
Documentation standards
Follow these steps to create a .github/copilot-instructions.md file in your workspace:

Create a .github/copilot-instructions.md file at the root of your workspace. If needed, create a .github directory first.

Describe your instructions in Markdown format. Keep them concise and focused for optimal results.

Note
VS Code also supports the use of an AGENTS.md file for always-on instructions.

Example: General coding guidelines
Use .instructions.md files
You can create file-based instructions with \*.instructions.md Markdown files that are applied dynamically based on the files or tasks the agent is working on.

The agent determines which instructions files to apply based on the file patterns specified in the applyTo property in the instructions file header or semantic matching of the instruction description to the current task.

Use .instructions.md files for:

Different conventions for frontend vs. backend code
Language-specific guidelines in a monorepo
Framework-specific patterns for specific modules
Specialized rules for test files or documentation
Instructions file locations
You can define instructions for a specific workspace or at the user level, where they are applied across all your workspaces. The following table lists the default file locations for instructions files based on their scope. You can configure additional file locations for workspace instructions files with the
chat.instructionsFilesLocations
setting.
Expand table
Scope Default file location
Workspace .github/instructions folder
Workspace (Claude format) .claude/rules folder
User profile ~/.copilot/instructions or ~/.claude/rules
Important
When Agent Host is enabled, the agent reads user-level instructions from harness-agnostic folders like ~/.copilot/instructions and ~/.claude/rules and not from VS Code profile user data. To use existing user-level instructions with the Copilot agent, store them in ~/.copilot/instructions (or ~/.claude/rules).

VS Code searches these folders recursively, to enable you to organize instructions files in subdirectories. For example, you can group instructions by team, language, or module:

Text

.github/instructions/
frontend/
react.instructions.md
accessibility.instructions.md
backend/
api-design.instructions.md
testing/
unit-tests.instructions.md
The following example shows how to configure the instructions file locations to only allow workspace-level instructions:

JSON

"chat.instructionsFilesLocations": {
".github/instructions": true,
".claude/rules": true,
"~/.copilot/instructions": false,
"~/.claude/rules": false
}
Tip
In a monorepo, enable
chat.useCustomizationsInParentRepositories
to discover instructions from the parent repository root. Learn more about parent repository discovery.
Instructions file format
Instructions files are Markdown files with the .instructions.md extension. The optional YAML frontmatter header controls when the instructions are applied:

Expand table
Field Required Description
name No Display name shown in the UI. Defaults to the file name.
description No Short description shown on hover in the Chat view.
applyTo No Glob pattern that defines which files the instructions apply to automatically, relative to the workspace root. Use \*\* to apply to all files. If not specified, the instructions are not applied automatically, but you can still add them manually to a chat request.
The body contains the instructions in Markdown format. To reference agent tools, use the #tool:<tool-name> syntax (for example, #tool:web/fetch).

Example: Language-specific coding guidelines
Example: Documentation writing guidelines
For more community-contributed examples, see the Awesome Copilot repository.

Use an AGENTS.md file
VS Code automatically detects an AGENTS.md Markdown file in the root of your workspace and applies the instructions in this file to all chat requests within this workspace. This is useful if you work with multiple AI agents in your workspace and want a single set of instructions recognized by all of them, or if you want subfolder-level instructions that apply to specific parts of a monorepo.

Use AGENTS.md when:

You work with multiple AI coding agents and want a single set of instructions recognized by all of them
You want subfolder-level instructions that apply to specific parts of a monorepo
To enable or disable support for AGENTS.md files, configure the
chat.useAgentsMdFile
setting.
Use multiple AGENTS.md files (experimental)
Using multiple AGENTS.md files in subfolders is useful if you want to apply different instructions to different parts of your project. For example, you can have one AGENTS.md file for the frontend code and another for the backend code.

Use the experimental
chat.useNestedAgentsMdFiles
setting to enable or disable support for nested AGENTS.md files in your workspace.
When enabled, VS Code searches recursively in all subfolders of your workspace for AGENTS.md files and adds their relative path to the chat context. The agent can then decide which instructions to use based on the files being edited.

Tip
For folder-specific instructions, you can also use multiple .instructions.md files with different applyTo patterns that match the folder structure.

Use a CLAUDE.md file
VS Code automatically detects a CLAUDE.md file and applies it as always-on instructions, similar to AGENTS.md. This is useful if you use Claude Code or other Claude-based tools alongside VS Code and want a single set of instructions recognized by all of them.

VS Code searches for CLAUDE.md files in these locations:

Expand table
Location Description
Workspace root CLAUDE.md in the root of your workspace
.claude folder .claude/CLAUDE.md in your workspace
User home ~/.claude/CLAUDE.md for personal instructions across all projects
Local variant CLAUDE.local.md for local-only instructions (not committed to version control)
To enable or disable support for CLAUDE.md files, configure the
chat.useClaudeMdFile
setting.
Note
For .claude/rules instructions files, VS Code uses a paths property instead of applyTo for glob patterns, following the Claude Rules format. The paths property accepts an array of glob patterns and defaults to \*\* (all files) when omitted.

Generate custom instructions for your workspace
VS Code can analyze your workspace and generate always-on custom instructions that match your coding practices and project structure. These instructions then apply automatically to all chat requests in the workspace.

When you generate instructions, VS Code performs the following steps:

It discovers existing AI conventions in your workspace, such as copilot-instructions.md or AGENTS.md files.
It analyzes your project structure and coding patterns.
It generates comprehensive workspace instructions tailored to your project.
To generate custom instructions for your workspace:

Type /init in the chat input box and press Enter.

Type /create-instructions, followed by a description of the instructions you want to generate.

In the Agent Customizations editor, select Generate Instructions from the dropdown.

Share custom instructions across teams
To share custom instructions across multiple workspaces and repositories within your GitHub organization, you can define them at the GitHub organization level.

VS Code automatically detects custom instructions defined at the organization level to which your account has access. These instructions are shown in the Chat Instructions menu alongside your personal and workspace instructions, and are automatically applied to all chat requests.

To enable discovery of organization-level custom instructions, set
github.copilot.chat.organizationInstructions.enabled
to true.
Learn how you can add custom instructions for your organization in the GitHub documentation.

Sync user instructions files across devices
VS Code can sync your user instructions files across multiple devices by using Settings Sync.

To sync your user instructions files, enable Settings Sync and run Settings Sync: Configure from the Command Palette (Ctrl+Shift+P). Select Prompts and Instructions from the list of settings to sync.

Specify custom instructions in settings
Note
Settings-based code generation and test generation instructions are deprecated as of VS Code 1.102. Use file-based instructions instead.

For code review, commit messages, and pull request descriptions, you can still use VS Code settings to define custom instructions. These settings accept an array of objects with either a text property (inline instruction) or a file property (path to a Markdown file).

Expand table
Scenario Setting
Code review
github.copilot.chat.reviewSelection.instructions
Commit messages
github.copilot.chat.commitMessageGeneration.instructions
Pull request descriptions
github.copilot.chat.pullRequestDescriptionGeneration.instructions
Instruction priority
When multiple types of custom instructions exist, they are all provided to the AI. Higher-priority instructions take precedence when conflicts occur:

Personal instructions (user-level, highest priority)
Repository instructions (.github/copilot-instructions.md or AGENTS.md)
Organization instructions (lowest priority)
Tips for writing effective instructions
Keep your instructions short and self-contained. Each instruction should be a single, simple statement. If you need to provide multiple pieces of information, use multiple instructions.

Include the reasoning behind rules. When instructions explain why a convention exists, the AI makes better decisions in edge cases. For example: "Use date-fns instead of moment.js because moment.js is deprecated and increases bundle size."

Show preferred and avoided patterns with concrete code examples. The AI responds more effectively to examples than to abstract rules.

Focus on non-obvious rules. Skip conventions that standard linters or formatters already enforce.

For task or language-specific instructions, use multiple \*.instructions.md files per topic and apply them selectively by using the applyTo property.

Store project-specific instructions in your workspace to share them with other team members and include them in your version control.

Reuse and reference instructions files in your prompt files and custom agents to keep them clean and focused, and to avoid duplicating instructions.

Whitespace between instructions is ignored, so you can format instructions as a single paragraph, on separate lines, or separated by blank lines for legibility.

Frequently asked questions
Why is my instructions file not being applied?
Tip
Use the chat customization diagnostics view to see all loaded instruction files and any errors. Right-click in the Chat view and select Diagnostics. Learn more about troubleshooting AI in VS Code.

If your instructions file is not being applied, check the following:

Verify that your instructions file is in the correct location. A .github/copilot-instructions.md file must be in the .github folder at the root of your workspace. A _.instructions.md file must be in one of the folders (or their subdirectories) specified in the
chat.instructionsFilesLocations
setting (default: .github/instructions) or in your user profile.
For _.instructions.md files, check that the applyTo glob pattern matches the file you are working on. If no applyTo property is specified, the instructions file is not applied automatically. Verify the References section in the chat response to see which instructions files were used.

Check that the relevant settings are enabled:
chat.includeApplyingInstructions
for pattern-based instructions,
chat.includeReferencedInstructions
for instructions referenced via Markdown links,
chat.useAgentsMdFile
for AGENTS.md files.
For advanced diagnostics, check language model requests in the Chat Debug view or debug the applyTo matching logic.

How do I know where 1234?
