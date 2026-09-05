import fs from "node:fs";
import path from "node:path";

const HOOK_DESCRIPTIONS = {
  "emit-reasoning-proof.js": "Emits auditable reasoning proof marker (12345677) before tool execution or on prompt submission.",
  "emitReasoningProof.js": "Emits auditable reasoning proof marker (12345677) before tool execution or on prompt submission.",
  "validate-tool.js": "Enforces workspace safety policy, asking confirmation before destructive commands or sensitive file edits.",
  "validateTool.js": "Enforces workspace safety policy, asking confirmation before destructive commands or sensitive file edits.",
  "emit-commit-context.js": "Injects commit-context-harness instructions to route commit drafting without invoking git.",
  "emitCommitContext.js": "Injects commit-context-harness instructions to route commit drafting without invoking git.",
  "inject-context-image-interpret.js": "Instructs model to delegate visual assets/pictures to contextImageInterpret for structured JSON analysis.",
  "injectContextImageInterpret.js": "Instructs model to delegate visual assets/pictures to contextImageInterpret for structured JSON analysis.",
  "inject-context-userinstructions.js": "Injects workspace user-context instructions (rules/user-context.instructions.md) into turn context.",
  "injectContextUserinstructions.js": "Injects workspace user-context instructions (rules/user-context.instructions.md) into turn context.",
  "report-tool-error.js": "Detects tool execution failures and classifies errors into fixable, userIntervention, or unknown.",
  "reportToolError.js": "Detects tool execution failures and classifies errors into fixable, userIntervention, or unknown.",
  "emit-changes-digraph-node.js": "Persists an auditable WIP vertex in changes-digraph/ after tool executions.",
  "emitChangesDigraphNode.js": "Persists an auditable WIP vertex in changes-digraph/ after tool executions.",
  "inject-changes-digraph-node.js": "Persists an auditable WIP vertex in changes-digraph/ after tool executions.",
  "inject-design-principle-context.js": "Injects design and accessibility principles for codebridge-design-principle.",
  "injectDesignPrinciple.js": "Injects design and accessibility principles for codebridge-design-principle.",
  "inject-ux-principle-context.js": "Injects interaction and journey principles for codebridge-ux-principle.",
  "injectUxPrinciple.js": "Injects interaction and journey principles for codebridge-ux-principle.",
  "inject-react-javascript-typescript-context.js": "Injects architecture and composition principles for codebridge-react-javascript-typescript.",
  "injectReactJavascriptTypescript.js": "Injects architecture and composition principles for codebridge-react-javascript-typescript.",
  "inject-react-design-principle-context.js": "Injects design and accessibility principles for codebridge-design-principle.",
  "injectReactDesignPrinciple.js": "Injects design and accessibility principles for codebridge-design-principle.",
  "inject-react-developer-principle-context.js": "Injects architecture and composition principles for codebridge-react-javascript-typescript.",
  "injectReactDeveloperPrinciple.js": "Injects architecture and composition principles for codebridge-react-javascript-typescript.",
  "inject-react-ux-principle-context.js": "Injects interaction and journey principles for codebridge-ux-principle.",
  "injectReactUxPrinciple.js": "Injects interaction and journey principles for codebridge-ux-principle.",
};

export function getRegisteredHooks(workspaceRoot, filterEvent) {
  const hooksFile = path.join(workspaceRoot, "hooks.json");
  const result = [];

  if (fs.existsSync(hooksFile)) {
    try {
      const config = JSON.parse(fs.readFileSync(hooksFile, "utf8"));
      const hooks = config.hooks || {};

      for (const [event, entries] of Object.entries(hooks)) {
        if (filterEvent && event !== filterEvent) continue;

        if (Array.isArray(entries)) {
          for (const entry of entries) {
            const command = entry.command || "";
            const scriptName = path.basename(command.replace(/^.*[\\/]/, "").replace(/"$/, ""));
            const description = HOOK_DESCRIPTIONS[scriptName] || `Hook script executed on ${event}`;

            result.push({
              event,
              name: scriptName || command,
              command,
              timeout: entry.timeout ?? 5,
              injectAsContext: !!entry.injectAsContext,
              description,
            });
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Also include agent-specific hooks from agents/
  const agentsDir = path.join(workspaceRoot, "agents");
  if (fs.existsSync(agentsDir)) {
    try {
      const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".agent.md"));
      for (const agentFile of agentFiles) {
        const content = fs.readFileSync(path.join(agentsDir, agentFile), "utf8");
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (match) {
          const frontmatter = match[1];
          if (/hooks:\s*\r?\n/.test(frontmatter)) {
            const agentName = agentFile.replace(".agent.md", "");
            // Extract hooks defined in frontmatter
            const hookBlockMatch = frontmatter.match(/hooks:\s*\r?\n([\s\S]*?)(?=\n[a-z0-9_-]+:|$)/i);
            if (hookBlockMatch) {
              const hookLines = hookBlockMatch[1].split(/\r?\n/);
              let currentEvent = "";
              for (const line of hookLines) {
                const eventMatch = line.match(/^\s*(PreToolUse|SessionStart|UserPromptSubmit|PostToolUse):\s*$/i);
                if (eventMatch) {
                  currentEvent = eventMatch[1];
                }
                const cmdMatch = line.match(/command:\s*"([^"]+)"/);
                if (cmdMatch && currentEvent) {
                  if (filterEvent && currentEvent !== filterEvent) continue;
                  const command = cmdMatch[1];
                  const scriptName = path.basename(command.replace(/^.*[\\/]/, "").replace(/"$/, ""));
                  result.push({
                    event: currentEvent,
                    name: `${agentName}:${scriptName}`,
                    command,
                    timeout: 5,
                    injectAsContext: false,
                    description: `Agent hook for ${agentName} on ${currentEvent}. ${HOOK_DESCRIPTIONS[scriptName] || ""}`.trim(),
                  });
                }
              }
            }
          }
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return result;
}
