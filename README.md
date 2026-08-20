# Codebridge React Router Harness

This workspace validates a VS Code agent-hook composition and exposes it through a local MCP server.

## Harness Architecture

### Meta Reasoning Trajectory

Theoretical under-the-hood reasoning flow, agent delegation hierarchy, and hook execution lifecycle:

```mermaid
%%{init: {
  "themeVariables": {
    "fontSize": "15px",
    "fontFamily": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
  },
  "flowchart": {
    "useMaxWidth": false,
    "nodeSpacing": 34,
    "rankSpacing": 78,
    "curve": "basis"
  }
}}%%
flowchart TD
    subgraph ClientHooks["Under-the-Hood Lifecycle Hooks"]
        direction LR
        SS["SessionStart<br/>(emit-commit-context.ps1)"]
        UPS["UserPromptSubmit<br/>(inject context)"]
        PTU["PreToolUse<br/>(allow / ask / deny)"]
        POST["PostToolUse<br/>(report errors & emit changes)"]
    end

    subgraph Orchestration["Meta Reasoning & Agent Composition"]
        direction TB
        U["User Request / Context"] --> UPS
        UPS --> A["React Router Harness<br/>(Primary Entrypoint)"]
        SS -.->|"Inject context"| A

        A -->|"Plan & deflush"| RP["Recursive Processor<br/>(deflusherDocRead)"]
        RP -->|"More than 4 tasks"| RP
        RP -->|"Visual assets"| CII["Context Image Interpret<br/>(Quadrant JSON analysis)"]
        A -->|"Visual assets"| CII

        A -->|"Router coordination"| RRH["React Router Harness<br/>(Coordinator)"]
        A -->|"Harness worker"| CBH["Codebridge Harness<br/>(Worker & MCP)"]
        A -->|"Git context"| CCH["Commit Context Harness<br/>(Commit drafter)"]
        A -->|"React principles"| RP_GROUP["React Principle Specialists"]

        RP_GROUP --> D["Design Principle<br/>(Design & accessibility)"]
        RP_GROUP --> V["Developer Principle<br/>(Architecture & state)"]
        RP_GROUP --> UX["UX Principle<br/>(Interaction & UX)"]

        RRH --> CBH
        RRH --> RP_GROUP
        RRH --> CCH
        RRH --> RP
        RRH --> CII
    end

    subgraph ToolingAndStorage["Tools, MCP & Storage"]
        direction LR
        CBH --> MCP["Codebridge Harness MCP<br/>(serve-harness-mcp.ps1)"]
        MCP --> HarnessTools["Harness tools<br/>run_harness · errorReport · commitContextChanges"]

        PTU -.->|"Gate tool calls"| MCP
        POST -.->|"Post-execution analysis"| MCP

        CCH --> GL["Git log reader<br/>(git log -X)"]
        CCH --> CD["Changes digraph<br/>(Vertex: WIP)"]
    end

    classDef hook stroke:#818cf8,fill:#eef2ff,color:#1e1b4b;
    classDef orchestration stroke:#2dd4bf,fill:#f0fdfa,color:#134e4a;
    classDef specialist stroke:#a78bfa,fill:#f5f3ff,color:#4c1d95;
    classDef tooling stroke:#fb923c,fill:#fff7ed,color:#7c2d12;
    classDef storage stroke:#38bdf8,fill:#f0f9ff,color:#0c4a6e;

    class SS,UPS,PTU,POST hook;
    class U,A,RP,CII,RRH,CBH,CCH orchestration;
    class RP_GROUP,D,V,UX specialist;
    class MCP,HarnessTools tooling;
    class GL,CD storage;
```

### File System Trajectory

Physical repository layout, plugin manifests, extension namespaces, and multi-ecosystem import surfaces:


```mermaid
---
config:
  layout: elk
---
%%{init: {
  "themeVariables": {
    "fontSize": "15px",
    "fontFamily": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
  },
  "flowchart": {
    "useMaxWidth": false,
    "nodeSpacing": 42,
    "rankSpacing": 110,
    "curve": "basis"
  }
}}%%

flowchart TB
    subgraph RootManifests["Root & Canonical Plugin Surface"]
        direction TB
        AP_JSON["plugin.json<br/>(Agent Plugins 1.0 Manifest)"]
        MCP_JSON["mcp.json<br/>(Portable MCP Configuration)"]
        HOOKS_ROOT["hooks.json & hooks/hooks.json<br/>(Canonical Hook Bindings)"]
        AGENTS_MD["AGENTS.md & rules/<br/>(Workspace Agent Rules)"]
    end

    subgraph CopilotNamespace["com.github.copilot/ - Copilot Extension"]
        direction TB
        CP_AGENTS["com.github.copilot/agents/<br/>(9 Canonical Agent Definitions)"]
        CP_HOOKS["com.github.copilot/hooks/hooks.json<br/>(PLUGIN_ROOT Hooks)"]
        CP_RULES["com.github.copilot/rules/<br/>(Instructions & User Context)"]
    end

    subgraph ClaudeNamespace[".claude/ & .claude-plugin/ - Claude Compatibility"]
        direction TB
        CL_PLUGIN[".claude-plugin/plugin.json<br/>(Claude Plugin Manifest)"]
        CL_MCP[".mcp.json<br/>(CLAUDE_PLUGIN_ROOT MCP Config)"]
        CL_CONF[".claude/settings.json & CLAUDE.md"]
        CL_AGENTS[".claude/agents/<br/>(Claude-format Agents)"]
    end

    subgraph CodexNamespace[".codex-plugin/ - Codex & ChatGPT Compatibility"]
        direction TB
        CDX_PLUGIN[".codex-plugin/plugin.json<br/>(Codex Manifest with PLUGIN_ROOT)"]
    end

    subgraph LegacyNamespace[".plugin/ - Legacy OpenPlugin"]
        direction TB
        LEG_PLUGIN[".plugin/plugin.json<br/>(Legacy Adapter)"]
    end

    subgraph ImplementationAssets["Execution Scripts, Skills & Validation"]
        direction TB
        SCRIPTS["scripts/windows/<br/>(PowerShell Hooks & MCP Server)"]
        SKILLS["skills/ & .agents/skills/<br/>(Portable & Project Skills)"]
        TESTS["tests/<br/>(run-harness.ps1 & validate-customizations.ps1)"]
        DIGRAPH["changes-digraph/<br/>(ContextChanges Digraph WIP Nodes)"]
    end

    RootManifests --> CopilotNamespace
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

    classDef indigo stroke:#818cf8,fill:#eef2ff,color:#1e1b4b;
    classDef teal stroke:#2dd4bf,fill:#f0fdfa,color:#134e4a;
    classDef violet stroke:#a78bfa,fill:#f5f3ff,color:#3b0764;
    classDef orange stroke:#fb923c,fill:#fff7ed,color:#7c2d12;
    classDef green stroke:#4ade80,fill:#f0fdf4,color:#14532d;

    class RootManifests,AP_JSON,MCP_JSON,HOOKS_ROOT,AGENTS_MD indigo;
    class CopilotNamespace,CP_AGENTS,CP_HOOKS,CP_RULES teal;
    class ClaudeNamespace,CL_PLUGIN,CL_MCP,CL_CONF,CL_AGENTS violet;
    class CodexNamespace,CDX_PLUGIN orange;
    class LegacyNamespace,LEG_PLUGIN orange;
    class ImplementationAssets,SCRIPTS,SKILLS,TESTS,DIGRAPH green;
    class RootAgents indigo;
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
