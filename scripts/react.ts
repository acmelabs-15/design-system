import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const ROOT = path.resolve(import.meta.dir, "..");
type Declaration = {
  name: string;
  tagName: string;
  members?: { name: string; kind: string; readonly?: boolean; static?: boolean; privacy?: string; default?: string; type?: { text: string }; "x-acme-reset"?: string }[];
  events?: { name: string; type?: { text: string } }[];
  "x-acme-native-root"?: string;
  "x-acme-native-content-target"?: string;
};
const eventTypes = ["DialogReason", "MenuReason", "CalendarValue", "FeedbackValue", "FlowViewport", "ToastDismissReason", "ThemeAppearance"];
export function reactModule(declaration: Declaration): string {
  const rawName = declaration.name.replace(/^Acme/, ""),
    name = /^\d/.test(rawName) ? "Icon" + rawName.replace(/Icon$/, "") : rawName,
    tag = declaration.tagName,
    slug = tag.slice(5);
  const keys = (declaration.members ?? []).filter((m) => m.kind === "field" && !m.static && !m.readonly && (!m.privacy || m.privacy === "public")).map((m) => m.name);
  const contentSlots = Object.fromEntries(keys.filter((key) => key === "renderContent" || key === "renderFallback").map((key) => [key, key === "renderFallback" ? "fallback" : ""]));
  const inputs = keys.filter((key) => !Object.hasOwn(contentSlots, key));
  const defaults = Object.fromEntries(
    (declaration.members ?? [])
      .filter((member) => inputs.includes(member.name) && member["x-acme-reset"] !== "undefined" && (member.default !== undefined || (/\bnull\b/.test(member.type?.text ?? "") && !/\bundefined\b/.test(member.type?.text ?? ""))))
      .map((member) => {
        if (member.default === undefined) return [member.name, null];
        let value;
        try {
          value = JSON.parse(member.default!);
        } catch {
          if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(member.default!)) throw new Error("Nonliteral public default: " + declaration.name + "." + member.name);
          value = Number(member.default);
        }
        return [member.name, value];
      }),
  );
  const events = (declaration.events ?? []).map((event) => ({
    name:
      "on" +
      event.name
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(""),
    event: event.name,
    type: event.type?.text ?? "Event",
  }));
  const imports = eventTypes.filter((name) => events.some((e) => new RegExp("\\b" + name + "\\b").test(e.type)));
  return `// Generated from the standard custom-elements manifest.\nimport { ${declaration.name} } from "@acmelabs/design-system/components/${slug}";\nimport "@acmelabs/design-system/define/${slug}";\nimport { createComponent, type ComponentProps } from "../create-component.js";\nimport type { EventName } from "@lit/react";\n${Object.keys(contentSlots).length ? 'import type { ReactNode } from "react";\n' : ""}${imports.length ? `import type { ${imports.join(", ")} } from "@acmelabs/design-system/react-support";\n` : ""}export type ${name}Props = ComponentProps<${declaration.name}, ${inputs.map((k) => JSON.stringify(k)).join(" | ") || "never"}, {${[...events.map((e) => `${e.name}?: (event: ${e.type}) => void`), ...Object.keys(contentSlots).map((key) => `${key}?: () => ReactNode`)].join("; ")}}>;\nexport const ${name} = createComponent<${declaration.name}, ${name}Props>({\n ${Object.keys(contentSlots).length ? `contentSlots: ${JSON.stringify(contentSlots)},` : ""}
 ${declaration["x-acme-native-content-target"] ? `nativeContentTarget: element => element[${JSON.stringify(declaration["x-acme-native-content-target"])}](),` : ""}
 inputs: ${JSON.stringify(inputs)}, defaults: ${JSON.stringify(defaults)},
 tagName: ${JSON.stringify(tag)}, elementClass: ${declaration.name}, displayName: ${JSON.stringify(name)},\n events: {${events.map((e) => `${e.name}: ${JSON.stringify(e.event)} as EventName<${e.type}>`).join(", ")}},\n ${declaration["x-acme-native-root"] ? ` nativeRoot: ${JSON.stringify(declaration["x-acme-native-root"])},` : ""}\n});\n`;
}
export async function buildReact(root = ROOT) {
  const dir = path.join(root, "packages/react"),
    source = path.join(dir, ".build-src"),
    out = path.join(dir, "dist");
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "dist/custom-elements.json"), "utf8"));
  const declarations: Declaration[] = manifest.modules.flatMap((m: { declarations?: Declaration[] }) => m.declarations ?? []).filter((d: Declaration) => d.tagName);
  fs.rmSync(source, { recursive: true, force: true });
  fs.mkdirSync(path.join(source, "components"), { recursive: true });
  fs.copyFileSync(path.join(dir, "src/create-component.ts"), path.join(source, "create-component.ts"));
  for (const d of declarations) {
    fs.writeFileSync(path.join(source, "components", d.tagName.slice(5) + ".ts"), reactModule(d));
  }
  fs.writeFileSync(path.join(source, "index.ts"), declarations.map((d) => `export * from "./components/${d.tagName.slice(5)}.js";`).join("\n") + "\n");
  const files = [path.join(source, "index.ts")];
  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    declaration: true,
    rootDir: source,
    outDir: out,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  });
  const diagnostics = ts.getPreEmitDiagnostics(program).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (diagnostics.length)
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics.slice(0, 25), { getCanonicalFileName: (f) => f, getCurrentDirectory: () => root, getNewLine: () => "\n" }) + `\n${diagnostics.length} errors`,
    );
  fs.rmSync(out, { recursive: true, force: true });
  const result = program.emit();
  if (result.emitSkipped) throw new Error("React emit skipped");
  console.log(`React: ${declarations.length} typed wrappers emitted`);
}
if (import.meta.main) await buildReact();
