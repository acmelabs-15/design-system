import fs from "node:fs";
import path from "node:path";
import { transform } from "lightningcss";
import { type StyleInputKey, styleInputSchema } from "../src/shared/style-input-schema";

export type GeneratedResponsiveStyleRule = Readonly<{
  property: string;
  target: "host" | "host-and-root";
  selector: string;
  template: string;
}>;
export type GeneratedResponsiveStyleDelivery = Readonly<{
  version: 1;
  rootDisplay: string;
  containerProbe: Readonly<{ property: string; baseline: string; found: string }>;
  rules: Readonly<Record<StyleInputKey, GeneratedResponsiveStyleRule>>;
}>;

const selector = (_target: GeneratedResponsiveStyleRule["target"]) => ":host";

function validateRule(rule: GeneratedResponsiveStyleRule): void {
  transform({ filename: "responsive-style-template.css", code: Buffer.from(rule.template) });
}

/** Creates the runtime declaration table from the one approved common-style schema. */
export function responsiveStyleDelivery(): GeneratedResponsiveStyleDelivery {
  transform({
    filename: "responsive-bridges.css",
    code: Buffer.from('[part~="root"]{display:inherit;}:host{--acme-responsive-container:0;}@container (width >= 0px){:host{--acme-responsive-container:1;}}'),
  });
  const rules = Object.fromEntries(
    Object.entries(styleInputSchema).map(([key, metadata]) => {
      const ruleSelector = selector(metadata.target);
      const rule = Object.freeze({
        property: metadata.cssProperty,
        target: metadata.target,
        selector: ruleSelector,
        template: `${ruleSelector}{${metadata.cssProperty}:initial;}`,
      });
      validateRule(rule);
      return [key, rule];
    }),
  ) as Record<StyleInputKey, GeneratedResponsiveStyleRule>;
  return Object.freeze({
    version: 1 as const,
    rootDisplay: '[part~="root"]{display:inherit;}',
    containerProbe: Object.freeze({ property: "--acme-responsive-container", baseline: ":host{--acme-responsive-container:0;}", found: ":host{--acme-responsive-container:1;}" }),
    rules: Object.freeze(rules),
  });
}

function moduleText(): string {
  const delivery = responsiveStyleDelivery();
  const rules = Object.entries(delivery.rules)
    .map(
      ([key, rule]) =>
        `  ${JSON.stringify(key)}: Object.freeze({ property: ${JSON.stringify(rule.property)}, target: ${JSON.stringify(rule.target)}, selector: ${JSON.stringify(rule.selector)}, template: ${JSON.stringify(rule.template)} }),`,
    )
    .join("\n");
  return `// Generated from the common style input schema. Edit src/shared/style-input-schema.ts.\nimport type { ResponsiveStyleDelivery } from "../shared/style-renderer";\n\nexport const responsiveStyleDelivery = Object.freeze({\n  version: 1,\n  rootDisplay: ${JSON.stringify(delivery.rootDisplay)},\n  containerProbe: Object.freeze(${JSON.stringify(delivery.containerProbe)}),\n  rules: Object.freeze({\n${rules}\n  }),\n}) satisfies ResponsiveStyleDelivery;\n`;
}

function output(root: string): string {
  return path.join(root, "src/generated/responsive-styles.ts");
}

export function writeResponsiveStyleDelivery(root = path.resolve(import.meta.dir, "..")): string {
  const file = output(root);
  const content = moduleText();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) {
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, content);
    fs.renameSync(temporary, file);
  }
  return file;
}

export function verifyResponsiveStyleDelivery(root = path.resolve(import.meta.dir, "..")): string {
  const file = output(root);
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== moduleText()) throw new Error("Missing or stale responsive style delivery; run bun run split");
  return file;
}

if (import.meta.main) console.log(writeResponsiveStyleDelivery(process.argv[2]));
