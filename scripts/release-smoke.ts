import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { repositoryRoot } from "./core-package";
import { npmCommand, verifyNpmCli } from "./release-npm";

export async function releaseSmoke() {
  await verifyNpmCli();
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "acme-release-smoke-"));
  try {
    fs.writeFileSync(path.join(temporary, "package.json"), JSON.stringify({ name: "acme-release-probe", version: "0.0.0", files: ["index.js"], scripts: { prepack: "exit 91" } }));
    fs.writeFileSync(path.join(temporary, "index.js"), "export const fixture = true;\n");
    const packed = await npmCommand(["pack", "--json", "--ignore-scripts", "--registry=http://127.0.0.1:1", "--pack-destination", temporary], { cwd: temporary });
    assert.equal(packed.status, 0, packed.stderr);
    const data = JSON.parse(packed.stdout),
      record = Array.isArray(data) ? data[0] : (Object.values(data)[0] as { files: { path: string }[] });
    assert.deepEqual(record.files.map((file: { path: string }) => file.path).sort(), ["index.js", "package.json"]);
    const output = path.join(repositoryRoot, ".artifacts/release/crypto-smoke.json");
    const child = Bun.spawn([process.execPath, path.join(import.meta.dir, "release-crypto.ts"), path.join(temporary, "acme-release-probe-0.0.0.tgz"), output], {
      env: { PATH: process.env.PATH, TMPDIR: process.env.TMPDIR },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr, status] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
    assert.equal(status, 0, stdout + stderr);
    return JSON.parse(await Bun.file(output).text());
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
if (import.meta.main) {
  console.log(JSON.stringify(await releaseSmoke(), null, 2));
}
