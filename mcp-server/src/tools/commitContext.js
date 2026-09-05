import { formatCommitContext } from "../core/commit.js";

export function handleCommitContextChanges(args = {}) {
  const result = formatCommitContext({
    summary: args.summary,
    l1: args.l1,
    l2: args.l2,
    l3: args.l3,
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result),
      },
    ],
    isError: false,
  };
}
