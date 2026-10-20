import { expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { buildProductionBrowser } from "../browser-build";

test("browser delivery selects production Lit and React with either minification setting", async () => {
  const artifacts = path.resolve(import.meta.dir, "../../.artifacts");
  fs.mkdirSync(artifacts, { recursive: true });
  const directory = fs.mkdtempSync(path.join(artifacts, "production-browser-"));
  const entry = path.join(directory, "entry.ts");
  fs.writeFileSync(entry, 'export { LitElement, html } from "lit"; export { createRoot } from "react-dom/client";');
  try {
    for (const minify of [false, true]) {
      const result = await buildProductionBrowser({ entrypoints: [entry], format: "esm", minify, metafile: true });
      expect(result.success).toBe(true);
      const inputs = Object.keys(result.metafile!.inputs);
      expect(inputs.some((file) => file.includes("react-dom"))).toBe(true);
      expect(inputs.some((file) => file.includes("lit-html"))).toBe(true);
      expect(inputs.filter((file) => /[/\\]development[/\\].*\.js$|\.development\.js$/.test(file))).toEqual([]);
      const source = (await Promise.all(result.outputs.map((output) => output.text()))).join("\n");
      expect(source).not.toContain("Lit is in dev mode");
      expect(source).not.toContain("react-dom-client.development.js");
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
