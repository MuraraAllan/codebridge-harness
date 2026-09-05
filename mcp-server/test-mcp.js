import { handleErrorReport } from "./src/tools/errorReport.js";
import { handleCommitContextChanges } from "./src/tools/commitContext.js";
import { validatePreToolUse } from "./src/core/security.js";
import { classifyErrorReport } from "./src/core/classifier.js";
import { formatCommitContext } from "./src/core/commit.js";
import { generateDigraphTitle } from "./src/core/digraph.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

console.log("=== Testing Codebridge MCP Server Core & Tools ===");

// 1. Error report tool
const err1 = handleErrorReport({
  error: "Error: Access denied to repository path",
  toolName: "runTerminalCommand",
});
const err1Data = JSON.parse(err1.content[0].text);
assert(err1Data.category === "userIntervention", "errorReport identifies access denied as userIntervention");
assert(err1Data.toolName === "runTerminalCommand", "errorReport preserves toolName");

const err2 = handleErrorReport({
  error: "Cannot find module 'foo.js'",
  toolName: "edit_file",
});
const err2Data = JSON.parse(err2.content[0].text);
assert(err2Data.category === "fixable", "errorReport identifies missing file as fixable");

// 2. Commit context changes tool
const commit1 = handleCommitContextChanges({
  summary: "feat: new mcp server",
  l1: "Added mcp server in nodejs",
  l2: "Integrated with stdio transport",
  l3: "No git invocation needed",
});
const commit1Data = JSON.parse(commit1.content[0].text);
assert(commit1Data.summary === "feat: new mcp server", "commitContextChanges formats summary");
assert(commit1Data.body.includes("L1: Added mcp server in nodejs"), "commitContextChanges formats L1");
assert(commit1Data.commitMessage.includes("L3: No git invocation needed"), "commitContextChanges creates commitMessage");

// 3. Security validation
const secAllow = validatePreToolUse("read_file", { filePath: "src/index.js" });
assert(secAllow.permissionDecision === "allow", "Safe tool call allowed");

const secDestructive = validatePreToolUse("run_in_terminal", { command: "rm -rf node_modules" });
assert(secDestructive.permissionDecision === "ask", "Destructive command requires confirmation (ask)");

const secEnv = validatePreToolUse("edit_file", { filePath: "s:/project/.env" });
assert(secEnv.permissionDecision === "ask", "Modifying .env file requires confirmation (ask)");

// 4. Digraph title generation
const title1 = generateDigraphTitle("edit_file", { filePath: "scripts/server.ts" });
assert(title1.fourWords.split(" ").length === 4, "Digraph title generates exactly 4 words");
assert(title1.title.startsWith("Node: ") && title1.title.endsWith(":Vertice:WIP"), "Digraph title conforms to Node: 4Words:Vertice:WIP");

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
