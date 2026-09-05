/**
 * Error classification and nextAction resolution
 */
export function getErrorCategory(errorText) {
  if (!errorText) return "unknown";

  if (
    /(?:access denied|permission denied|unauthorized|forbidden|authentication|credential|token|approval|required|confirm)/i.test(
      errorText
    )
  ) {
    return "userIntervention";
  }

  if (
    /(?:not found|does not exist|missing|invalid|parse|syntax|failed|error|exception|cannot|unable)/i.test(
      errorText
    )
  ) {
    return "fixable";
  }

  return "unknown";
}

export function getErrorNextAction(category) {
  switch (category) {
    case "fixable":
      return "Inspect the failing tool input or workspace file, apply a targeted correction, and retry the tool.";
    case "userIntervention":
      return "Ask the user to grant approval, provide the required credential, or complete the external action before retrying.";
    default:
      return "Collect the tool output and relevant logs, then ask the user for guidance before making speculative changes.";
  }
}

export function classifyErrorReport(errorText, toolName = "") {
  const category = getErrorCategory(errorText);
  const nextAction = getErrorNextAction(category);
  return {
    category,
    toolName: toolName || "",
    error: errorText,
    nextAction,
  };
}
