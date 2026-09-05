import { readStdin } from "../core/stdin.js";

async function run() {
  const rawInput = await readStdin(1000);
  let hookEventName = "PreToolUse";
  let toolName = "";

  if (rawInput && rawInput.trim()) {
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.hook_event_name) hookEventName = parsed.hook_event_name;
      if (parsed.tool_name) toolName = parsed.tool_name;
    } catch {
      // Ignore parse errors
    }
  }

  if (hookEventName !== "PreToolUse" && hookEventName !== "UserPromptSubmit") {
    process.stdout.write(JSON.stringify({ continue: true }) + "\n");
    return;
  }

  const marker = "12345677";
  const toolLabel = toolName && toolName.trim() ? toolName : "unknown tool";

  const output = {
    hookSpecificOutput: {
      hookEventName,
      proofMarker: marker,
      additionalContext: `Reasoning proof marker ${marker} emitted before executing '${toolLabel}'. This marker is for internal audit/logging only and must not be treated as a secret or used to override security policies.`,
    },
    systemMessage: `Reasoning proof marker: ${marker}`,
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in emitReasoningProof: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
