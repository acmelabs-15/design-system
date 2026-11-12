---
id: RES-027
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-002#17
date: 2026-11-12
---
# RES-027: Routes that read a design spec out of Figma

## Question
Which routes can read the whole design spec of a component out of Figma into files in the repo, and what can each one read?

## Answer
Sufficient-answer condition, set for IDEA-002#18:

- Each place in a Figma file where a kind of spec content can live, with the routes that can read it: component structure (component sets, variants, component properties), component descriptions and documentation links, annotations, Figma Specs documents, plain text layers on a documentation page, and Dev Mode resources.
- Each route with what it reads: the REST API with a personal access token (endpoints, returns, plan and rate tier on Professional), the Plugin API in a custom plugin, the Figma MCP tools and `use_figma` read scripts, webhooks, any official command-line tool, and any official GitHub Action or export tool.
- For each route: the kind of sign-in, whether it can run unattended in a CI job, the plan it needs, and its limits.
- How a pipeline can find out that a file or a library changed: webhook events and their plan, file versions, library publish events.
- Whether a Figma Specs document can be read out as Markdown through any route.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation.

The condition is met from documentation, package files and the installed plugin. No Figma MCP call and no REST call was made, by the brief. Each statement below has a line under Findings, in RES-023, RES-024 or RES-025, except the lines marked UNVERIFIED.

### What each route reads, by kind of spec content

REST is the REST API with a personal access token. Plugin is a custom plugin on the Plugin API. MCP is the remote Figma MCP server: its read tools and `use_figma` read scripts, which run Plugin API code (RES-023).

| Spec content | Where it lives in Figma | REST | Plugin | MCP |
|---|---|---|---|---|
| Anatomy and parts | The layer tree of the component: node names, types, children | Yes: the `document` tree from `GET file` or `GET file nodes` | Yes | `get_metadata` (outline), `get_design_context`, `use_figma` |
| Variants, sizes, states | A component set and its VARIANT properties | Yes: `componentPropertyDefinitions` with `variantOptions` | Yes | `get_context_for_code_connect`, `use_figma`. `get_metadata` shows no properties (RES-025) |
| Other component properties | TEXT, BOOLEAN, INSTANCE_SWAP and SLOT properties | Yes, with `preferredValues` and `slotSettings`. No SLOT node type is in the REST catalog | Yes, with `SlotNode` | `get_context_for_code_connect`, `use_figma` |
| Subcomponents | Nested instances | Yes: `componentId`, `componentProperties`, the `components` map | Yes | `get_context_for_code_connect` (nested instances), `use_figma` |
| Token use | Variable bindings on nodes | Bindings as variable IDs. Variable values need Enterprise (RES-024) | Yes | `get_variable_defs`, `use_figma` |
| Component description | One field on a component, a component set and each variant | `description`, one string. No Markdown field | `description` (plain text) and `descriptionMarkdown` (rich text) | `use_figma`. UNVERIFIED: whether `get_design_context` includes it |
| Documentation links | A field on a component and a component set | `documentationLinks` | `documentationLinks`; the setter takes one link | `use_figma` |
| Annotations (behaviour, accessibility notes) | On a node: a label, pinned properties and a category | `label` and `properties`. No category and no Markdown. The page says one annotation at most | `label`, `labelMarkdown`, `properties`, `categoryId`; several on a node | `use_figma`. UNVERIFIED: whether `get_design_context` includes them |
| Measurements | On a page, in Dev Mode | `measurements` on the page node | Yes | `use_figma` |
| Text layers on a documentation page | TEXT nodes | `characters`, styles, list types and indents | `characters` and `getStyledTextSegments` (lists, links) | `get_design_context`, `use_figma` |
| Figma Specs document | A `SPEC_BLOCK` on a Design or FigJam canvas, or a Spec file | No: no Specs node type, endpoint or file type in the REST pages | Not in the public typings 1.142.0. UNVERIFIED whether a custom plugin can call `figma.spec` | `use_figma` with `figma.spec.getContent`: GitHub-Flavored Markdown |
| Dev resources | Links on any layer, at most 10 for each node | `GET dev_resources`, Tier 2. Plan: see disagreements | `getDevResourcesAsync` | `use_figma`. UNVERIFIED which read tool returns them |
| Dev Mode status | On frames and sections | `devStatus` | Yes | `use_figma` |
| Motion | Figma Motion keyframes, timelines and animation styles (open beta) | Prototype transitions only; no keyframes | `animations`, `manualKeyframeTracks`, `timelines`, `animationStyles` | `get_motion_context` (keyframes, easing, CSS `@keyframes`), `use_figma` |
| Data a plugin stored | `sharedPluginData` on any node, at most 100 kB for each entry | Yes, with `plugin_data=shared` | Yes | `use_figma` |
| MCP instructions for a component | Code Connect UI with a connected GitHub repository | No REST field found | No API found | The MCP server passes them to agents |

### Each route: sign-in, CI, plan and limits

| Route | Sign-in | Unattended in a CI job | Plan on Professional | Limits |
|---|---|---|---|---|
| REST API, personal access token | Token in the `X-Figma-Token` header; it acts as the person | Yes. Figma's Code Connect CI example uses a personal access token on Professional | Available. Variables endpoints and the Discovery API are not (Enterprise) | Expires after 90 days at most. Full seat: Tier 1 10/min, Tier 2 25/min, Tier 3 50/min (RES-024), counted per person and plan |
| REST API, plan access token | Plan token, not tied to a person, up to one year | Yes; Figma names CI/CD as its use | Not available: Organization and Enterprise only | Counted per token |
| REST API, OAuth app | A person signs in through OAuth | Figma calls it "designed for interactive workflows, not automation" | Available | Counted per person, plan and app |
| Custom plugin | Runs in the Figma editor of a signed-in person | No source describes a run without the editor | A development plugin needs the desktop app; a private plugin needs Organization (RES-024); Community publication has Figma's review | Pages load on demand; Dev Mode plugins are read-only; it can send data out with `fetch` |
| Figma MCP, remote | Each person signs in through a browser (OAuth); only catalog clients connect (RES-023) | UNVERIFIED. No Figma source describes MCP use in CI | Full seat: 200 read calls a day, 10 a minute (RES-023) | 20 KB of output for each call; Claude Code's 25,000-token response limit (RES-023) |
| Webhooks | Created through the API with a token and the `webhooks:write` scope | They push to an HTTP endpoint that the team runs | Available: 20 for each team, 3 for each file, 150 file webhooks in total | Retries three times; no interface in Figma |
| `figma` command (`@figma/code-connect`) | Token through `--token` or `FIGMA_ACCESS_TOKEN` | Yes; Figma gives a GitHub Actions example | Code Connect: one library and one framework (RES-024) | `connect create` reads component properties only; no spec export |
| GitHub | The Figma GitHub App, for Code Connect and Figma Make | — | — | No official action exports components, descriptions, annotations or Specs |

The one command-line tool from Figma that this research found is the `figma` binary in `@figma/code-connect`; the other four `@figma` npm packages have no binary. The package calls it "the Figma CLI", and its only command group is `connect`. It publishes and manages Code Connect mappings; it does not export a design spec.

### How a pipeline can find out that something changed

| Signal | What it reports | Source facts |
|---|---|---|
| `FILE_UPDATE` webhook | A file was edited; fires after 30 minutes without edits | File, folder or team webhook |
| `FILE_VERSION_UPDATE` webhook | Someone saved a named version, with its label and description | Same |
| `LIBRARY_PUBLISH` webhook | A library publish, with created, modified and deleted components, styles and variables; one publish can arrive as several events | Same |
| `DEV_MODE_STATUS_UPDATE` webhook | A layer's Dev Mode status changed, with its dev resources | Same |
| `FILE_COMMENT` webhook | A comment | Same |
| Polling `GET file metadata` | `version` and `last_touched_at` | Tier 3 |
| Polling `GET file versions` | The version list with labels and descriptions | Tier 2 |
| Polling published components | `updated_at` for each published component and component set | Tier 3 |

Webhooks need a server endpoint that accepts a `POST` from Figma. Figma's own advice for local testing is a tool like ngrok.

### Specs as Markdown
One documented route reads a Figma Specs document as Markdown: a `use_figma` script that calls `figma.spec.getContent`, on the remote MCP server. It returns GitHub-Flavored Markdown with Figma-hosted image URLs and `[comment:<uuid>]` markers. The REST pages name no Specs node, endpoint or file type. The public Plugin API typings have no `figma.spec`. The help center names no export or download of a Spec as Markdown.

### Unknown
- UNVERIFIED: whether the MCP route can run unattended, for example a headless agent in CI with a stored sign-in.
- UNVERIFIED: whether `get_design_context` returns annotations, component descriptions and dev resources. Figma's file guide implies that agents get them, but names no tool.
- UNVERIFIED: whether a custom plugin can call `figma.spec`.
- UNVERIFIED: what `GET file` returns for a standalone Spec file or for a Design file that holds an embedded Spec.
- UNVERIFIED: whether the dev resources REST endpoints answer on Professional. The sources disagree.
- UNVERIFIED: whether `FILE_UPDATE` fires for edits inside a Spec.
- Seven disagreements between sources are under Findings, in "Disagreements between sources". The two that bear on the routes: the REST API allows one annotation for each node with no category, while the Plugin API allows several with categories; and the dev resources REST endpoints name no plan, while the pricing page marks "REST API with Dev Mode" as Enterprise only.

## Findings

### REST API: file content
- `GET /v1/files/:key` returns the file as JSON: a `document` node tree, a `components` map, a `componentSets` map and a `styles` map, plus `version` and `lastModified`; it is a Tier 1 endpoint and needs the `file_content:read` scope. Source: https://developers.figma.com/docs/rest-api/file-endpoints/#get-files-endpoint, checked 2026-11-12.
- `GET /v1/files/:key` takes `version` (a version ID), `ids` (a node subset), `depth` and `plugin_data`; `GET /v1/files/:key/nodes` returns chosen nodes and is also Tier 1 with `file_content:read`. Source: https://developers.figma.com/docs/rest-api/file-endpoints/#get-file-nodes-endpoint, checked 2026-11-12.
- `GET /v1/images/:key` renders nodes as JPG, PNG, SVG or PDF and returns URLs that expire after 30 days; it is Tier 1. Source: https://developers.figma.com/docs/rest-api/file-endpoints/#get-images-endpoint, checked 2026-11-12.
- `GET /v1/files/:key/meta` returns file metadata, including `version` and `last_touched_at`, without the content; it is Tier 3 with the `file_metadata:read` scope. Source: https://developers.figma.com/docs/rest-api/file-endpoints/#get-file-metadata-endpoint, checked 2026-11-12.
- The `Component` and `ComponentSet` entries in a file response hold `key`, `name`, `description` ("as entered in the editor"), `documentationLinks` and `remote`. Source: https://developers.figma.com/docs/rest-api/file-property-types/#component-type, checked 2026-11-12.
- COMPONENT and COMPONENT_SET nodes carry `componentPropertyDefinitions`: for each property a `type` (BOOLEAN, INSTANCE_SWAP, TEXT, VARIANT, SLOT), a `defaultValue`, `variantOptions` for VARIANT, `preferredValues` for INSTANCE_SWAP and SLOT, and `slotSettings` (minimum and maximum children, preferred values only). Source: https://developers.figma.com/docs/rest-api/file-property-types/#componentpropertydefinition-type, checked 2026-11-12.
- Every node carries `componentPropertyReferences`, `boundVariables` and `explicitVariableModes`, and `pluginData` and `sharedPluginData` when the request names them. Source: https://developers.figma.com/docs/rest-api/files/#node-type, checked 2026-11-12.
- `sharedPluginData` is "Data written by plugins that is visible to all plugins"; `GET file` returns it when `plugin_data` includes the string `shared`. Source: https://developers.figma.com/docs/rest-api/files/#node-type, checked 2026-11-12.
- FRAME-type nodes carry `annotations` ("notes and pinned properties of nodes. Currently a maximum of 1 annotation is supported") and `devStatus` (`READY_FOR_DEV` or `COMPLETED` with an optional `description`); SECTION nodes also carry `devStatus`. Source: https://developers.figma.com/docs/rest-api/file-node-types/#frame-props, checked 2026-11-12.
- INSTANCE nodes carry `componentId`, `componentProperties` (the value of each property on that instance), `overrides`, `isExposedInstance` and `exposedInstances`. Source: https://developers.figma.com/docs/rest-api/file-node-types/#instance-props, checked 2026-11-12.
- The REST `Annotation` type has two fields, `label` (a string) and `properties` (pinned properties such as `fills`, `padding`, `fontSize`, `mainComponent`). Source: https://developers.figma.com/docs/rest-api/file-property-types/#annotation-type, checked 2026-11-12.
- CANVAS nodes carry `measurements`: pinned distances between nodes in Dev Mode, with an optional `freeText` override. Source: https://developers.figma.com/docs/rest-api/file-node-types/#canvas-props, checked 2026-11-12.
- TEXT nodes carry `characters` (the text), `style`, per-character style overrides, `lineTypes` (ORDERED, UNORDERED, NONE) and `lineIndentations`. Source: https://developers.figma.com/docs/rest-api/file-node-types/#text-props, checked 2026-11-12.
- For motion, the REST node types document prototype `interactions`, `transitionNodeID`, `transitionDuration` and `transitionEasing`; the node type and property type pages have no keyframe, timeline or animation style field. Source: https://developers.figma.com/docs/rest-api/file-node-types/#frame-props, checked 2026-11-12.
- The REST node type catalog lists no SLOT node type and no Figma Specs node type (no `SPEC_BLOCK`), and no REST page read has a `descriptionMarkdown` or `labelMarkdown` field. Source: https://developers.figma.com/docs/rest-api/file-node-types/ (word search), checked 2026-11-12.
- The REST API is described in an OpenAPI specification in the `figma/rest-api-spec` repository, with TypeScript types. Source: https://developers.figma.com/docs/rest-api/#openapi-specification, checked 2026-11-12.

### REST API: published components, dev resources and versions
- `GET /v1/files/:file_key/components`, `GET /v1/files/:file_key/component_sets` and the team variants list published library components and component sets with `description`, `created_at`, `updated_at` and `node_id`; they are Tier 3 endpoints with the `library_content:read` or `team_library_content:read` scope. Source: https://developers.figma.com/docs/rest-api/component-endpoints/, checked 2026-11-12.
- These endpoints cover published assets only; local and subscribed components come from `GET /v1/files/:key`. Source: https://developers.figma.com/docs/rest-api/component-types/, checked 2026-11-12.
- `GET /v1/files/:file_key/dev_resources` returns the dev resources of a file (name, URL, node ID), optionally for chosen nodes; it is Tier 2 with the `file_dev_resources:read` scope. Dev resources need no publishing. Source: https://developers.figma.com/docs/rest-api/dev-resources-endpoints/#get-dev-resources-endpoint, checked 2026-11-12.
- A node can have at most 10 dev resources. Source: https://developers.figma.com/docs/rest-api/dev-resources-endpoints/#post-dev-resources-endpoint, checked 2026-11-12.
- `GET /v1/files/:key/versions` lists file versions with `id`, `created_at`, `label`, `description` and `user`; it is Tier 2 with the `file_versions:read` scope. Source: https://developers.figma.com/docs/rest-api/version-history-endpoints/#get-file-versions-endpoint, checked 2026-11-12.
- The Discovery API returns text events, including in-file text, component documentation descriptions and links, annotations and dev resources; it is "only available to Enterprise plans with Governance+" and needs an organization admin with an OAuth token. Source: https://developers.figma.com/docs/rest-api/discovery/, checked 2026-11-12.

### REST API: sign-in, scopes and limits
- The REST API accepts three kinds of sign-in: an OAuth app, a plan access token and a personal access token; Figma advises a personal access token "for individual use, such as scripts or local tooling against your own Figma account". Source: https://developers.figma.com/docs/rest-api/authentication/#what-type-of-authentication-should-i-use, checked 2026-11-12.
- A personal access token is sent in the `X-Figma-Token` header and acts "as if they were the user who generated the token". Source: https://developers.figma.com/docs/rest-api/personal-access-tokens/, checked 2026-11-12.
- Since 2025-04-28 a personal access token expires after at most 90 days; non-expiring tokens can no longer be created. Source: https://developers.figma.com/docs/rest-api/changelog/#2025-04-28, checked 2026-11-12.
- Plan access tokens are not tied to a person, last up to one year, and are available for Organization and Enterprise plans only; Figma names "CI/CD implementations" as their use. Source: https://developers.figma.com/docs/rest-api/plan-access-tokens/, checked 2026-11-12.
- The scopes for spec content are `file_content:read`, `file_metadata:read`, `file_versions:read`, `file_dev_resources:read`, `library_content:read`, `library_assets:read`, `team_library_content:read`, `file_comments:read` and `webhooks:read` and `webhooks:write`; `file_variables:read` and `library_analytics:read` are Enterprise only. Source: https://developers.figma.com/docs/rest-api/scopes/, checked 2026-11-12.
- Rate-limit tiers: GET file, GET file nodes and GET image are Tier 1; comments, dev resources, version history and webhooks are Tier 2; components and styles and GET file metadata are Tier 3. RES-024 holds the limits for each tier and plan. Source: https://developers.figma.com/docs/rest-api/rate-limits/, checked 2026-11-12.
- For a personal access token, rate limits are tracked per user and per plan, and the plan of the requested file sets the limit. Source: https://developers.figma.com/docs/rest-api/rate-limits/, checked 2026-11-12.
- For OAuth apps, rate limits are tracked per user, per plan and per app; for plan access tokens, per token and per plan. Source: https://developers.figma.com/docs/rest-api/rate-limits/, checked 2026-11-12.
- The plan access token page lists the limits of the other two kinds: a personal access token is "Tied to an individual user" with a maximum expiration of 90 days, and an OAuth app is "Designed for interactive workflows, not automation". Source: https://developers.figma.com/docs/rest-api/plan-access-tokens/#when-to-use-plan-access-tokens, checked 2026-11-12.
- The scopes page says the Figma MCP server "handles its own OAuth authentication flow — you don't configure REST API scopes for it". Source: https://developers.figma.com/docs/rest-api/scopes/#figma-mcp-server, checked 2026-11-12.

### Webhooks
- Webhooks attach to a team, a folder or a file; team admins create team webhooks, and a person with `Can edit` creates folder and file webhooks. Limits: 20 per team, 5 per folder, 3 per file, and in total 150 file webhooks on Professional, 300 on Organization and 600 on Enterprise. Source: https://developers.figma.com/docs/rest-api/webhooks/#getting-started, checked 2026-11-12.
- Figma has no interface for webhooks; they are created, changed and deleted through the Webhooks API (`POST /v2/webhooks`, Tier 2, `webhooks:write`). Source: https://developers.figma.com/docs/rest-api/webhooks/#getting-started, checked 2026-11-12.
- A webhook sends a `POST` to an HTTP endpoint that the creator gives, with a passcode; Figma retries a failed call three times (after 5 minutes, 30 minutes and 3 hours) and recommends a tool like ngrok to expose a local server. Source: https://developers.figma.com/docs/rest-api/webhooks/#configure-your-server-to-handle-post-requests-with-a-json-payload, checked 2026-11-12.
- The events are `PING`, `FILE_UPDATE` (within 30 minutes of editing inactivity), `FILE_DELETE`, `FILE_VERSION_UPDATE` (a named version is created), `LIBRARY_PUBLISH`, `FILE_COMMENT` and `DEV_MODE_STATUS_UPDATE`. Source: https://developers.figma.com/docs/rest-api/webhooks-events/, checked 2026-11-12.
- `LIBRARY_PUBLISH` lists created, modified and deleted components, styles and variables; one publish can arrive as several events, one for each asset type and more for large publishes. Source: https://developers.figma.com/docs/rest-api/webhooks-events/#library-publish-event, checked 2026-11-12.
- `DEV_MODE_STATUS_UPDATE` fires when a layer's Dev Mode status changes and includes the node ID, the status and the dev resources on that layer. Source: https://developers.figma.com/docs/rest-api/webhooks-events/#dev-mode-status-update-event, checked 2026-11-12.

### Plugin API
- `description` is "The plain-text annotation entered by the user for this style/component"; `descriptionMarkdown` is "The rich-text annotation"; both exist on ComponentNode, ComponentSetNode and style nodes. Source: https://developers.figma.com/docs/plugins/api/properties/nodes-descriptionmarkdown/, checked 2026-11-12.
- The Plugin API documents a bug where the description field can appear missing or out of date, with re-publishing as the workaround. Source: https://developers.figma.com/docs/plugins/api/properties/nodes-description/#remarks, checked 2026-11-12.
- `documentationLinks` "currently only supports setting a single documentation link". Source: https://developers.figma.com/docs/plugins/api/properties/nodes-documentationlinks/#remarks, checked 2026-11-12.
- The Plugin API `Annotation` has `label`, `labelMarkdown`, `properties` and `categoryId`; `figma.annotations.getAnnotationCategoriesAsync()` returns the file's categories. Source: https://developers.figma.com/docs/plugins/api/Annotation/, checked 2026-11-12.
- ComponentSetNode exposes `componentPropertyDefinitions`, `getDevResourcesAsync`, `annotations`, shared plugin data, and the Motion fields `animationStyles`, `animations` (all keyframes), `manualKeyframeTracks` and `timelines`. Source: https://developers.figma.com/docs/plugins/api/ComponentSetNode/, checked 2026-11-12.
- A plugin reads measurements through `PageNode.getMeasurements()` and `getMeasurementsForNode(node)`; each has a start node, an end node, an offset and `freeText`. `addMeasurement` works in Dev Mode only. Source: https://developers.figma.com/docs/plugins/api/Measurement/, checked 2026-11-12.
- `SlotNode` (type `SLOT`) is a slot in a component or instance, linked to a SLOT component property, and reports `limitViolations` against the slot settings. Source: https://developers.figma.com/docs/plugins/api/SlotNode/, checked 2026-11-12.
- Plugin code runs in a sandbox on the main thread of the Figma editor, FigJam, Figma Slides and Figma Buzz, and must call `figma.closePlugin()` when done. Source: https://developers.figma.com/docs/plugins/how-plugins-run/#plugin-environment, checked 2026-11-12.
- A plugin can make network requests with Figma's Fetch API, limited to the domains in its manifest when network access is limited. Source: https://developers.figma.com/docs/plugins/making-network-requests/#make-network-requests, checked 2026-11-12.
- A plugin must load a page with `loadAsync()` before it reads that page's children. Source: https://developers.figma.com/docs/plugins/accessing-document/#loading-pages-and-nodes, checked 2026-11-12.
- Plugins in Dev Mode are read-only: they read the document, can change `pluginData` and relaunch data, and can make network requests; they run in the web and desktop apps and in Figma for VS Code. Source: https://developers.figma.com/docs/plugins/working-in-dev-mode/#plugins-for-dev-mode, checked 2026-11-12.
- The plugin parameters guide names "all contexts from which a plugin can be run: quick actions, context menus, the desktop app menu, etc."; each is a place where a user starts the plugin. Source: https://developers.figma.com/docs/plugins/plugin-parameters/, checked 2026-11-12.
- No page read in Figma's plugin documentation (how plugins run, accessing the document, network requests, Dev Mode, parameters, manifest) describes a way to run a plugin without the Figma editor open. Source: https://developers.figma.com/docs/plugins/how-plugins-run/ (word search of the pages named), checked 2026-11-12.
- `setSharedPluginData(namespace, key, value)` stores data on a node or style that is "public to all plugins"; one entry (namespace, key and value) cannot exceed 100 kB. Source: https://developers.figma.com/docs/plugins/api/properties/nodes-setsharedplugindata/, checked 2026-11-12.
- `getStyledTextSegments` returns text in segments with chosen properties, among them `listOptions`, `indentation`, `hyperlink`, `fontWeight` and `textStyleId`. Source: https://developers.figma.com/docs/plugins/api/properties/TextNode-getstyledtextsegments/, checked 2026-11-12.
- The public Plugin API typings `@figma/plugin-typings` 1.142.0 (2026-10-16) have no `figma.spec` API and no `SPEC_BLOCK` node; neither do the typings bundled with the Figma plugin 2.2.157; the developer documentation sitemap has no Plugin API page for Specs. Source: https://registry.npmjs.org/@figma/plugin-typings/-/plugin-typings-1.142.0.tgz (word search of `plugin-api.d.ts`), checked 2026-11-12.

### Figma Specs
- Figma Specs is "a collaborative document editor" on the Figma Design canvas and on FigJam boards, also as standalone Spec files; it is in open beta on Starter, Professional, Education, Organization and Enterprise. Source: https://help.figma.com/hc/en-us/articles/44049066011671-Guide-to-Specs-in-Figma, checked 2026-11-12.
- Figma names "Placing usage documentation on the canvas next to library components so your team and agents have the context they need" as a use of Specs. Source: https://help.figma.com/hc/en-us/articles/44049066011671-Guide-to-Specs-in-Figma, checked 2026-11-12.
- Writing in a Spec needs edit access to the file; manual writing uses no AI credits, and use of the Figma agent with Specs does. Source: https://help.figma.com/hc/en-us/articles/44049066011671-Guide-to-Specs-in-Figma#h_01M4Y0KMQ766AK3Q737RR2PEJS, checked 2026-11-12.
- The Specs guide names one route for other tools: "Coding agents connected to the Figma MCP server can work with Specs using the figma-spec skill" and can read, create and update standalone and embedded Specs. It names no export or download as Markdown. Source: https://help.figma.com/hc/en-us/articles/44049066011671-Guide-to-Specs-in-Figma#h_01M4Y0KMQFY14QHZCWSM3AQ2M1, checked 2026-11-12.
- The beta list calls Specs "a multiplayer, Markdown editor". Source: https://help.figma.com/hc/en-us/articles/4406787442711-What-Figma-features-are-in-beta#h_01M4Y3QH4E8WMQXT4DY5CREA39, checked 2026-11-12.
- The `use_figma` tool reads, creates and edits Specs, including Specs embedded in Figma Design and FigJam files, and needs the `figma-spec` skill; Specs work only on plans where Specs is turned on. Source: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#use_figma, checked 2026-11-12.
- In the `figma-spec` skill, a Spec is GitHub-Flavored Markdown under a `SPEC_BLOCK` node, and `figma.spec.getContent({ specNodeId })` returns `markdown`, `title` and `specNodeId`, with `offset` and `maxLines` for paging. Source: /Users/peterkloss/.claude/plugins/cache/claude-plugins-official/figma/2.2.157/skills/figma-spec/SKILL.md:11-49, checked 2026-11-12.
- `getContent` returns images as URLs of the form `https://<host>/spec/<fileKey>/image/<sha>?w=<width>&h=<height>`, and comment anchors as `[comment:<uuid>]…[/comment:<uuid>]` markers in the Markdown. Source: /Users/peterkloss/.claude/plugins/cache/claude-plugins-official/figma/2.2.157/skills/figma-spec/SKILL.md:78-94, checked 2026-11-12.
- The current `figma-spec` skill (repository version) tells the agent to check that `figma.spec` is defined in the first `use_figma` script, because "it exists only when the file's plan has Specs enabled"; the installed 2.2.157 version tells it to check `specs_enabled: true` through `whoami`. Source: https://raw.githubusercontent.com/figma/mcp-server-guide/main/skills/figma-spec/SKILL.md, checked 2026-11-12.

### Annotations and descriptions in the help center
- Adding annotations and measurements needs a Professional, Education, Organization, Government or Enterprise plan, a Full seat and edit access; viewing them needs a Full or Dev seat and view access. Source: https://help.figma.com/hc/en-us/articles/20774752502935-Add-measurements-and-annotate-designs, checked 2026-11-12.
- An annotation can hold plain text and pinned properties; Figma Design files come with the categories Development, Interaction, Accessibility and Content, and editors can add categories for each file. Source: https://help.figma.com/hc/en-us/articles/20774752502935-Add-measurements-and-annotate-designs#h_01JQF01V58B84YWTHPN9NGTMMV, checked 2026-11-12.
- Figma calls the component description field a "short description" and says "It won't be possible to capture every detail in this description field"; a component, a component set and each variant can have a description and a link. Source: https://help.figma.com/hc/en-us/articles/7938814091287-Add-descriptions-to-styles-components-and-variables#components, checked 2026-11-12.
- Figma Motion is in open beta on all plans with a Full seat; Dev Mode has a read-only timeline that copies animation code into CSS, JSON or React, and the MCP server can send animation context. Source: https://help.figma.com/hc/en-us/articles/4406787442711-What-Figma-features-are-in-beta#h_01KTN7QBXW6KS1ACWCXEQT506N, checked 2026-11-12.
- Dev resources (links to code, tickets or documentation) can be added to any layer on Professional, Education, Organization, Government and Enterprise; a link on a component is inherited by all its instances. Source: https://help.figma.com/hc/en-us/articles/15023231995927-Link-Dev-resources-to-layers-in-Dev-Mode, checked 2026-11-12.

### Figma MCP reads
RES-023 holds the MCP tool list, the sign-in, the limits and the plans. These findings add what bears on spec content.

- `get_motion_context` returns, for an animated node, a list of animated nodes, keyframe tracks with easing curves, and CSS `@keyframes` and Motion code snippets. Source: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#get_motion_context, checked 2026-11-12.
- Figma's guide to structuring a file for the MCP server tells designers to "Add annotations to explain things that are hard to show visually, like how an element should behave, align, or respond" and to add dev resources "so your agent gets links to related documentation, code, or tickets"; it does not name which tool returns them. Source: https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/, checked 2026-11-12.
- With Code Connect UI and a connected GitHub repository, a team can add "instructions for MCP" for each mapped component, which the MCP server passes to agents. Source: https://developers.figma.com/docs/code-connect/code-connect-ui-github/#what-you-get-from-the-integration, checked 2026-11-12.
- A live call showed that `get_metadata` returns no component properties and no variable bindings; their check needed a `use_figma` read script. Source: /Users/peterkloss/Dev/ACMElabs/design-system-v1/docs/research/RES-025-figma-live-trial.md:51, checked 2026-11-12.

### Command-line tools and GitHub
- The Code Connect CLI, npm package `@figma/code-connect`, runs as `npx figma connect` with the commands `publish`, `unpublish`, `parse`, `create`, `migrate` and `preview`; it takes a token through `--token` or `FIGMA_ACCESS_TOKEN`. Source: https://developers.figma.com/docs/code-connect/cli-reference/, checked 2026-11-12.
- `figma connect create <figma-node-url>` fetches a component from the REST API and writes a `.figma.ts` template with one accessor for each component property; it writes no other spec content. Source: https://developers.figma.com/docs/code-connect/cli-reference/#figma-connect-create, checked 2026-11-12.
- The `@figma/code-connect` package, version 2.1.0 (2026-10-26), installs a binary named `figma` whose only registered command group is `connect`; its update message calls it "the Figma CLI". Source: https://registry.npmjs.org/@figma/code-connect (package 2.1.0, `dist/cli.js` and `dist/common/updates.js`), checked 2026-11-12.
- Figma's Code Connect CI example is a GitHub Actions job that runs `npx figma connect publish` with `FIGMA_ACCESS_TOKEN`; on Professional, Figma says to use a personal access token. Source: https://developers.figma.com/docs/code-connect/ci-cd/#authentication-in-ci, checked 2026-11-12.
- The plan access token page has a "Figma CLI" token type with "a fixed scope set for supported Figma CLI workflows, including Code Connect and codebase uploads"; it is created by an organization administrator. Source: https://developers.figma.com/docs/rest-api/plan-access-tokens/#create-a-figma-cli-token, checked 2026-11-12.
- The npm registry lists five packages in the `@figma` scope: `rest-api-spec`, `plugin-typings`, `code-connect`, `eslint-plugin-figma-plugins` and `widget-typings`; `@figma/cli` returns 404. Source: https://registry.npmjs.org/-/v1/search?text=%40figma, checked 2026-11-12.
- The Figma GitHub App serves Code Connect and Figma Make: it reads repository files for Code Connect and writes commits, branches and repositories for Figma Make exports; its Checks, Commit statuses and Pull requests permissions are marked "In development". Source: https://developers.figma.com/docs/github-permissions/, checked 2026-11-12.
- The `figma` GitHub organization has 199 public repositories; 93 have "action" in the name, and 92 of these are forks of third-party actions. The one that is not a fork is `variables-github-action-example`, "Example GitHub Actions workflows for syncing variables to Figma" (variables are IDEA-002#08's scope). No repository name or description names an export of components, descriptions, annotations or Specs. Source: https://api.github.com/orgs/figma/repos?per_page=100&page=1 and https://api.github.com/orgs/figma/repos?per_page=100&page=2, checked 2026-11-12.

### Disagreements between sources
- Number of annotations on a node: the REST node types say "Currently a maximum of 1 annotation is supported"; the Plugin API example sets two annotations with different categories on one node. Source: https://developers.figma.com/docs/rest-api/file-node-types/#frame-props and https://developers.figma.com/docs/plugins/api/Annotation/#example-usage, checked 2026-11-12.
- Fields of an annotation: the Plugin API has `label`, `labelMarkdown`, `properties` and `categoryId`; the REST type has `label` and `properties` only. Source: https://developers.figma.com/docs/plugins/api/Annotation/#annotation-properties and https://developers.figma.com/docs/rest-api/file-property-types/#annotation-type, checked 2026-11-12.
- Rate limit for a low-limit seat or a Starter file: the rate-limit page's example and text say 6 requests a month; its table says up to 20 a month (also in RES-024). Source: https://developers.figma.com/docs/rest-api/rate-limits/, checked 2026-11-12.
- Plan for the dev resources REST endpoints: the endpoint pages name no plan; RES-024 records that the pricing page marks "REST API with Dev Mode", described as "Access dev resources, check on statuses, and integrate external tools via the REST API", as included on Enterprise only. Source: https://developers.figma.com/docs/rest-api/dev-resources-endpoints/ and https://www.figma.com/pricing/, checked 2026-11-12.
- Annotations from a Dev Mode plugin: the Dev Mode guide says "Plugins in Dev Mode are read-only" and "won't be able to edit the contents of the document"; the annotations article says "teams can build custom Dev Mode plugins to create and manage annotations in bulk". Source: https://developers.figma.com/docs/plugins/working-in-dev-mode/#plugins-for-dev-mode and https://help.figma.com/hc/en-us/articles/20774752502935-Add-measurements-and-annotate-designs#h_01JQF01V58B84YWTHPN9NGTMMV, checked 2026-11-12.
- Specs check in the `figma-spec` skill: the installed version 2.2.157 requires `whoami` with `specs_enabled: true`; the repository version tells the agent to test whether `figma.spec` is defined. Source: /Users/peterkloss/.claude/plugins/cache/claude-plugins-official/figma/2.2.157/skills/figma-spec/SKILL.md:9 and https://raw.githubusercontent.com/figma/mcp-server-guide/main/skills/figma-spec/SKILL.md, checked 2026-11-12.
- "Figma CLI": the plan access token page says Figma CLI tokens serve "supported Figma CLI workflows, including Code Connect and codebase uploads"; the `figma` binary in `@figma/code-connect` 2.1.0 registers the `connect` command group only, and no other `@figma` npm package has a binary for codebase uploads. Source: https://developers.figma.com/docs/rest-api/plan-access-tokens/#supported-endpoints and https://registry.npmjs.org/@figma/code-connect, checked 2026-11-12.

## Follow-ups
- What does a live read return for one component with a description, an annotation, a dev resource and an embedded Spec: `GET file nodes` with the access token, and `get_design_context` and a `use_figma` read through the MCP? This settles four UNVERIFIED lines.
- Can a headless agent in CI use the remote Figma MCP server with a stored sign-in, or does each run need a person?
- Does the Spec editor have a copy or export command for Markdown? A look in the Figma app can settle it.

## Next action
None.

Capabilities used: brain:source-driven-development was loaded. `curl` with a local HTML-to-text script read the developer documentation (first proof: `https://developers.figma.com/docs/rest-api/file-endpoints/`, HTTP 200). The help center article API, the npm registry, the GitHub API and WebSearch answered. Local reads of the installed plugin worked. No Figma MCP call and no access token were used, by the brief.
