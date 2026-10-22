import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

type MigrationStatus = "planned" | "prepared" | "complete";
interface Destination {
  path: string;
  integrity: "bytes" | "semantic";
  sha256?: string;
}
interface MigrationRecord {
  source: string;
  sourceSha256: string;
  kind: string;
  action: "preserve" | "convert" | "split" | "retire";
  destinations: Destination[];
  batch: string;
  status: MigrationStatus;
}
export interface MigrationLedger {
  schemaVersion: number;
  baselineRevision: string;
  additionalSourceRevisions?: string[];
  sourceRoots: string[];
  sourceCount: number;
  records: MigrationRecord[];
  extractedFixtures: { source: string; jsonPointer: string; destination: string; sha256: string; utf8Bytes: number; batch: string; status: MigrationStatus }[];
  relatedUpdates: string[];
  newDocumentOwners: string[];
  auditInputs: string[];
  batchIndex: string;
}
export interface MigrationReport {
  mode: "preparation" | "final";
  passed: boolean;
  errors: string[];
  pending: string[];
  limits: string[];
  fingerprints: Record<string, string>;
  counts: { sources: number; destinations: number; extractedFixtures: number; batches: number };
}

const auditDirectory = "docs/verification/workflow-migration";
const approvedSourceRoots = ["notes", "PLAN.md", ".agents/skills"] as const;
const sha256 = (bytes: Uint8Array | string) => new Bun.CryptoHasher("sha256").update(bytes).digest("hex");

function git(root: string, args: string[], stdin?: Uint8Array) {
  const result = Bun.spawnSync(["git", ...args], { cwd: root, stdin, stdout: "pipe", stderr: "pipe", maxBuffer: 128 * 1024 * 1024 });
  if (result.exitCode !== 0) {
    throw new Error(result.stderr.toString().trim());
  }
  return result.stdout;
}

function contained(root: string, file: string) {
  const relative = path.relative(root, file);
  return relative !== ".." && !relative.startsWith("../") && !path.isAbsolute(relative);
}

function safePath(root: string, file: string, errors: string[]) {
  if (
    !file ||
    /[\\:]/.test(file) ||
    [...file].some((character) => character.charCodeAt(0) < 32) ||
    path.posix.isAbsolute(file) ||
    path.posix.normalize(file) !== file ||
    file === "." ||
    file === ".." ||
    file.startsWith("../")
  ) {
    errors.push("Unsafe repository path: " + file);
    return false;
  }
  let current = root;
  for (const part of file.split("/")) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) {
      // A dangling symlink must not turn into an unchecked target when created later.
      if (fs.lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink()) {
        errors.push("Unresolved symlink: " + file);
        return false;
      }
      break;
    }
    if (!contained(root, fs.realpathSync(current))) {
      errors.push("Symlink escapes repository: " + file);
      return false;
    }
  }
  return true;
}

function baselineBytes(root: string, revision: string, files: string[]) {
  const output = git(root, ["cat-file", "--batch"], Buffer.from(files.map((file) => revision + ":" + file).join("\n") + "\n"));
  const result = new Map<string, Buffer>();
  let offset = 0;
  for (const file of files) {
    const end = output.indexOf(10, offset);
    const header = output.subarray(offset, end).toString();
    const match = /^\w+ blob (\d+)$/.exec(header);
    if (!match) {
      throw new Error("Cannot read baseline blob: " + file);
    }
    const size = Number(match[1]);
    result.set(file, output.subarray(end + 1, end + 1 + size));
    offset = end + 2 + size;
  }
  return result;
}

function filesystemSources(root: string, sourceRoots: string[], errors: string[]) {
  const files: string[] = [];
  const visit = (file: string) => {
    if (!safePath(root, file, errors)) {
      return;
    }
    const absolute = path.join(root, file);
    const stat = fs.lstatSync(absolute, { throwIfNoEntry: false });
    if (!stat) {
      return;
    }
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(absolute).sort()) {
        visit(path.posix.join(file, name));
      }
    } else {
      // A symlink is a source entry, not another tree to traverse.
      files.push(file);
    }
  };
  sourceRoots.forEach(visit);
  return files;
}

function physicalPath(root: string, file: string): string {
  const absolute = path.join(root, file);
  if (fs.existsSync(absolute)) {
    return fs.realpathSync(absolute);
  }
  return path.join(physicalPath(root, path.dirname(file)), path.basename(file));
}

interface ReferenceAudit {
  baselineRevision: string;
  markdown: { source: string; href: string; resolvedSource: string; classification: string }[];
  externalMutableCorrections: { currentUrl: string; applied: boolean }[];
  resolvedHistoricalLinks?: { source: string; oldHref: string; newHref: string }[];
}

function markdownReferences(text: string) {
  const links: string[] = [],
    code: string[] = [],
    anchors = new Set<string>();
  Bun.markdown.render(
    text,
    {
      link: (children, meta) => {
        links.push(meta.href);
        return children;
      },
      image: (_, meta) => {
        links.push(meta.src);
        return "";
      },
      heading: (children) => {
        // GitHub retains both surrounding spaces when punctuation is removed.
        const base = children
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
          .replaceAll(" ", "-");
        let id = base,
          suffix = 0;
        while (anchors.has(id)) {
          id = base + "-" + ++suffix;
        }
        anchors.add(id);
        return "";
      },
      codespan: (value) => {
        code.push(value);
        return value;
      },
      code: (value) => {
        code.push(value);
        return "";
      },
      html: (value) => {
        for (const match of value.matchAll(/\b(href|src|id|name)=["']([^"']+)["']/g)) {
          if (match[1] === "href" || match[1] === "src") {
            links.push(match[2]);
          } else {
            anchors.add(match[2]);
          }
        }
        return "";
      },
    },
    { headings: { ids: true } },
  );
  return { links, code, anchors };
}

function censusProvenance(source: ts.SourceFile) {
  const bindings = new Map<ts.StringLiteralLike, string>();
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "docCensus" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      for (const record of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(record)) {
          continue;
        }
        const properties = new Map(
          record.properties.flatMap((property) =>
            ts.isPropertyAssignment(property) && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) ? [[property.name.text, property.initializer] as const] : [],
          ),
        );
        if (properties.size !== record.properties.length) {
          continue;
        }
        const text = (name: string) => {
          const value = properties.get(name);
          return value && ts.isStringLiteralLike(value) ? value.text : undefined;
        };
        const fixture = text("fixtureId"),
          revision = text("referenceRevision"),
          paths = properties.get("acceptedDifferences");
        if (text("status") !== "historical" || !fixture || !revision || !/^[a-f\d]{40}$/.test(revision) || !paths || !ts.isArrayLiteralExpression(paths)) {
          continue;
        }
        for (const value of paths.elements) {
          if (ts.isStringLiteralLike(value)) {
            bindings.set(value, JSON.stringify([fixture, revision, value.text]));
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return bindings;
}

function sourceReferences(file: string, text: string, historicalBindings = new Set<string>()) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const historical = new Set<ts.Node>(historicalBindings.size ? [...censusProvenance(source)].filter(([, binding]) => historicalBindings.has(binding)).map(([node]) => node) : []);
  const values: string[] = [];
  const inputs: { value: string; module: boolean; url?: boolean }[] = [];
  const inputNodes = new Set<ts.Node>();
  let computed = false;
  const launch = (node: ts.Node) => ts.isCallExpression(node) && /(?:^|\.)(?:spawn|spawnSync)$/.test(node.expression.getText(source));
  const literal = (node: ts.Node | undefined) => (node && ts.isStringLiteralLike(node) ? node.text : undefined);
  const input = (node: ts.Node | undefined, module = false, url = false) => {
    const value = literal(node);
    if (value === undefined) {
      computed = true;
    } else {
      inputNodes.add(node!);
      inputs.push({ value, module, url });
    }
  };
  const visit = (node: ts.Node) => {
    // The verifier's fixed source-root list declares migration scope, not a live consumer path.
    if (file === "scripts/workflow-migration.ts" && ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "approvedSourceRoots") {
      return;
    }
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      input(node.moduleSpecifier, true);
    }
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const operation = node.expression.getText(source);
      const args = node.arguments ?? [];
      if (/^(?:import|require)$/.test(operation)) {
        input(args[0], true);
      } else if (/(?:^|\.)(?:readFile|readFileSync|readFileSyncUtf8|file)$/.test(operation)) {
        input(args[0]);
      } else if (operation === "URL" && args[1]?.getText(source) === "import.meta.url") {
        input(args[0], true, true);
      } else if (launch(node)) {
        const options = args[1];
        const runtimeCwd = options && ts.isObjectLiteralExpression(options) && options.properties.some((property) => property.name?.getText(source) === "cwd");
        const command = args[0];
        if (command && ts.isArrayLiteralExpression(command) && !runtimeCwd) {
          for (const operand of command.elements.slice(1)) {
            const value = literal(operand);
            if (value && /\.[cm]?[jt]sx?$/.test(value) && !/[\s;()]/.test(value)) {
              inputs.push({ value, module: false });
            } else if (value === undefined) {
              computed = true;
            }
          }
        } else {
          computed = true;
        }
      }
    }
    if (ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      // Test data is not a dependency. Imports and actual file/path operations still are.
      const parent = node.parent;
      const directOperation =
        (ts.isCallExpression(parent) || ts.isNewExpression(parent)) &&
        /(?:^import$|(?:^|\.)(?:file|readFile(?:Sync)?|writeFile(?:Sync)?|open(?:Sync)?|readdir(?:Sync)?|stat(?:Sync)?|existsSync|join|resolve|URL|spawn(?:Sync)?|require)$)/.test(
          parent.expression.getText(source),
        );
      const launchOperand = ts.isArrayLiteralExpression(parent) && launch(parent.parent);
      if (!inputNodes.has(node) && !historical.has(node) && (!file.includes("/__tests__/") || ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || directOperation || launchOperand)) {
        values.push(node.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { values, inputs, computed, historical: historical.size };
}

function checkReferences(root: string, ledger: MigrationLedger, report: MigrationReport, baseline: ReadonlyMap<string, Buffer>) {
  const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");
  const audit = (file: string) => {
    const text = read(file);
    report.fingerprints[file] = sha256(text);
    return JSON.parse(text);
  };
  const references: ReferenceAudit = audit(auditDirectory + "/references.json");
  const live: { files: { source: string; target: string; classification: string }[] } = audit(auditDirectory + "/live-file-audit.json");
  if (references.baselineRevision !== ledger.baselineRevision) {
    report.errors.push("Reference audit baseline differs from ledger");
  }
  const pending = (message: string) => (report.mode === "final" ? report.errors : report.pending).push(message);
  const oldRootPath = (value: string) => {
    const normalized = path.posix.normalize(value.split(/[?#]/, 1)[0]).replace(/\/$/, "");
    return ledger.sourceRoots.some((oldRoot) => normalized === oldRoot || normalized.startsWith(oldRoot + "/"));
  };
  const oldPaths = ledger.sourceRoots.map((oldRoot) => {
    const escaped = oldRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // An ordinary word is not a path. A slash, filename or resolved input supplies path context.
    const tail = /[./]/.test(oldRoot) ? "(?:/[^\\s\"'`(),;<>]*)?(?=$|[\\s\"'`),#?])" : "/[^\\s\"'`(),;<>]*";
    return new RegExp("(^|[\\s\"'`(=:])((?:\\.\\.?/)*" + escaped + tail + ")", "g");
  });
  const active = (file: string, value: string, resolved?: string) => {
    const repositoryUrl = /^https:\/\/github\.com\/acmelabs-15\/design-system\/(?:blob|tree)\/([^/]+)\/(.*)$/.exec(value);
    let retained = false;
    if (repositoryUrl) {
      retained = !/^(?:[a-f\d]{40}|v\d+\.\d+\.\d+(?:[-+][\w.-]+)?)$/.test(repositoryUrl[1]) && oldRootPath(repositoryUrl[2]);
    } else if (resolved !== undefined) {
      retained = oldRootPath(resolved);
    } else if (!/^[a-z][a-z\d+.-]*:/i.test(value)) {
      retained = oldPaths.some((pattern) => [...value.matchAll(pattern)].some((match) => oldRootPath(match[2].replace(/^(?:\.\.?\/)+/, ""))));
    }
    if (retained) {
      pending("Active old-path reference: " + file + " -> " + value);
    }
  };
  const originals = new Map<string, string>();
  const immutable = new Set<string>();
  const targets = new Set([...ledger.newDocumentOwners, ...ledger.relatedUpdates]);
  for (const record of ledger.records) {
    for (const destination of record.destinations) {
      targets.add(destination.path);
      originals.set(destination.path, record.source);
      if (destination.integrity === "bytes") {
        immutable.add(destination.path);
        immutable.add(record.source);
      }
    }
  }
  for (const fixture of ledger.extractedFixtures) {
    immutable.add(fixture.destination);
  }
  const liveData = new Set(live.files.flatMap((file) => (file.classification === "live-code-data" ? [file.source, file.target] : [])));
  const auditData = new Set([
    ...ledger.auditInputs.filter((file) => file.endsWith(".json")),
    auditDirectory + "/ledger.json",
    auditDirectory + "/references.json",
    auditDirectory + "/live-file-audit.json",
  ]);
  const documents = new Map<string, ReturnType<typeof markdownReferences>>();
  const historicalBindings = new Set<string>();
  if (fs.existsSync(path.join(root, "site/recipes.ts"))) {
    try {
      const original = git(root, ["show", ledger.baselineRevision + ":site/recipes.ts"]).toString();
      for (const binding of censusProvenance(ts.createSourceFile("site/recipes.ts", original, ts.ScriptTarget.Latest, true)).values()) {
        historicalBindings.add(binding);
      }
    } catch {
      // No baseline binding means no provenance exemption for current source literals.
    }
  }
  const source = (file: string, text: string) => {
    const parsed = sourceReferences(file, text, file === "site/recipes.ts" ? historicalBindings : undefined);
    parsed.values.forEach((value) => active(file, value));
    if (parsed.historical) {
      report.limits.push("Historical census source paths retain their exact baseline fixture/revision binding: " + file);
    }
    if (parsed.computed) {
      report.limits.push("Computed or runtime-dependent source paths require execution: " + file);
    }
    for (const reference of parsed.inputs) {
      const { value } = reference;
      if (reference.module && !reference.url && !value.startsWith(".")) {
        continue;
      }
      let resolved: string;
      if (reference.url) {
        let absolute: string;
        try {
          const url = new URL(value, pathToFileURL(path.join(root, file)));
          if (url.protocol !== "file:") {
            active(file, value);
            report.limits.push("External or runtime source path requires execution: " + file + " -> " + value);
            continue;
          }
          absolute = fileURLToPath(url);
        } catch {
          report.errors.push("Invalid source URL: " + file + " -> " + value);
          continue;
        }
        if (!contained(root, absolute)) {
          report.errors.push("Source reference escapes repository: " + file + " -> " + value);
          continue;
        }
        resolved = path.relative(root, absolute) || ".";
      } else {
        resolved = path.posix.normalize(reference.module ? path.posix.join(path.posix.dirname(file), value) : value).replace(/\/$/, "");
      }
      active(file, value, resolved);
      // site/build.ts writes the MCP data; scripts/browser-assets.ts writes the worker beside built entrypoints.
      if (reference.url && ((file === "packages/mcp/src/cli.ts" && value === "./documentation.json") || (file === "src/shared/flow-engine.ts" && value === "./elk-worker.js"))) {
        report.limits.push("Generated runtime URL requires the package gate: " + file + " -> " + value);
        continue;
      }
      if (/^(?:[a-z][a-z\d+.-]*:|\/|node_modules\/|dist\/|_site\/|\.artifacts\/)/i.test(resolved)) {
        report.limits.push("External or runtime source path requires execution: " + file + " -> " + value);
        continue;
      }
      if (!(reference.url && resolved === ".") && !safePath(root, resolved, report.errors)) {
        continue;
      }
      let absolute = path.join(root, resolved);
      if (reference.module && (!reference.url || /\.[cm]?[jt]sx?$/.test(resolved))) {
        try {
          absolute = Bun.resolveSync(reference.url ? path.join(root, resolved) : value, path.dirname(path.join(root, file)));
        } catch {
          absolute = "";
        }
      }
      if (absolute && fs.existsSync(absolute) && !contained(root, fs.realpathSync(absolute))) {
        report.errors.push("Source reference escapes repository: " + file + " -> " + value);
        continue;
      }
      if (absolute && fs.existsSync(absolute)) {
        active(file, value, path.relative(root, fs.realpathSync(absolute)));
      }
      if (!absolute || !fs.existsSync(absolute) || (!reference.url && !fs.statSync(absolute).isFile())) {
        const allocated = targets.has(resolved) || (reference.module && [...targets].some((target) => target.replace(/\.[cm]?[jt]sx?$/, "") === resolved.replace(/\.[cm]?js$/, "")));
        (report.mode === "preparation" && allocated ? report.pending : report.errors).push("Missing source reference: " + file + " -> " + value);
      }
    }
  };
  const document = (file: string) => {
    let parsed = documents.get(file);
    if (!parsed) {
      parsed = markdownReferences(read(file));
      documents.set(file, parsed);
    }
    return parsed;
  };
  const link = (file: string, href: string) => {
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//")) {
      active(file, href);
      return;
    }
    if (/^skills\/[^/]+\/SKILL\.md$/.test(file) && href === "../references/release.json") {
      report.limits.push("Consumer skill release reference is generated by scripts/consumer-skills.ts; packed-package availability requires the package gate: " + file);
      return;
    }
    const [pathname, anchor] = href.split("#", 2);
    const decoded = decodeURIComponent(pathname.split("?", 1)[0]);
    const resolved = decoded ? path.posix.normalize(path.posix.join(path.posix.dirname(file), decoded)) : file;
    const original = originals.get(file) ?? file;
    const classified = references.markdown.find((entry) => entry.source === original && (entry.href === href || entry.resolvedSource === resolved));
    if (classified && ["external-local-reference", "local-reference-corpus"].includes(classified.classification)) {
      report.limits.push("Local-only reference; portable availability unverified: " + file + " -> " + href);
      return;
    }
    if (references.resolvedHistoricalLinks?.some((entry) => entry.source === original && entry.oldHref === href)) {
      pending("Historical link correction pending: " + file + " -> " + href);
      return;
    }
    active(file, href, resolved);
    if (path.isAbsolute(decoded) || !contained(root, path.resolve(root, resolved))) {
      report.errors.push("Link escapes repository: " + file + " -> " + href);
      return;
    }
    if (!safePath(root, resolved, report.errors)) {
      return;
    }
    const absolute = path.join(root, resolved);
    if (!fs.existsSync(absolute)) {
      (report.mode === "preparation" && targets.has(resolved) ? report.pending : report.errors).push("Missing link target: " + file + " -> " + href);
    } else if (anchor && /\.md$/i.test(resolved) && !document(resolved).anchors.has(decodeURIComponent(anchor))) {
      report.errors.push("Missing link anchor: " + file + " -> " + href);
    }
  };
  const files = git(root, ["ls-files", "--cached", "--others", "--exclude-standard", "-z"]).toString().split("\0").filter(Boolean);
  for (const file of new Set([...files, ...targets])) {
    if (!/\.(?:md|[cm]?[jt]sx?|json|ya?ml|toml|sh)$/.test(file) || !fs.existsSync(path.join(root, file)) || !fs.statSync(path.join(root, file)).isFile()) {
      continue;
    }
    if (!safePath(root, file, report.errors)) {
      continue;
    }
    if (liveData.has(file)) {
      const entries: Record<string, string>[] = JSON.parse(read(file));
      for (const entry of entries) {
        for (const key of ["fixture", "setup", "body", "options"]) {
          if (entry[key]) {
            if (key === "fixture") {
              active(file, entry[key]);
            } else {
              source(file, entry[key]);
            }
          }
        }
      }
    } else if (immutable.has(file)) {
      continue;
    } else if (file.endsWith(".md")) {
      const parsed = document(file);
      parsed.links.forEach((href) => link(file, href));
      if (
        /^(?:AGENTS|CLAUDE|README|CONTEXT(?:-MAP)?)\.md$/.test(file) ||
        /^(?:docs\/(?:agents|development)|skills|spec)\//.test(file) ||
        ["docs/STATUS.md", "tasks/plan.md", "tasks/todo.md"].includes(file)
      ) {
        parsed.code.forEach((value) => active(file, value));
      }
    } else if (/\.[cm]?[jt]sx?$/.test(file)) {
      source(file, read(file));
    } else if (file.endsWith(".json")) {
      let value: unknown;
      try {
        value = JSON.parse(read(file));
      } catch {
        const parsed = ts.parseConfigFileTextToJson(file, read(file));
        if (parsed.error) {
          report.errors.push("Cannot parse JSON: " + file);
          continue;
        }
        value = parsed.config;
      }
      const taskName = /^task-(\d+(?:-supplemental)?)\.json$/.exec(path.basename(file))?.[1];
      const taskReport =
        file.startsWith(auditDirectory + "/") &&
        taskName &&
        value &&
        typeof value === "object" &&
        (("schemaVersion" in value && value.schemaVersion === 1 && "task" in value && (value.task === taskName || (typeof value.task === "number" && value.task === Number(taskName)))) ||
          (taskName === "02" && "baselineRevision" in value && "sourceCoverage" in value && "scope" in value));
      const batchReport =
        file.startsWith(auditDirectory + "/batches/") && value && typeof value === "object" && "schemaVersion" in value && value.schemaVersion === 1 && "batch" in value && "verification" in value;
      if (!auditData.has(file) && file !== ledger.batchIndex && !taskReport && !batchReport) {
        const researchRecord =
          file === auditDirectory + "/initial-research.json"
            ? ledger.records.find(
                (record) =>
                  record.kind === "migration-research-record" &&
                  record.action === "convert" &&
                  record.destinations.some((destination) => destination.path === file && destination.integrity === "semantic"),
              )
            : undefined;
        const provenance = value && typeof value === "object" && "migrationProvenance" in value ? value.migrationProvenance : undefined;
        const original = researchRecord && baseline.get(researchRecord.source);
        const originalFields: Record<string, unknown> | undefined =
          researchRecord &&
          original &&
          provenance &&
          typeof provenance === "object" &&
          "source" in provenance &&
          provenance.source === researchRecord.source &&
          "sourceSha256" in provenance &&
          provenance.sourceSha256 === sha256(original)
            ? JSON.parse(original.toString())
            : undefined;
        const assetCatalog =
          file === "assets/material-symbols/catalog.json" &&
          value &&
          typeof value === "object" &&
          "revision" in value &&
          typeof value.revision === "string" &&
          /^[a-f\d]{40}$/.test(value.revision) &&
          "symbols" in value &&
          Array.isArray(value.symbols);
        const strings = (item: unknown, keys: string[] = []) => {
          if (
            originalFields &&
            ((keys.length === 1 && Object.hasOwn(originalFields, keys[0]) && JSON.stringify(originalFields[keys[0]]) === JSON.stringify(item)) ||
              (keys.join(".") === "migrationProvenance.source" && item === researchRecord?.source))
          ) {
            return;
          }
          if (typeof item === "string") {
            if (assetCatalog && /^symbols\.\d+\.assets\.\d+\.file$/.test(keys.join("."))) {
              const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), item));
              active(file, item, resolved);
              if (safePath(root, resolved, report.errors) && !fs.existsSync(path.join(root, resolved))) {
                report.errors.push("Missing asset catalog file: " + file + " -> " + item);
              }
            } else {
              active(file, item);
            }
          } else if (item && typeof item === "object") {
            Object.entries(item).forEach(([key, child]) => strings(child, [...keys, key]));
          }
        };
        strings(value);
      }
    } else {
      read(file)
        .split("\n")
        .forEach((value) => active(file, value));
    }
  }
  for (const correction of references.externalMutableCorrections) {
    if (!correction.applied) {
      pending("External link correction pending: " + correction.currentUrl);
    }
  }
  report.limits.push("Static reference checks do not execute drivers, resolve computed paths, verify prose meaning, test agent startup, or fetch external links.");
  report.limits.push("Named audit JSON and schema-labelled task reports are provenance data. Their Markdown links remain checked.");
}

export function verifyWorkflowMigration(root: string, mode: "preparation" | "final"): MigrationReport {
  root = fs.realpathSync(root);
  const report: MigrationReport = { mode, passed: false, errors: [], pending: [], limits: [], fingerprints: {}, counts: { sources: 0, destinations: 0, extractedFixtures: 0, batches: 0 } };
  const ledgerFile = auditDirectory + "/ledger.json";
  for (const name of ["ledger.json", "references.json", "live-file-audit.json", "batches.json"]) {
    safePath(root, auditDirectory + "/" + name, report.errors);
  }
  if (report.errors.length) {
    return report;
  }
  const ledgerBytes = fs.readFileSync(path.join(root, ledgerFile));
  const ledger: MigrationLedger = JSON.parse(ledgerBytes.toString());
  if (ledger.schemaVersion !== 1 || typeof ledger.baselineRevision !== "string" || !/^[a-f0-9]{40}$/.test(ledger.baselineRevision) || !ledger.sourceRoots.length) {
    throw new Error("Unsupported ledger schema or baseline revision");
  }
  const additions = ledger.additionalSourceRevisions;
  if (
    additions !== undefined &&
    (!Array.isArray(additions) ||
      additions.length === 0 ||
      additions.some((revision) => typeof revision !== "string" || !/^[a-f0-9]{40}$/.test(revision)) ||
      new Set([ledger.baselineRevision, ...additions]).size !== additions.length + 1)
  ) {
    throw new Error("Unsupported supplemental source revisions");
  }
  report.fingerprints[ledgerFile] = sha256(ledgerBytes);
  if (ledger.batchIndex !== auditDirectory + "/batches.json") {
    report.errors.push("The production batch index is required");
  }
  if (ledger.sourceRoots.length !== approvedSourceRoots.length || !approvedSourceRoots.every((sourceRoot) => ledger.sourceRoots.includes(sourceRoot))) {
    report.errors.push("Source roots differ from approved migration scope");
  }
  const seenSources = new Set<string>();
  const seenTargets = new Set<string>();
  const physicalTargets = new Set<string>();
  const destinationPath = (file: string) => {
    if (safePath(root, file, report.errors)) {
      const physical = physicalPath(root, file);
      if (physicalTargets.has(physical)) {
        report.errors.push("Duplicate physical destination: " + file);
      }
      physicalTargets.add(physical);
    }
    if (seenTargets.has(file)) {
      report.errors.push("Duplicate destination: " + file);
    }
    seenTargets.add(file);
  };
  for (const record of ledger.records) {
    safePath(root, record.source, report.errors);
    if (seenSources.has(record.source)) {
      report.errors.push("Duplicate source: " + record.source);
    }
    seenSources.add(record.source);
    if (record.action === "preserve" && record.destinations.some((destination) => destination.integrity !== "bytes")) {
      report.errors.push("Preserved record requires byte integrity: " + record.source);
    }
    const immutableKind = record.kind.startsWith("immutable-") || ["raw-evidence", "original-request-snapshot", "live-code-data"].includes(record.kind);
    if (immutableKind && !record.destinations.some((destination) => destination.integrity === "bytes")) {
      report.errors.push("Immutable record requires a byte-preserved destination: " + record.source);
    }
    if (record.action === "retire" && !record.source.startsWith(approvedSourceRoots[2] + "/")) {
      report.errors.push("Retirement outside local-skill tree: " + record.source);
    }
    if (record.action === "retire" && record.batch !== "11-cutover") {
      report.errors.push("Retirement requires cutover batch: " + record.source);
    }
    for (const destination of record.destinations) {
      destinationPath(destination.path);
    }
    if (
      !["planned", "prepared", "complete"].includes(record.status) ||
      !record.batch ||
      !record.kind ||
      !["preserve", "convert", "split", "retire"].includes(record.action) ||
      (record.action === "retire") !== (record.destinations.length === 0)
    ) {
      report.errors.push("Invalid record state: " + record.source);
    }
  }
  for (const fixture of ledger.extractedFixtures) {
    safePath(root, fixture.source, report.errors);
    destinationPath(fixture.destination);
    if (!["planned", "prepared", "complete"].includes(fixture.status) || !fixture.batch) {
      report.errors.push("Invalid fixture state: " + fixture.destination);
    }
  }
  for (const file of ledger.newDocumentOwners) {
    destinationPath(file);
  }
  for (const file of [...ledger.sourceRoots, ...ledger.relatedUpdates, ...ledger.newDocumentOwners, ...ledger.auditInputs, ...(ledger.batchIndex ? [ledger.batchIndex] : [])]) {
    safePath(root, file, report.errors);
  }
  if (report.errors.length) {
    return report;
  }
  const baseline = new Map<string, Buffer>();
  for (const revision of [ledger.baselineRevision, ...(ledger.additionalSourceRevisions ?? [])]) {
    const revisionFiles = git(root, ["ls-tree", "-r", "--name-only", "-z", revision, "--", ...ledger.sourceRoots])
      .toString()
      .split("\0")
      .filter(Boolean);
    if (revision === ledger.baselineRevision && revisionFiles.length === 0) {
      report.errors.push("Migration baseline is empty");
      return report;
    }
    const added = revisionFiles.filter((file) => !baseline.has(file));
    if (added.length) {
      for (const [file, bytes] of baselineBytes(root, revision, added)) {
        baseline.set(file, bytes);
      }
    }
  }
  const files = [...baseline.keys()];
  report.counts.sources = files.length;
  report.counts.destinations = seenTargets.size;
  report.counts.extractedFixtures = ledger.extractedFixtures.length;
  report.fingerprints.baselineSources = sha256(files.map((file) => file + "\0" + sha256(baseline.get(file)!) + "\n").join(""));
  const sources = new Set(ledger.records.map((record) => record.source));
  for (const file of files) {
    if (!sources.has(file)) {
      report.errors.push("Unlisted source: " + file);
    }
  }
  if (ledger.sourceCount !== files.length || ledger.records.length !== files.length) {
    report.errors.push("Source count differs from the Git baseline");
  }
  const currentFiles = git(root, ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", ...ledger.sourceRoots])
    .toString()
    .split("\0")
    .filter(Boolean);
  const actualFiles = mode === "preparation" ? filesystemSources(root, ledger.sourceRoots, report.errors) : [];
  for (const file of new Set([...currentFiles, ...actualFiles])) {
    if (path.posix.basename(file) === ".DS_Store" && fs.lstatSync(path.join(root, file), { throwIfNoEntry: false })?.isFile()) {
      continue;
    }
    if (!sources.has(file) || !baseline.has(file)) {
      report.errors.push("Unlisted current source: " + file);
    }
  }
  const exists = (file: string) => fs.existsSync(path.join(root, file));
  const read = (file: string) => fs.readFileSync(path.join(root, file));
  const pending = (message: string) => (mode === "final" ? report.errors : report.pending).push(message);
  const target = (file: string, status: MigrationStatus) => {
    if (!exists(file)) {
      (mode === "final" || status !== "planned" ? report.errors : report.pending).push("Missing target: " + file);
      return false;
    }
    if (!fs.statSync(path.join(root, file)).isFile()) {
      report.errors.push("Target is not a file: " + file);
      return false;
    }
    return true;
  };
  for (const record of ledger.records) {
    const original = baseline.get(record.source);
    if (!original) {
      report.errors.push("Source absent from baseline: " + record.source);
      continue;
    }
    const originalHash = sha256(original);
    if (record.sourceSha256 !== originalHash) {
      report.errors.push("Source hash differs from baseline: " + record.source);
    }
    if (record.status !== "complete") {
      pending("Incomplete record: " + record.source + " (" + record.status + ")");
    }
    if (record.destinations.some((destination) => destination.integrity === "bytes") && exists(record.source) && sha256(read(record.source)) !== originalHash) {
      report.errors.push("Changed immutable source: " + record.source);
    }
    if (!exists(record.source) && record.action !== "retire" && record.destinations.some((destination) => !exists(destination.path))) {
      report.errors.push("Missing source and target: " + record.source);
    }
    for (const destination of record.destinations) {
      if (!["bytes", "semantic"].includes(destination.integrity)) {
        report.errors.push("Invalid integrity policy: " + destination.path);
      }
      if (ledger.sourceRoots.some((oldRoot) => destination.path === oldRoot || destination.path.startsWith(oldRoot + "/"))) {
        report.errors.push("Destination retains old root: " + destination.path);
      }
      const present = target(destination.path, record.status);
      if (destination.integrity === "bytes") {
        if (destination.sha256 !== originalHash) {
          report.errors.push("Destination hash differs from baseline: " + destination.path);
        }
        if (present && sha256(read(destination.path)) !== originalHash) {
          report.errors.push("Changed immutable destination: " + destination.path);
        }
      }
    }
  }
  for (const fixture of ledger.extractedFixtures) {
    const original = baseline.get(fixture.source);
    let value: unknown = original ? JSON.parse(original.toString()) : undefined;
    if (!fixture.jsonPointer.startsWith("/")) {
      value = undefined;
    } else {
      for (const key of fixture.jsonPointer.slice(1).split("/")) {
        value = value && typeof value === "object" ? (value as Record<string, unknown>)[key.replaceAll("~1", "/").replaceAll("~0", "~")] : undefined;
      }
    }
    if (typeof value !== "string" || sha256(value) !== fixture.sha256 || Buffer.byteLength(value) !== fixture.utf8Bytes) {
      report.errors.push("Extracted fixture differs from baseline string: " + fixture.destination);
    }
    if (fixture.status !== "complete") {
      pending("Incomplete fixture: " + fixture.destination + " (" + fixture.status + ")");
    }
    if (target(fixture.destination, fixture.status) && typeof value === "string" && !read(fixture.destination).equals(Buffer.from(value))) {
      report.errors.push("Changed extracted fixture: " + fixture.destination);
    }
  }
  for (const file of [...ledger.relatedUpdates, ...ledger.newDocumentOwners, ...ledger.auditInputs]) {
    target(file, ledger.auditInputs.includes(file) ? "complete" : "planned");
  }
  for (const oldRoot of ledger.sourceRoots) {
    if (exists(oldRoot)) {
      pending("Old root remains: " + oldRoot);
    }
  }
  if (ledger.batchIndex) {
    const batches: { schemaVersion: number; batches: { id: string; sources: string[]; destinations: string[]; status: MigrationStatus; result: string }[] } = JSON.parse(
      read(ledger.batchIndex).toString(),
    );
    report.fingerprints[ledger.batchIndex] = sha256(read(ledger.batchIndex));
    report.counts.batches = batches.batches.length;
    const identities = new Set<string>();
    const expected = new Map<string, { sources: Set<string>; destinations: Set<string> }>();
    const scope = (id: string, source: string, destinations: string[]) => {
      let batch = expected.get(id);
      if (!batch) {
        batch = { sources: new Set(), destinations: new Set() };
        expected.set(id, batch);
      }
      batch.sources.add(source);
      destinations.forEach((destination) => batch.destinations.add(destination));
    };
    for (const record of ledger.records) {
      if (record.action !== "retire") {
        scope(
          record.batch,
          record.source,
          record.destinations.map((destination) => destination.path),
        );
      }
    }
    for (const fixture of ledger.extractedFixtures) {
      scope(fixture.batch, fixture.source, [fixture.destination]);
    }
    if (batches.schemaVersion !== 1) {
      report.errors.push("Unsupported batch index schema");
    }
    for (const batch of batches.batches) {
      if (identities.has(batch.id)) {
        report.errors.push("Duplicate batch: " + batch.id);
      }
      identities.add(batch.id);
      const expectedScope = expected.get(batch.id);
      const matches = (actual: string[], required: Set<string>) => actual.length === required.size && new Set(actual).size === actual.length && actual.every((file) => required.has(file));
      if (!expectedScope || !matches(batch.sources, expectedScope.sources) || !matches(batch.destinations, expectedScope.destinations)) {
        report.errors.push("Batch scope differs from ledger: " + batch.id);
      }
      if (batch.status !== "complete") {
        pending("Incomplete batch: " + batch.id + " (" + batch.status + ")");
      }
      const before = report.errors.length;
      destinationPath(batch.result);
      if (report.errors.length > before) {
        continue;
      }
      if (!exists(batch.result)) {
        pending("Missing batch result: " + batch.result);
        continue;
      }
      const result = JSON.parse(read(batch.result).toString());
      if (result.schemaVersion !== 1 || result.batch !== batch.id) {
        report.errors.push("Batch result identity mismatch: " + batch.result);
      }
      if (result.status !== "complete" || result.verification?.passed !== true) {
        pending("Unverified batch result: " + batch.result);
      }
    }
    for (const id of expected.keys()) {
      if (!identities.has(id)) {
        report.errors.push("Unlisted batch: " + id);
      }
    }
    report.limits.push("Batch result identity and completion assertions are accountability checks; semantic review and execution evidence need separate review.");
  }
  checkReferences(root, ledger, report, baseline);
  report.errors = [...new Set(report.errors)];
  report.pending = [...new Set(report.pending)];
  report.limits = [...new Set(report.limits)];
  report.passed = report.errors.length === 0;
  return report;
}

if (import.meta.main) {
  const [mode] = process.argv.slice(2);
  if (mode !== "preparation" && mode !== "final") {
    console.error("Usage: bun scripts/workflow-migration.ts preparation|final");
    process.exitCode = 2;
  } else {
    try {
      const report = verifyWorkflowMigration(path.resolve(import.meta.dir, ".."), mode);
      console.log(JSON.stringify(report, null, 2));
      process.exitCode = report.passed ? 0 : 1;
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
