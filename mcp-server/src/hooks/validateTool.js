import { readStdin } from "../core/stdin.js";
import { validatePreToolUse } from "../core/security.js";

async function run() {
  const rawInput = await readStdin(1000);
  let toolName = "";
  let toolArgs = {};

  if (rawInput && rawInput.trim()) {
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.tool_name) toolName = parsed.tool_name;
      if (parsed.tool_input) toolArgs = parsed.tool_input;
    } catch {
      // Ignore parse errors
    }
  }

  const decision = validatePreToolUse(toolName, toolArgs);

  const output = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: decision.permissionDecision,
    },
  };

  if (decision.permissionDecisionReason) {
    output.hookSpecificOutput.permissionDecisionReason = decision.permissionDecisionReason;
  }

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in validateTool: ${err.message}\n`);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
    },
  }) + "\n");
});
