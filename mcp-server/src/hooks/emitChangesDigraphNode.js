import path from "node:path";
import { fileURLToPath } from "node:url";
import { readStdin } from "../core/stdin.js";
import { writeDigraphNode } from "../core/digraph.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../../..");

async function run() {
  const rawInput = await readStdin(1000);
  let hookEventName = "PostToolUse";
  let toolName = "";
  let toolInput = null;
  let toolResponse = "";

  if (rawInput && rawInput.trim()) {
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.hook_event_name) hookEventName = parsed.hook_event_name;
      if (parsed.tool_name) toolName = parsed.tool_name;
      if (parsed.tool_input) toolInput = parsed.tool_input;
      if (parsed.tool_response) toolResponse = String(parsed.tool_response);
    } catch {
      // Ignore parse errors
    }
  }

  if (hookEventName !== "PostToolUse") {
    process.stdout.write(JSON.stringify({ continue: true }) + "\n");
    return;
  }

  const digraphResult = writeDigraphNode({
    workspaceRoot,
    toolName: toolName || "workspace change",
    toolInput,
    toolResponse,
    hookEventName,
  });

  const output = {
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `commit-context-harness recorded changes-digraph node '${digraphResult.title}' at ${digraphResult.nodePath} with post reasoning proof marker ${digraphResult.proofMarker}.`,
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in emitChangesDigraphNode: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
