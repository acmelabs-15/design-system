import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { verifyWorkflowMigration, type MigrationLedger } from "../workflow-migration";

const roots: string[] = [];
const auditDirectory = "docs/verification/workflow-migration";
const hash = (text: string) => new Bun.CryptoHasher("sha256").update(text).digest("hex");

function write(root: string, file: string, text: string) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
}

function git(root: string, ...args: string[]) {
  const result = Bun.spawnSync(["git", "-c", "core.hooksPath=/dev/null", "-c", "commit.gpgSign=false", "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", ...args], {
    cwd: root,
    env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" },
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    throw new Error(result.stderr.toString());
  }
  return result.stdout.toString().trim();
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "acme-workflow-migration-"));
  roots.push(root);
  const raw = '{"source":"notes/old.ts","result":"passed"}\n';
  write(root, "notes/result.json", raw);
  write(root, "notes/guide.md", "# Guide\n");
  git(root, "init");
  git(root, "add", "notes");
  git(root, "commit", "-m", "Baseline");
  const ledger: MigrationLedger = {
    schemaVersion: 1,
    baselineRevision: git(root, "rev-parse", "HEAD"),
    sourceRoots: ["notes", "PLAN.md", ".agents/skills"],
    sourceCount: 2,
    records: [
      {
        source: "notes/result.json",
        sourceSha256: hash(raw),
        kind: "raw-evidence",
        action: "preserve",
        destinations: [{ path: "docs/verification/result.json", integrity: "bytes", sha256: hash(raw) }],
        batch: "raw",
        status: "planned",
      },
      {
        source: "notes/guide.md",
        sourceSha256: hash("# Guide\n"),
        kind: "research",
        action: "convert",
        destinations: [{ path: "docs/research/guide.md", integrity: "semantic" }],
        batch: "guide",
        status: "planned",
      },
    ],
    extractedFixtures: [],
    relatedUpdates: [],
    newDocumentOwners: [],
    auditInputs: [],
    batchIndex: auditDirectory + "/batches.json",
  };
  const batches = ledger.records.map((record) => ({
    id: record.batch,
    sources: [record.source],
    destinations: record.destinations.map((destination) => destination.path),
    status: "planned",
    result: auditDirectory + "/batches/" + record.batch + ".json",
  }));
  write(root, ledger.batchIndex, JSON.stringify({ schemaVersion: 1, batches }));
  write(
    root,
    auditDirectory + "/references.json",
    JSON.stringify({ schemaVersion: 1, baselineRevision: ledger.baselineRevision, markdown: [], literalConsumers: [], liveDependencyEdges: [], externalMutableCorrections: [] }),
  );
  write(root, auditDirectory + "/live-file-audit.json", JSON.stringify({ files: [] }));
  const save = () => write(root, auditDirectory + "/ledger.json", JSON.stringify(ledger));
  save();
  return { root, ledger, raw, save };
}

function completeFixture() {
  const result = fixture();
  write(result.root, "docs/verification/result.json", result.raw);
  write(result.root, "docs/research/guide.md", "# Guide\n\n## Same heading\n\n## Same heading\n");
  for (const record of result.ledger.records) {
    record.status = "complete";
  }
  fs.rmSync(path.join(result.root, result.ledger.sourceRoots[0]), { recursive: true });
  result.save();
  completeBatches(result.root);
  return result;
}

function completeBatches(root: string) {
  const file = auditDirectory + "/batches.json";
  const index = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  for (const batch of index.batches) {
    batch.status = "complete";
    write(root, batch.result, JSON.stringify({ schemaVersion: 1, batch: batch.id, status: "complete", verification: { passed: true } }));
  }
  write(root, file, JSON.stringify(index));
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("preparation rejects an omitted baseline source", () => {
  const { root, ledger, save } = fixture();
  ledger.records.pop();
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Unlisted source: notes/guide.md");
});

test("dropping a whole approved root and all its records cannot shrink coverage", () => {
  const { root, ledger, save } = fixture();
  ledger.sourceRoots.reverse();
  save();
  expect(verifyWorkflowMigration(root, "preparation").passed).toBe(true);
  ledger.sourceRoots = ledger.sourceRoots.filter((sourceRoot) => sourceRoot !== "notes");
  ledger.records = [];
  ledger.sourceCount = 0;
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Source roots differ from approved migration scope");
});

test("the approved root set cannot accept an empty Git baseline", () => {
  const { root, ledger, save } = fixture();
  git(root, "rm", "-r", "notes");
  git(root, "commit", "-m", "Empty baseline");
  ledger.baselineRevision = git(root, "rev-parse", "HEAD");
  ledger.records = [];
  ledger.sourceCount = 0;
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Migration baseline is empty");
});

test("retirement is limited to the approved local-skill tree", () => {
  const { root, ledger, save } = fixture();
  ledger.records[1].action = "retire";
  ledger.records[1].destinations = [];
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Retirement outside local-skill tree: notes/guide.md");
});

test.each(["raw-evidence", "immutable-evaluation-benchmark", "original-request-snapshot", "live-code-data"])(
  "audited %s records require bytes even when action and integrity change together",
  (kind) => {
    const { root, ledger, save } = fixture();
    ledger.records[0].kind = kind;
    ledger.records[0].action = "convert";
    ledger.records[0].destinations[0].integrity = "semantic";
    save();
    expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Immutable record requires a byte-preserved destination: notes/result.json");
  },
);

test("preparation rejects duplicate sources and destinations", () => {
  const { root, ledger, save } = fixture();
  ledger.records.push(structuredClone(ledger.records[0]));
  save();
  const { errors } = verifyWorkflowMigration(root, "preparation");
  expect(errors).toContain("Duplicate source: notes/result.json");
  expect(errors).toContain("Duplicate destination: docs/verification/result.json");
});

test.each(["../escape.json", "/tmp/escape.json", "docs/../escape.json", "docs//escape.json", "docs\\escape.json"])("preparation rejects the unsafe destination %s", (destination) => {
  const { root, ledger, save } = fixture();
  ledger.records[0].destinations[0].path = destination;
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Unsafe repository path: " + destination);
});

test("preparation rejects an absent target beneath an escaping symlink", () => {
  const { root, ledger, save } = fixture();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "acme-workflow-outside-"));
  roots.push(outside);
  fs.symlinkSync(outside, path.join(root, "docs/escape"), "dir");
  ledger.records[0].destinations[0].path = "docs/escape/result.json";
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Symlink escapes repository: docs/escape/result.json");
});

test("preparation checks immutable sources and targets against baseline bytes", () => {
  const { root, ledger, save } = fixture();
  write(root, "notes/result.json", "changed source");
  write(root, "docs/verification/result.json", "changed target");
  ledger.records[0].destinations[0].sha256 = hash("changed target");
  save();
  const { errors } = verifyWorkflowMigration(root, "preparation");
  expect(errors).toContain("Changed immutable source: notes/result.json");
  expect(errors).toContain("Destination hash differs from baseline: docs/verification/result.json");
  expect(errors).toContain("Changed immutable destination: docs/verification/result.json");
});

test("source fingerprints bind Git objects while current semantic records may change", () => {
  const { root, ledger, save } = fixture();
  write(root, "notes/guide.md", "# Current handoff\n");
  expect(verifyWorkflowMigration(root, "preparation").errors).toEqual([]);
  ledger.records[1].sourceSha256 = hash("# Current handoff\n");
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Source hash differs from baseline: notes/guide.md");
});

test("preparation reports absent planned targets and final rejects unfinished work", () => {
  const { root } = fixture();
  const preparation = verifyWorkflowMigration(root, "preparation");
  expect(preparation.passed).toBe(true);
  expect(preparation.pending).toContain("Missing target: docs/research/guide.md");
  const final = verifyWorkflowMigration(root, "final");
  expect(final.passed).toBe(false);
  expect(final.errors).toContain("Incomplete record: notes/guide.md (planned)");
  expect(final.errors).toContain("Missing target: docs/research/guide.md");
  expect(final.errors).toContain("Old root remains: notes");
});

test("prepared records require targets and current sources cannot disappear without a replacement", () => {
  const { root, ledger, save } = fixture();
  ledger.records[1].status = "prepared";
  fs.rmSync(path.join(root, ledger.records[0].source));
  save();
  const { errors } = verifyWorkflowMigration(root, "preparation");
  expect(errors).toContain("Missing target: docs/research/guide.md");
  expect(errors).toContain("Missing source and target: notes/result.json");
});

test("final passes only after complete records, required files and old-root removal", () => {
  const { root, ledger, raw, save } = fixture();
  write(root, "docs/verification/result.json", raw);
  write(root, "docs/research/guide.md", "# Guide\n");
  ledger.records.forEach((record) => {
    record.status = "complete";
  });
  ledger.newDocumentOwners.push("docs/STATUS.md");
  fs.rmSync(path.join(root, ledger.sourceRoots[0]), { recursive: true });
  save();
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Missing target: docs/STATUS.md");
  write(root, "docs/STATUS.md", "# Status\n");
  completeBatches(root);
  expect(verifyWorkflowMigration(root, "final").passed).toBe(true);
});

test("extracted fixtures preserve the exact baseline JSON string including its final newline", () => {
  const { root, ledger, save } = fixture();
  const source = JSON.stringify({ script: "run();\n" });
  write(root, "notes/capture.json", source);
  git(root, "add", "notes/capture.json");
  git(root, "commit", "-m", "Add capture");
  ledger.baselineRevision = git(root, "rev-parse", "HEAD");
  ledger.sourceCount++;
  ledger.records.push({
    source: "notes/capture.json",
    sourceSha256: hash(source),
    kind: "raw-evidence",
    action: "preserve",
    destinations: [{ path: "docs/verification/capture.json", integrity: "bytes", sha256: hash(source) }],
    batch: "raw",
    status: "planned",
  });
  ledger.extractedFixtures.push({
    source: "notes/capture.json",
    jsonPointer: "/script",
    destination: "scripts/verification/fixtures/script.js.txt",
    sha256: hash("run();\n"),
    utf8Bytes: 7,
    batch: "driver",
    status: "prepared",
  });
  write(root, "scripts/verification/fixtures/script.js.txt", "run();");
  write(
    root,
    auditDirectory + "/references.json",
    JSON.stringify({ schemaVersion: 1, baselineRevision: ledger.baselineRevision, markdown: [], literalConsumers: [], liveDependencyEdges: [], externalMutableCorrections: [] }),
  );
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Changed extracted fixture: scripts/verification/fixtures/script.js.txt");
});

test("final checks new Markdown links, reference links and anchors while ignoring fenced examples", () => {
  const { root } = completeFixture();
  write(
    root,
    "docs/agents/workflow.md",
    "[good](../research/guide.md#same-heading-1)\n[bad][missing]\n\n[missing]: ../research/absent.md\n\n[anchor](../research/guide.md#absent)\n\n~~~md\n[example](missing-example.md)\n~~~\n",
  );
  const { errors } = verifyWorkflowMigration(root, "final");
  expect(errors).toContain("Missing link target: docs/agents/workflow.md -> ../research/absent.md");
  expect(errors).toContain("Missing link anchor: docs/agents/workflow.md -> ../research/guide.md#absent");
  expect(errors.some((error) => error.includes("same-heading-1") || error.includes("missing-example"))).toBe(false);
});

test("final detects active old imports, file reads and Markdown instructions without treating negative test strings as imports", () => {
  const { root } = completeFixture();
  write(root, "scripts/driver.ts", 'import "../notes/driver.ts";\nconst text = Bun.file("notes/input.json");\n');
  write(root, "scripts/__tests__/driver.test.ts", 'const negative = \'import "../notes/driver.ts"\';\nconst actual = Bun.file("notes/active.json");\n');
  write(root, "docs/agents/workflow.md", "Read `notes/guide.md`.\n");
  const { errors } = verifyWorkflowMigration(root, "final");
  expect(errors).toContain("Active old-path reference: scripts/driver.ts -> ../notes/driver.ts");
  expect(errors).toContain("Active old-path reference: scripts/driver.ts -> notes/input.json");
  expect(errors).toContain("Active old-path reference: scripts/__tests__/driver.test.ts -> notes/active.json");
  expect(errors).toContain("Active old-path reference: docs/agents/workflow.md -> notes/guide.md");
  expect(errors).not.toContain('Active old-path reference: scripts/__tests__/driver.test.ts -> import "../notes/driver.ts"');
});

test("raw evidence and named audit provenance stay inert without hiding new scripts or report Markdown links", () => {
  const { root } = completeFixture();
  write(root, auditDirectory + "/task-04.json", JSON.stringify({ schemaVersion: 1, task: 4, source: "notes/guide.md", command: "bun notes/old.ts" }));
  write(root, auditDirectory + "/report.md", "[stale](../../../notes/guide.md)\n");
  const { errors } = verifyWorkflowMigration(root, "final");
  expect(errors).toContain("Active old-path reference: " + auditDirectory + "/report.md -> ../../../notes/guide.md");
  expect(errors.some((error) => error.includes("result.json") || error.includes("task-04.json"))).toBe(false);
});

test("live JSON executable fields stay active while their original source metadata stays inert", () => {
  const { root } = completeFixture();
  const source = "notes/cases.json";
  const target = "scripts/verification/cases.json";
  write(root, auditDirectory + "/live-file-audit.json", JSON.stringify({ files: [{ source, target, classification: "live-code-data" }] }));
  write(root, target, JSON.stringify([{ source: "notes/original.ts", setup: 'const input = Bun.file("notes/active.json");', body: "", options: "{}" }]));
  const { errors } = verifyWorkflowMigration(root, "final");
  expect(errors).toContain("Active old-path reference: " + target + " -> notes/active.json");
  expect(errors.some((error) => error.includes("original.ts"))).toBe(false);
});

test("explicit local-only research links report portability limits", () => {
  const { root, ledger } = completeFixture();
  const source = "notes/guide.md";
  const href = "../../tools/geist/corpus/md/reference.md";
  write(root, "docs/research/guide.md", "# Guide\n[local source](" + href + ")\n");
  write(
    root,
    auditDirectory + "/references.json",
    JSON.stringify({
      schemaVersion: 1,
      baselineRevision: ledger.baselineRevision,
      markdown: [{ source, href, resolvedSource: "tools/geist/corpus/md/reference.md", classification: "local-reference-corpus" }],
      literalConsumers: [],
      liveDependencyEdges: [],
      externalMutableCorrections: [],
    }),
  );
  const report = verifyWorkflowMigration(root, "final");
  expect(report.passed).toBe(true);
  expect(report.limits).toContain("Local-only reference; portable availability unverified: docs/research/guide.md -> " + href);
});

test("configuration comments do not hide active JSON path values", () => {
  const { root } = completeFixture();
  write(root, "tsconfig.json", '// Authored configuration\n{"files":["notes/active.ts"]}\n');
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Active old-path reference: tsconfig.json -> notes/active.ts");
});

test("JSON arrays remain valid reference inputs", () => {
  const { root } = completeFixture();
  write(root, "scripts/proofs.json", '[{"path":"notes/active.ts"}]\n');
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Active old-path reference: scripts/proofs.json -> notes/active.ts");
});

test("repository heading anchors retain spaces around punctuation", () => {
  const { root } = completeFixture();
  write(root, "docs/research/guide.md", "# Guide — [dated](#guide--dated)\n\n[heading](#guide--dated)\n");
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([]);
});

test("consumer skill release links resolve in the generated package projection", () => {
  const { root } = completeFixture();
  write(root, "skills/html-artifacts/SKILL.md", "[release](../references/release.json)\n");
  const report = verifyWorkflowMigration(root, "final");
  expect(report.passed).toBe(true);
  expect(report.limits).toContain("Consumer skill release reference is generated by scripts/consumer-skills.ts; packed-package availability requires the package gate: skills/html-artifacts/SKILL.md");
});

test("final requires each batch result to name its batch and report verified completion", () => {
  const { root, ledger, save } = completeFixture();
  ledger.batchIndex = auditDirectory + "/batches.json";
  const result = auditDirectory + "/batches/raw.json";
  fs.rmSync(path.join(root, result));
  save();
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Missing batch result: " + result);
  write(root, result, JSON.stringify({ schemaVersion: 1, batch: "raw", status: "prepared", verification: { passed: false } }));
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Unverified batch result: " + result);
  write(root, result, JSON.stringify({ schemaVersion: 1, batch: "other", status: "complete", verification: { passed: true } }));
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Batch result identity mismatch: " + result);
  write(root, result, JSON.stringify({ schemaVersion: 1, batch: "raw", status: "complete", verification: { passed: true }, sources: ["notes/result.json"] }));
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([]);
});

test.each(["docs/STATUS.md", "tasks/plan.md", "tasks/todo.md", "spec/SPEC-current.md"])("active instructions in %s cannot retain old commands", (file) => {
  const { root } = completeFixture();
  write(root, file, "Run `bun notes/old.ts`.\n");
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Active old-path reference: " + file + " -> bun notes/old.ts");
});

test("literal repository inputs, runners and static local imports must exist", () => {
  const { root } = completeFixture();
  write(root, "scripts/driver.ts", 'import "./missing-helper";\nconst input = Bun.file("docs/verification/missing.json");\nBun.spawnSync(["bun", "scripts/verification/missing.ts"]);\n');
  const { errors } = verifyWorkflowMigration(root, "final");
  expect(errors).toContain("Missing source reference: scripts/driver.ts -> ./missing-helper");
  expect(errors).toContain("Missing source reference: scripts/driver.ts -> docs/verification/missing.json");
  expect(errors).toContain("Missing source reference: scripts/driver.ts -> scripts/verification/missing.ts");
});

test("literal module resolution supports dotted extensionless names and directory file URLs", () => {
  const { root } = completeFixture();
  write(root, "scripts/theme.styles.ts", "export {};\n");
  write(root, "scripts/policy.config.ts", "export {};\n");
  write(root, "scripts/driver.ts", 'import "./theme.styles";\nimport "./policy.config";\nconst root = new URL("../", import.meta.url);\n');
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([]);
});

test("literal worker JavaScript URLs resolve their authored TypeScript entrypoint", () => {
  const { root } = completeFixture();
  write(root, "scripts/worker.ts", "export {};\n");
  write(root, "scripts/driver.ts", 'const worker = new Worker(new URL("./worker.js", import.meta.url));\n');
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([]);
});

test("the two generated runtime URL projections report their package verification limit", () => {
  const { root } = completeFixture();
  write(root, "packages/mcp/src/cli.ts", 'const data = Bun.file(new URL("./documentation.json", import.meta.url));\n');
  write(root, "src/shared/flow-engine.ts", 'const worker = new URL("./elk-worker.js", import.meta.url);\n');
  const report = verifyWorkflowMigration(root, "final");
  expect(report.errors).toEqual([]);
  expect(report.limits).toContain("Generated runtime URL requires the package gate: packages/mcp/src/cli.ts -> ./documentation.json");
  expect(report.limits).toContain("Generated runtime URL requires the package gate: src/shared/flow-engine.ts -> ./elk-worker.js");
});

test("a resolved import extension cannot escape through an ignored symlink", () => {
  const { root } = completeFixture();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "acme-workflow-import-"));
  roots.push(outside);
  fs.writeFileSync(path.join(outside, "helper.ts"), "export {};\n");
  write(root, "scripts/driver.ts", 'import "./helper";\n');
  write(root, ".gitignore", "scripts/helper.ts\n");
  fs.symlinkSync(path.join(outside, "helper.ts"), path.join(root, "scripts/helper.ts"));
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Source reference escapes repository: scripts/driver.ts -> ./helper");
});

test("computed reads and explicit runtime working directories report execution limits", () => {
  const { root } = completeFixture();
  write(root, "scripts/driver.ts", 'const input = Bun.file(path.join(runtime, "input.json"));\nBun.spawnSync(["bun", "scripts/runtime.ts"], {cwd: runtime});\n');
  const report = verifyWorkflowMigration(root, "final");
  expect(report.errors).toEqual([]);
  expect(report.limits).toContain("Computed or runtime-dependent source paths require execution: scripts/driver.ts");
});

test("test process argument arrays stay active while unrelated arrays stay inert", () => {
  const { root } = completeFixture();
  write(root, "scripts/__tests__/driver.test.ts", 'const negative = ["bun", "notes/negative.ts"];\nBun.spawnSync(["bun", "notes/active.ts"]);\n');
  const { errors } = verifyWorkflowMigration(root, "final");
  expect(errors).toContain("Active old-path reference: scripts/__tests__/driver.test.ts -> notes/active.ts");
  expect(errors.some((error) => error.includes("negative.ts"))).toBe(false);
});

test("batch accountability cannot be removed with its index or a whole batch", () => {
  const { root, ledger, save } = completeFixture();
  Reflect.deleteProperty(ledger, "batchIndex");
  save();
  expect(verifyWorkflowMigration(root, "final").errors).toContain("The production batch index is required");
  ledger.batchIndex = auditDirectory + "/batches.json";
  save();
  write(root, ledger.batchIndex, JSON.stringify({ schemaVersion: 1, batches: [] }));
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Unlisted batch: raw");
  ledger.records = [];
  ledger.sourceCount = 0;
  save();
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Unlisted source: notes/result.json");
});

test("batch scope must match its records and extracted fixtures", () => {
  const { root, ledger } = completeFixture();
  const index = JSON.parse(fs.readFileSync(path.join(root, ledger.batchIndex!), "utf8"));
  index.batches[0].destinations = [];
  write(root, ledger.batchIndex!, JSON.stringify(index));
  expect(verifyWorkflowMigration(root, "final").errors).toContain("Batch scope differs from ledger: raw");
});

test.each(["ledger.json", "references.json", "live-file-audit.json"])("fixed metadata %s is checked before reading an escaping symlink", (file) => {
  const { root } = fixture();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "acme-workflow-metadata-"));
  roots.push(outside);
  fs.writeFileSync(path.join(outside, "invalid.json"), "not JSON");
  fs.rmSync(path.join(root, auditDirectory, file));
  fs.symlinkSync(path.join(outside, "invalid.json"), path.join(root, auditDirectory, file));
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Symlink escapes repository: " + auditDirectory + "/" + file);
});

test("a completed fixture accepts the actual verifier and its real test source", () => {
  const { root } = completeFixture();
  write(root, "scripts/workflow-migration.ts", fs.readFileSync(path.join(import.meta.dir, "../workflow-migration.ts"), "utf8"));
  write(root, "scripts/__tests__/workflow-migration.test.ts", fs.readFileSync(import.meta.path, "utf8"));
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([]);
});

test("destinations cannot alias one physical target through an internal symlink", () => {
  const { root, ledger, save } = fixture();
  fs.symlinkSync("verification", path.join(root, "docs/alias"));
  ledger.records[1].destinations[0].path = "docs/alias/result.json";
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Duplicate physical destination: docs/alias/result.json");
});

test("mutable repository URLs remain active while immutable commit URLs preserve provenance", () => {
  const { root } = completeFixture();
  write(
    root,
    "docs/agents/workflow.md",
    "[mutable](https://github.com/acmelabs-15/design-system/blob/main/notes/guide.md)\n[original](https://github.com/acmelabs-15/design-system/blob/0123456789abcdef0123456789abcdef01234567/notes/guide.md)\n",
  );
  const report = verifyWorkflowMigration(root, "final");
  expect(report.errors).toContain("Active old-path reference: docs/agents/workflow.md -> https://github.com/acmelabs-15/design-system/blob/main/notes/guide.md");
  expect(report.errors.some((error) => error.includes("0123456789abcdef"))).toBe(false);
  write(root, "docs/agents/workflow.md", "[release](https://github.com/acmelabs-15/design-system/blob/v0.3.2/notes/guide.md)\n");
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([]);
});

test("preserved records cannot weaken their byte-integrity policy", () => {
  const { root, ledger, save } = fixture();
  ledger.records[0].destinations[0].integrity = "semantic";
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Preserved record requires byte integrity: notes/result.json");
});

test("new document owners cannot duplicate an allocated destination", () => {
  const { root, ledger, save } = fixture();
  ledger.newDocumentOwners.push("docs/research/guide.md");
  save();
  expect(verifyWorkflowMigration(root, "preparation").errors).toContain("Duplicate destination: docs/research/guide.md");
});

test("the verifier scope declaration is metadata while its imports stay active", () => {
  const { root } = completeFixture();
  write(root, "scripts/workflow-migration.ts", 'const approvedSourceRoots = ["notes", "PLAN.md", ".agents/skills"];\nimport "../notes/active.ts";\n');
  expect(verifyWorkflowMigration(root, "final").errors).toEqual([
    "Active old-path reference: scripts/workflow-migration.ts -> ../notes/active.ts",
    "Missing source reference: scripts/workflow-migration.ts -> ../notes/active.ts",
  ]);
});
