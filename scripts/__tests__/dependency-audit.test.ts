import { expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import braces from "braces";
import { auditDispositions, classifyAudit, verifyAuditProof } from "../dependency-audit";

test("patched Braces bounds each parser and AST walker without changing ordinary patterns", () => {
  const message = "Nesting depth exceeds maximum of 100";
  for (const method of ["parse", "compile", "expand", "stringify", "create"]) {
    for (const [open, close] of [
      ["{", "}"],
      ["(", ")"],
      ["{(", "})"],
    ]) {
      expect(() => braces[method](open.repeat(101) + "a" + close.repeat(101))).toThrow(message);
    }
  }
  type Ast = { type: string; value?: string; nodes?: Ast[]; parent?: Ast };
  for (const method of ["compile", "expand", "stringify"]) {
    let node: Ast = { type: "text", value: "a" };
    for (let index = 0; index < 102; index++) {
      const parent: Ast = { type: "paren", nodes: [node] };
      node.parent = parent;
      node = parent;
    }
    node.type = "root";
    expect(() => braces[method](node)).toThrow(message);
  }
  expect(() => braces.parse("{".repeat(101))).toThrow(message);
  expect(() => braces.parse("(".repeat(100) + "a" + ")".repeat(100))).not.toThrow();
  expect(() => braces.parse("\\{".repeat(101))).not.toThrow();
  expect(() => braces.parse('"' + "{".repeat(101) + '"')).not.toThrow();
  expect(braces.compile("a/{b,c}/d")).toBe("a/(b|c)/d");
  expect(braces.expand("a/{b,c}/d")).toEqual(["a/b/d", "a/c/d"]);
  expect(braces.stringify("a/{b,c}/d")).toBe("a/{b,c}/d");
  expect(braces.expand("{1..3}")).toEqual(["1", "2", "3"]);
});

test("npm cache applicability proof passes against its actual caller and stored response", () => {
  const root = path.resolve(import.meta.dir, "../..");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "acme-npm-cache-test-"));
  try {
    const result = Bun.spawnSync([process.execPath, path.join(root, "scripts/verification/dependency-audit/npm-cache-private.ts"), root], {
      cwd: work,
      stdout: "pipe",
      stderr: "pipe",
      timeout: 15000,
    });
    expect({ status: result.exitCode, error: result.stderr.toString() }).toEqual({ status: 0, error: "" });
    expect(result.stdout.toString()).toContain("private cache and cookie omission verified");
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
});

test("only exact reviewed advisories can receive a verified disposition", async () => {
  const known = { braces: [{ url: "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm", severity: "high", vulnerable_versions: "<=3.0.3" }] };
  const verified = await classifyAudit(known, async () => {});
  expect(verified.blocking).toHaveLength(0);
  expect(verified.reviewed).toHaveLength(1);
  expect(
    (
      await classifyAudit(known, async () => {
        throw new Error("proof changed");
      })
    ).blocking,
  ).toHaveLength(1);
  for (const changed of [
    { braces: [{ ...known.braces[0], url: "https://github.com/advisories/GHSA-new-advisory" }] },
    { other: known.braces },
    { braces: [{ ...known.braces[0], severity: "critical" }] },
    { braces: [{ ...known.braces[0], vulnerable_versions: "<=3.0.4" }] },
  ]) {
    expect((await classifyAudit(changed, async () => {})).blocking).toHaveLength(1);
  }
  for (const invalid of [null, [], { error: "network unavailable" }, { braces: [{}] }]) {
    await expect(classifyAudit(invalid, async () => {})).rejects.toThrow();
  }
});

test("audit proof rejects expired review, changed code and additional dependency paths", async () => {
  const root = path.resolve(import.meta.dir, "../..");
  const proof = auditDispositions[0];
  await verifyAuditProof(proof, root, new Date("2026-10-20"));
  await expect(verifyAuditProof(proof, root, new Date("2026-11-21"))).rejects.toThrow("expired");
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), "acme-audit-proof-"));
  try {
    for (const file of ["bun.lock", "package.json", ...proof.files.map((entry) => entry.path)]) {
      const target = path.join(copy, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
    }
    const target = proof.files[0].path;
    fs.appendFileSync(path.join(copy, target), "\nchanged");
    await expect(verifyAuditProof(proof, copy, new Date("2026-10-20"))).rejects.toThrow("fingerprint");
    fs.copyFileSync(path.join(root, target), path.join(copy, target));
    const lock = Bun.JSONC.parse(fs.readFileSync(path.join(copy, "bun.lock"), "utf8"));
    lock.packages["other/braces"] = lock.packages.braces;
    fs.writeFileSync(path.join(copy, "bun.lock"), JSON.stringify(lock));
    await expect(verifyAuditProof(proof, copy, new Date("2026-10-20"))).rejects.toThrow("dependency paths");
  } finally {
    fs.rmSync(copy, { recursive: true, force: true });
  }
});

test("private-cache disposition rejects required, optional and peer consumer dependencies", async () => {
  const root = path.resolve(import.meta.dir, "../..");
  const proof = auditDispositions[1];
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), "acme-audit-consumer-"));
  try {
    for (const file of ["bun.lock", "package.json", ...proof.files.map((entry) => entry.path)]) {
      const target = path.join(copy, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
    }
    const consumer = path.join(copy, "packages/core/package.json");
    fs.mkdirSync(path.dirname(consumer), { recursive: true });
    fs.writeFileSync(consumer, JSON.stringify({ name: "@acmelabs/design-system" }));
    await verifyAuditProof(proof, copy, new Date("2026-10-20"));
    for (const field of ["dependencies", "optionalDependencies", "peerDependencies"]) {
      fs.writeFileSync(consumer, JSON.stringify({ name: "@acmelabs/design-system", [field]: { npm: "12.0.2" } }));
      await expect(verifyAuditProof(proof, copy, new Date("2026-10-20"))).rejects.toThrow("consumer runtime");
    }
  } finally {
    fs.rmSync(copy, { recursive: true, force: true });
  }
});

test.each([
  { name: "empty failure", status: 1, stdout: "", stderr: "error: advisory POST returned 503\n", failure: "Native dependency audit returned invalid JSON (exit 1)", report: false },
  { name: "malformed failure", status: 1, stdout: "{broken", stderr: "error: advisory response is incomplete\n", failure: "Native dependency audit returned invalid JSON (exit 1)", report: false },
  { name: "empty success", status: 0, stdout: "", stderr: "", failure: "Native dependency audit returned invalid JSON (exit 0)", report: false },
  { name: "malformed success", status: 0, stdout: "<html>unavailable</html>", stderr: "response diagnostic\n", failure: "Native dependency audit returned invalid JSON (exit 0)", report: false },
  { name: "process failure", status: 2, stdout: "{}", stderr: "native process failed\n", failure: "Native dependency audit failed:", report: false },
  { name: "failure without findings", status: 1, stdout: "{}", stderr: "native report unavailable\n", failure: "Native dependency audit failed without findings:", report: false },
  { name: "clean report", status: 0, stdout: "{}", stderr: "", failure: "", report: true },
  {
    name: "unreviewed high finding",
    status: 1,
    stdout: JSON.stringify({ example: [{ url: "https://example.invalid/advisory", severity: "high", vulnerable_versions: "*" }] }),
    stderr: "",
    failure: "1 unresolved high/critical dependency findings",
    report: true,
  },
])("audit process boundary preserves native diagnostics and verdict: $name", (scenario) => {
  const root = path.resolve(import.meta.dir, "../..");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "acme-native-audit-response-"));
  try {
    for (const file of ["scripts/dependency-audit.ts", "scripts/dependency-audit-proofs.json", "scripts/core-package.ts"]) {
      const target = path.join(work, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
    }
    fs.writeFileSync(path.join(work, "response.json"), JSON.stringify(scenario));
    const executable = path.join(work, "native-audit");
    fs.writeFileSync(
      executable,
      `#!/usr/bin/env bun
const response = await Bun.file(new URL("./response.json", import.meta.url)).json();
await Bun.write(new URL("./invocation.json", import.meta.url), JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() }));
await Bun.write(Bun.stdout, response.stdout);
await Bun.write(Bun.stderr, response.stderr);
process.exit(response.status);
`,
      { mode: 0o755 },
    );
    fs.writeFileSync(
      path.join(work, "run.ts"),
      `import { auditDependencies } from "./scripts/dependency-audit";
process.execPath = ${JSON.stringify(executable)};
await auditDependencies();
`,
    );
    const result = Bun.spawnSync([process.execPath, path.join(work, "run.ts")], {
      cwd: work,
      env: { ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + (process.env.PATH ?? "") },
      stdout: "pipe",
      stderr: "pipe",
      timeout: 10000,
    });
    expect(JSON.parse(fs.readFileSync(path.join(work, "invocation.json"), "utf8"))).toEqual({ args: ["audit", "--json"], cwd: fs.realpathSync(work) });
    expect(result.exitCode).toBe(scenario.failure ? 1 : 0);
    if (scenario.failure) {
      expect(result.stderr.toString()).toContain(scenario.failure);
      if (scenario.failure.startsWith("Native dependency audit returned invalid JSON")) {
        expect(result.stderr.toString()).toContain("SyntaxError");
      }
      if (scenario.stderr) {
        expect(result.stderr.toString()).toContain(scenario.stderr.trim());
      }
    }
    const reportPath = path.join(work, ".artifacts/checks/dependency-audit.json");
    expect(fs.existsSync(reportPath)).toBe(scenario.report);
    if (scenario.report) {
      const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
      expect(report.nativeExitCode).toBe(scenario.status);
      expect(report.blocking).toHaveLength(scenario.status === 1 ? 1 : 0);
    }
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
});
