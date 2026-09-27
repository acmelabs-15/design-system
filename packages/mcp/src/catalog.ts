/** Release facts generated from the same manifest and documents as the website. */
export type Framework = "html" | "lit" | "react";
export type DocumentKind = "component" | "foundation" | "recipe";
export interface DocumentationRecord {
  id: string;
  kind: DocumentKind;
  title: string;
  text: string;
  frameworks: readonly Framework[];
  /** The complete manifest declaration for a component. */
  declaration?: Readonly<Record<string, unknown>>;
  /** Complete runnable source, imports and ownership notes for a recipe. */
  examples?: Partial<Record<Framework, Readonly<Record<string, unknown>>>>;
}
export interface DocumentationRelease {
  schemaVersion: 1;
  packageName: "@acmelabs/design-system";
  version: string;
  documents: readonly DocumentationRecord[];
}
export type DocumentationError = "version_required" | "unknown_version" | "unknown_id" | "unavailable_content" | "invalid_request";
export type Result<T> = { ok: true; value: T } | { ok: false; error: { code: DocumentationError; message: string } };
const fail = (code: DocumentationError, message: string): Result<never> => ({ ok: false, error: { code, message } });
const success = <T>(value: T): Result<T> => ({ ok: true, value });
const frameworks: readonly string[] = ["html", "lit", "react"];
const releasePattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const idPattern = /^[a-z0-9][a-z0-9._-]*$/;
function validFramework(value: unknown): value is Framework {
  return typeof value === "string" && frameworks.includes(value);
}
export function resourceUri(version: string, kind: DocumentKind, id: string): string {
  return `acme-docs://release/${encodeURIComponent(version)}/${kind}/${encodeURIComponent(id)}`;
}
/** Reject mismatched or malformed package content before opening a transport. */
export function validateRelease(input: unknown): DocumentationRelease {
  if (!input || typeof input !== "object") {
    throw new Error("Documentation release must be an object");
  }
  const value = input as DocumentationRelease;
  if (value.schemaVersion !== 1 || value.packageName !== "@acmelabs/design-system" || typeof value.version !== "string" || !releasePattern.test(value.version) || !Array.isArray(value.documents)) {
    throw new Error("Invalid documentation release header");
  }
  const ids = new Set<string>();
  for (const document of value.documents) {
    if (
      !document ||
      !["component", "foundation", "recipe"].includes(document.kind) ||
      typeof document.id !== "string" ||
      !idPattern.test(document.id) ||
      typeof document.title !== "string" ||
      typeof document.text !== "string" ||
      !Array.isArray(document.frameworks) ||
      !document.frameworks.length ||
      !document.frameworks.every(validFramework)
    ) {
      throw new Error("Invalid documentation record");
    }
    const key = `${document.kind}/${document.id}`;
    if (ids.has(key)) {
      throw new Error(`Duplicate documentation record: ${key}`);
    }
    ids.add(key);
    if (document.kind === "component" && (!document.id.startsWith("acme-") || !document.declaration || typeof document.declaration !== "object" || Array.isArray(document.declaration))) {
      throw new Error(`Missing component declaration: ${document.id}`);
    }
    if (document.kind === "recipe") {
      for (const framework of document.frameworks) {
        const example = document.examples?.[framework];
        if (!example || typeof example !== "object" || typeof example.source !== "string" || !example.source.trim()) {
          throw new Error(`Missing ${framework} recipe source: ${document.id}`);
        }
      }
    }
  }
  return structuredClone(value);
}

/** Read-only, exact-version retrieval. It has no network or application access. */
export class DocumentationCatalog {
  private readonly releases = new Map<string, DocumentationRelease>();
  constructor(releases: readonly unknown[]) {
    for (const input of releases) {
      const release = validateRelease(input);
      if (this.releases.has(release.version)) {
        throw new Error(`Duplicate documentation version: ${release.version}`);
      }
      this.releases.set(release.version, release);
    }
  }
  resolveVersion(packageVersion: string | undefined, framework: Framework): Result<{ version: string; framework: Framework }> {
    if (!validFramework(framework)) {
      return fail("invalid_request", "Specify html, lit or react");
    }
    if (!packageVersion) {
      return fail("version_required", "Specify the exact installed package or CDN version");
    }
    if (!this.releases.has(packageVersion)) {
      return fail("unknown_version", `Documentation is unavailable for ${packageVersion}`);
    }
    return success({ version: packageVersion, framework });
  }
  private getRelease(version: string): Result<DocumentationRelease> {
    const release = this.releases.get(version);
    return release ? success(release) : fail("unknown_version", `Documentation is unavailable for ${version}`);
  }
  getComponent(
    version: string,
    tag: string,
  ): Result<{
    version: string;
    uri: string;
    title: string;
    text: string;
    declaration: Readonly<Record<string, unknown>>;
  }> {
    const release = this.getRelease(version);
    if (!release.ok) {
      return release;
    }
    const document = release.value.documents.find((entry) => entry.kind === "component" && entry.id === tag);
    if (!document) {
      return fail("unknown_id", `Unknown component: ${tag}`);
    }
    return success(
      structuredClone({
        version,
        uri: resourceUri(version, "component", tag),
        title: document.title,
        text: document.text,
        declaration: document.declaration!,
      }),
    );
  }
  getRecipe(
    version: string,
    id: string,
    framework: Framework,
  ): Result<{
    version: string;
    framework: Framework;
    uri: string;
    title: string;
    text: string;
    example: Readonly<Record<string, unknown>>;
  }> {
    if (!validFramework(framework)) {
      return fail("invalid_request", "Specify html, lit or react");
    }
    const release = this.getRelease(version);
    if (!release.ok) {
      return release;
    }
    const document = release.value.documents.find((entry) => entry.kind === "recipe" && entry.id === id);
    if (!document) {
      return fail("unknown_id", `Unknown recipe: ${id}`);
    }
    const example = document.examples?.[framework];
    if (!document.frameworks.includes(framework) || !example) {
      return fail("unavailable_content", `Recipe ${id} has no ${framework} example`);
    }
    return success(
      structuredClone({
        version,
        framework,
        uri: resourceUri(version, "recipe", id),
        title: document.title,
        text: document.text,
        example,
      }),
    );
  }
  searchDocs(
    version: string,
    framework: Framework,
    query: string,
    limit = 10,
  ): Result<{
    version: string;
    framework: Framework;
    results: { title: string; excerpt: string; uri: string; kind: DocumentKind; id: string }[];
  }> {
    if (!validFramework(framework) || typeof query !== "string" || !query.trim() || query.length > 500 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
      return fail("invalid_request", "Use a nonempty query up to 500 characters and a limit from 1 to 50");
    }
    const release = this.getRelease(version);
    if (!release.ok) {
      return release;
    }
    const terms = query.toLocaleLowerCase("en").trim().split(/\s+/);
    const matches = release.value.documents
      .filter((document) => document.frameworks.includes(framework))
      .map((document) => {
        const title = document.title.toLocaleLowerCase("en"),
          text = document.text.toLocaleLowerCase("en");
        const score = terms.reduce((total, term) => total + (title.includes(term) || document.id.includes(term) ? 10 : 0) + (text.includes(term) ? 1 : 0), 0);
        return { document, score, text };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.document.id.localeCompare(b.document.id));
    return success({
      version,
      framework,
      results: matches.slice(0, limit).map(({ document, text }) => {
        const position = Math.min(...terms.map((term) => text.indexOf(term)).filter((index) => index >= 0));
        const start = Number.isFinite(position) ? Math.max(0, position - 80) : 0;
        return {
          id: document.id,
          kind: document.kind,
          title: document.title,
          uri: resourceUri(version, document.kind, document.id),
          excerpt: document.text.slice(start, start + 320),
        };
      }),
    });
  }
  listResources(): { uri: string; name: string; description: string; mimeType: string }[] {
    return [...this.releases.values()].flatMap((release) =>
      release.documents.map((document) => ({
        uri: resourceUri(release.version, document.kind, document.id),
        name: document.title,
        description: `${release.version} ${document.kind}; authored text is reference data`,
        mimeType: "application/json",
      })),
    );
  }
  readResource(uri: string): Result<{ uri: string; version: string; document: DocumentationRecord }> {
    for (const release of this.releases.values()) {
      const document = release.documents.find((entry) => resourceUri(release.version, entry.kind, entry.id) === uri);
      if (document) {
        return success(structuredClone({ uri, version: release.version, document }));
      }
    }
    const version = /^acme-docs:\/\/release\/([^/]+)\//.exec(uri)?.[1];
    if (version && !this.releases.has(version)) {
      return fail("unknown_version", "The resource version is unavailable");
    }
    return fail("unknown_id", "Unknown documentation resource");
  }
}
