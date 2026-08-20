# Codebridge React Router Harness

This workspace validates a VS Code agent-hook composition and exposes it through a local MCP server.

## Harness Architecture

### Meta Reasoning Trajectory

Theoretical under-the-hood reasoning flow, agent delegation hierarchy, and hook execution lifecycle:

```mermaid
flowchart TD
    subgraph ClientHooks [Under-the-Hood Lifecycle Hooks]
        SS["SessionStart Hook<br/>(emit-commit-context.ps1)"]
        UPS["UserPromptSubmit Hook<br/>(inject-context-image-interpret.ps1 & inject-context-userinstructions.ps1)"]
        PTU["PreToolUse Hook<br/>(validate-tool.ps1 -> allow / ask / deny)"]
        POST["PostToolUse Hook<br/>(report-tool-error.ps1 & emit-changes-digraph-node.ps1)"]
    end

    subgraph Orchestration [Meta Reasoning & Agent Composition]
        U[User Request / Context] --> UPS
        UPS --> A["codebridge-react-router-harness<br/>(Primary Entrypoint & MetaOrchestrator)"]
        SS -.->|Inject Context| A
        
        A -->|deflush / docReadPlan| RP["recursive-processor<br/>(deflusherDocRead)"]
        RP -->|if >4 tasks| RP
        RP -->|visual assets| CII["contextImageInterpret<br/>(Quadrant JSON Analysis)"]
        A -->|visual assets| CII

        A -->|React Router coordination| RRH["react-router-harness<br/>(Coordinator)"]
        A -->|harness worker| CBH["codebridge-harness<br/>(Worker & MCP)"]
        A -->|git context & changes-digraph| CCH["commit-context-harness<br/>(Commit Drafter)"]
        A -->|React principles| RP_Group[React Principle Specialists]
        
        RP_Group --> D["codebridge-react-design-principle<br/>(Design & Accessibility)"]
        RP_Group --> V["codebridge-react-developer-principle<br/>(Architecture & State)"]
        RP_Group --> UX["codebridge-react-ux-principle<br/>(Interaction & UX)"]
        
        RRH --> CBH
        RRH --> RP_Group
        RRH --> CCH
        RRH --> RP
        RRH --> CII
    end

    subgraph ToolingAndStorage [Tools, MCP & Storage]
        CBH --> MCP["codebridge-harness MCP<br/>(serve-harness-mcp.ps1)"]
        MCP --> HarnessTools["run_harness / errorReport / commitContextChanges"]
        PTU -.->|Gate Tool Calls| MCP
        POST -.->|Post-execution Analysis| MCP
        
        CCH --> GL["git log -X reader"]
        CCH --> CD["changes-digraph/<br/>(Node: Vertice:WIP)"]
    end
```

### File System Trajectory

Physical repository layout, plugin manifests, extension namespaces, and multi-ecosystem import surfaces:

```mermaid
flowchart TB
    subgraph RootManifests [Root & Canonical Plugin Surface]
        AP_JSON["plugin.json<br/>(Agent Plugins 1.0 Manifest)"]
        MCP_JSON["mcp.json<br/>(Portable MCP Configuration)"]
        HOOKS_ROOT["hooks.json & hooks/hooks.json<br/>(Canonical Hook Bindings)"]
        AGENTS_MD["AGENTS.md & rules/<br/>(Workspace Agent Rules)"]
    end

    subgraph CopilotNamespace [com.github.copilot/ - Copilot Extension]
        CP_AGENTS["com.github.copilot/agents/<br/>(9 Canonical Agent Definitions)"]
        CP_HOOKS["com.github.copilot/hooks/hooks.json<br/>(PLUGIN_ROOT Hooks)"]
        CP_RULES["com.github.copilot/rules/<br/>(Instructions & User Context)"]
    end

    subgraph ClaudeNamespace [.claude/ & .claude-plugin/ - Claude Compatibility]
        CL_PLUGIN[".claude-plugin/plugin.json<br/>(Claude Plugin Manifest)"]
        CL_MCP[".mcp.json<br/>(CLAUDE_PLUGIN_ROOT MCP Config)"]
        CL_CONF[".claude/settings.json & CLAUDE.md"]
        CL_AGENTS[".claude/agents/<br/>(Claude-format Agents)"]
    end

    subgraph CodexNamespace [.codex-plugin/ - Codex & ChatGPT Compatibility]
        CDX_PLUGIN[".codex-plugin/plugin.json<br/>(Codex Manifest with PLUGIN_ROOT)"]
    end

    subgraph LegacyNamespace [.plugin/ - Legacy OpenPlugin]
        LEG_PLUGIN[".plugin/plugin.json<br/>(Legacy Adapter)"]
    end

    subgraph ImplementationAssets [Execution Scripts, Skills & Validation]
        SCRIPTS["scripts/windows/<br/>(PowerShell Hooks & MCP Server)"]
        SKILLS["skills/ & .agents/skills/<br/>(Portable & Project Skills)"]
        TESTS["tests/<br/>(run-harness.ps1 & validate-customizations.ps1)"]
        DIGRAPH["changes-digraph/<br/>(ContextChanges Digraph WIP Nodes)"]
    end

    AP_JSON --> CopilotNamespace
    AP_JSON --> SKILLS
    AP_JSON --> MCP_JSON
    MCP_JSON --> SCRIPTS
    HOOKS_ROOT --> SCRIPTS
    
    CopilotNamespace --> SCRIPTS
    ClaudeNamespace --> SCRIPTS
    CodexNamespace --> SKILLS
    CodexNamespace --> SCRIPTS
    LegacyNamespace --> SCRIPTS
    
    TESTS --> SCRIPTS
    TESTS --> HOOKS_ROOT
    CP_AGENTS -.->|Mirror| RootAgents["agents/ (Root Agent Definitions)"]
```

## Composition

`codebridge-react-router-harness` is the entry agent. It can delegate integration work to `react-router-harness`, harness implementation to `codebridge-harness`, and focused analysis to the three principle agents:

- `codebridge-react-design-principle` for design, accessibility, responsiveness, and performance.
- `codebridge-react-developer-principle` for component architecture, composition, specialization, state, and abstractions.
- `codebridge-react-ux-principle` for navigation, feedback, attention, and journeys.
- `commit-context-harness` for drafting commit messages from ContextChanges data without invoking git.
- `contextImageInterpret` for structured visual analysis (quadrants, object inventory, color temperature, 4-line description) whenever pictures or diagrams are provided.

`recursive-processor` acts as the `deflusherDocRead` pre-processor: before broad source reads, repository scans, or web searches, it converts the user message into taskList, intention, contextualDescription, and a minimal docReadPlan. It still splits work recursively when there are more than four comparable, independent items. Nested subagent invocation is enabled through `.vscode/settings.json`.

The `SessionStart` hook injects this routing orientation into every session. The hook harness verifies that injection together with the pre-tool permission decisions and post-tool error-report context.

## Generic Plugin Import

The repository is now shaped around a single canonical Agent Plugins 1.0 package:

- `.codex-plugin/plugin.json` is the Codex and ChatGPT plugin manifest.
- `plugin.json` is the portable root manifest for clients that support Agent Plugins 1.0.
- `mcp.json` is the portable MCP server definition for the shared `codebridge-harness` server.
- `skills/` contains portable skill packages discovered by compatible clients.
- `com.github.copilot/` contains VS Code and Copilot-specific agents, hooks, and rules.
- `.claude-plugin/plugin.json`, `.mcp.json`, and `hooks/hooks.json` provide Claude and legacy compatibility adapters that point back to the same scripts and MCP server.
- `.plugin/plugin.json` is retained as a legacy OpenPlugin-style adapter.

The package should be imported from the repository root. Workspace-only files such as `.vscode/mcp.json`, `.claude/settings.json`, `rules/`, `agents/`, and `.hooks/` remain useful while developing this repo locally, but the root plugin files are the import surface.

For Codex, the required entrypoint is `.codex-plugin/plugin.json`. The manifest points to the shared `skills/` folder and declares the `codebridge-harness` MCP server with `PLUGIN_ROOT`, so the installed plugin can start the same PowerShell server from its cache path. The default Codex hook path is `hooks/hooks.json`, which remains present at the plugin root.

A Git-backed marketplace entry can point directly at this repository root:

```json
{
  "name": "codebridge-react-router-harness",
  "source": {
    "source": "url",
    "url": "https://github.com/muraraallan/codebdrige-react-router-harness.git",
    "ref": "main"
  },
  "policy": {
    "installation": "AVAILABLE",
    "authentication": "ON_INSTALL"
  },
  "category": "Productivity"
}
```

## Validation

Run the hook behavior suite:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\run-harness.ps1
```

Validate the complete customization composition and MCP contract:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tests\validate-customizations.ps1
```

## Recent Changes

1. **Synchronized agent composition parity & dual trajectory diagrams**
   - **L1**: Updated [README.md](README.md) with two comprehensive diagrams: `Meta Reasoning Trajectory` (theoretical/hook lifecycle & metaOrchestrator FeedForward) and `File System Trajectory` (physical repository layout across Copilot, Claude, Codex, and legacy namespaces).
   - **L2**: Aligned [com.github.copilot/agents/codebridge-react-router-harness.agent.md](com.github.copilot/agents/codebridge-react-router-harness.agent.md) with [agents/codebridge-react-router-harness.agent.md](agents/codebridge-react-router-harness.agent.md) and aligned [hooks.json](hooks.json) / [com.github.copilot/hooks/hooks.json](com.github.copilot/hooks/hooks.json) to use `PLUGIN_ROOT`.
   - **L3**: Validated test harness and customization tests with 100% pass rate.

2. **extend codex plugin** (`3677cb57`)
   - Extended Codex plugin manifest and setup integration.

2. **Extended recursive agent into deflusherDocRead pre-processor** (`bb0f68db`)
   - **L1**: Updated [agents/recursive-processor.agent.md](agents/recursive-processor.agent.md) and [com.github.copilot/agents/recursive-processor.agent.md](com.github.copilot/agents/recursive-processor.agent.md) to produce a FeedForward packet: `taskList`, `intention`, `contextualDescription`, `docReadPlan`, and `processingMode`.
   - **L2**: Updated [tests/validate-customizations.ps1](tests/validate-customizations.ps1) so validation requires the `deflusherDocRead` contract.
   - **L3**: Documented pre-processor behavior.

3. **Implemented first pass toward generic plugin import** (`1a699dad`)
   - **L1**: Added canonical Agent Plugins files: [plugin.json](plugin.json) and [mcp.json](mcp.json). Added Claude/legacy adapters in [.claude-plugin/plugin.json](.claude-plugin/plugin.json), [.mcp.json](.mcp.json), [hooks/hooks.json](hooks/hooks.json), and [.plugin/plugin.json](.plugin/plugin.json).
   - **L2**: Added VS Code/Copilot namespace files under [com.github.copilot](com.github.copilot), updated [.vscode/settings.json](.vscode/settings.json) for moved `.hooks/`, and updated [tests/validate-customizations.ps1](tests/validate-customizations.ps1).
   - **L3**: Maintained repo-root canonical surface with multi-ecosystem compatibility.

4. **try to organize** (`3fcb8f1d`)
   - Initial organization pass for workspace scripts and repository layout.
