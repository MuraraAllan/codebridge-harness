/**
 * Security inspection for PreToolUse hooks
 */
const DESTRUCTIVE_CMD_REGEX =
  /(?:\brm\s+(?:-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b|\bremove-item\b.*(?:-recurse|-r)\b.*(?:-force|-f)\b|\bdrop\s+table\b|\bgit\s+push\s+--force(?:-with-lease)?\b)/i;

const SENSITIVE_FILE_REGEX =
  /(?:^|[\\/])\.env(?:\..+)?$|(?:^|[\\/])prod\.json$/i;

export function validatePreToolUse(toolName, toolArgs = {}) {
  const terminalTools = ["run_in_terminal", "execute_command", "runTerminalCommand"];
  if (terminalTools.includes(toolName)) {
    const command = String(toolArgs?.command || "");
    if (DESTRUCTIVE_CMD_REGEX.test(command)) {
      return {
        permissionDecision: "ask",
        permissionDecisionReason: `Destructive command detected ('${command}') requires manual confirmation.`,
      };
    }
  }

  const editTools = ["edit_file", "write_file", "editFiles", "createFile"];
  if (editTools.includes(toolName)) {
    const filePaths = [];
    if (toolArgs?.filePath) filePaths.push(String(toolArgs.filePath));
    if (toolArgs?.path) filePaths.push(String(toolArgs.path));
    if (Array.isArray(toolArgs?.files)) {
      filePaths.push(...toolArgs.files.map(String));
    }

    for (const filePath of filePaths) {
      if (SENSITIVE_FILE_REGEX.test(filePath)) {
        return {
          permissionDecision: "ask",
          permissionDecisionReason: `Modifying sensitive configuration file (${filePath}) requires manual confirmation.`,
        };
      }
    }
  }

  return {
    permissionDecision: "allow",
  };
}
