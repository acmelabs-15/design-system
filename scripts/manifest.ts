import { readCorePackage } from "./core-package";
import fs from "node:fs";
import path from "node:path";
import { create, ts as analyzerTs, type Plugin } from "@custom-elements-manifest/analyzer";
import { Window } from "happy-dom";
import ts from "typescript";
import type { Package, ClassDeclaration, ClassField, Event as ManifestEvent } from "custom-elements-manifest/schema";

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
  nativeRoot?: string;
  nativeContentTarget?: string;
  defaults?: Record<string, string>;
  nestedAssignments: Set<string>;
  directAssignments: Set<string>;
  slots: Set<string>;
  parts: Set<string>;
  queries: Set<string>;
  events: Map<string, EventFact>;
  eventTypes: Map<string, Set<string>>;
  dynamic: Set<string>;
  annotated: Set<string>;
  members: Map<string, { default?: string; writable?: boolean; resetUndefined?: boolean; type?: { text: string }; literalType?: { text: string }; return?: { type: { text: string } } }>;
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
    if (type.isStringLiteral()) {
      return [type.value];
    }
    if (type.isUnion() && type.types.length < 16 && type.types.every((t) => t.isStringLiteral())) {
      return type.types.map((t) => (t as ts.StringLiteralType).value);
    }
    return ["__ACME_CEM_DYNAMIC__"];
  };
  for (const file of files) {
    const source = program.getSourceFile(path.join(root, file))!;
    for (const declaration of source.statements) {
      if (!ts.isClassDeclaration(declaration) || !declaration.name) {
        continue;
      }
      const found: Facts = {
        nestedAssignments: new Set(),
        directAssignments: new Set(),
        slots: new Set(),
        parts: new Set(),
        queries: new Set(),
        events: new Map(),
        eventTypes: new Map(),
        dynamic: new Set(),
        annotated: new Set(),
        members: new Map(),
      };
      for (const tag of ts.getJSDocTags(declaration)) {
        if (tag.tagName.text === "acmeNativeRoot" && typeof tag.comment === "string") {
          found.nativeRoot = tag.comment.trim();
        }
        if (tag.tagName.text === "acmeNativeContentTarget" && typeof tag.comment === "string") {
          found.nativeContentTarget = tag.comment.trim();
        }
        if (tag.tagName.text === "acmeDefault" && typeof tag.comment === "string") {
          const match = /^(\w+)\s+(.+)$/.exec(tag.comment.trim());
          if (!match) {
            throw new Error("Invalid inherited default annotation");
          }
          (found.defaults ??= {})[match[1]] = match[2];
        }
        if (["fires", "event", "emits"].includes(tag.tagName.text)) {
          found.annotated.add("events");
        }
        if (tag.tagName.text === "slot") {
          found.annotated.add("slots");
        }
        if (tag.tagName.text === "csspart") {
          found.annotated.add("parts");
        }
      }
      for (const member of declaration.members) {
        if (member.name) {
          const name = member.name.getText(source);
          if (ts.isMethodDeclaration(member)) {
            const signature = checker.getSignatureFromDeclaration(member);
            if (signature) {
              found.members.set(name, { return: { type: { text: checker.typeToString(checker.getReturnTypeOfSignature(signature), member, ts.TypeFormatFlags.NoTruncation) } } });
            }
          } else {
            const type = checker.getTypeAtLocation(member.name);
            const defaultTag = ts.getJSDocTags(member).find((tag) => tag.tagName.text === "default");
            const declaredDefault = typeof defaultTag?.comment === "string" ? defaultTag.comment.trim() : found.members.get(name)?.default;
            const literal =
              type.aliasSymbol &&
              type.isUnion() &&
              type.types.length <= 32 &&
              type.types.every((part) => !!(part.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
            found.members.set(name, {
              ...(ts.isPropertyDeclaration(member) && member.initializer ? { default: member.initializer.getText(source) } : {}),
              ...(declaredDefault !== undefined ? { default: declaredDefault } : {}),
              ...(ts.isSetAccessorDeclaration(member) || found.members.get(name)?.writable ? { writable: true } : {}),
              ...(found.members.get(name)?.resetUndefined !== undefined ? { resetUndefined: found.members.get(name)!.resetUndefined } : {}),
              ...(ts.isSetAccessorDeclaration(member) && member.parameters[0]
                ? {
                    resetUndefined: (() => {
                      const input = checker.getTypeAtLocation(member.parameters[0]);
                      return (input.isUnion() ? input.types : [input]).some((type) => !!(type.flags & ts.TypeFlags.Undefined));
                    })(),
                  }
                : {}),
              type: { text: checker.typeToString(type, member, ts.TypeFormatFlags.NoTruncation) },
              ...(literal ? { literalType: { text: checker.typeToString(type, member, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias) } } : {}),
            });
          }
        }
        if (member.name && ts.canHaveDecorators(member) && ts.getDecorators(member)?.some((d) => ts.isCallExpression(d.expression) && /^query/.test(d.expression.expression.getText(source)))) {
          found.queries.add(member.name.getText(source));
        }
      }
      const visit = (node: ts.Node) => {
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(node.left)) {
          if (node.left.expression.kind === ts.SyntaxKind.ThisKeyword) {
            found.directAssignments.add(node.left.name.text);
          } else if (ts.isPropertyAccessExpression(node.left.expression)) {
            found.nestedAssignments.add(node.left.name.text);
          }
        }
        if (ts.isTaggedTemplateExpression(node) && ["html", "svg"].includes(node.tag.getText(source))) {
          let templates: string[];
          if (ts.isNoSubstitutionTemplateLiteral(node.template)) {
            templates = [node.template.text];
          } else {
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
              if (name.includes("__ACME_CEM_DYNAMIC__")) {
                found.dynamic.add("slots");
              } else {
                found.slots.add(name);
              }
            }
            for (const element of template.content.querySelectorAll("[part]")) {
              const names = element.getAttribute("part")!.split(/\s+/).filter(Boolean);
              if (names.some((name) => name.includes("__ACME_CEM_DYNAMIC__"))) {
                found.dynamic.add("parts");
              } else {
                for (const name of names) {
                  found.parts.add(name);
                }
              }
            }
            for (const element of template.content.querySelectorAll("[exportparts]")) {
              for (const mapping of element.getAttribute("exportparts")!.split(",")) {
                const name = mapping.split(":").at(-1)!.trim();
                if (name.includes("__ACME_CEM_DYNAMIC__")) {
                  found.dynamic.add("parts");
                } else if (name) {
                  found.parts.add(name);
                }
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
            if (variable && ts.isVariableDeclaration(variable) && (variable.parent.flags & ts.NodeFlags.Const) !== 0 && variable.initializer) {
              event = variable.initializer;
            }
          }
          if (event && ts.isNewExpression(event)) {
            const name = event.arguments?.[0];
            const names = name ? literalChoices(name) : ["__ACME_CEM_DYNAMIC__"];
            if (!names.includes("__ACME_CEM_DYNAMIC__")) {
              const options: Record<string, boolean | undefined> = { bubbles: false, composed: false, cancelable: false };
              const init = event.arguments?.[1];
              if (init && ts.isObjectLiteralExpression(init)) {
                for (const property of init.properties) {
                  if (ts.isSpreadAssignment(property)) {
                    for (const field of Object.keys(options)) {
                      options[field] = undefined;
                    }
                  }
                  if (ts.isPropertyAssignment(property)) {
                    const field = property.name.getText(source).replace(/^["']|["']$/g, "");
                    if (field in options) {
                      options[field] = property.initializer.kind === ts.SyntaxKind.TrueKeyword ? true : property.initializer.kind === ts.SyntaxKind.FalseKeyword ? false : undefined;
                    }
                  }
                }
              } else if (init) {
                for (const field of Object.keys(options)) {
                  options[field] = undefined;
                }
              }
              for (const name of names) {
                const types = found.eventTypes.get(name) ?? new Set<string>();
                types.add(checker.typeToString(checker.getTypeAtLocation(event), event, ts.TypeFormatFlags.NoTruncation));
                found.eventTypes.set(name, types);
                const previous = found.events.get(name)?.["x-acme-options"];
                found.events.set(name, {
                  name,
                  type: { text: [...types].join(" | ") },
                  "x-acme-options": previous ? Object.fromEntries(Object.entries(options).map(([key, value]) => [key, previous[key] === value ? value : undefined])) : options,
                });
              }
            } else {
              found.dynamic.add("events");
            }
          } else {
            found.dynamic.add("events");
          }
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
      for (const name of [candidate, candidate + ".ts", candidate.replace(/\.js$/, ".ts"), path.join(candidate, "index.ts")]) {
        if (fs.existsSync(name) && fs.statSync(name).isFile()) {
          return name;
        }
      }
    }
    const resolved = ts.resolveModuleName(reference, path.join(root, from), { moduleResolution: ts.ModuleResolutionKind.Bundler, allowImportingTsExtensions: true }, ts.sys).resolvedModule;
    if (!resolved || resolved.isExternalLibraryImport) {
      throw new Error("Unresolved local manifest reference: " + from + " -> " + reference);
    }
    return resolved.resolvedFileName;
  };
  const normalized = structuredClone(manifest);
  const visited = new WeakSet<object>();
  for (const module of normalized.modules) {
    const from = module.path;
    const walk = (value: unknown) => {
      if (!value || typeof value !== "object" || visited.has(value)) {
        return;
      }
      visited.add(value);
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      const object = value as Record<string, unknown>;
      if (typeof object.module === "string" && !object.package) {
        object.module = output(resolve(object.module, from));
      }
      for (const item of Object.values(object)) {
        walk(item);
      }
    };
    walk(module);
    (module as unknown as Record<string, unknown>)["x-acme-source"] = from;
    module.path = output(path.join(root, from));
  }
  return normalized;
}

export async function analyzeManifest(root = ROOT): Promise<{ manifest: Package; issues: Issue[] }> {
  const profileStart = performance.now();
  const profile = (stage: string) => {
    if (process.env.ACME_MANIFEST_PROFILE === "1") {
      console.log(`manifest ${stage}: ${((performance.now() - profileStart) / 1000).toFixed(2)}s`);
    }
  };
  const files = [...new Bun.Glob("src/**/*.ts").scanSync(root)]
    .filter((file) => !file.includes("/__tests__/") && (!file.startsWith("src/generated/") || file.startsWith("src/generated/icons/classes/")) && !file.endsWith(".d.ts"))
    .sort();
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
  profile("source facts");
  const issues: Issue[] = [];
  const pluginUrl = new URL("./src/features/framework-plugins/lit/lit.js", import.meta.resolve("@custom-elements-manifest/analyzer"));
  const { litPlugin } = (await import(pluginUrl.href)) as { litPlugin(): Plugin[] };
  const plugin: Plugin = {
    name: "acme-template-and-event-facts",
    analyzePhase({ ts: syntax, node, moduleDoc }) {
      if (!syntax.isClassDeclaration(node) || !node.name || !moduleDoc.path) {
        return;
      }
      const declaration = moduleDoc.declarations?.find((d) => d.kind === "class" && d.name === node.name!.text) as ClassDeclaration | undefined;
      const fact = facts.get(key(moduleDoc.path, node.name.text));
      if (!declaration || !fact) {
        return;
      }
      if (fact.nativeRoot) {
        (declaration as ClassDeclaration & { "x-acme-native-root"?: string })["x-acme-native-root"] = fact.nativeRoot;
      }
      if (fact.nativeContentTarget) {
        (declaration as ClassDeclaration & { "x-acme-native-content-target"?: string })["x-acme-native-content-target"] = fact.nativeContentTarget;
      }
      if (fact.defaults) {
        (declaration as ClassDeclaration & { "x-acme-defaults"?: Record<string, string> })["x-acme-defaults"] = fact.defaults;
      }
      const element = declaration as ClassDeclaration & { slots?: { name: string }[]; cssParts?: { name: string }[]; events?: ManifestEvent[] };
      for (const category of fact.dynamic) {
        if (!fact.annotated.has(category)) {
          issues.push({ file: moduleDoc.path, className: node.name.text, category });
        }
      }
      element.slots = [...(element.slots ?? []), ...[...fact.slots].filter((name) => !element.slots?.some((item) => item.name === name)).map((name) => ({ name }))];
      element.cssParts = [...(element.cssParts ?? []), ...[...fact.parts].filter((name) => !element.cssParts?.some((item) => item.name === name)).map((name) => ({ name }))];
      element.events = (element.events ?? []).filter((event) => !!event.name).map((event) => ({ ...fact.events.get(event.name), ...event, type: fact.events.get(event.name)?.type ?? event.type }));
      for (const event of fact.events.values()) {
        if (!element.events.some((item) => item.name === event.name)) {
          element.events.push(event);
        }
      }
      declaration.members = declaration.members
        ?.filter((member) => !CALLBACKS.has(member.name))
        .filter((member) => !fact.nestedAssignments.has(member.name) || fact.members.has(member.name) || fact.directAssignments.has(member.name))
        .map((member) => {
          const inferred = fact.members.get(member.name);
          if (member.kind === "field" && inferred?.writable) {
            (member as typeof member & { readonly?: boolean }).readonly = false;
          }
          if (member.kind === "field" && inferred?.resetUndefined) {
            (member as typeof member & { "x-acme-reset"?: string })["x-acme-reset"] = "undefined";
          }
          if (member.kind === "field" && fact.nestedAssignments.has(member.name) && !fact.directAssignments.has(member.name) && inferred) {
            if (inferred.default === undefined) {
              delete member.default;
            } else {
              member.default = inferred.default;
            }
            if (inferred.type) {
              member.type = inferred.type;
            }
          }
          if (member.kind === "field" && !member.type && inferred?.type) {
            member.type = inferred.type;
          }
          if (member.kind === "field" && inferred?.literalType) {
            member.type = inferred.literalType;
          }
          if (member.kind === "method" && !member.return?.type && inferred?.return) {
            member.return = { ...member.return, ...inferred.return };
          }
          return fact.queries.has(member.name) ? { ...member, privacy: "private" as const } : member;
        })
        .filter((member) => member.privacy !== "private" && member.privacy !== "protected");
    },
  };
  const modules = await Promise.all(files.map(async (file) => analyzerTs.createSourceFile(file, await Bun.file(path.join(root, file)).text(), analyzerTs.ScriptTarget.Latest, true)));
  profile("parsed modules");
  const byFile = new Map(modules.map((module) => [module.fileName, module]));
  const icons = modules.filter((module) => module.fileName.startsWith("src/generated/icons/classes/"));
  const iconPaths = new Set(icons.flatMap((module) => [module.fileName, "src/define/" + path.basename(module.fileName)]));
  const checker = program.getTypeChecker();
  const ancestry = (input: Iterable<string>): Set<string> => {
    const result = new Set(input);
    const visit = (file: string): void => {
      const source = program.getSourceFile(path.join(root, file));
      for (const declaration of source?.statements ?? []) {
        if (!ts.isClassDeclaration(declaration)) {
          continue;
        }
        for (const clause of declaration.heritageClauses ?? []) {
          if (clause.token !== ts.SyntaxKind.ExtendsKeyword) {
            continue;
          }
          for (const parent of clause.types) {
            let symbol = checker.getSymbolAtLocation(parent.expression);
            if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
              symbol = checker.getAliasedSymbol(symbol);
            }
            const base = symbol?.declarations?.find(ts.isClassDeclaration);
            if (!base) {
              continue;
            }
            const name = forward(path.relative(root, base.getSourceFile().fileName));
            if (byFile.has(name) && !result.has(name)) {
              result.add(name);
              visit(name);
            }
          }
        }
      }
    };
    for (const file of [...result]) {
      visit(file);
    }
    return result;
  };
  // Generated icon classes are independent leaves. Bound the standard analyzer's
  // repeated inheritance scans while retaining every leaf and its real ancestors.
  const analyze = (paths: Iterable<string>) => create({ modules: [...paths].map((file) => byFile.get(file)!), plugins: [...litPlugin(), plugin] });
  const corePaths = ancestry(modules.filter((module) => !iconPaths.has(module.fileName)).map((module) => module.fileName));
  for (const file of [...corePaths]) {
    if (file.startsWith("src/generated/icons/classes/")) {
      corePaths.add("src/define/" + path.basename(file));
    }
  }
  const analyzed = analyze(corePaths);
  const output = new Map(analyzed.modules.map((module) => [module.path, module]));
  for (let offset = 0; offset < icons.length; offset += 128) {
    const paths = icons.slice(offset, offset + 128).flatMap((module) => [module.fileName, "src/define/" + path.basename(module.fileName)]);
    const part = analyze(ancestry(paths));
    for (const module of part.modules) {
      if (!paths.includes(module.path)) {
        continue;
      }
      const previous = output.get(module.path);
      if (previous && JSON.stringify(previous) !== JSON.stringify(module)) {
        throw new Error("Inconsistent icon manifest partition: " + module.path);
      }
      output.set(module.path, module);
    }
  }
  analyzed.modules = [...output.values()].filter((module) => !module.path.startsWith("src/internal/")).sort((a, b) => a.path.localeCompare(b.path, "en"));
  profile("analyzed modules");
  for (const module of analyzed.modules) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class" || !("attributes" in declaration)) {
        continue;
      }
      const element = declaration as ClassDeclaration & { attributes?: { name: string; fieldName?: string; type?: { text: string }; default?: string }[] };
      for (const attribute of element.attributes ?? []) {
        const linked = element.members?.find((member) => member.name === attribute.fieldName) as (ClassField & { readonly?: boolean; attribute?: string }) | undefined;
        if (linked?.readonly) {
          delete attribute.fieldName;
          if (linked.attribute === attribute.name) {
            delete linked.attribute;
          }
        }
        if (!attribute.fieldName) {
          const matching = element.members?.filter(
            (member) =>
              member.kind === "field" &&
              !(member as { readonly?: boolean }).readonly &&
              (!member.privacy || member.privacy === "public") &&
              member.name.replace(/[A-Z]/g, (character) => "-" + character.toLowerCase()) === attribute.name,
          );
          if (matching?.length === 1 && matching[0].kind === "field") {
            attribute.fieldName = matching[0].name;
            (matching[0] as ClassField & { attribute?: string }).attribute ??= attribute.name;
          }
        }
        const member = element.members?.find((member) => member.kind === "field" && member.name === attribute.fieldName);
        if (member?.kind !== "field") {
          continue;
        }
        attribute.type = member.type;
        attribute.default = member.default;
      }
    }
  }
  const manifest = normalizeManifest(analyzed, root);
  type WithDefaults = ClassDeclaration & { "x-acme-defaults"?: Record<string, string> };
  const classes = new Map(
    manifest.modules.flatMap((module) =>
      (module.declarations ?? []).filter((declaration) => declaration.kind === "class").map((declaration) => [key(module.path, declaration.name), declaration as WithDefaults] as const),
    ),
  );
  const defaults = (declaration: WithDefaults, module: string): Record<string, string> => {
    const parentModule = declaration.superclass?.module ?? module;
    const parent = declaration.superclass && !declaration.superclass.package && classes.get(key(parentModule, declaration.superclass.name));
    return { ...(parent ? defaults(parent, parentModule) : {}), ...declaration["x-acme-defaults"] };
  };
  for (const module of manifest.modules) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class") {
        continue;
      }
      for (const [name, value] of Object.entries(defaults(declaration as WithDefaults, module.path))) {
        const member = declaration.members?.find((member) => member.kind === "field" && member.name === name);
        if (member?.kind !== "field") {
          throw new Error(`Default annotation has no public input: ${declaration.name}.${name}`);
        }
        member.default = value;
        for (const attribute of (declaration as ClassDeclaration & { attributes?: { fieldName?: string; default?: string }[] }).attributes ?? []) {
          if (attribute.fieldName === name) {
            attribute.default = value;
          }
        }
      }
    }
  }
  profile("normalized modules");
  (manifest as unknown as Record<string, unknown>)["x-acme-version"] = readCorePackage(root).version;
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

if (import.meta.main) {
  await writeManifest(process.argv[2]);
}
