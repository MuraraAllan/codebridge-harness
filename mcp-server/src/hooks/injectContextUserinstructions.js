import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../../..");

async function run() {
  const userInstructionsPath = path.join(workspaceRoot, "rules", "user-context.instructions.md");
  let userInstructions = "";

  if (fs.existsSync(userInstructionsPath)) {
    userInstructions = fs.readFileSync(userInstructionsPath, "utf8");
  }

  const output = {
    hookSpecificOutput: {
      source: "user-context.instructions.md",
      path: userInstructionsPath,
      content: userInstructions,
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in injectContextUserinstructions: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
