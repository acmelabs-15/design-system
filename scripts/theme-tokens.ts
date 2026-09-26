import fs from "node:fs";
import path from "node:path";
import { type Declaration, type Rule, type Selector, transform } from "lightningcss";
import { motionTokenDefinitions } from "../src/shared/motion-tokens";
import { numericTokenDefinitions } from "../src/shared/numeric-tokens";
import { densityTokenDefinitions, fontWeightTokenDefinitions, themeTokenDefinitions } from "../src/shared/theme-tokens";

const ROOT = path.resolve(import.meta.dir, "..");
type Mode = "base" | "light" | "dark";
type Source = { file: string; css: string };
type Fact = { values: Set<string>; hasBase: boolean; hasAppearance: boolean; dependencies: Set<string> };

export type ThemeStyleSelectors = Readonly<{
  reset: string;
  appearance: string;
  density: string;
  appearanceAttribute: string;
  densityAttribute: string;
}>;
export const defaultThemeStyleSelectors: ThemeStyleSelectors = Object.freeze({
  reset: "[data-acme-theme-reset], :host([data-acme-theme-reset])",
  appearance: "[data-acme-appearance-boundary], :host([data-acme-appearance-boundary])",
  density: "[data-acme-density-boundary], :host([data-acme-density-boundary])",
  appearanceAttribute: "data-acme-appearance",
  densityAttribute: "data-acme-density",
});

/** Normalize source document selectors inside the caller's guarded CSS compiler. */
export function documentThemeSelector(selector: Selector): Selector | undefined {
  const first = selector[0];
  if (first?.type !== "pseudo-class" || first.kind !== "root") {
    return;
  }
  let changed = false;
  function rewrite(value: Selector): Selector {
    let rootCompound = true;
    return value.map((part) => {
      if (part.type === "combinator") {
        rootCompound = false;
      }
      if (!rootCompound) {
        return part;
      }
      if (part.type === "attribute" && part.name === "data-theme") {
        changed = true;
        return { ...part, name: "data-acme-appearance" };
      }
      if (part.type === "pseudo-class" && (part.kind === "where" || part.kind === "is" || part.kind === "not")) {
        return { ...part, selectors: part.selectors.map(rewrite) };
      }
      return part;
    });
  }
  const result = rewrite(selector);
  return changed ? (JSON.parse(JSON.stringify(result), (_key, item) => (item === null ? undefined : item)) as Selector) : undefined;
}

function rootMode(selector: Selector): Mode | undefined {
  selector = documentThemeSelector(selector) ?? selector;
  const first = selector[0];
  if (first?.type !== "pseudo-class" || first.kind !== "root") {
    return undefined;
  }
  if (selector.length === 1) {
    return "base";
  }
  if (selector.length !== 2) {
    return undefined;
  }
  let condition = selector[1];
  if (condition.type === "pseudo-class" && condition.kind === "where" && condition.selectors.length === 1 && condition.selectors[0].length === 1) {
    condition = condition.selectors[0][0];
  }
  if (condition.type !== "attribute" || condition.name !== "data-acme-appearance" || condition.operation?.operator !== "equal") {
    return undefined;
  }
  const value = condition.operation.value;
  return value === "light" || value === "dark" ? value : undefined;
}

function styleModes(rule: Extract<Rule, { type: "style" }>): Mode[] | undefined {
  const modes = rule.value.selectors.map(rootMode);
  if (modes.some((mode) => mode === undefined)) {
    return undefined;
  }
  return [...new Set(modes)] as Mode[];
}

function automaticMedia(rule: Rule): boolean {
  return rule.type === "media" && JSON.stringify(rule.value.query).includes("prefers-color-scheme");
}

function dependencies(value: unknown, result = new Set<string>()): Set<string> {
  if (!value || typeof value !== "object") {
    return result;
  }
  const token = value as { type?: string; value?: { name?: { ident?: string } } };
  if (token.type === "var" && token.value?.name?.ident) {
    result.add(token.value.name.ident);
  }
  for (const child of Object.values(value)) {
    dependencies(child, result);
  }
  return result;
}

function fingerprint(value: unknown): string {
  return JSON.stringify(value, (_key, item) => (Array.isArray(item) ? item.filter((token) => token?.type !== "token" || token.value?.type !== "white-space") : item));
}

function collectFacts(sources: Source[]): Map<string, Fact> {
  const facts = new Map<string, Fact>();
  for (const source of sources) {
    let active: Mode[] | undefined;
    transform({
      filename: source.file,
      code: Buffer.from(source.css),
      visitor: {
        Rule(rule) {
          if (automaticMedia(rule)) {
            return [];
          }
          if (rule.type === "style") {
            active = styleModes(rule);
            if (active === undefined) {
              return [];
            }
          }
        },
        RuleExit(rule) {
          if (rule.type === "style") {
            active = undefined;
          }
        },
        Declaration(declaration) {
          if (active === undefined || declaration.property !== "custom" || !declaration.value.name.startsWith("--")) {
            return;
          }
          const { name, value } = declaration.value;
          const fact = facts.get(name) ?? { values: new Set<string>(), hasBase: false, hasAppearance: false, dependencies: new Set<string>() };
          fact.values.add(fingerprint(value));
          fact.hasBase ||= active.includes("base");
          fact.hasAppearance ||= active.some((mode) => mode !== "base");
          dependencies(value, fact.dependencies);
          facts.set(name, fact);
        },
      },
    });
  }
  return facts;
}

function appearanceClosure(facts: Map<string, Fact>): Set<string> {
  const selected = new Set([...facts].filter(([, fact]) => fact.hasAppearance && (!fact.hasBase || fact.values.size > 1)).map(([name]) => name));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, fact] of facts) {
      if (!selected.has(name) && [...fact.dependencies].some((dependency) => selected.has(dependency))) {
        selected.add(name);
        changed = true;
      }
    }
  }
  return selected;
}

function scopeSelectors(target: string, attribute?: string, mode?: string): Selector[] {
  const parsed: Selector[] = [];
  let condition: Selector = [];
  if (attribute && mode) {
    transform({
      filename: "theme-condition.css",
      code: Buffer.from("[" + attribute + '="' + mode + '"]{--probe:0}'),
      visitor: {
        Selector(value) {
          condition = JSON.parse(JSON.stringify(value), (_key, item) => (item === null ? undefined : item));
        },
      },
    });
  }
  transform({
    filename: "theme-selector.css",
    code: Buffer.from(target + "{--probe:0}"),
    visitor: {
      Selector(value) {
        const selector = JSON.parse(JSON.stringify(value), (_key, item) => (item === null ? undefined : item)) as Selector;
        const host = selector.find((part) => part.type === "pseudo-class" && part.kind === "host");
        if (host && host.type === "pseudo-class" && host.kind === "host") {
          if (selector.length !== 1) {
            throw new Error("Host theme targets must use a single :host compound");
          }
          parsed.push([{ type: "pseudo-class", kind: "host", selectors: [{ type: "pseudo-class", kind: "where", selectors: [[...(host.selectors ?? []), ...condition]] }] }]);
        } else {
          parsed.push([{ type: "pseudo-class", kind: "where", selectors: [[...selector, ...condition]] }]);
        }
      },
    },
  });
  if (!parsed.length) {
    throw new Error("Invalid theme scope selector");
  }
  return parsed;
}
function scopeRule(target: string, body: string, attribute?: string, mode?: string): string {
  const selectors = scopeSelectors(target, attribute, mode);
  return transform({
    filename: "theme-scope-rule.css",
    code: Buffer.from(".scope{" + body + "}"),
    visitor: {
      Selector() {
        return selectors;
      },
    },
  }).code.toString();
}

function scopeSource(source: Source, target: string, attribute: string, properties?: ReadonlySet<string>): string {
  let active: Mode[] | undefined;
  const selectors = new Map<Mode, Selector[]>();
  for (const mode of ["base", "light", "dark"] as const) {
    selectors.set(mode, scopeSelectors(target, mode === "base" ? undefined : attribute, mode));
  }
  return transform({
    filename: source.file,
    code: Buffer.from(source.css),
    minify: false,
    visitor: {
      Rule(rule) {
        if (automaticMedia(rule)) {
          return [];
        }
        if (rule.type === "style") {
          active = styleModes(rule);
          if (active === undefined) {
            return [];
          }
        } else if (rule.type !== "media" && rule.type !== "supports" && rule.type !== "layer-block") {
          return [];
        }
      },
      RuleExit(rule) {
        if (rule.type === "style") {
          active = undefined;
        }
        if ((rule.type === "media" || rule.type === "supports" || rule.type === "layer-block") && !rule.value.rules.length) {
          return [];
        }
      },
      Selector(value) {
        const mode = rootMode(value);
        return active === undefined || mode === undefined ? undefined : selectors.get(mode);
      },
      Declaration(declaration) {
        if (active === undefined) {
          return [];
        }
        if (declaration.property === "color-scheme") {
          return;
        }
        if (declaration.property !== "custom" || !declaration.value.name.startsWith("--")) {
          return [];
        }
        if (properties && !properties.has(declaration.value.name)) {
          return [];
        }
      },
    },
  }).code.toString();
}

function declarations(tokens: readonly { cssProperty: string; defaultValue: string }[]): string {
  return tokens.map((token) => `  ${token.cssProperty}: ${token.defaultValue};`).join("\n");
}

/** Produce CSS for the standard style writer; this function writes no files. */
export function generateThemeStyles(root = ROOT, selected: Partial<ThemeStyleSelectors> = {}) {
  const selectors = { ...defaultThemeStyleSelectors, ...selected };
  for (const attribute of [selectors.appearanceAttribute, selectors.densityAttribute]) {
    if (!/^[a-z][a-z0-9-]*$/.test(attribute)) {
      throw new Error("Invalid theme state attribute");
    }
  }
  const inputs = ["styles/house.css", "src/generated/theme.css", "src/shared/theme-tokens.ts", "src/shared/numeric-tokens.ts", "scripts/theme-tokens.ts", "src/shared/motion-tokens.ts"];
  const sources = inputs.slice(0, 2).map((file) => ({ file, css: fs.readFileSync(path.join(root, file), "utf8") }));
  const facts = collectFacts(sources);
  const appearance = appearanceClosure(facts);
  const ownedDefaults = [...fontWeightTokenDefinitions, ...densityTokenDefinitions, ...motionTokenDefinitions];
  const rootCss = `:root {\n${declarations(ownedDefaults)}\n}\n`;
  const fullResetCss =
    sources.map((source) => scopeSource(source, selectors.reset, selectors.appearanceAttribute)).join("\n") + scopeRule(selectors.reset, declarations([...numericTokenDefinitions, ...ownedDefaults]));
  const appearanceCss = sources.map((source) => scopeSource(source, selectors.appearance, selectors.appearanceAttribute, appearance)).join("\n");
  const densityTarget = selectors.density + ", " + selectors.reset;
  const compactCss =
    scopeRule(densityTarget, declarations(densityTokenDefinitions), selectors.densityAttribute, "normal") +
    scopeRule(densityTarget, declarations(densityTokenDefinitions.map((token) => ({ ...token, defaultValue: token.compactValue }))), selectors.densityAttribute, "compact");
  return {
    css: rootCss + fullResetCss + appearanceCss + compactCss,
    rootCss,
    fullResetCss,
    appearanceCss,
    compactCss,
    inputs,
    appearanceProperties: [...appearance].sort(),
    hooks: {
      compactTargetMinimumPx: 24,
      normalDensitySurfaces: ["menu", "dialog", "toast"],
    },
  };
}

function metadataText(root: string): string {
  return "// Generated by scripts/theme-tokens.ts.\nexport const themeAppearanceProperties = Object.freeze(" + JSON.stringify(generateThemeStyles(root).appearanceProperties) + " as const);\n";
}
export function writeThemeStyleMetadata(root = ROOT): string {
  const file = path.join(root, "src/generated/theme-properties.ts");
  const text = metadataText(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) {
    fs.writeFileSync(file, text);
  }
  return file;
}
export function verifyThemeStyleMetadata(root = ROOT): string {
  const file = path.join(root, "src/generated/theme-properties.ts");
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== metadataText(root)) {
    throw new Error("Missing or stale theme metadata; run bun run split");
  }
  return file;
}
