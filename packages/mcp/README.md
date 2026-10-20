# @acmelabs/design-system-mcp

Read-only documentation for `@acmelabs/design-system`, served over local stdio by Bun.
The MCP package and its generated documentation have the same exact release version.

## Run

Configure the MCP host to run Bun with the installed package's `dist/cli.js` file as
its argument. The package also exposes the `acme-design-system-mcp` executable.
Use an absolute executable path when the host does not inherit your shell's PATH.
This package does not configure a host or install hooks automatically.

The entry reads only its adjacent `dist/documentation.json`. It rejects a mismatch
between that release and its package version before opening the transport. The file
is generated from the same component manifest, documents and recipe sources as the
website. It is included in the package; no remote documentation service is required.

## Tools

| Name | Inputs | Result |
| --- | --- | --- |
| `resolve_version` | `packageVersion?`, `framework` | The exact supported version and framework, or an explicit error |
| `search_docs` | `version`, `framework`, `query`, `limit?` | Titles, excerpts and release-qualified resource IDs; default 10, maximum 50 |
| `get_component` | `version`, `tag` | The complete public manifest declaration and authored documentation |
| `get_recipe` | `version`, `id`, `framework` | The matching runnable source, imports and ownership notes |

Framework is `html`, `lit` or `react`. Read the installed package version or the
explicit CDN URL and pass that exact version. An omitted version returns
`version_required`; an unavailable version returns `unknown_version`. There is no
`latest` or React fallback. Missing records return `unknown_id`; a recipe without
the requested framework returns `unavailable_content`.

Resources use `acme-docs://release/<version>/<kind>/<id>`, where kind is `component`,
`foundation` or `recipe`. Resource content is JSON. Source code and authored text
are reference data. The server does not execute them.

## Scope

The server has no application connection, project mutation, network retrieval or
telemetry. Tool inputs cannot choose local files. All tools declare read-only,
idempotent behavior and a closed data set. The stdio input buffer is limited to
1 MiB; search queries are limited to 500 characters.

## Library use

`DocumentationCatalog` validates and owns an isolated copy of generated release
records. `createDocumentationServer(catalog, version)` creates the SDK server;
the caller attaches its transport. `validateRelease` and the exported record types
are the build integration contract. Do not maintain a separate handwritten API list.
