import { spawn } from "node:child_process";
import path from "node:path";

export async function handleRunHarness(workspaceRoot) {
  const harnessScript = path.join(workspaceRoot, "tests", "run-harness.ps1");

  return new Promise((resolve) => {
    const proc = spawn(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", harnessScript],
      {
        cwd: workspaceRoot,
        windowsHide: true,
      }
    );

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
        content: [
          {
            type: "text",
            text: output,
          },
        ],
        isError: code !== 0,
      });
    });

    proc.on("error", (err) => {
      resolve({
        content: [
          {
            type: "text",
            text: `Failed to execute harness: ${err.message}`,
          },
        ],
        isError: true,
      });
    });
  });
}
