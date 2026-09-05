import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { handleErrorReport } from "./tools/errorReport.js";
import { handleCommitContextChanges } from "./tools/commitContext.js";
import { handleRunHarness } from "./tools/runHarness.js";
import { handleExecutePowershell } from "./tools/executePowershell.js";
import { getRegisteredHooks } from "./core/hooks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../..");

const server = new McpServer({
  name: "codebridge-harness",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// 1. Discovery (server/discover)
// Modern MCP 2026-07-28 protocol discovery endpoint for capability and version negotiation
// ---------------------------------------------------------------------------
const DiscoverRequestSchema = z.object({
  method: z.literal("server/discover"),
  params: z
    .object({
      _meta: z.record(z.unknown()).optional(),
    })
    .optional(),
});

server.server.setRequestHandler(DiscoverRequestSchema, async () => {
  return {
    resultType: "complete",
    supportedVersions: ["2026-07-28", "2025-11-25", "2025-03-26", "2024-11-05"],
    capabilities: {
      tools: { listChanged: true },
      resources: { listChanged: true, subscribe: false },
      prompts: { listChanged: true },
    },
    _meta: {
      "io.modelcontextprotocol/serverInfo": {
        name: "codebridge-harness",
        version: "1.0.0",
      },
    },
    instructions:
      "Codebridge React Router harness server providing error classification, commit context changes, hook lifecycle auditing (PreToolUse, PostToolUse, SessionStart, UserPromptSubmit), and harness test execution.",
    ttlMs: 3600000,
    cacheScope: "public",
  };
});

// ---------------------------------------------------------------------------
// 2. Tools (tools/list & tools/call)
// Registered with titles, descriptions, and strict input/output schemas
// ---------------------------------------------------------------------------
server.registerTool(
  "run_harness",
  {
    title: "Run Hook Test Harness",
    description: "Run the Codebridge React Router hook harness and return its test output.",
    inputSchema: z.object({}).optional(),
    outputSchema: z.object({
      passedCount: z.number(),
      failedCount: z.number(),
      output: z.string(),
    }),
  },
  async () => {
    return handleRunHarness(workspaceRoot);
  }
);

server.registerTool(
  "errorReport",
  {
    title: "Classify Tool Error",
    description:
      "Classify a tool error as fixable, userIntervention, or unknown and provide the next action.",
    inputSchema: z.object({
      toolName: z.string().optional().describe("The name of the tool that encountered the error"),
      error: z.string().describe("The raw error string or response"),
    }),
    outputSchema: z.object({
      category: z.enum(["fixable", "userIntervention", "unknown"]),
      toolName: z.string(),
      error: z.string(),
      nextAction: z.string(),
    }),
  },
  async (args) => {
    return handleErrorReport(args);
  }
);

server.registerTool(
  "commitContextChanges",
  {
    title: "Format Context Changes & Commit",
    description:
      "Create a draft commit message from ContextChanges data without running git commands.",
    inputSchema: z.object({
      summary: z.string().optional().describe("Summary title for the commit"),
      l1: z.string().optional().describe("L1 changed files and visible behavior"),
      l2: z.string().optional().describe("L2 integration and validation impact"),
      l3: z.string().optional().describe("L3 scope, assumptions, and remaining action"),
    }),
    outputSchema: z.object({
      summary: z.string(),
      body: z.string(),
      commitMessage: z.string(),
    }),
  },
  async (args) => {
    return handleCommitContextChanges(args);
  }
);

server.registerTool(
  "executePowershell",
  {
    title: "Execute PowerShell (Sandboxed MCP)",
    description:
      "Execute a PowerShell command or script safely inside the MCP server process without running powershell from VS Code.",
    inputSchema: z.object({
      command: z.string().optional().describe("PowerShell command string to execute"),
      scriptPath: z.string().optional().describe("Path to PowerShell script file to run"),
      args: z.array(z.string()).optional().describe("Arguments to pass to the PowerShell script"),
    }),
    outputSchema: z.object({
      exitCode: z.number(),
      output: z.string(),
      stderr: z.string().optional(),
    }),
  },
  async (args) => {
    return handleExecutePowershell(args);
  }
);

server.registerTool(
  "list_hooks",
  {
    title: "List Registered Lifecycle Hooks",
    description:
      "Query and list all active workspace and agent hooks across PreToolUse, PostToolUse, SessionStart, and UserPromptSubmit lifecycle events.",
    inputSchema: z.object({
      event: z
        .enum(["PreToolUse", "SessionStart", "UserPromptSubmit", "PostToolUse"])
        .optional()
        .describe("Optional lifecycle event to filter hooks by"),
    }),
    outputSchema: z.object({
      count: z.number(),
      hooks: z.array(
        z.object({
          event: z.string(),
          name: z.string(),
          command: z.string(),
          timeout: z.number().optional(),
          injectAsContext: z.boolean().optional(),
          description: z.string(),
        })
      ),
    }),
  },
  async (args) => {
    const hooks = getRegisteredHooks(workspaceRoot, args?.event);
    const textLines = hooks.map(
      (h) => `[${h.event}] ${h.name} (timeout: ${h.timeout}s): ${h.description}`
    );
    return {
      content: [
        {
          type: "text",
          text: `Found ${hooks.length} registered hook(s):\n` + textLines.join("\n"),
        },
      ],
      structuredContent: {
        count: hooks.length,
        hooks,
      },
      isError: false,
    };
  }
);

// ---------------------------------------------------------------------------
// 3. Prompts (prompts/list & prompts/get)
// Pre-defined interactive templates for user-initiated workflows
// ---------------------------------------------------------------------------
server.registerPrompt(
  "review_context_changes",
  {
    title: "Review Context Changes",
    description: "Review current turn modifications and formulate L1, L2, and L3 ContextChanges.",
    argsSchema: {
      changesDescription: z
        .string()
        .optional()
        .describe("Brief description of recent modifications or goals"),
    },
  },
  async (args) => {
    return {
      description: "Review and draft ContextChanges for recent workspace activity",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review recent workspace activity (${args.changesDescription || "current turn"}) and generate L1 (changed files and behavior), L2 (integration and validation impact), and L3 (scope, assumptions, remaining actions) ContextChanges.`,
          },
        },
      ],
    };
  }
);

server.registerPrompt(
  "run_harness_check",
  {
    title: "Run Harness Check",
    description: "Execute the agent hook harness suite and summarize pass/fail decisions.",
  },
  async () => {
    return {
      description: "Execute and analyze the Codebridge test harness",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Execute the Codebridge React Router harness test suite via codebridge-harness/run_harness and summarize any failing tests.",
          },
        },
      ],
    };
  }
);

server.registerPrompt(
  "inspect_hooks",
  {
    title: "Inspect and Audit Lifecycle Hooks",
    description: "Audit all active workspace hooks, verifying events, handlers, and safety policies.",
  },
  async () => {
    return {
      description: "Audit active hooks and safety policies",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "List and inspect all registered lifecycle hooks via codebridge-harness/list_hooks and verify that PreToolUse, PostToolUse, SessionStart, and UserPromptSubmit handlers are functioning as expected.",
          },
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// 4. Resources (resources/list & resources/read)
// Expose workspace instructions and latest digraph vertex as structured context
// ---------------------------------------------------------------------------
server.registerResource(
  "hooks_registry",
  "codebridge://hooks/active",
  {
    title: "Active Hook Registry",
    description: "Detailed inventory of all registered workspace and agent lifecycle hooks.",
    mimeType: "text/markdown",
  },
  async () => {
    const hooks = getRegisteredHooks(workspaceRoot);
    const md = [
      "# Codebridge Active Hook Registry",
      "",
      `Total registered hooks: ${hooks.length}`,
      "",
      "| Lifecycle Event | Hook Name | Command | Timeout | Description |",
      "| :--- | :--- | :--- | :--- | :--- |",
      ...hooks.map(
        (h) =>
          `| \`${h.event}\` | \`${h.name}\` | \`${h.command}\` | ${h.timeout}s | ${h.description} |`
      ),
    ].join("\n");

    return {
      contents: [
        {
          uri: "codebridge://hooks/active",
          mimeType: "text/markdown",
          text: md,
        },
      ],
    };
  }
);

server.registerResource(
  "hooks_config",
  "codebridge://hooks/config",
  {
    title: "Workspace Hooks Configuration",
    description: "Raw JSON configuration of workspace hooks from hooks.json.",
    mimeType: "application/json",
  },
  async () => {
    const hooksFile = path.join(workspaceRoot, "hooks.json");
    const jsonText = fs.existsSync(hooksFile) ? fs.readFileSync(hooksFile, "utf8") : "{}";
    return {
      contents: [
        {
          uri: "codebridge://hooks/config",
          mimeType: "application/json",
          text: jsonText,
        },
      ],
    };
  }
);
server.registerResource(
  "user_context_instructions",
  "codebridge://rules/user-context",
  {
    title: "User Context Instructions",
    description: "Workspace-level guidance for reporting task progress and contextual changes.",
    mimeType: "text/markdown",
  },
  async () => {
    const filePath = path.join(workspaceRoot, "rules", "user-context.instructions.md");
    const text = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    return {
      contents: [
        {
          uri: "codebridge://rules/user-context",
          mimeType: "text/markdown",
          text,
        },
      ],
    };
  }
);

server.registerResource(
  "latest_digraph_node",
  "codebridge://changes-digraph/latest",
  {
    title: "Latest Changes-Digraph Node",
    description: "Most recently generated WIP vertex in changes-digraph/.",
    mimeType: "text/markdown",
  },
  async () => {
    const digraphDir = path.join(workspaceRoot, "changes-digraph");
    let latestText = "(no digraph nodes found)";
    let latestFile = "";

    if (fs.existsSync(digraphDir)) {
      const files = fs
        .readdirSync(digraphDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => ({
          file: f,
          mtime: fs.statSync(path.join(digraphDir, f)).mtimeMs,
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (files.length > 0) {
        latestFile = files[0].file;
        latestText = fs.readFileSync(path.join(digraphDir, latestFile), "utf8");
      }
    }

    return {
      contents: [
        {
          uri: "codebridge://changes-digraph/latest",
          mimeType: "text/markdown",
          text: latestText,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("Codebridge Harness MCP server running on stdio\n");
}

export { server, main };

const isMainModule =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMainModule) {
  main().catch((err) => {
    process.stderr.write(`Fatal error: ${err.message}\n`);
    process.exit(1);
  });
}
