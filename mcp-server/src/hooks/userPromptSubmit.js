import { readStdin } from "../core/stdin.js";

async function run() {
  const rawInput = await readStdin(1000);
  let hookEventName = "UserPromptSubmit";

  if (rawInput && rawInput.trim()) {
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.hook_event_name) hookEventName = parsed.hook_event_name;
    } catch {
      // Ignore parse errors
    }
  }

  const marker = "12345677";
  const imageContext =
    "Image/Picture Interpretation context: When user input contains images or visual assets, contextImageInterpret must be invoked to deflush image content into structured JSON (quadrant, object, objectDescription, colorTemperature, objectList, fourLinesDescription).";

  const output = {
    hookSpecificOutput: {
      hookEventName,
      proofMarker: marker,
      additionalContext: `Reasoning proof marker ${marker} emitted on prompt submission. ${imageContext}`,
    },
    systemMessage: `Reasoning proof marker: ${marker}`,
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in userPromptSubmit hook: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
