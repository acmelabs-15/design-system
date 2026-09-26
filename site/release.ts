import type { Package } from "custom-elements-manifest/schema";
import type { DocumentationRelease, DocumentationRecord, Framework } from "../packages/mcp/src/catalog";
import { validateRelease } from "../packages/mcp/src/catalog";
import { type ElementApi } from "./api";
import type { Doc } from "./site";
import { docToMarkdown } from "./markdown";
import { exampleSources } from "./example-source";
import type { RecipeRecord } from "./recipes";

/** Versioned consumer facts are projections of the same build inputs as the website. */
export async function documentationRelease(
  manifest: Package,
  api: readonly ElementApi[],
  docs: readonly Doc[],
  foundations: readonly Doc[],
  recipes: readonly RecipeRecord[],
): Promise<DocumentationRelease> {
  const byTag = new Map(api.map((element) => [element.tag, element]));
  const declarations = new Map(
    manifest.modules.flatMap((module) =>
      (module.declarations ?? []).flatMap((declaration) => ("tagName" in declaration && declaration.tagName ? [[declaration.tagName, { ...declaration, module: module.path }] as const] : [])),
    ),
  );
  const documents: DocumentationRecord[] = [];
  for (const element of api) {
    const page = docs.find((doc) => doc.tags?.includes(element.tag) || doc.catalogTags?.includes(element.tag));
    if (!page) {
      throw new Error("No guidance for " + element.tag);
    }
    const text = (await docToMarkdown({ id: element.tag, title: element.tag, lede: page.lede, tags: [element.tag], examples: [], practices: page.practices }, byTag)).join("\n");
    documents.push({
      kind: "component",
      id: element.tag,
      title: element.tag,
      text,
      frameworks: ["html", "lit", "react"],
      declaration: declarations.get(element.tag) as unknown as Record<string, unknown>,
    });
  }
  for (const doc of foundations) {
    documents.push({ kind: "foundation", id: doc.id, title: doc.title, text: (await docToMarkdown(doc, byTag)).join("\n"), frameworks: ["html", "lit", "react"] });
  }
  for (const recipe of recipes) {
    const examples: Partial<Record<Framework, Record<string, unknown>>> = {};
    for (const framework of ["html", "lit", "react"] as const) {
      const matching = recipe.examples.filter((example) => example.framework === framework);
      if (!matching.length) {
        continue;
      }
      const sources = await Promise.all(matching.map(async (example) => ({ heading: example.example.h, id: example.exampleId, files: await exampleSources(example.example, example.exampleId) })));
      examples[framework] = {
        source: sources.map((example) => example.files.map((file) => `// ${file.label}\n${file.code}`).join("\n\n")).join("\n\n"),
        sources,
        imports: [...new Set(matching.flatMap((example) => example.imports))],
        applicationInputs: recipe.applicationInputs,
        ownership: recipe.ownership,
        cleanup: recipe.cleanup,
        accessibility: recipe.accessibility,
        references: recipe.references,
        deviations: recipe.deviations,
      };
    }
    documents.push({
      kind: "recipe",
      id: recipe.id,
      title: recipe.heading,
      text: [recipe.purpose, ...recipe.applicationInputs, ...recipe.ownership, recipe.cleanup, ...recipe.accessibility].join("\n\n"),
      frameworks: Object.keys(examples) as Framework[],
      examples,
    });
  }
  return validateRelease({ schemaVersion: 1, packageName: "@acmelabs/design-system", version: api[0]?.version, documents });
}
