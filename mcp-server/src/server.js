import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { handleErrorReport } from "./tools/errorReport.js";
import { handleCommitContextChanges } from "./tools/commitContext.js";
import { handleRunHarness } from "./tools/runHarness.js";
import { handleExecutePowershell } from "./tools/executePowershell.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../..");

const server = new McpServer({
  name: "codebridge-harness",
  version: "1.0.0",
});

server.tool(
  "run_harness",
  "Run the Codebridge React Router hook harness and return its test output.",
  {},
  async () => {
    return handleRunHarness(workspaceRoot);
  }
);

server.tool(
  "errorReport",
  "Classify a tool error as fixable, userIntervention, or unknown and provide the next action.",
  {
    toolName: z.string().optional().describe("The name of the tool that encountered the error"),
    error: z.string().describe("The raw error string or response"),
  },
  async (args) => {
    return handleErrorReport(args);
  }
);

server.tool(
  "commitContextChanges",
  "Create a draft commit message from ContextChanges data without running git commands.",
  {
    summary: z.string().optional().describe("Summary title for the commit"),
    l1: z.string().optional().describe("L1 changed files and visible behavior"),
    l2: z.string().optional().describe("L2 integration and validation impact"),
    l3: z.string().optional().describe("L3 scope, assumptions, and remaining action"),
  },
  async (args) => {
    return handleCommitContextChanges(args);
  }
);

server.tool(
  "executePowershell",
  "Execute a PowerShell command or script safely inside the MCP server process without running powershell from VS Code.",
  {
    command: z.string().optional().describe("PowerShell command string to execute"),
    scriptPath: z.string().optional().describe("Path to PowerShell script file to run"),
    args: z.array(z.string()).optional().describe("Arguments to pass to the PowerShell script"),
  },
  async (args) => {
    return handleExecutePowershell(args);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("Codebridge Harness MCP server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err.message}\n`);
  process.exit(1);
});
