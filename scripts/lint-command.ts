import fs from "node:fs";

/** Capture directly to a fresh file; piping large diagnostics can truncate output. */
export async function runLintCommand(binary: string, args: readonly string[], report: string, cwd: string): Promise<number> {
  const descriptor = fs.openSync(report, "w");
  try {
    const child = Bun.spawn([process.execPath, binary, ...args], { cwd, stdout: descriptor, stderr: "inherit" });
    return await child.exited;
  } finally {
    fs.closeSync(descriptor);
  }
}
