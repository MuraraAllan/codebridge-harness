import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "codebridge-harness",
  version: "1.0.0",
});

server.tool(
  "run_harness",
  "Run the Codebridge React Router hook harness and return its test output.",
  {},
  async () => ({ content: [{ type: "text", text: "ok" }] })
);

server.tool(
  "errorReport",
  "Classify a tool error as fixable, userIntervention, or unknown and provide the next action.",
  {
    toolName: z.string().optional().describe("The name of the tool that encountered the error"),
    error: z.string().describe("The raw error string or response"),
  },
  async () => ({ content: [{ type: "text", text: "ok" }] })
);

// Check internal registered tools
const registered = Object.keys(server._registeredTools || {});
console.log("Registered tools count:", registered.length);
console.log("Registered tools names:", registered);
