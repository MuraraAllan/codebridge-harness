/**
 * ContextChanges formatter and commit message generator
 */
export function formatCommitContext({ summary, l1, l2, l3 } = {}) {
  const normalizedSummary =
    summary && summary.trim() ? summary.trim() : "chore: update context changes";
  const sections = [];

  if (l1 && l1.trim()) sections.push(`L1: ${l1.trim()}`);
  if (l2 && l2.trim()) sections.push(`L2: ${l2.trim()}`);
  if (l3 && l3.trim()) sections.push(`L3: ${l3.trim()}`);

  if (sections.length === 0) {
    sections.push("L1: (pending)");
    sections.push("L2: (pending)");
    sections.push("L3: (pending)");
  }

  const body = sections.join("\n");
  const commitMessage = `${normalizedSummary}\n\n${body}`;

  return {
    summary: normalizedSummary,
    body,
    commitMessage,
  };
}
