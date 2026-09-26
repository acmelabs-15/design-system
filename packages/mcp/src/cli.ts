#!/usr/bin/env bun
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DocumentationCatalog, validateRelease } from "./catalog";
import { createDocumentationServer } from "./server";

// The generated release file is packaged beside this entry. Tool arguments cannot select files.
const release = validateRelease(await Bun.file(new URL("./documentation.json", import.meta.url)).json());
const metadata = await Bun.file(new URL("../package.json", import.meta.url)).json();
if (metadata.version !== release.version) throw new Error("MCP package and documentation versions differ");
const server = createDocumentationServer(new DocumentationCatalog([release]), metadata.version);
await server.connect(new StdioServerTransport(undefined, undefined, { maxBufferSize: 1024 * 1024 }));
