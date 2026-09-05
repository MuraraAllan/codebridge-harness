import fs from "node:fs";
import path from "node:path";
import { formatCommitContext } from "./commit.js";

export function generateDigraphTitle(toolName, toolInput) {
  let seed = "";
  if (toolInput && toolInput.filePath) {
    seed = path.parse(String(toolInput.filePath)).name;
  } else if (toolInput && toolInput.command) {
    seed = String(toolInput.command);
  } else {
    seed = toolName;
  }

  if (!seed || !seed.trim()) seed = "workspace change";

  let spaced = seed.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  spaced = spaced.replace(/[_\-.]/g, " ");
  const words = spaced
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

  const fillerWords = ["Workspace", "Applied", "Pending", "Update"];
  let fillerIndex = 0;
  while (words.length < 4) {
    words.push(fillerWords[fillerIndex % fillerWords.length]);
    fillerIndex++;
  }

  const fourWords = words.slice(0, 4).join(" ");
  return {
    fourWords,
    title: `Node: ${fourWords}:Vertice:WIP`,
  };
}

export function writeDigraphNode({
  workspaceRoot,
  toolName,
  toolInput,
  toolResponse = "",
  proofMarker = "12345677",
  hookEventName = "PostToolUse",
}) {
  const { fourWords, title } = generateDigraphTitle(toolName, toolInput);
  const summary = `chore: ${fourWords.toLowerCase()}`;
  const l1 = `Tool '${toolName}' ran as part of this change.`;
  const l2 = `Recorded as a changes-digraph node via emit-changes-digraph-node.`;
  const l3 = `No git invocation; node is a WIP draft pending review through commit-context-harness.`;

  const draft = formatCommitContext({ summary, l1, l2, l3 });
  const digraphDir = path.join(workspaceRoot, "changes-digraph");
  if (!fs.existsSync(digraphDir)) {
    fs.mkdirSync(digraphDir, { recursive: true });
  }

  const fileNameSafe = title.replace(/:/g, "").replace(/\s+/g, "-");
  const nodePath = path.join(digraphDir, `${fileNameSafe}.md`);
  const timestamp = new Date().toISOString();
  const toolInputJson = toolInput ? JSON.stringify(toolInput) : "{}";
  let responsePreview = (toolResponse || "").trim();
  if (responsePreview.length > 1000) {
    responsePreview = responsePreview.slice(0, 1000) + "... [truncated]";
  }

  const content = `# ${title}

${draft.commitMessage}

## Post reasoning summary

- Proof marker: ${proofMarker}
- Hook event: ${hookEventName}
- Tool: ${toolName}
- Timestamp UTC: ${timestamp}
- Tool input: \`\`${toolInputJson}\`\`
- Tool response summary: \`\`${responsePreview}\`\`
- Reasoning record: Tool '${toolName}' completed and was recorded as an observable post-step reasoning summary. This file intentionally stores an auditable summary of the step, not hidden chain-of-thought.
`;

  fs.writeFileSync(nodePath, content, "utf8");

  return {
    title,
    nodePath,
    proofMarker,
  };
}
