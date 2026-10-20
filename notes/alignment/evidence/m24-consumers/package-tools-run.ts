import assert from "node:assert/strict";
import path from "node:path";
import { cp, mkdir, rm } from "node:fs/promises";
const consumer = process.env.ACME_RELEASE_CONSUMER;
if (!consumer) throw new Error("Set ACME_RELEASE_CONSUMER to the installed archive consumer");
const root = path.resolve(import.meta.dir, "../../../.."),
  core = path.join(consumer, "node_modules/@acmelabs/design-system"),
  mcp = path.join(consumer, "node_modules/@acmelabs/design-system-mcp");
const version = (await Bun.file(core + "/package.json").json()).version;
const cli = root + "/node_modules/@tanstack/intent/dist/cli.mjs",
  packagePath = consumer + "/package.json",
  original = await Bun.file(packagePath).text(),
  p = JSON.parse(original);
const commands: Record<string, unknown>[] = [];
async function run(args: string[], expected = 0) {
  const child = Bun.spawn([process.execPath, cli, ...args], { cwd: consumer, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, status] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  assert.equal(status, expected, stderr);
  commands.push({ args, status, stderr, ...(args[0] === "validate" ? { stdout } : {}) });
  return stdout;
}
try {
  await Bun.write(packagePath, JSON.stringify({ ...p, intent: { skills: ["@acmelabs/design-system"] } }, null, 2));
  await run(["validate", core + "/skills"]);
  const list = JSON.parse(await run(["list", "--json"]));
  assert.equal(list.skills.length, 7);
  assert(list.skills.every((skill: any) => skill.packageVersion === version));
  for (const skill of list.skills) {
    const loaded = JSON.parse(await run(["load", skill.use, "--json"]));
    assert.equal(loaded.version, version);
    const source = await Bun.file(path.join(core, "skills", loaded.skill, "SKILL.md")).text();
    const references = new Map<string, string>();
    for (const [, reference] of source.matchAll(/\]\((\.\.?\/[^)]+)\)/g)) {
      const [file, fragment] = reference.split("#", 2);
      const target = path.resolve(core, "skills", loaded.skill, file);
      assert(target.startsWith(core + path.sep), "A skill reference stays inside its installed package");
      assert(await Bun.file(target).exists(), "Missing installed skill reference: " + reference);
      references.set(reference, path.relative(consumer, target).split(path.sep).join("/") + (fragment ? "#" + fragment : ""));
    }
    assert.equal(loaded.content, source.replace(/\]\((\.\.?\/[^)]+)\)/g, (_, reference) => "](" + references.get(reference) + ")"));
    assert(await Bun.file(path.resolve(consumer, loaded.path)).exists());
    if (loaded.skill === "html-artifacts") assert(loaded.content.includes("## HTML false values"));
  }
  const release = await Bun.file(core + "/skills/references/release.json").json();
  assert.equal(release.version, version);
  const index = await Bun.file(path.resolve(core + "/skills/references", release.index)).json();
  const referenceCounts: Record<string, number> = {};
  for (const record of index) {
    referenceCounts[record.kind] = (referenceCounts[record.kind] ?? 0) + 1;
    const entry = await Bun.file(path.join(core, "skills/references", version, record.path)).json();
    assert.equal(entry.version, version);
    assert.equal(entry.id, record.id);
  }
  await Bun.write(packagePath, JSON.stringify({ ...p, intent: { skills: [] } }, null, 2));
  await run(["load", "@acmelabs/design-system#html-artifacts"], 1);
  await Bun.write(
    consumer + "/intent-results.json",
    JSON.stringify(
      { pass: true, version, skills: list.skills.length, references: index.length, referenceCounts, commands },
      null,
      2,
    ),
  );
  console.log("Intent", list.skills.length, "skills", index.length, "release records passed");
} finally {
  await Bun.write(packagePath, original);
}
const { Client } = await import(path.join(consumer, "node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js"));
const { StdioClientTransport } = await import(
  path.join(consumer, "node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js")
);
const client = new Client({ name: "packed-release-check", version: "1.0.0" }),
  transport = new StdioClientTransport({ command: process.execPath, args: [mcp + "/dist/cli.js"], stderr: "pipe" });
const release = await Bun.file(mcp + "/dist/documentation.json").json(),
  manifest = await Bun.file(core + "/dist/custom-elements.json").json(),
  checks: string[] = [];
const declarations = new Map(
  manifest.modules.flatMap((module: any) =>
    (module.declarations ?? [])
      .filter((entry: any) => entry.tagName)
      .map((entry: any) => [entry.tagName, { ...entry, module: module.path }]),
  ),
);
const tool = async (name: string, args: Record<string, unknown>) => await client.callTool({ name, arguments: args });
await client.connect(transport);
try {
  const tools = await client.listTools();
  assert.deepEqual(
    tools.tools.map((tool: any) => tool.name),
    ["resolve_version", "search_docs", "get_component", "get_recipe"],
  );
  assert(tools.tools.every((tool: any) => tool.annotations?.readOnlyHint && tool.annotations?.openWorldHint === false));
  checks.push("exact four read-only tool contracts");
  for (const framework of ["html", "lit", "react"]) {
    const result = await tool("resolve_version", { packageVersion: version, framework });
    assert.deepEqual(result.structuredContent, { ok: true, value: { version, framework } });
  }
  assert.equal((await tool("resolve_version", { framework: "html" })).structuredContent.error.code, "version_required");
  assert.equal(
    (await tool("resolve_version", { packageVersion: "99.0.0", framework: "html" })).structuredContent.error.code,
    "unknown_version",
  );
  checks.push("exact version/framework resolution and explicit missing/unavailable errors");
  for (const args of [
    { version, framework: "html", query: "input", limit: 0 },
    { version, framework: "html", query: "input", limit: 51 },
    { version, framework: "vue", query: "input" },
    { version, framework: "html", query: "a".repeat(501) },
  ])
    assert.equal((await tool("search_docs", args)).isError, true);
  assert.equal((await tool("get_component", { version, tag: "acme-input", file: "/etc/passwd" })).isError, true);
  for (const [name, args] of [
    ["search_docs", { framework: "html", query: "input" }],
    ["get_component", { tag: "acme-input" }],
    ["get_recipe", { id: "settings-rows", framework: "html" }],
  ] as const)
    assert.equal((await tool(name, args)).isError, true);
  checks.push("invalid schema, missing versions, bounds, framework and file arguments rejected");
  const search = await tool("search_docs", { version, framework: "html", query: "input", limit: 2 });
  assert.equal(search.structuredContent.value.results.length, 2);
  assert(
    search.structuredContent.value.results.every(
      (entry: any) => entry.uri.startsWith("acme-docs://release/" + version + "/") && entry.excerpt.length <= 320,
    ),
  );
  checks.push("bounded release-qualified search");
  const components = release.documents.filter((entry: any) => entry.kind === "component");
  assert.equal(components.length, declarations.size);
  for (let offset = 0; offset < components.length; offset += 20)
    await Promise.all(
      components.slice(offset, offset + 20).map(async (entry: any) => {
        const result = await tool("get_component", { version, tag: entry.id });
        assert.equal(result.structuredContent.ok, true);
        assert.deepEqual(result.structuredContent.value.declaration, declarations.get(entry.id));
      }),
    );
  checks.push("all " + components.length + " component contracts equal the installed core manifest");
  const resources = await client.listResources();
  assert.equal(resources.resources.length, release.documents.length);
  assert.equal(new Set(resources.resources.map((r: any) => r.uri)).size, release.documents.length);
  for (let offset = 0; offset < resources.resources.length; offset += 20)
    await Promise.all(
      resources.resources.slice(offset, offset + 20).map(async (resource: any) => {
        const result = await client.readResource({ uri: resource.uri });
        const record = JSON.parse(result.contents[0].text);
        assert.equal(record.version, version);
        assert(
          release.documents.some(
            (entry: any) => entry.id === record.document.id && entry.kind === record.document.kind,
          ),
        );
      }),
    );
  checks.push("all " + resources.resources.length + " listed resources read at the same release");
  const recipes = release.documents.filter((entry: any) => entry.kind === "recipe");
  let variants = 0;
  for (const entry of recipes)
    for (const framework of entry.frameworks) {
      const result = await tool("get_recipe", { version, id: entry.id, framework });
      assert.deepEqual(result.structuredContent.value.example, entry.examples[framework]);
      variants++;
    }
  checks.push("all " + variants + " recipe/framework variants return their exact runnable records");
  assert.equal(
    (await tool("get_recipe", { version, id: "settings-rows", framework: "react" })).structuredContent.error.code,
    "unavailable_content",
  );
  assert.equal(
    (await tool("get_recipe", { version, id: "missing", framework: "html" })).structuredContent.error.code,
    "unknown_id",
  );
  assert.equal(
    (await tool("get_component", { version: "99.0.0", tag: "acme-input" })).structuredContent.error.code,
    "unknown_version",
  );
  await assert.rejects(client.readResource({ uri: "acme-docs://release/99.0.0/component/acme-input" }));
  await assert.rejects(client.readResource({ uri: "file:///etc/passwd" }));
  checks.push("no cross-version, missing-ID, framework or filesystem fallback");
  await Bun.write(
    consumer + "/mcp-results.json",
    JSON.stringify(
      {
        pass: true,
        version,
        records: release.documents.length,
        components: components.length,
        recipes: recipes.length,
        recipeVariants: variants,
        checks,
      },
      null,
      2,
    ),
  );
  console.log("MCP full release", checks.length, "checks passed");
} finally {
  await client.close();
}

const mismatch = path.join(consumer, "mcp-version-mismatch");
await mkdir(mismatch, { recursive: true });
try {
  await cp(mcp + "/dist", mismatch + "/dist", { recursive: true });
  await Bun.write(mismatch + "/package.json", JSON.stringify({ type: "module", version: "99.0.0" }));
  const child = Bun.spawn([process.execPath, mismatch + "/dist/cli.js"], {
    cwd: consumer,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, status] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  assert.notEqual(status, 0);
  assert.equal(stdout, "");
  assert(stderr.includes("MCP package and documentation versions differ"));
  const result = await Bun.file(consumer + "/mcp-results.json").json();
  result.checks.push("actual archive rejects package/documentation mismatch before opening stdio");
  await Bun.write(consumer + "/mcp-results.json", JSON.stringify(result, null, 2));
} finally {
  await rm(mismatch, { recursive: true, force: true });
}
