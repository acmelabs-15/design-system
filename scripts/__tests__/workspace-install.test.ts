import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { corePackageDirectory, ensureCorePackageLinks, readCorePackage } from "../core-package";

const repository = path.resolve(import.meta.dir, "../..");
test("workspace installs preserve one live core after dependency changes", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-workspace-install-"));
  try {
    const manifests = [...new Bun.Glob("packages/*/package.json").scanSync(repository)];
    for (const file of ["package.json", "bun.lock", "bunfig.toml", ...manifests, ...new Bun.Glob("patches/*").scanSync(repository)]) {
      const target = path.join(root, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(repository, file), target);
    }
    ensureCorePackageLinks(root);
    fs.mkdirSync(path.join(root, "dist"));
    fs.writeFileSync(path.join(root, "dist/index.js"), "export const identity = {};\n");
    const core = readCorePackage(root);
    const install = async (cwd: string, args: string[]) => {
      const child = Bun.spawn([process.execPath, ...args, "--ignore-scripts"], { cwd, stdout: "pipe", stderr: "pipe" });
      const [status, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
      if (status !== 0) {
        throw new Error(stdout + stderr);
      }
    };
    const verify = (step: string) => {
      for (const file of manifests) {
        const cwd = path.dirname(path.join(root, file));
        // A fresh resolver process is essential: Bun caches resolution across installs.
        const result = Bun.spawnSync([process.execPath, "-e", "console.log(Bun.resolveSync(process.argv[1],process.argv[2]))", core.name, cwd], { stdout: "pipe", stderr: "pipe" });
        if (result.exitCode !== 0) {
          throw new Error(step + ": " + cwd + "\n" + result.stderr.toString());
        }
        expect(fs.realpathSync(result.stdout.toString().trim())).toBe(fs.realpathSync(path.join(root, "dist/index.js")));
      }
    };
    await install(root, ["install", "--frozen-lockfile"]);
    verify("fresh");
    await install(root, ["install", "--frozen-lockfile"]);
    verify("repeat");
    await install(path.join(root, "packages/react"), ["add", "@lit/react@1.0.8"]);
    verify("child add");
    const file = path.join(root, "packages/mcp/package.json");
    const mcp = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const version of ["3.25.76", "4.6.5"]) {
      if (mcp.dependencies.zod === version) {
        continue;
      }
      mcp.dependencies.zod = version;
      fs.writeFileSync(file, JSON.stringify(mcp, null, 2));
      await install(root, ["install"]);
      verify("changed dependency " + version);
    }
    await install(root, ["install", "--frozen-lockfile"]);
    verify("final frozen");
    expect(fs.realpathSync(corePackageDirectory(root))).toBe(corePackageDirectory(fs.realpathSync(root)));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}, 120000);
