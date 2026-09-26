import fs from "node:fs";
import path from "node:path";
import stylelint from "stylelint";
import cssConfig from "../stylelint.config";
import { lintFiles, hasLitCss } from "./lint-files";
import { lintLitSyntax } from "./lint-lit-syntax";
import { runLintCommand } from "./lint-command";

const root = path.resolve(import.meta.dir, "..");
const mode = process.argv[2] ?? "check";
if (!["check", "css", "format", "format-write", "audit"].includes(mode)) {
  throw new Error("Unknown lint mode: " + mode);
}
const files = lintFiles(root);
const out = path.join(root, ".artifacts/lint");
fs.mkdirSync(out, { recursive: true });
let failed = false;
const versions = Object.fromEntries(
  await Promise.all(["oxlint", "oxfmt", "ultracite", "stylelint", "postcss-lit"].map(async (name) => [name, (await Bun.file(path.join(root, "node_modules", name, "package.json")).json()).version])),
);

async function command(tool: "oxlint" | "oxfmt", args: string[], file: string) {
  const bin = path.join(root, "node_modules", tool, "bin", tool);
  const code = await runLintCommand(bin, args, path.join(out, file), root);
  if (code !== 0) {
    failed = true;
  }
  return { code, report: path.join(out, file) };
}
if (mode === "check" || mode === "audit") {
  const result = await command("oxlint", ["--config", "oxlint.config.ts", "--format", "json", ...files.filter((file) => !file.endsWith(".css"))], "oxlint.json");
  const report = await Bun.file(result.report).json();
  if (!Array.isArray(report.diagnostics) || !Number.isInteger(report.number_of_files)) {
    throw new Error("Incomplete Oxlint JSON report");
  }
  const rules: Record<string, number> = {};
  for (const diagnostic of report.diagnostics) {
    rules[diagnostic.code] = (rules[diagnostic.code] ?? 0) + 1;
  }
  await Bun.write(
    path.join(out, "oxlint-summary.json"),
    JSON.stringify(
      {
        versions,
        exitCode: result.code,
        files: report.number_of_files,
        rules: report.number_of_rules,
        diagnostics: report.diagnostics.length,
        counts: Object.fromEntries(Object.entries(rules).sort((a, b) => b[1] - a[1])),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Oxlint: ${report.diagnostics.length} diagnostics in ${report.number_of_files} files; ${result.report}`);
}
if (["check", "css", "audit"].includes(mode)) {
  const generatedCss = [...new Bun.Glob("src/generated/css/**/*.css").scanSync({ cwd: root })].filter((file) => !file.endsWith(".source.css"));
  const cssFiles = [...files.filter((file) => file.endsWith(".css")), ...generatedCss];
  const templateFiles = files.filter((file) => /\.[cm]?[jt]sx?$/.test(file) && hasLitCss(fs.readFileSync(path.join(root, file), "utf8"), file));
  const css = await stylelint.lint({ files: cssFiles.map((file) => path.join(root, file)), config: cssConfig, configBasedir: root });
  const templates = templateFiles.length
    ? await stylelint.lint({ files: templateFiles.map((file) => path.join(root, file)), config: cssConfig, customSyntax: lintLitSyntax, configBasedir: root })
    : { results: [], errored: false };
  const results = [...css.results, ...templates.results].map((result) => ({
    source: path.relative(root, result.source ?? ""),
    warnings: result.warnings,
    parseErrors: result.parseErrors,
    invalidOptionWarnings: result.invalidOptionWarnings,
  }));
  const count = results.reduce((sum, result) => sum + result.warnings.length + result.parseErrors.length + result.invalidOptionWarnings.length, 0);
  failed ||= css.errored || templates.errored;
  await Bun.write(
    path.join(out, "stylelint.json"),
    JSON.stringify({ versions, authoredCssFiles: cssFiles.length - generatedCss.length, generatedCssFiles: generatedCss.length, templateFiles, diagnostics: count, results }, null, 2) + "\n",
  );
  console.log(`Stylelint: ${count} diagnostics; ${path.join(out, "stylelint.json")}`);
}
if (["format", "format-write", "audit"].includes(mode)) {
  const result = await command("oxfmt", [mode === "format-write" ? "--write" : "--check", "--config", "oxfmt.config.ts", ...files.filter((file) => !file.endsWith(".css"))], "oxfmt.txt");
  console.log(`Oxfmt: ${result.code === 0 ? "pass" : "changes required"}; ${result.report}`);
}
process.exitCode = failed ? 1 : 0;
