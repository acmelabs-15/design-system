import { expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DocumentationCatalog, type DocumentationRelease } from "../catalog";
import { createDocumentationServer } from "../server";
const release: DocumentationRelease = {
  schemaVersion: 1,
  packageName: "@acmelabs/design-system",
  version: "0.2.0",
  documents: [
    {
      kind: "component",
      id: "acme-input",
      title: "Input",
      text: "Input form control",
      frameworks: ["html", "lit", "react"],
      declaration: { tagName: "acme-input", events: [{ name: "acme-change" }] },
    },
    {
      kind: "recipe",
      id: "form",
      title: "Native form",
      text: "Submit named controls",
      frameworks: ["html"],
      examples: {
        html: {
          source: "<form><acme-input name='email'></acme-input></form>",
          imports: ["@acmelabs/design-system/define/input"],
        },
      },
    },
  ],
};
async function exercise(client: Client) {
  const tools = await client.listTools();
  expect(tools.tools.map((tool) => tool.name)).toEqual([
    "resolve_version",
    "search_docs",
    "get_component",
    "get_recipe",
  ]);
  expect(tools.tools.every((tool) => tool.annotations?.readOnlyHint && tool.annotations?.openWorldHint === false)).toBe(
    true,
  );
  const read = (name: string, args: Record<string, unknown>) => client.callTool({ name, arguments: args });
  expect(await read("resolve_version", { framework: "html" })).toMatchObject({
    isError: true,
    structuredContent: { error: { code: "version_required" } },
  });
  expect(await read("resolve_version", { packageVersion: "0.2.0", framework: "react" })).toMatchObject({
    structuredContent: { ok: true, value: { version: "0.2.0", framework: "react" } },
  });
  expect(await read("search_docs", { version: "0.2.0", framework: "html", query: "form", limit: 1 })).toMatchObject({
    structuredContent: { ok: true, value: { results: [{ id: "form" }] } },
  });
  expect(await read("search_docs", { version: "0.2.0", framework: "html", query: "form", limit: 1000 })).toMatchObject({
    isError: true,
  });
  expect(await read("get_component", { version: "0.2.0", tag: "acme-input", extra: true })).toMatchObject({
    isError: true,
  });
  expect(await read("get_component", { version: "0.2.0", tag: "acme-input" })).toMatchObject({
    structuredContent: { value: { declaration: release.documents[0]!.declaration } },
  });
  expect(await read("get_recipe", { version: "0.2.0", id: "form", framework: "react" })).toMatchObject({
    isError: true,
    structuredContent: { error: { code: "unavailable_content" } },
  });
  expect(await read("get_recipe", { version: "0.3.0", id: "form", framework: "html" })).toMatchObject({
    isError: true,
    structuredContent: { error: { code: "unknown_version" } },
  });
  const resources = await client.listResources();
  expect(resources.resources).toHaveLength(2);
  for (const resource of resources.resources) {
    const result = await client.readResource({ uri: resource.uri });
    expect(JSON.parse((result.contents[0] as { text: string }).text).version).toBe("0.2.0");
  }
  await expect(client.readResource({ uri: "acme-docs://release/0.2.0/component/missing" })).rejects.toThrow(
    "Unknown documentation resource",
  );
  await expect(client.readResource({ uri: "acme-docs://release/0.3.0/component/acme-input" })).rejects.toThrow(
    "version is unavailable",
  );
}
test("MCP schemas, read-only tools and resources work through the protocol", async () => {
  const server = createDocumentationServer(new DocumentationCatalog([release]), "0.2.0");
  const client = new Client({ name: "test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  try {
    await exercise(client);
  } finally {
    await client.close();
    await server.close();
  }
});
test("the Bun stdio entry reads only its adjacent packaged release", async () => {
  const directory = await mkdtemp(join(tmpdir(), "acme-mcp-test-"));
  await mkdir(join(directory, "dist"));
  const output = await Bun.build({
    entrypoints: [new URL("../cli.ts", import.meta.url).pathname],
    target: "bun",
    outdir: join(directory, "dist"),
    naming: "cli.js",
  });
  expect(output.success).toBe(true);
  await Bun.write(join(directory, "dist/documentation.json"), JSON.stringify(release));
  await Bun.write(
    join(directory, "package.json"),
    JSON.stringify({ name: "@acmelabs/design-system-mcp", type: "module", version: release.version }),
  );
  const client = new Client({ name: "stdio-test", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [join(directory, "dist/cli.js")],
    stderr: "pipe",
  });
  try {
    await client.connect(transport);
    await exercise(client);
    await client.close();
    await Bun.write(join(directory, "package.json"), JSON.stringify({ version: "0.3.0" }));
    const mismatch = Bun.spawn([process.execPath, join(directory, "dist/cli.js")], { stdout: "pipe", stderr: "pipe" });
    expect(await mismatch.exited).not.toBe(0);
    expect(await new Response(mismatch.stdout).text()).toBe("");
    expect(await new Response(mismatch.stderr).text()).toContain("MCP package and documentation versions differ");
  } finally {
    await client.close();
    await rm(directory, { recursive: true, force: true });
  }
});
