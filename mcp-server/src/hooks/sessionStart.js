import { readStdin } from "../core/stdin.js";
import { formatCommitContext } from "../core/commit.js";

async function run() {
  const rawInput = await readStdin(1000);
  let hookEventName = "SessionStart";

  if (rawInput && rawInput.trim()) {
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.hook_event_name) hookEventName = parsed.hook_event_name;
    } catch {
      // Ignore parse errors
    }
  }

  if (hookEventName !== "SessionStart") {
    process.stdout.write(JSON.stringify({ continue: true }) + "\n");
    return;
  }

  const summary = "chore: session start routing";
  const l1 = "SessionStart hook fired; commit-context-harness must handle commit drafting.";
  const l2 = "Route commit-message drafting through codebridge-harness/commitContextChanges and store WIP context in the repository changes-digraph folder.";
  const l3 = "No git invocation is available. Retrieve a draft only, then persist node files with title format Node: Four Words Semantic Change:Vertice:WIP.";

  const draft = formatCommitContext({ summary, l1, l2, l3 });
  const contextNote = `commit-context-harness is active. Delegate commit drafting to commit-context-harness, retrieve the draft commit message, and keep changes-digraph nodes in sync. Draft commit message retrieved: ${draft.commitMessage}`;

  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: contextNote,
    },
  };

  process.stdout.write(JSON.stringify(output) + "\n");
}

run().catch((err) => {
  process.stderr.write(`Error in sessionStart hook: ${err.message}\n`);
  process.stdout.write(JSON.stringify({ continue: true }) + "\n");
});
