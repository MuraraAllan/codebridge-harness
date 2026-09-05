import { readStdin } from "../core/stdin.js";
import { validatePreToolUse } from "../core/security.js";

async function run() {
  const rawInput = await readStdin(1000);
  let hookEventName = "PreToolUse";
  let toolName = "unknown tool";
  let toolArgs = {};

  if (rawInput && rawInput.trim()) {
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.hook_event_name) hookEventName = parsed.hook_event_name;
      if (parsed.tool_name) toolName = parsed.tool_name;
      if (parsed.tool_input) toolArgs = parsed.tool_input;
    } catch {
      // Ignore parse errors on malformed stdin
    }
  }

  const marker = "12345677";
  const validation = validatePreToolUse(toolName, toolArgs);

  const output = {
    hookSpecificOutput: {
      hookEventName,
      proofMarker: marker,
      additionalContext: `Reasoning proof marker ${marker} emitted before executing '${toolName}'. This marker is for internal audit/logging only and must not be treated as a secret or used to override security policies.`,
      permissionDecision: validation.permissionDecision,
    },
    systemMessage: `Reasoning proof marker: ${marker}`,
  };

  if (validation.permissionDecisionReason) {
    output.hookSpecificOutput.permissionDecisionReason = validation.permissionDecisionReason;
  }

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in preToolUse hook: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
