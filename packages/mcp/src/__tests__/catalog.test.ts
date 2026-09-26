import { describe, expect, test } from "bun:test";
import { DocumentationCatalog, resourceUri, validateRelease, type DocumentationRelease } from "../catalog";

const release = (version = "0.2.0"): DocumentationRelease => ({
  schemaVersion: 1,
  packageName: "@acmelabs/design-system",
  version,
  documents: [
    {
      id: "acme-input",
      kind: "component",
      title: "Input",
      text: `Input form control. ${version}`,
      frameworks: ["html", "lit", "react"],
      declaration: {
        name: "Input",
        attributes: [{ name: "form", type: { text: "string" } }],
        events: [{ name: "acme-change", type: { text: "CustomEvent<{value: string}>" } }],
        members: [{ name: "focus", kind: "method" }],
      },
    },
    {
      id: "forms",
      kind: "recipe",
      title: "Forms",
      text: "Native form ownership",
      frameworks: ["html", "lit"],
      examples: {
        html: {
          source: '<form><acme-input name="email"></acme-input></form>',
          imports: ["@acmelabs/design-system/define/input"],
          cleanup: "Remove the form",
        },
        lit: { source: "html`<form></form>`" },
      },
    },
    {
      id: "tokens",
      kind: "foundation",
      title: "Tokens",
      text: "Colour and spacing tokens",
      frameworks: ["html", "lit", "react"],
    },
  ],
});
describe("versioned documentation catalog", () => {
  test("requires an explicit exact version and never substitutes a framework", () => {
    const catalog = new DocumentationCatalog([release()]);
    expect(catalog.resolveVersion(undefined, "html")).toMatchObject({ ok: false, error: { code: "version_required" } });
    for (const version of ["latest", "^0.2.0", "0.3.0"]) {
      expect(catalog.resolveVersion(version, "react")).toMatchObject({ ok: false, error: { code: "unknown_version" } });
    }
    expect(catalog.resolveVersion("0.2.0", "html")).toEqual({
      ok: true,
      value: { version: "0.2.0", framework: "html" },
    });
    expect(catalog.getRecipe("0.2.0", "forms", "react")).toMatchObject({
      ok: false,
      error: { code: "unavailable_content" },
    });
    expect(catalog.getRecipe("0.2.0", "missing", "html")).toMatchObject({ ok: false, error: { code: "unknown_id" } });
  });
  test("preserves complete component facts and isolates release and caller mutations", () => {
    const source = release(),
      catalog = new DocumentationCatalog([source, release("0.3.0")]);
    (source.documents[0]!.declaration! as Record<string, unknown>).name = "Tampered";
    const result = catalog.getComponent("0.2.0", "acme-input");
    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected a component");
    }
    expect(result.value.declaration).toEqual(release().documents[0]!.declaration!);
    (result.value.declaration as Record<string, unknown>).name = "Tampered again";
    expect(catalog.getComponent("0.2.0", "acme-input")).toMatchObject({
      ok: true,
      value: { declaration: { name: "Input" }, text: "Input form control. 0.2.0" },
    });
    expect(catalog.getComponent("0.3.0", "acme-input")).toMatchObject({
      ok: true,
      value: { text: "Input form control. 0.3.0" },
    });
  });
  test("bounds search and filters unavailable framework content", () => {
    const catalog = new DocumentationCatalog([release()]);
    expect(catalog.searchDocs("0.2.0", "html", "form", 1)).toMatchObject({
      ok: true,
      value: { results: [{ id: "forms" }] },
    });
    const result = catalog.searchDocs("0.2.0", "react", "form");
    expect(result).toMatchObject({ ok: true, value: { results: [{ id: "acme-input" }] } });
    for (const limit of [0, 51, 1.5, Infinity]) {
      expect(catalog.searchDocs("0.2.0", "html", "form", limit)).toMatchObject({
        ok: false,
        error: { code: "invalid_request" },
      });
    }
    expect(catalog.searchDocs("0.2.0", "html", " ")).toMatchObject({ ok: false, error: { code: "invalid_request" } });
    expect(catalog.searchDocs("0.2.0", "html", "a".repeat(501))).toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
  });
  test("uses matching stable resources and never interprets resource IDs as filesystem paths", () => {
    const catalog = new DocumentationCatalog([release()]);
    for (const resource of catalog.listResources()) {
      expect(catalog.readResource(resource.uri)).toMatchObject({
        ok: true,
        value: { uri: resource.uri, version: "0.2.0" },
      });
    }
    expect(catalog.readResource(resourceUri("0.3.0", "component", "acme-input"))).toMatchObject({
      ok: false,
      error: { code: "unknown_version" },
    });
    for (const uri of ["file:///etc/passwd", "acme-docs://release/0.2.0/component/../../secret", "https://example.com/"]) {
      expect(catalog.readResource(uri)).toMatchObject({ ok: false, error: { code: "unknown_id" } });
    }
  });
  test("rejects incomplete and duplicate release records", () => {
    expect(() => validateRelease({ ...release(), version: "latest" })).toThrow();
    expect(() => new DocumentationCatalog([release(), release()])).toThrow("Duplicate documentation version");
    const duplicate = release();
    duplicate.documents = [...duplicate.documents, duplicate.documents[0]!];
    expect(() => validateRelease(duplicate)).toThrow("Duplicate documentation record");
    const incomplete = release();
    incomplete.documents[1]!.examples = { html: { source: "" } };
    expect(() => validateRelease(incomplete)).toThrow("Missing html recipe source");
  });
});
test("malformed non-string release record IDs cannot pass string-pattern coercion", () => {
  const malformed = release();
  (malformed.documents[2] as unknown as Record<string, unknown>).id = 123;
  expect(() => validateRelease(malformed)).toThrow("Invalid documentation record");
});
