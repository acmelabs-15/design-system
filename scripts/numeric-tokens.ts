import fs from "node:fs";
import path from "node:path";
import { numericTokenDefinitions } from "../src/shared/numeric-tokens";

export function numericTokenCss(): string {
  return ":root {\n" + numericTokenDefinitions.map(({ cssProperty, defaultValue }) => `  ${cssProperty}: ${defaultValue};`).join("\n") + "\n}\n";
}

function manifestText(): string {
  const tokens = numericTokenDefinitions.map((definition) => ({ ...definition, source: "src/shared/numeric-tokens.ts" }));
  return JSON.stringify({ schemaVersion: 1, tokens }, null, 2) + "\n";
}

export function writeTokenManifest(root: string): string {
  const file = path.join(root, "src/generated/tokens.json");
  const content = manifestText();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) fs.writeFileSync(file, content);
  return file;
}

export function verifyTokenManifest(root: string): string {
  const file = path.join(root, "src/generated/tokens.json");
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== manifestText()) throw new Error("Missing or stale token manifest; run bun run split");
  return file;
}
