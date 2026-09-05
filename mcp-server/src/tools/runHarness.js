import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const HOOK_SCRIPT_MAP = {
  "emit-reasoning-proof.ps1": "emitReasoningProof.js",
  "inject-context-userinstructions.ps1": "injectContextUserinstructions.js",
  "inject-react-developer-principle-context.ps1": "injectReactDeveloperPrinciple.js",
  "inject-react-design-principle-context.ps1": "injectReactDesignPrinciple.js",
  "inject-react-ux-principle-context.ps1": "injectReactUxPrinciple.js",
  "inject-context-image-interpret.ps1": "injectContextImageInterpret.js",
  "report-tool-error.ps1": "reportToolError.js",
  "validate-tool.ps1": "validateTool.js",
  "emit-commit-context.ps1": "emitCommitContext.js",
  "emit-changes-digraph-node.ps1": "emitChangesDigraphNode.js",
};

async function runHookScript(scriptPath, jsonInput, workspaceRoot) {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [scriptPath], {
      cwd: workspaceRoot,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("close", (code) => {
      resolve({
        code,
        stdout,
        stderr,
      });
    });

    proc.on("error", (err) => {
      resolve({
        code: 1,
        stdout: "",
        stderr: err.message,
      });
    });

    if (jsonInput) {
      proc.stdin.write(JSON.stringify(jsonInput));
    }
    proc.stdin.end();
  });
}

export async function handleRunHarness(workspaceRoot) {
  const suitePath = path.join(workspaceRoot, "tests", "test-suite.json");
  if (!fs.existsSync(suitePath)) {
    return {
      content: [{ type: "text", text: `Test suite not found at ${suitePath}` }],
      isError: true,
    };
  }

  const suite = JSON.parse(fs.readFileSync(suitePath, "utf8"));
  const hooksDir = path.join(workspaceRoot, "mcp-server", "src", "hooks");
  const lines = [`Running Agent Hook Harness: ${suite.suiteName}`];

  let passedCount = 0;
  let failedCount = 0;

  for (const test of suite.tests) {
    let scriptFileName = "validateTool.js";

    if (test.hookScript) {
      const baseName = path.basename(test.hookScript);
      scriptFileName = HOOK_SCRIPT_MAP[baseName] || `${path.parse(baseName).name}.js`;
    }

    const scriptPath = path.join(hooksDir, scriptFileName);
    const result = await runHookScript(scriptPath, test.input, workspaceRoot);

    if (result.code !== 0) {
      lines.push(`[FAIL] ${test.id}: hook exited with code ${result.code}. ${result.stderr}`);
      failedCount++;
      continue;
    }

    let actualOutput = {};
    try {
      actualOutput = JSON.parse(result.stdout || "{}");
    } catch {
      // malformed output
    }

    const hookOutput = actualOutput.hookSpecificOutput || {};
    const actualDecision = hookOutput.permissionDecision;
    const actualReason = hookOutput.permissionDecisionReason;
    const actualEventName = hookOutput.hookEventName;
    const actualContext = hookOutput.additionalContext;
    const actualSource = hookOutput.source;
    const actualSystemMessage = actualOutput.systemMessage;

    const decisionMatches =
      !test.expected.permissionDecision || actualDecision === test.expected.permissionDecision;
    const reasonMatches =
      !test.expected.reasonContains ||
      (actualReason && actualReason.includes(test.expected.reasonContains));
    const eventMatches =
      !test.expected.hookEventName || actualEventName === test.expected.hookEventName;
    const contextMatches =
      !test.expected.additionalContext ||
      (actualContext && actualContext.includes(test.expected.additionalContext));
    const messageMatches =
      !test.expected.systemMessage || actualSystemMessage === test.expected.systemMessage;
    const sourceMatches =
      !test.expected.source || actualSource === test.expected.source;

    if (
      decisionMatches &&
      reasonMatches &&
      eventMatches &&
      contextMatches &&
      messageMatches &&
      sourceMatches
    ) {
      lines.push(`[PASS] ${test.id}`);
      passedCount++;
    } else {
      lines.push(`[FAIL] ${test.id}: hook output did not match expected values.`);
      failedCount++;
    }
  }

  lines.push(`Test Summary: ${passedCount} passed, ${failedCount} failed`);

  return {
    content: [
      {
        type: "text",
        text: lines.join("\n"),
      },
    ],
    isError: failedCount > 0,
  };
}
