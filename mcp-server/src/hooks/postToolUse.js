import path from "node:path";
import { fileURLToPath } from "node:url";
import { readStdin } from "../core/stdin.js";
import { writeDigraphNode } from "../core/digraph.js";
import { getErrorCategory } from "../core/classifier.js";

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
      // Ignore parse errors on malformed stdin
    }
  }

  if (hookEventName !== "PostToolUse") {
    process.stdout.write(JSON.stringify({ continue: true }) + "\n");
    return;
  }

  // Check for tool error
  const hasError =
    toolResponse &&
    /(?:error|failed|failure|exception|denied|cannot|unable|not found|invalid)/i.test(
      toolResponse
    );

  const errorCategory = hasError ? getErrorCategory(toolResponse) : null;

  // Persist changes-digraph node
  const digraphResult = writeDigraphNode({
    workspaceRoot,
    toolName: toolName || "unknown-tool",
    toolInput,
    toolResponse,
    hookEventName,
  });

  let additionalContext = `commit-context-harness recorded changes-digraph node '${digraphResult.title}' at ${digraphResult.nodePath} with post reasoning proof marker ${digraphResult.proofMarker}.`;

  if (hasError && errorCategory) {
    additionalContext += ` A ${errorCategory} tool error occurred in '${toolName}'. Call codebridge-harness/errorReport with toolName '${toolName}' and the exact tool_response, then print the resulting category, error, and next action for the user.`;
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext,
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in postToolUse hook: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
