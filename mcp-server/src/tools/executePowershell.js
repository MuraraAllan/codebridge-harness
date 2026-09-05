import { spawn } from "node:child_process";

export async function handleExecutePowershell({ command, scriptPath, args = [] } = {}) {
  return new Promise((resolve) => {
    let spawnArgs = ["-NoProfile", "-ExecutionPolicy", "Bypass"];

    if (scriptPath) {
      spawnArgs.push("-File", scriptPath, ...args);
    } else if (command) {
      spawnArgs.push("-Command", command);
    } else {
      resolve({
        content: [{ type: "text", text: "Error: either command or scriptPath must be provided." }],
        isError: true,
      });
      return;
    }

    const proc = spawn("powershell.exe", spawnArgs, {
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
      const output = (stdout + stderr).trim();
      resolve({
        content: [{ type: "text", text: output || "(no output)" }],
        isError: code !== 0,
      });
    });

    proc.on("error", (err) => {
      resolve({
        content: [{ type: "text", text: `Failed to execute powershell: ${err.message}` }],
        isError: true,
      });
    });

    proc.stdin.end();
  });
}
