import { classifyErrorReport } from "../core/classifier.js";

export function handleErrorReport(args = {}) {
  const errorText = String(args.error || "");
  const toolName = String(args.toolName || "");
  const report = classifyErrorReport(errorText, toolName);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(report),
      },
    ],
    isError: false,
  };
}
