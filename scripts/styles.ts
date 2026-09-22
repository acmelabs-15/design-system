import fs from "node:fs";
import path from "node:path";
import { type CustomAtRules, Features, type Rule, type TokenOrValue, transform, type Visitor } from "lightningcss";
import { fontWeightTokenDefinitions, themeTokenDefinitions } from "../src/shared/theme-tokens";
import { documentThemeSelector } from "./theme-tokens";

export type PropertyRegistration = { name: string; syntax: string; inherits: boolean; initialValue?: string };
export type Registration = { name: string; definition: string };
export type CompiledStyle = { css: string; map: string; registrations: Registration[] };
export type StyleEntry = {
  key: string;
  producer: "house" | "mapped" | "authored" | "document";
  inputs: Record<string, string>;
  externalInputs: Record<string, string>;
  files: Record<string, string>;
  properties: PropertyRegistration[];
  registrations: Registration[];
  exportName?: string;
};
export type StyleManifest = { version: 1; compiler: string; entries: Record<string, StyleEntry> };

const ROOT = path.resolve(import.meta.dir, "..");
const MANIFEST = "src/generated/style-manifest.json";
const COMPILER = "lightningcss@" + JSON.parse(fs.readFileSync(path.resolve(import.meta.dir, "../node_modules/lightningcss/package.json"), "utf8")).version;
const sha = (text: string) => new Bun.CryptoHasher("sha256").update(text).digest("hex");
const slash = (file: string) => file.split(path.sep).join("/");
const read = (root: string, file: string) => fs.readFileSync(path.join(root, file), "utf8");
const writeChanged = (file: string, text: string) => {
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === text) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = file + "." + process.pid + ".tmp";
  fs.writeFileSync(temporary, text);
  fs.renameSync(temporary, file);
};
const propertyCss = (p: PropertyRegistration) =>
  "@property " + p.name + " { syntax: " + JSON.stringify(p.syntax) + "; inherits: " + p.inherits + ";" + (p.initialValue === undefined ? "" : " initial-value: " + p.initialValue + ";") + " }";
const weightTokens = new Map(fontWeightTokenDefinitions.map((token) => [Number(token.defaultValue), token.cssProperty]));
const fontFamilyTokens = new Set<string>(themeTokenDefinitions.filter((token) => token.category === "fonts").map((token) => token.cssProperty));
const fontAliases: Record<string, string> = { "--sans": "--acme-font-sans", "--font-sans": "--acme-font-sans", "--mono": "--acme-font-mono", "--font-mono": "--acme-font-mono" };
const colorTokens = new Set<string>(themeTokenDefinitions.filter((token) => token.category === "colors").map((token) => token.cssProperty));
function fullColorTokens(tokens: TokenOrValue[], self?: string): TokenOrValue[] {
  const ident = (value: string): TokenOrValue => ({ type: "token", value: { type: "ident", value } });
  const space: TokenOrValue = { type: "token", value: { type: "white-space", value: " " } };
  const output = tokens.map((token): TokenOrValue => {
    if (token.type === "var" && token.value.fallback) {
      const fallback = fullColorTokens(token.value.fallback, self);
      return fallback === token.value.fallback ? token : { ...token, value: { ...token.value, fallback } };
    }
    if (token.type !== "function") return token;
    const args = fullColorTokens(token.value.arguments, self);
    const significant = args.filter((value) => value.type !== "token" || value.value.type !== "white-space");
    const first = significant[0];
    if (/^hsla?$/i.test(token.value.name) && first?.type === "var" && first.value.name.ident.endsWith("-value")) {
      const name = first.value.name.ident.slice(0, -6);
      if (name !== self && colorTokens.has(name)) {
        const origin: TokenOrValue = { type: "var", value: { name: { ident: name } } };
        if (significant.length === 1) return origin;
        const separator = significant[1];
        if (significant.length === 3 && separator.type === "token" && (separator.value.type === "comma" || (separator.value.type === "delim" && separator.value.value === "/")))
          return {
            type: "function",
            value: {
              name: "rgb",
              arguments: [ident("from"), space, origin, space, ident("r"), space, ident("g"), space, ident("b"), space, { type: "token", value: { type: "delim", value: "/" } }, space, significant[2]],
            },
          };
      }
    }
    return args === token.value.arguments ? token : { ...token, value: { ...token.value, arguments: args } };
  });
  return output.some((value, index) => value !== tokens[index]) ? output : tokens;
}

function transformCss(source: string, filename: string, visitor: Visitor<CustomAtRules> = {}, sourceMap = false) {
  // Keep constant line-height calculations out of numeric folding (upstream issue #949).
  // A same-length temporary property keeps source-map columns aligned with the authored CSS.
  let id = 0;
  let marker = "--acme00000";
  while (source.includes(marker)) marker = "--acme" + String(++id).padStart(5, "0");
  let prepared = "",
    quote = "",
    boundary = true,
    parentheses = 0,
    brackets = 0;
  const blocks: { customValue: boolean; valueBlock: boolean }[] = [];
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      prepared += c;
      if (c === "\\") {
        prepared += source[++i] ?? "";
        continue;
      }
      if (c === quote) quote = "";
      continue;
    }
    if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      if (end < 0) throw new Error("Unterminated CSS comment");
      prepared += source.slice(i, end + 2);
      i = end + 1;
      continue;
    }
    if (c === "\\") {
      prepared += c + (source[++i] ?? "");
      boundary = false;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      prepared += c;
      boundary = false;
      continue;
    }
    const block = blocks.at(-1);
    if (boundary && block && !block.valueBlock && !parentheses && !brackets) {
      if (source.startsWith("--", i)) block.customValue = true;
      if (/^line-height\s*:\s*calc\(/i.test(source.slice(i))) {
        prepared += marker;
        i += "line-height".length - 1;
        boundary = false;
        continue;
      }
    }
    prepared += c;
    if (c === "(") parentheses++;
    if (c === ")") parentheses--;
    if (c === "[") brackets++;
    if (c === "]") brackets--;
    if (!parentheses && !brackets && c === "{") {
      const valueBlock = !!(block?.customValue || block?.valueBlock);
      blocks.push({ customValue: false, valueBlock });
      boundary = !valueBlock;
    } else if (!parentheses && !brackets && c === "}") {
      blocks.pop();
      boundary = !blocks.at(-1)?.customValue && !blocks.at(-1)?.valueBlock;
    } else if (!parentheses && !brackets && !block?.valueBlock && c === ";") {
      if (block) block.customValue = false;
      boundary = true;
    } else if (!/\s/.test(c)) boundary = false;
  }
  const result = transform({
    filename,
    code: Buffer.from(prepared),
    sourceMap,
    minify: false,
    include: Features.Nesting,
    visitor: {
      ...visitor,
      Selector: documentThemeSelector,
      VariableExit(variable) {
        const name = fontAliases[variable.name.ident];
        if (name) return { type: "var", value: JSON.parse(JSON.stringify({ ...variable, name: { ...variable.name, ident: name } }), (_key, value) => (value === null ? undefined : value)) };
      },
      DeclarationExit(declaration) {
        if (declaration.property === "custom" && Object.hasOwn(fontAliases, declaration.value.name)) return [];
        if (declaration.property === "font-weight" && declaration.value.type === "absolute" && declaration.value.value.type === "weight") {
          const name = weightTokens.get(declaration.value.value.value);
          if (name) return { property: "unparsed", value: { propertyId: { property: "font-weight" }, value: [{ type: "var", value: { name: { ident: name } } }] } };
        }
        if (declaration.property === "unparsed" && declaration.value.propertyId.property === "font-weight" && declaration.value.value.length === 1) {
          const value = declaration.value.value[0];
          if (value.type === "var" && fontFamilyTokens.has(value.value.name.ident)) return [];
        }
        if (declaration.property === "unparsed" || declaration.property === "custom") {
          const value = fullColorTokens(declaration.value.value, declaration.property === "custom" ? declaration.value.name : undefined);
          if (value !== declaration.value.value) return JSON.parse(JSON.stringify({ ...declaration, value: { ...declaration.value, value } }), (_key, item) => (item === null ? undefined : item));
        }
        if (declaration.property === "custom" && declaration.value.name === marker) {
          const tokens = JSON.parse(JSON.stringify(declaration.value.value), (_, value) => (value === null ? undefined : value));
          return { property: "unparsed", value: { propertyId: { property: "line-height" }, value: tokens } };
        }
      },
    },
  });
  if (result.map) {
    const map = JSON.parse(result.map.toString());
    map.sourcesContent = [source];
    result.map = Buffer.from(JSON.stringify(map));
  }
  return result;
}

export function compileStyle(source: string, filename: string): CompiledStyle {
  const registrations: Registration[] = [];
  const result = transformCss(
    source,
    filename,
    {
      Rule(rule) {
        if (rule.type === "property") {
          const { loc: _location, name, ...definition } = rule.value;
          registrations.push({ name, definition: JSON.stringify(definition) });
        }
      },
    },
    true,
  );
  return { css: result.code.toString(), map: result.map!.toString(), registrations: validateRegistrations([registrations]) };
}

export function validateRegistrations(groups: Registration[][]): Registration[] {
  const known = new Map<string, Registration>();
  for (const group of groups) {
    for (const property of group) {
      const existing = known.get(property.name);
      if (existing && existing.definition !== property.definition) throw new Error("Conflicting CSS registration: " + property.name);
      known.set(property.name, property);
    }
  }
  return [...known.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function litStyleModule(exportName: string, css: string, properties: PropertyRegistration[] = [], registrationHelper = "../../../shared/style-properties"): string {
  const tick = String.fromCharCode(96);
  const escaped = css
    .replaceAll("\\", "\\\\")
    .replaceAll(tick, "\\" + tick)
    .replaceAll("$" + "{", "\\$" + "{");
  return (
    '// Generated from compiled CSS. Edit its generator input.\nimport { css } from "lit";\n' +
    (properties.length ? "import { withStyleProperties } from " + JSON.stringify(registrationHelper) + ";\n" : "") +
    "export const " +
    exportName +
    " = " +
    (properties.length ? "/* @__PURE__ */ withStyleProperties(" : "") +
    "css" +
    tick +
    escaped +
    tick +
    (properties.length ? ", " + JSON.stringify(properties) + ")" : "") +
    ";\n"
  );
}

export function loadStyleManifest(root = ROOT): StyleManifest {
  const file = path.join(root, MANIFEST);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { version: 1, compiler: COMPILER, entries: {} };
}

export function writeStyle(
  key: string,
  source: string,
  options: { producer: StyleEntry["producer"]; inputs: string[]; externalInputs?: string[]; properties?: PropertyRegistration[]; module?: boolean; root?: string },
): StyleEntry {
  if (!/^(components\/[a-z0-9-]+\/[a-z0-9-]+|shared\/[a-z0-9-]+|document\/[a-z0-9-]+)$/.test(key)) throw new Error("Invalid generated style key: " + key);
  const root = options.root ?? ROOT;
  const properties = options.properties ?? [];
  const sourceFile = "src/generated/css/" + key + ".source.css";
  const cssFile = "src/generated/css/" + key + ".css";
  const mapFile = cssFile + ".map";
  const moduleFile = "src/generated/" + key + ".styles.ts";
  const fullSource = ((properties.length ? properties.map(propertyCss).join("\n") + "\n" : "") + source).replace(/[\t ]+$/gm, "");
  const compiled = compileStyle(fullSource, path.basename(sourceFile));
  // @property is delivered in document CSS or registered when a component uses its styles.
  const componentCss =
    options.module === false
      ? compiled.css
      : transformCss(
          fullSource,
          path.basename(sourceFile),
          {
            Rule(rule) {
              if (rule.type === "property") return [];
            },
          },
          true,
        );
  const css = typeof componentCss === "string" ? componentCss : componentCss.code.toString();
  const map = typeof componentCss === "string" ? compiled.map : componentCss.map!.toString();
  const exportName =
    key
      .split("/")
      .at(-1)!
      .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) + "Css";
  const files: Record<string, string> = {
    [sourceFile]: fullSource,
    [cssFile]: css,
    [mapFile]: map,
  };
  if (options.module !== false) {
    const helper = slash(path.relative(path.dirname(moduleFile), "src/shared/style-properties"));
    files[moduleFile] = litStyleModule(exportName, css, properties, helper.startsWith(".") ? helper : "./" + helper);
  }
  const inputs = [...new Set([...options.inputs, "scripts/styles.ts", "scripts/theme-tokens.ts", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts", "src/shared/motion-tokens.ts"])];
  const entry: StyleEntry = {
    key,
    producer: options.producer,
    inputs: Object.fromEntries(inputs.sort().map((file) => [file, sha(read(root, file))])),
    externalInputs: Object.fromEntries((options.externalInputs ?? []).sort().map((file) => [file, sha(read(root, file))])),
    files: Object.fromEntries(Object.entries(files).map(([file, text]) => [file, sha(text)])),
    properties,
    registrations: compiled.registrations,
    ...(options.module === false ? {} : { exportName }),
  };
  const lockFile = path.join(root, ".style-write.lock");
  fs.mkdirSync(path.dirname(lockFile), { recursive: true });
  let lock: number;
  try {
    lock = fs.openSync(lockFile, "wx");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error("Style output is locked. Confirm the recorded producer has stopped before clearing: " + lockFile);
    throw error;
  }
  try {
    fs.writeFileSync(lock, String(process.pid));
    const manifest = loadStyleManifest(root);
    manifest.entries[key] = entry;
    validateRegistrations(Object.values(manifest.entries).map((e) => e.registrations));
    for (const [file, text] of Object.entries(files)) writeChanged(path.join(root, file), text);
    manifest.entries = Object.fromEntries(Object.entries(manifest.entries).sort(([a], [b]) => a.localeCompare(b)));
    writeChanged(path.join(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
    return entry;
  } finally {
    fs.closeSync(lock);
    fs.unlinkSync(lockFile);
  }
}

/** Removes a retired producer's recorded outputs without touching other style families. */
export function removeStyle(key: string, root = ROOT): void {
  if (!/^(components\/[a-z0-9-]+\/[a-z0-9-]+|shared\/[a-z0-9-]+|document\/[a-z0-9-]+)$/.test(key)) throw new Error("Invalid generated style key: " + key);
  const lockFile = path.join(root, ".style-write.lock");
  const lock = fs.openSync(lockFile, "wx");
  try {
    fs.writeFileSync(lock, String(process.pid));
    const manifest = loadStyleManifest(root),
      entry = manifest.entries[key];
    if (!entry) return;
    for (const [file, expected] of Object.entries(entry.files)) {
      const resolved = path.resolve(root, file);
      if (!resolved.startsWith(path.resolve(root, "src/generated") + path.sep)) throw new Error("Invalid generated output path");
      if (fs.existsSync(resolved) && sha(read(root, file)) !== expected) throw new Error("Retired style output has unrecorded changes: " + file);
    }
    for (const file of Object.keys(entry.files)) fs.rmSync(path.join(root, file), { force: true });
    delete manifest.entries[key];
    writeChanged(path.join(root, MANIFEST), JSON.stringify(manifest, null, 2) + "\n");
  } finally {
    fs.closeSync(lock);
    fs.unlinkSync(lockFile);
  }
}

export function verifyStyleManifest(root = ROOT, exclude: string[] = []): StyleManifest {
  const manifest = loadStyleManifest(root);
  if (manifest.version !== 1 || manifest.compiler !== COMPILER || !Object.keys(manifest.entries).length) throw new Error("Generate styles before building");
  for (const entry of Object.values(manifest.entries)) {
    if (exclude.includes(entry.key)) continue;
    for (const [file, expected] of Object.entries({ ...entry.inputs, ...entry.files })) {
      if (!fs.existsSync(path.join(root, file)) || sha(read(root, file)) !== expected) throw new Error("Stale generated style: " + entry.key + " (" + file + ")");
    }
    const externalFiles = Object.keys(entry.externalInputs).sort();
    const directories = [...new Set(externalFiles.map((file) => path.dirname(file)))];
    if (directories.some((directory) => fs.existsSync(path.join(root, directory)))) {
      const actualFiles = directories
        .flatMap((directory) => {
          if (!fs.existsSync(path.join(root, directory))) return [];
          const extensions = new Set(externalFiles.filter((file) => path.dirname(file) === directory).map((file) => path.extname(file)));
          return fs
            .readdirSync(path.join(root, directory), { withFileTypes: true })
            .filter((file) => file.isFile() && extensions.has(path.extname(file.name)))
            .map((file) => slash(path.join(directory, file.name)));
        })
        .sort();
      if (JSON.stringify(actualFiles) !== JSON.stringify(externalFiles)) throw new Error("Changed reference input set: " + entry.key);
      for (const [file, expected] of Object.entries(entry.externalInputs)) {
        if (sha(read(root, file)) !== expected) throw new Error("Changed reference input: " + file);
      }
    }
  }
  const outputs = new Set(Object.values(manifest.entries).flatMap((entry) => Object.keys(entry.files)));
  for (const file of new Bun.Glob("src/generated/{components,shared}/**/*.styles.ts").scanSync(root)) {
    if (!outputs.has(file)) throw new Error("Unrecorded generated style: " + file);
  }
  validateRegistrations(Object.values(manifest.entries).map((e) => e.registrations));
  return manifest;
}

export function partitionStyleSheet(source: string, select: (selector: string) => string | null): Map<string | null, string> {
  const css = source;
  const lines = css.split("\n");
  let offset = 0;
  const offsets = lines.map((line) => {
    const start = offset;
    offset += line.length + 1;
    return start;
  });
  const leaf = (rule: Rule): boolean => "value" in rule && rule.value !== null && "loc" in rule.value && (rule.type === "style" || !("rules" in rule.value));
  const owner = (rule: Rule): string | null => {
    if (!("value" in rule) || rule.value === null || !("loc" in rule.value)) return null;
    const loc = rule.value.loc;
    const start = offsets[loc.line] + loc.column - 1;
    let quote = "",
      escapedCharacter = false,
      end = start;
    for (; end < css.length; end++) {
      const c = css[end];
      if (escapedCharacter) {
        escapedCharacter = false;
        continue;
      }
      if (c === "\\") {
        escapedCharacter = true;
        continue;
      }
      if (quote) {
        if (c === quote) quote = "";
        continue;
      }
      if (c === '"' || c === "'") {
        quote = c;
        continue;
      }
      if (c === "{" || c === ";") break;
    }
    return select(css.slice(start, end).trim());
  };
  const owners = new Set<string | null>();
  const ownership = new Map<string, string | null>();
  const parents: (string | null)[] = [];
  const location = (rule: Rule) => ("value" in rule && rule.value !== null && "loc" in rule.value ? rule.value.loc.line + ":" + rule.value.loc.column + ":" + rule.type : "");
  transform({
    filename: "house.css",
    code: Buffer.from(css),
    visitor: {
      Rule(rule) {
        if (leaf(rule)) {
          const key = parents.length ? parents[parents.length - 1] : owner(rule);
          owners.add(key);
          ownership.set(location(rule), key);
          if (rule.type === "style") parents.push(key);
        }
      },
      RuleExit(rule) {
        if (rule.type === "style") parents.pop();
      },
    },
  });
  return new Map(
    [...owners].map((key) => [
      key,
      transformCss(css, "house.css", {
        Rule(rule) {
          if (leaf(rule) && ownership.get(location(rule)) !== key) return [];
        },
      }).code.toString(),
    ]),
  );
}
