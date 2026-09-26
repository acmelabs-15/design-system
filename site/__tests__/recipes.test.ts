import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";
import { docCensus, docStates, recipeDocs, recipes } from "../recipes";

const root = path.resolve(import.meta.dir, "../..");
const scanner = new Bun.Transpiler({ loader: "tsx" });
const document = new Window().document;

describe("published recipe records", () => {
  test("covers the required families and removed arrangement destinations", () => {
    expect(recipes.map((recipe) => recipe.id).sort()).toEqual([
      "checkbox-rows",
      "document-navigation",
      "file-tree",
      "input-addons",
      "integration-cards",
      "measurement-cards",
      "measurement-rows",
      "relative-time-details",
      "responsive-panes",
      "results-pagination",
      "selectable-stats",
      "settings-rows",
      "task-rows",
      "typed-confirmation",
      "virtualized-table",
    ]);
    for (const recipe of recipes) {
      expect(recipe.applicationInputs.length).toBeGreaterThan(0);
      expect(recipe.ownership.length).toBeGreaterThan(0);
      expect(recipe.accessibility.length).toBeGreaterThan(0);
      expect(recipe.cleanup.length).toBeGreaterThan(0);
      for (const reference of recipe.references) {
        if (!reference.startsWith("https://")) {
          expect(existsSync(path.join(root, reference.split("#")[0]))).toBe(true);
        }
      }
    }
  });

  test("all components have real definition entries and copied modules include their local import closure", () => {
    for (const recipe of recipes) {
      for (const source of recipe.examples) {
        for (const tag of source.components) {
          expect(existsSync(path.join(root, "src/define", tag.slice(5) + ".ts"))).toBe(true);
        }
        if (source.example.script) {
          expect(() => new Function("root", source.example.script!)).not.toThrow();
        }
        if (source.example.sourcePath) {
          expect(source.example.code).toBe(readFileSync(path.join(root, source.example.sourcePath), "utf8"));
        }
        const files = source.example.sourceFiles ?? [];
        for (const file of files) {
          for (const entry of scanner.scanImports(readFileSync(path.join(root, file), "utf8"))) {
            if (!entry.path.startsWith(".")) {
              expect(source.imports).toContain(entry.path);
              continue;
            }
            const base = path.resolve(root, path.dirname(file), entry.path);
            const resolved = [base, base + ".ts", base + ".tsx", path.join(base, "index.ts")].find((candidate) => existsSync(candidate));
            expect(resolved).toBeDefined();
            expect(files).toContain(path.relative(root, resolved!));
          }
        }
      }
    }
  });

  test("recipe pages reuse the exact source and expose ownership and cleanup", () => {
    for (const doc of recipeDocs()) {
      const recipe = recipes.find((recipe) => recipe.id === doc.id)!;
      expect(doc.examples).toEqual(recipe.examples.map((source) => source.example));
      expect(doc.practices?.Ownership).toEqual([...recipe.ownership]);
      expect(doc.practices?.Cleanup).toEqual([recipe.cleanup]);
      expect(doc.tags).toBeUndefined();
    }
  });

  test("state outcomes reference executable examples and dated browser evidence", () => {
    const ids = new Set(recipes.flatMap((recipe) => recipe.examples.map((source) => source.exampleId)));
    for (const state of docStates) {
      expect(ids.has(state.exampleId)).toBe(true);
      expect(state.expectedOutcome.length).toBeGreaterThan(30);
      expect(state.verification).toBe("browser-verified");
      const evidence = JSON.parse(readFileSync(path.join(root, state.evidence), "utf8"));
      expect(evidence.results.map((result: { engine: string }) => result.engine).sort()).toEqual(["chromium", "firefox", "webkit"]);
      for (const result of evidence.results) {
        expect(result.checks.find((check: { name: string }) => check.name === state.name)?.pass).toBe(true);
      }
    }
  });

  test("historical census records point to nonempty paired measurements with explicit limits", () => {
    for (const record of docCensus) {
      expect(record.status).toBe("historical");
      expect(record.referenceRevision).toMatch(/^[a-f0-9]{40}$/);
      expect(record.recordedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(existsSync(path.join(root, record.configId))).toBe(true);
      const results = record.resultFiles.map((file) => JSON.parse(readFileSync(path.join(root, file), "utf8")));
      for (const theme of ["light", "dark"]) {
        const pair = results.filter((result) => result.theme === theme);
        expect(pair.length).toBe(2);
        expect(pair[0].roots.length).toBeGreaterThan(0);
        expect(pair[0].roots.length).toBe(pair[1].roots.length);
      }
      expect(record.limitations).toContain("not a measurement of the current implementation");
    }
  });

  test("authored recipes preserve independent navigation, field and list ownership", () => {
    const get = (id: string) => {
      const fragment = document.createElement("template");
      fragment.innerHTML = recipes.find((recipe) => recipe.id === id)!.examples[0].example.html;
      return fragment.content;
    };
    expect(get("settings-rows").querySelectorAll("acme-field > acme-switch").length).toBe(2);
    expect(get("integration-cards").querySelector("a acme-button")).toBeNull();
    expect(get("measurement-rows").querySelectorAll("ul > li").length).toBe(2);
    expect(get("document-navigation").querySelectorAll('nav[aria-label="Adjacent documents"] a[href]').length).toBe(2);
    expect(get("relative-time-details").querySelector("acme-hover-card > a[href]")).not.toBeNull();
    expect(get("relative-time-details").querySelector('time[datetime="2026-09-23T12:00:00Z"]')).not.toBeNull();
  });
});
