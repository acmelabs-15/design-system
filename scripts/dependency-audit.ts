import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import proofs from "./dependency-audit-proofs.json";
import { repositoryRoot } from "./core-package";

type AuditProof = {
  package: string;
  version: string;
  path: string;
  url: string;
  severity: string;
  range: string;
  disposition: string;
  reason: string;
  reviewBefore: string;
  files: { path: string; sha256: string }[];
};
export const auditDispositions: AuditProof[] = proofs;
type Finding = { url: string; severity: string; vulnerable_versions: string };
type Result = { package: string; url: string; severity: string; reason: string };

function object(value: unknown): Record<string, unknown> {
  assert.ok(value && typeof value === "object" && !Array.isArray(value), "Invalid lockfile object");
  return value as Record<string, unknown>;
}

export async function verifyAuditProof(proof: AuditProof, root = repositoryRoot, now = new Date()): Promise<void> {
  assert.ok(now < new Date(proof.reviewBefore), "Audit review expired: " + proof.url);
  const lock = object(Bun.JSONC.parse(await Bun.file(path.join(root, "bun.lock")).text()));
  const occurrences = Object.entries(object(lock.packages)).flatMap(([key, record]) =>
    Array.isArray(record) && typeof record[0] === "string" && record[0].startsWith(proof.package + "@") ? [[key, record[0]]] : [],
  );
  assert.deepEqual(occurrences, [[proof.path, `${proof.package}@${proof.version}`]], "Reviewed dependency paths changed");
  const manifest = await Bun.file(path.join(root, "package.json")).json();
  assert.equal(manifest.private, true, "Audit proof requires a private build workspace");
  if (proof.package === "braces") {
    assert.equal(manifest.patchedDependencies?.["braces@3.0.3"], "patches/braces@3.0.3.patch");
    assert.equal(object(lock.patchedDependencies)["braces@3.0.3"], "patches/braces@3.0.3.patch");
  } else {
    assert.equal(manifest.devDependencies?.npm, "12.0.2", "Private-cache proof requires the reviewed npm version");
    for (const file of new Bun.Glob("packages/*/package.json").scanSync(root)) {
      const pkg = await Bun.file(path.join(root, file)).json();
      for (const name of ["npm", "http-cache-semantics", "make-fetch-happen", "npm-registry-fetch"]) {
        assert.ok(
          !["dependencies", "optionalDependencies", "peerDependencies"].some((field) => Object.hasOwn(pkg[field] ?? {}, name)),
          "Private-cache proof cannot cover a consumer runtime dependency",
        );
      }
    }
  }
  for (const { path: file, sha256: expected } of proof.files) {
    const actual = new Bun.CryptoHasher("sha256").update(await Bun.file(path.join(root, file)).arrayBuffer()).digest("hex");
    assert.equal(actual, expected, "Audit proof fingerprint changed: " + file);
  }
}

export async function classifyAudit(report: unknown, verify: (proof: AuditProof) => Promise<void> = verifyAuditProof) {
  assert.ok(report && typeof report === "object" && !Array.isArray(report), "Invalid native audit response");
  const blocking: Result[] = [],
    reviewed: Result[] = [],
    lower: Result[] = [];
  for (const [name, entries] of Object.entries(report)) {
    assert.ok(Array.isArray(entries), "Invalid native audit findings");
    for (const entry of entries) {
      assert.ok(
        entry && typeof entry.url === "string" && typeof entry.vulnerable_versions === "string" && ["low", "moderate", "high", "critical"].includes(entry.severity),
        "Invalid native audit finding",
      );
      const finding = entry as Finding;
      const result = { package: name, url: finding.url, severity: finding.severity, reason: "Unreviewed advisory" };
      if (finding.severity === "low" || finding.severity === "moderate") {
        lower.push(result);
        continue;
      }
      const proof = auditDispositions.find((item) => item.package === name && item.url === finding.url && item.severity === finding.severity && item.range === finding.vulnerable_versions);
      if (!proof) {
        blocking.push(result);
        continue;
      }
      try {
        await verify(proof);
        reviewed.push({ ...result, reason: `${proof.disposition}: ${proof.reason}` });
      } catch (error) {
        blocking.push({ ...result, reason: String(error) });
      }
    }
  }
  return { blocking, reviewed, lower };
}

export async function auditDependencies(): Promise<void> {
  const child = Bun.spawn([process.execPath, "audit", "--json"], { cwd: repositoryRoot, stdout: "pipe", stderr: "pipe" });
  const [status, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
  if (status !== 0 && status !== 1) {
    throw new Error("Native dependency audit failed: " + stderr);
  }
  let report;
  try {
    report = JSON.parse(stdout);
  } catch (cause) {
    throw new Error(`Native dependency audit returned invalid JSON (exit ${status}): ${stderr.trim() || "No native stderr"}`, { cause });
  }
  const result = await classifyAudit(report);
  if (status === 1 && Object.values(report).every((entries) => (entries as unknown[]).length === 0)) {
    throw new Error("Native dependency audit failed without findings: " + stderr);
  }
  const destination = path.join(repositoryRoot, ".artifacts/checks/dependency-audit.json");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  await Bun.write(destination, JSON.stringify({ checkedAt: new Date().toISOString(), nativeExitCode: status, report, ...result }, null, 2) + "\n");
  for (const item of [...result.reviewed, ...result.blocking]) {
    console.log(`${item.package}: ${item.url} — ${item.reason}`);
  }
  if (result.blocking.length) {
    throw new Error(`${result.blocking.length} unresolved high/critical dependency findings`);
  }
  console.log(`Dependency audit: no unresolved high/critical findings; ${result.reviewed.length} verified dispositions; ${result.lower.length} lower-severity findings.`);
}

if (import.meta.main) {
  await auditDependencies();
}
