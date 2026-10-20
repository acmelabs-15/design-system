import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { npmVersion, requireReleaseRuntime } from "./release-policy";
import { repositoryRoot } from "./core-package";

export function npmDirectory(root = repositoryRoot): string {
  return path.join(root, "node_modules/npm");
}
export async function npmCommand(args: string[], options: { root?: string; cwd?: string; env?: Record<string, string | undefined> } = {}): Promise<{ stdout: string; stderr: string; status: number }> {
  requireReleaseRuntime();
  const directory = npmDirectory(options.root);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
  if (metadata.version !== npmVersion) {
    throw new Error("Pinned npm CLI version mismatch");
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "acme-npm-config-"));
  try {
    const user = path.join(temporary, "user.npmrc"),
      global = path.join(temporary, "global.npmrc");
    fs.writeFileSync(user, "");
    fs.writeFileSync(global, "");
    const child = Bun.spawn([process.execPath, path.join(directory, "bin/npm-cli.js"), ...args], {
      cwd: options.cwd ?? temporary,
      env: { ...options.env, NPM_CONFIG_USERCONFIG: user, NPM_CONFIG_GLOBALCONFIG: global, NPM_CONFIG_CACHE: path.join(temporary, "cache"), NPM_CONFIG_UPDATE_NOTIFIER: "false" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr, status] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
    return { stdout, stderr, status };
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
export async function verifyNpmCli(root = repositoryRoot): Promise<void> {
  const result = await npmCommand(["--version"], { root });
  if (result.status !== 0 || result.stdout.trim() !== npmVersion) {
    throw new Error("Pinned npm CLI did not run correctly under Bun: " + result.stderr);
  }
}
