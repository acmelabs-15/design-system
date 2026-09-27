import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { exampleFiles } from "../example-files";
import { doc as table } from "../pages/components/table";
import { recipes } from "../recipes";
import { exampleSources } from "../example-source";

const root = path.resolve(import.meta.dir, "../..");
const scanner = new Bun.Transpiler({ loader: "tsx" });
const cases = [
  ...table.examples.filter((example) => example.code !== undefined).map((example) => ({ framework: example.h.includes("React") ? "react" : "lit", example })),
  ...recipes.find((recipe) => recipe.id === "virtualized-table")!.examples.filter((example) => example.framework === "react"),
  ...recipes.find((recipe) => recipe.id === "experimental-worker-table")!.examples,
];
for (const { framework, example } of cases) {
  test(`${example.h} copies only its framework source graph with exact executed source`, async () => {
    const files = exampleFiles([example.sourcePath!, example.entryPath!, ...(example.sourceFiles ?? [])], root);
    expect(files).not.toContain("examples/table/docs-entry.ts");
    const imports = files.flatMap((file) => scanner.scanImports(readFileSync(path.join(root, file), "utf8")).map((entry) => entry.path));
    if (framework === "lit") {
      expect(imports.filter((name) => /^(?:react(?:\/|$)|react-dom(?:\/|$)|@tanstack\/react-|@acmelabs\/design-system-react)/.test(name))).toEqual([]);
    } else {
      expect(imports.filter((name) => /^@tanstack\/lit-/.test(name))).toEqual([]);
    }
    const sources = await exampleSources(example, "table-source-check");
    expect(
      sources
        .filter((source) => source.path)
        .map((source) => source.path)
        .sort(),
    ).toEqual(files.sort());
    expect(example.code).toBe(readFileSync(path.join(root, example.sourcePath!), "utf8"));
    expect(sources.find((source) => source.label === "main.ts")!.code).toContain(example.registerFunction! + "()");
  });
}
test("virtualized recipe imports stay framework-specific", () => {
  for (const example of recipes.find((recipe) => recipe.id === "virtualized-table")!.examples) {
    if (example.framework === "lit") {
      expect(example.imports.filter((name) => /react/.test(name))).toEqual([]);
    } else {
      expect(example.imports.filter((name) => /^@tanstack\/lit-/.test(name))).toEqual([]);
    }
  }
});

test("experimental worker setup ships only with its complete recipe and stays outside browser imports", async () => {
  for (const record of recipes.find((recipe) => recipe.id === "experimental-worker-table")!.examples) {
    const files = exampleFiles([record.example.entryPath!], root);
    expect(files).not.toContain("examples/table/setup.ts");
    expect(files).not.toContain("examples/table/build-worker.ts");
    const sources = await exampleSources(record.example, record.exampleId);
    for (const file of ["examples/table/setup.ts", "examples/table/build-worker.ts", "examples/table/table-worker.ts"]) {
      expect(sources.map((source) => source.path)).toContain(file);
    }
  }
  for (const record of recipes.find((recipe) => recipe.id === "virtualized-table")!.examples) {
    expect(record.example.sourceFiles).not.toContain("examples/table/setup.ts");
  }
});
