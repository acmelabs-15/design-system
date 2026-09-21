import fs from "node:fs";
import path from "node:path";
import { create, ts as analyzerTs, type Plugin } from "@custom-elements-manifest/analyzer";
import { Window } from "happy-dom";
import ts from "typescript";
import type { Package, ClassDeclaration, Event as ManifestEvent } from "custom-elements-manifest/schema";

const ROOT = path.resolve(import.meta.dir, "..");
const CALLBACKS = new Set([
  "connectedCallback",
  "disconnectedCallback",
  "adoptedCallback",
  "attributeChangedCallback",
  "formAssociatedCallback",
  "formDisabledCallback",
  "formResetCallback",
  "formStateRestoreCallback",
]);
type EventFact = ManifestEvent & { "x-acme-options": Record<string, boolean | undefined> };
type Facts = {
  slots: Set<string>;
  parts: Set<string>;
  queries: Set<string>;
  events: Map<string, EventFact>;
  dynamic: Set<string>;
  annotated: Set<string>;
  members: Map<string, { type?: { text: string }; literalType?: { text: string }; return?: { type: { text: string } } }>;
};
type Issue = { file: string; className: string; category: string };
const key = (file: string, name: string) => file + "#" + name;
const forward = (file: string) => file.split(path.sep).join("/");

function sourceFacts(program: ts.Program, files: string[], root: string): Map<string, Facts> {
  const checker = program.getTypeChecker();
  const window = new Window({ settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true, disableCSSFileLoading: true, disableIframePageLoading: true } });
  const facts = new Map<string, Facts>();
  const literalChoices = (expression: ts.Expression): string[] => {
    const type = checker.getTypeAtLocation(expression);
    if (type.isStringLiteral()) return [type.value];
    if (type.isUnion() && type.types.length < 16 && type.types.every((t) => t.isStringLiteral())) return type.types.map((t) => (t as ts.StringLiteralType).value);
    return ["__ACME_CEM_DYNAMIC__"];
  };
  for (const file of files) {
    const source = program.getSourceFile(path.join(root, file))!;
    for (const declaration of source.statements) {
      if (!ts.isClassDeclaration(declaration) || !declaration.name) continue;
      const found: Facts = { slots: new Set(), parts: new Set(), queries: new Set(), events: new Map(), dynamic: new Set(), annotated: new Set(), members: new Map() };
      for (const tag of ts.getJSDocTags(declaration)) {
        if (["fires", "event", "emits"].includes(tag.tagName.text)) found.annotated.add("events");
        if (tag.tagName.text === "slot") found.annotated.add("slots");
        if (tag.tagName.text === "csspart") found.annotated.add("parts");
      }
      for (const member of declaration.members) {
        if (member.name) {
          const name = member.name.getText(source);
          if (ts.isMethodDeclaration(member)) {
            const signature = checker.getSignatureFromDeclaration(member);
            if (signature) found.members.set(name, { return: { type: { text: checker.typeToString(checker.getReturnTypeOfSignature(signature), member, ts.TypeFormatFlags.NoTruncation) } } });
          } else {
            const type = checker.getTypeAtLocation(member.name);
            const literal = type.aliasSymbol && type.isUnion() && type.types.length <= 32 && type.types.every(part => !!(part.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
            found.members.set(name, {
              type: { text: checker.typeToString(type, member, ts.TypeFormatFlags.NoTruncation) },
              ...(literal ? { literalType: { text: checker.typeToString(type, member, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias) } } : {}),
            });
          }
        }
        if (member.name && ts.canHaveDecorators(member) && ts.getDecorators(member)?.some((d) => ts.isCallExpression(d.expression) && /^query/.test(d.expression.expression.getText(source))))
          found.queries.add(member.name.getText(source));
      }
      const visit = (node: ts.Node) => {
        if (ts.isTaggedTemplateExpression(node) && ["html", "svg"].includes(node.tag.getText(source))) {
          let templates: string[];
          if (ts.isNoSubstitutionTemplateLiteral(node.template)) templates = [node.template.text];
          else {
            templates = [node.template.head.text];
            for (const span of node.template.templateSpans) {
              const choices = literalChoices(span.expression);
              templates =
                templates.length * choices.length <= 32
                  ? templates.flatMap((template) => choices.map((choice) => template + choice + span.literal.text))
                  : templates.map((template) => template + "__ACME_CEM_DYNAMIC__" + span.literal.text);
            }
          }
          for (const text of templates) {
            const template = window.document.createElement("template");
            template.innerHTML = text;
            for (const slot of template.content.querySelectorAll("slot")) {
              const name = slot.getAttribute("name") ?? "";
              if (name.includes("__ACME_CEM_DYNAMIC__")) found.dynamic.add("slots");
              else found.slots.add(name);
            }
            for (const element of template.content.querySelectorAll("[part]")) {
              const names = element.getAttribute("part")!.split(/\s+/).filter(Boolean);
              if (names.some((name) => name.includes("__ACME_CEM_DYNAMIC__"))) found.dynamic.add("parts");
              else for (const name of names) found.parts.add(name);
            }
            for (const element of template.content.querySelectorAll("[exportparts]")) {
              for (const mapping of element.getAttribute("exportparts")!.split(",")) {
                const name = mapping.split(":").at(-1)!.trim();
                if (name.includes("__ACME_CEM_DYNAMIC__")) found.dynamic.add("parts");
                else if (name) found.parts.add(name);
              }
            }
          }
        }
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          node.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
          node.expression.name.text === "dispatchEvent"
        ) {
          let event = node.arguments[0];
          if (event && ts.isIdentifier(event)) {
            const variable = checker.getSymbolAtLocation(event)?.valueDeclaration;
            if (variable && ts.isVariableDeclaration(variable) && (variable.parent.flags & ts.NodeFlags.Const) !== 0 && variable.initializer) event = variable.initializer;
          }
          if (event && ts.isNewExpression(event)) {
            const name = event.arguments?.[0];
            const names = name ? literalChoices(name) : ["__ACME_CEM_DYNAMIC__"];
            if (!names.includes("__ACME_CEM_DYNAMIC__")) {
              const options: Record<string, boolean | undefined> = { bubbles: false, composed: false, cancelable: false };
              const init = event.arguments?.[1];
              if (init && ts.isObjectLiteralExpression(init)) {
                for (const property of init.properties) {
                  if (ts.isSpreadAssignment(property)) for (const field of Object.keys(options)) options[field] = undefined;
                  if (ts.isPropertyAssignment(property)) {
                    const field = property.name.getText(source).replace(/^["']|["']$/g, "");
                    if (field in options)
                      options[field] = property.initializer.kind === ts.SyntaxKind.TrueKeyword ? true : property.initializer.kind === ts.SyntaxKind.FalseKeyword ? false : undefined;
                  }
                }
              } else if (init) for (const field of Object.keys(options)) options[field] = undefined;
              for (const name of names)
                found.events.set(name, {
                  name,
                  type: { text: checker.typeToString(checker.getTypeAtLocation(event), event, ts.TypeFormatFlags.NoTruncation) },
                  "x-acme-options": options,
                });
            } else found.dynamic.add("events");
          } else found.dynamic.add("events");
        }
        ts.forEachChild(node, visit);
      };
      visit(declaration);
      facts.set(key(file, declaration.name.text), found);
    }
  }
  window.happyDOM.abort();
  return facts;
}

export function normalizeManifest(manifest: Package, root = ROOT): Package {
  const output = (file: string) =>
    forward(path.relative(root, file))
      .replace(/^src\//, "dist/")
      .replace(/\.ts$/, ".js");
  const resolve = (reference: string, from: string): string => {
    const clean = reference.replace(/^\/+/, "");
    if (clean.startsWith("src/")) {
      const candidate = path.join(root, clean);
      for (const name of [candidate, candidate + ".ts", candidate.replace(/\.js$/, ".ts"), path.join(candidate, "index.ts")]) if (fs.existsSync(name) && fs.statSync(name).isFile()) return name;
    }
    const resolved = ts.resolveModuleName(reference, path.join(root, from), { moduleResolution: ts.ModuleResolutionKind.Bundler, allowImportingTsExtensions: true }, ts.sys).resolvedModule;
    if (!resolved || resolved.isExternalLibraryImport) throw new Error("Unresolved local manifest reference: " + from + " -> " + reference);
    return resolved.resolvedFileName;
  };
  const normalized = structuredClone(manifest);
  for (const module of normalized.modules) {
    const from = module.path;
    const walk = (value: unknown) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      const object = value as Record<string, unknown>;
      if (typeof object.module === "string" && !object.package) object.module = output(resolve(object.module, from));
      for (const item of Object.values(object)) walk(item);
    };
    walk(module);
    (module as unknown as Record<string, unknown>)["x-acme-source"] = from;
    module.path = output(path.join(root, from));
  }
  return normalized;
}

export async function analyzeManifest(root = ROOT): Promise<{ manifest: Package; issues: Issue[] }> {
  const files = [...new Bun.Glob("src/**/*.ts").scanSync(root)].filter((file) => !file.includes("/__tests__/") && !file.startsWith("src/generated/") && !file.endsWith(".d.ts")).sort();
  const program = ts.createProgram(
    files.map((file) => path.join(root, file)),
    {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      experimentalDecorators: true,
      useDefineForClassFields: false,
      strict: true,
      skipLibCheck: true,
    },
  );
  const facts = sourceFacts(program, files, root);
  const issues: Issue[] = [];
  const pluginUrl = new URL("./src/features/framework-plugins/lit/lit.js", import.meta.resolve("@custom-elements-manifest/analyzer"));
  const { litPlugin } = (await import(pluginUrl.href)) as { litPlugin(): Plugin[] };
  const plugin: Plugin = {
    name: "acme-template-and-event-facts",
    analyzePhase({ ts: syntax, node, moduleDoc }) {
      if (!syntax.isClassDeclaration(node) || !node.name || !moduleDoc.path) return;
      const declaration = moduleDoc.declarations?.find((d) => d.kind === "class" && d.name === node.name!.text) as ClassDeclaration | undefined;
      const fact = facts.get(key(moduleDoc.path, node.name.text));
      if (!declaration || !fact) return;
      const element = declaration as ClassDeclaration & { slots?: { name: string }[]; cssParts?: { name: string }[]; events?: ManifestEvent[] };
      for (const category of fact.dynamic) {
        if (!fact.annotated.has(category)) issues.push({ file: moduleDoc.path, className: node.name.text, category });
      }
      element.slots = [...(element.slots ?? []), ...[...fact.slots].filter((name) => !element.slots?.some((item) => item.name === name)).map((name) => ({ name }))];
      element.cssParts = [...(element.cssParts ?? []), ...[...fact.parts].filter((name) => !element.cssParts?.some((item) => item.name === name)).map((name) => ({ name }))];
      element.events = (element.events ?? []).filter((event) => !!event.name).map((event) => ({ ...fact.events.get(event.name), ...event, type: fact.events.get(event.name)?.type ?? event.type }));
      for (const event of fact.events.values()) if (!element.events.some((item) => item.name === event.name)) element.events.push(event);
      declaration.members = declaration.members
        ?.filter((member) => !CALLBACKS.has(member.name))
        .map((member) => {
          const inferred = fact.members.get(member.name);
          if (member.kind === "field" && !member.type && inferred?.type) member.type = inferred.type;
          if (member.kind === "field" && inferred?.literalType) member.type = inferred.literalType;
          if (member.kind === "method" && !member.return?.type && inferred?.return) member.return = { ...member.return, ...inferred.return };
          return fact.queries.has(member.name) ? { ...member, privacy: "private" } : member;
        });
    },
  };
  const modules = await Promise.all(files.map(async (file) => analyzerTs.createSourceFile(file, await Bun.file(path.join(root, file)).text(), analyzerTs.ScriptTarget.Latest, true)));
  const analyzed = create({ modules, plugins: [...litPlugin(), plugin] });
  for (const module of analyzed.modules)
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class" || !("attributes" in declaration)) continue;
      const element = declaration as ClassDeclaration & { attributes?: { name: string; fieldName?: string; type?: { text: string }; default?: string }[] };
      for (const attribute of element.attributes ?? []) {
        if (!attribute.fieldName) {
          const matching = element.members?.filter(member => member.kind === "field" && (!member.privacy || member.privacy === "public") && member.name.replace(/[A-Z]/g, character => "-" + character.toLowerCase()) === attribute.name);
          if (matching?.length === 1 && matching[0].kind === "field") {
            attribute.fieldName = matching[0].name;
            matching[0].attribute ??= attribute.name;
          }
        }
        const member = element.members?.find((member) => member.kind === "field" && member.name === attribute.fieldName);
        if (member?.kind !== "field") continue;
        attribute.type = member.type;
        attribute.default = member.default;
      }
    }
  const manifest = normalizeManifest(analyzed, root);
  (manifest as unknown as Record<string, unknown>)["x-acme-version"] = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
  return { manifest, issues };
}

export async function writeManifest(output = path.join(ROOT, "dist/custom-elements.json"), root = ROOT): Promise<Package> {
  const result = await analyzeManifest(root);
  if (result.issues.length) {
    throw new Error("Document unresolved dynamic element metadata before publishing:\n" + JSON.stringify(result.issues, null, 2));
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(result.manifest, null, 2) + "\n");
  console.log("manifest: " + result.manifest.modules.flatMap((m) => m.declarations ?? []).filter((d) => "tagName" in d).length + " elements");
  return result.manifest;
}

if (import.meta.main) await writeManifest(process.argv[2]);
