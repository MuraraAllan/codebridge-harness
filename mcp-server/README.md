flowchart TD
    subgraph VSCode["VS Code / Copilot Client"]
        CH["Copilot Hook Runner"]
        CC["Copilot MCP Client"]
    end

    subgraph NodeStack["Unified Node.js Engine (codebridge-harness/mcp-server)"]
        subgraph MCPServer["MCP Server Process (stdio)"]
            TR["StdioServerTransport"]
            REG["McpServer Registry"]
            T1["tool: errorReport"]
            T2["tool: commitContextChanges"]
            T3["tool: run_harness"]
        end

        subgraph SharedLib["Shared Core Domain Logic"]
            ERR["Error Classification & NextAction"]
            COM["Context Changes & Digraph Generator"]
            VAL["Safety & Sensitive Path Rules"]
        end

        subgraph HookCLI["Hook Entrypoints (node CLI)"]
            H1["pre-tool-use.js"]
            H2["post-tool-use.js"]
            H3["session-start.js"]
            H4["user-prompt-submit.js"]
        end
    end

    CC <==>|JSON-RPC via stdio| TR
    TR --> REG
    REG --> T1 & T2 & T3
    T1 & T2 & T3 --> SharedLib

    CH -->|Executes hook with stdin/stdout| H1 & H2 & H3 & H4
    H1 & H2 & H3 & H4 --> SharedLib

1. PowerShell Execution Completely Blocked from VS Code
All hook configurations and agent hooks that previously launched powershell.exe from VS Code have been migrated to native Node.js scripts under mcp-server/src/hooks/. VS Code will now execute node directly, eliminating PowerShell startup latency, pipe hangs, and orphaned processes:

Configuration / Location	Previous Command	New Command (100% Node.js)
hooks.json (Root VS Code hooks)	powershell.exe -File scripts.	node .\mcp-server\src\hooks\<hook>.js
.hooks/codebridge-harness.json	powershell.exe -File scripts.	node .\mcp-server\src\hooks\<hook>.js
hooks/hooks.json	powershell.exe -File scripts.	node .\mcp-server\src\hooks\<hook>.js
com.github.copilot/hooks/hooks.json	powershell.exe -File scripts.	node .\mcp-server\src\hooks\<hook>.js
.copilot/hooks/hooks.json	powershell.exe -File scripts.	node .\mcp-server\src\hooks\<hook>.js
.claude/settings.json & FUTURE.claude	powershell.exe -File scripts.	node .\mcp-server\src\hooks\<hook>.js
.vscode/mcp.json	powershell.exe -File serve-harness-mcp.ps1	node ./mcp-server/src/server.js
agents/commit-context-harness.agent.md	powershell.exe -File emit-commit-context.ps1	node .\mcp-server\src\hooks\emit-commit-context.js
agents/codebridge-react-design-principle.agent.md	powershell.exe -File inject-react-design...	node .\mcp-server\src\hooks\inject-react-design...
agents/codebridge-react-developer-principle.agent.md	powershell.exe -File inject-react-dev...	node .\mcp-server\src\hooks\inject-react-dev...
agents/codebridge-react-ux-principle.agent.md	powershell.exe -File inject-react-ux...	node .\mcp-server\src\hooks\inject-react-ux...
Mirror agents in agents & agents	powershell.exe -File ...	node .\mcp-server\src\hooks\<hook>.js
2. Complete Mapping: .copilot/scripts/windows/ 
→
→ mcp-server/
Every shell script in windows has been mapped into native Node.js in mcp-server/:

Script in .copilot/scripts/windows/	Implementation in mcp-server/	Description
commit-context-changes.ps1	src/core/commit.js	Formats L1, L2, L3 changes and generates draft commit messages.
emit-changes-digraph-node.ps1	src/core/digraph.js & src/hooks/emit-changes-digraph-node.js	Formats 4-word vertex title and writes markdown nodes to changes-digraph.
emit-commit-context.ps1	src/hooks/emit-commit-context.js	SessionStart hook injecting active commit-context-harness instructions.
emit-reasoning-proof.ps1	src/hooks/emit-reasoning-proof.js	Emits proof marker 12345677 before tool use or on prompt submission.
validate-tool.ps1	src/core/security.js & src/hooks/validate-tool.js	Validates destructive commands (rm -rf, git push --force) and sensitive files (.env, prod.json).
report-tool-error.ps1	src/core/classifier.js & src/hooks/report-tool-error.js	Classifies errors (fixable, userIntervention, unknown) on PostToolUse.
inject-context-image-interpret.ps1	src/hooks/inject-context-image-interpret.js	Injects prompt instruction to delegate images/diagrams to contextImageInterpret.
inject-context-userinstructions.ps1	src/hooks/inject-context-userinstructions.js	Injects rules/user-context.instructions.md into session context.
inject-react-design-principle-context.ps1	src/hooks/inject-react-design-principle-context.js	Injects design and accessibility guidance for codebridge-react-design-principle.
inject-react-developer-principle-context.ps1	src/hooks/inject-react-developer-principle-context.js	Injects component architecture guidance for codebridge-react-developer-principle.
inject-react-ux-principle-context.ps1	src/hooks/inject-react-ux-principle-context.js	Injects navigation and feedback guidance for codebridge-react-ux-principle.
serve-harness-mcp.ps1	src/server.js	JSON-RPC MCP server over StdioServerTransport.
test.ps1	src/hooks/test.js	Outputs test token 1234.

3. Hook Visibility & Inspection Primitives (MCP Primitives)
Although "Hooks" are an agent execution environment feature and not a native wire protocol primitive in MCP (which defines Prompts, Resources, and Tools), the server exposes all active hooks through standard MCP primitives:

- Tool: `list_hooks` - Returns structured array of all registered hooks across PreToolUse, PostToolUse, SessionStart, and UserPromptSubmit with descriptions, timeouts, and commands.
- Resource: `codebridge://hooks/active` - Renderable Markdown table detailing all 11 active workspace and agent hooks.
- Resource: `codebridge://hooks/config` - Raw JSON configuration of workspace hooks from `hooks.json`.
- Prompt: `inspect_hooks` - Pre-defined audit template allowing clients and users to verify hook configurations.