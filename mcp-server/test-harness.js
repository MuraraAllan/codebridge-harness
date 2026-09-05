import { handleRunHarness } from "./src/tools/runHarness.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");

console.log("=== Testing Native Node.js Hook Harness ===");

handleRunHarness(workspaceRoot).then((res) => {
  console.log(res.content[0].text);
  if (res.isError) {
    console.error("Harness failed!");
    process.exit(1);
  } else {
    console.log("\nHarness passed successfully!");
  }
}).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
