import { readStdin } from "../core/stdin.js";
import { getErrorCategory } from "../core/classifier.js";

async function run() {
  const rawInput = await readStdin(1000);

  if (!rawInput || !rawInput.trim()) {
    process.stdout.write(JSON.stringify({ continue: true }) + "\n");
    return;
  }

  let toolName = "";
  let toolResponse = "";

  try {
    const parsed = JSON.parse(rawInput);
    if (parsed.tool_name) toolName = parsed.tool_name;
    if (parsed.tool_response) toolResponse = String(parsed.tool_response);
  } catch {
    // Ignore parse errors
  }

  if (
    !toolResponse ||
    !/(?:error|failed|failure|exception|denied|cannot|unable|not found|invalid)/i.test(
      toolResponse
    )
  ) {
    process.stdout.write(JSON.stringify({ continue: true }) + "\n");
    return;
  }

  const category = getErrorCategory(toolResponse);

  const output = {
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `A ${category} tool error occurred in '${toolName}'. Call codebridge-harness/errorReport with toolName '${toolName}' and the exact tool_response, then print the resulting category, error, and next action for the user.`,
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in reportToolError: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
