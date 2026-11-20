---
id: RES-080
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-005#14 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-080: MCP Apps views in Claude Code, Codex and Gemini CLI

## Question
Do Claude Code, Codex and Gemini CLI show the view of a tool that uses MCP Apps? What does each host's own documentation say, and what does a test with a minimal server show?

Settled context: a new design system is being defined, with a core of Lit web components. It will have an MCP server. RES-066 found that a tool can return rendered UI through MCP Apps: the tool names a `ui://` resource, one HTML page, and the host shows it in a sandboxed frame. The community's list of hosts has no tick for Claude Code, and Codex and Gemini CLI are not in that list. RES-066 did not check the three hosts themselves. Needed by IDEA-005#12, the decision whether the MCP server of the new system has tools that return rendered UI.

## Answer
Sufficient answer, for each of the three hosts, with its version and the date of the check: (1) what the host's own documentation, release notes and repository say about MCP Apps, `ui://` resources and the UI of a tool, quoted, or where we looked if they say nothing; (2) what a test with a minimal stdio server shows for each installed host: the capabilities the host sends at the start and whether it declares the MCP Apps extension, whether it reads the `ui://` resource, and what it gives back for the tool call in a run with no person; a host that is not installed or needs a sign-in is "not performed" with the reason; (3) what the MCP Apps specification says a host does when it does not support views. State what could not be confirmed.

Answered on 2026-11-20 for Claude Code 2.1.329, Codex CLI 0.154.0 and Gemini CLI 0.58.0, all installed on this machine. None of the three showed a view or declared MCP Apps to the server in its terminal use. Each one connected, listed the tool, and read no `ui://` resource.

1. Own documentation, release notes and repository.
   - Claude Code: the docs name MCP Apps only to say that `ui://` resources are "pages for a host application to render rather than content for Claude to read" and are left out of resource lists (changelog 2.1.281). Rendering is named only for Claude Desktop and claude.ai, and, through the Agent SDK's alpha `readMcpResource()`, for an application that embeds Claude Code and renders the view itself. An open user issue (#95149) asks for rendering in Claude Code; it is labelled `duplicate` and `stale`.
   - Codex: the CLI's MCP docs list no MCP Apps feature. The code knows `io.modelcontextprotocol/ui` ("Extension ID for MCP App UI rendering") but declares it to servers only when its app-server client declares it. The in-process client that `exec` and the TUI use sets `extensions: None`. Codex passes a tool's `ui://` URI to its app-server clients as `appContext.resourceUri`. Many open issues about MCP Apps name Codex Desktop.
   - Gemini CLI: no mention of MCP Apps, `ui://`, `mcp-app` or the extension in code or docs at v0.58.0 and at `main` of 2026-11-19, in the last 100 release notes, or in issue titles. Its MCP client registers only `roots`.
2. Test with a minimal stdio server (scratch home, no sign-in).
   - Claude Code: modern handshake by default (`server/discover`, 2026-07-28) with client capabilities `roots` and `elicitation`; legacy `initialize` (2025-11-25) with the same capabilities when forced. No `extensions`, no `resources/read`. The tool call was not performed: "Not logged in".
   - Codex: `codex exec` sent `initialize` (2025-06-18) with `experimental` and `elicitation`; no `extensions`, no `resources/read`. The tool call through the model was not performed: 401 without a sign-in. Through `codex app-server`, a client that declared the extension had it passed on to the server, and a client that did not had none. A direct `mcpServer/tool/call` returned the text and `structuredContent` to that client; the view was read only when the client asked for it.
   - Gemini CLI: the session client sent `initialize` (2025-06-18) with only `roots`; no `extensions`, no `resources/read`. The tool call was not performed: no sign-in, and an invalid dummy key failed at the model.
3. Specification: "If host does not support MCP Apps, tool behaves as standard tool (text-only fallback)". The server "SHOULD" check the client's capability, "SHOULD" give a text-only fallback, and the tool "MUST return meaningful content array even when UI is available".

Could not confirm:
- What each host gives back to the model for the tool call. Every model-driven run stopped at the missing sign-in.
- Whether a signed-in session, or a feature flag fetched in one, changes Claude Code's declared capabilities. The test ran with no sign-in, and the docs say Claude Code fetches feature flags in some sessions.
- Whether any Codex client (Desktop, IDE extension) renders the view. Only the pass-through in the app-server was observed.
- Which issue #95149 duplicates, and whether Anthropic or Google plan this feature. No maintainer statement was found.
- The interactive terminal of each host was not run. The test covered headless runs and, for Codex, the app-server.

Limits: one macOS arm64 machine, one run per case. The three `--version` checks ran before `HOME` was redirected. Gemini's folder trust was simulated in the scratch home. During its run, Claude Code reported a messaging socket under `/tmp/cc-socks/`, outside the trial folder. The socket was gone after the run.

## Findings

### The MCP Apps specification (2026-01-26, stable)

- Web tool proved by a read: Firecrawl scrape of the spec file, live fetch (`maxAge: 0`). Source: https://raw.githubusercontent.com/modelcontextprotocol/ext-apps/main/specification/2026-01-26/apps.mdx, checked 2026-11-20.
- A host advertises support in its `initialize` request: "Clients advertise MCP Apps support in the initialize request using the extension identifier `io.modelcontextprotocol/ui`", as `capabilities.extensions["io.modelcontextprotocol/ui"].mimeTypes: ["text/html;profile=mcp-app"]`. `mimeTypes` is REQUIRED. Source: same file, section "Client (Host) Capabilities", checked 2026-11-20.
- What a host without views does: "If host does not support MCP Apps, tool behaves as standard tool (text-only fallback)". A host that supports it "MUST use `resources/read` to fetch the referenced resource URI" and "MAY prefetch and cache UI resource content". Source: same file, section "Behavior" under tool metadata, checked 2026-11-20.
- The server side of the fallback: "Servers SHOULD check client capabilities before registering UI-enabled tools"; "Servers SHOULD provide text-only fallback behavior for all UI-enabled tools"; "Tools MUST return meaningful content array even when UI is available"; "Servers MAY register different tool variants based on host capabilities". Source: same file, sections "Server Behavior" and "Graceful Degradation", checked 2026-11-20.
- The tool names its view with `_meta.ui.resourceUri`; the flat `_meta["ui/resourceUri"]` is deprecated. The resource URI "MUST start with `ui://`" and its `mimeType` "MUST be `text/html;profile=mcp-app`". Source: same file, sections on tool metadata and "Content Requirements", checked 2026-11-20.

### Claude Code (2.1.329): its own documentation

- Installed version: `claude --version` prints `2.1.329 (Claude Code)`; the changelog's top entry is 2.1.329. Source: local run and https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md, checked 2026-11-20.
- The MCP docs page mentions MCP Apps once, under resources: "MCP Apps UI resources are entries with a `ui://` URI or the `text/html;profile=mcp-app` media type: pages for a host application to render rather than content for Claude to read. They don't appear in the `@` suggestions or in the resource list tool's results, and a server that offers only UI resources shows an empty resource list. Reading a UI resource by its URI still works." The page says nothing about rendering a view. Source: https://code.claude.com/docs/en/mcp.md (section on MCP resources), checked 2026-11-20.
- Changelog 2.1.281: "Changed MCP resource lists (the resource list tool and @-mention suggestions) to skip MCP Apps UI resources; reading one by URI still works". No changelog entry adds rendering of MCP Apps views; a search for "MCP App", "ui://", "mcp-app" and "io.modelcontextprotocol/ui" finds only this entry. Source: https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md, checked 2026-11-20.
- Changelog 2.1.319: "Fixed MCP servers on the older handshake failing to connect, or returning empty results, because Claude Code declared an extension that it only uses with newer servers". The entry does not name the extension. Source: same file, checked 2026-11-20.
- Of the 205 pages listed in the docs index, five mention MCP Apps: `mcp.md`, `changelog.md`, `tools-reference.md`, `network-config.md` and `typescript.md`. Source: https://code.claude.com/docs/llms.txt and each page's `.md` form, fetched and searched for "MCP App", "ui://", "mcp-app" and "io.modelcontextprotocol/ui", checked 2026-11-20.
- `network-config.md` names other hosts, not the terminal: "Claude Desktop and claude.ai also render some tool results inside a conversation as interactive widgets, such as the MCP Apps some connectors provide. Those widgets load from generated subdomains of `claudemcpcontent.com`". Source: https://code.claude.com/docs/en/network-config.md, checked 2026-11-20.
- The Agent SDK reference leaves rendering to the embedding application: `readMcpResource(serverName, uri)` is "*Alpha.* Reads one MCP Apps `ui://` resource from a connected MCP server so your application can render a tool's widget" (Agent SDK v0.3.280 or later). The tool's `_meta` carries "the `ui` object and the `ui/resourceUri` string"; "Fetch that URI with `readMcpResource()` and render the resource in your application". "Claude Code sends `_meta` only when the `capabilities` array of the `system` message with subtype `init` lists `mcp_tool_ui_meta_v1`. You don't turn `mcp_tool_ui_meta_v1` on yourself" (end of quote). Source: https://code.claude.com/docs/en/typescript.md (`readMcpResource`, `McpServerStatus`), checked 2026-11-20.
- On protocol revision 2026-07-28, "each request carries Claude Code's client capabilities at `params._meta["io.modelcontextprotocol/clientCapabilities"]`". Claude Code uses its v2 runtime, which asks stdio servers for that revision, by default on 2.1.274 or later in sessions without feature-flag fetching, for example with `DISABLE_TELEMETRY`. Source: https://code.claude.com/docs/en/mcp.md (sections "MCP client runtimes" and MCP tasks), checked 2026-11-20.
- Repository: issue anthropics/claude-code#95149, "Render MCP Apps (SEP-1865) ui:// resources in Claude Code", opened 2026-09-17, is open with the labels `duplicate`, `area:mcp` and `stale`. Its author reports that "`capabilities.extensions` does not advertise `io.modelcontextprotocol/ui`, so the server correctly falls back to text". This is a user report, not a statement by the maintainers. Source: https://github.com/anthropics/claude-code/issues/95149 (GitHub REST API), checked 2026-11-20.
- Repository: other open issues in anthropics/claude-code name MCP Apps in the "Desktop Code tab", for example #105199 ("MCP Apps host acknowledges `_meta.ui.csp.resourceDomains` but omits it from the iframe") and #103809 ("MCP App widgets receive no structuredContent"). They concern the Claude Desktop app, not the terminal CLI. Source: GitHub issue search `repo:anthropics/claude-code "MCP Apps"` (159 results), checked 2026-11-20.

### Test setup

- The test server is `server/server.mjs`: Node.js 24.20.0, no dependencies, stdio, one tool `show_swatch` with `_meta.ui.resourceUri: "ui://trial-swatch/view.html"`, a resource of type `text/html;profile=mcp-app` at that URI, and a tool result with a text `content` item and `structuredContent`. It answers both the legacy `initialize` and the modern `server/discover` with per-request `_meta`, and writes every message it receives and sends to a JSON-lines log. A self-test answered both forms. Source: .artifacts/v1/trial/IDEA-005-14/server/server.mjs and logs/selftest.jsonl, checked 2026-11-20.
- Every host ran through `env.sh`: `env -i` with `HOME`, the XDG folders, `TMPDIR` and `CODEX_HOME` inside `.artifacts/v1/trial/IDEA-005-14/home`, so no host saw a credential or the real home folder's configuration. No sign-in took place. Source: .artifacts/v1/trial/IDEA-005-14/env.sh, checked 2026-11-20.

### Claude Code 2.1.329: test

- Run: `claude -p "<call show_swatch>" --mcp-config hosts/claude/mcp.json --strict-mcp-config --debug --output-format stream-json --verbose` from the scratch project. Claude Code connected the server (`"mcp_servers":[{"name":"trial","status":"connected"}]`) and listed the tool `mcp__trial__show_swatch`. Source: .artifacts/v1/trial/IDEA-005-14/logs/claude-run.txt, checked 2026-11-20.
- Default handshake, modern: the first request was `server/discover` with `_meta["io.modelcontextprotocol/protocolVersion"]: "2026-07-28"`, `clientInfo` `claude-code` 2.1.329, and `clientCapabilities` `{"roots":{"listChanged":true},"elicitation":{"form":{},"url":{}}}`. Then `resources/list` and `tools/list` with the same `_meta`. No `extensions` member, so no `io.modelcontextprotocol/ui`. Source: .artifacts/v1/trial/IDEA-005-14/logs/claude.jsonl, checked 2026-11-20.
- Legacy handshake (`MCP_PROTOCOL_NEGOTIATION=legacy`): `initialize` with `protocolVersion` `2025-11-25` and `capabilities` `{"roots":{"listChanged":true},"elicitation":{"form":{},"url":{}}}`, then `notifications/initialized`, `tools/list` and `resources/list`. No `extensions` member. Source: .artifacts/v1/trial/IDEA-005-14/logs/claude-legacy.jsonl and claude-legacy-run.txt, checked 2026-11-20.
- In both runs Claude Code did not send `resources/read`, so it did not fetch the `ui://` view. Source: the same two server logs, checked 2026-11-20.
- The tool call itself: not performed. The run stopped before the model with "Not logged in · Please run /login" (`"error":"authentication_failed"`), because the scratch home has no sign-in. Source: .artifacts/v1/trial/IDEA-005-14/logs/claude-run.txt, checked 2026-11-20.
- The `init` message of the headless run lists, among its `capabilities`, `mcp_read_resource_v1`, `mcp_tool_ui_meta_v1`, `ui_surface_v1` and `ui_pane_widget_v1`. These are the Agent SDK capabilities that the docs tie to `readMcpResource()` and the tool `_meta` for an embedding application. Source: .artifacts/v1/trial/IDEA-005-14/logs/claude-run.txt, checked 2026-11-20.

### Codex (CLI 0.154.0): its own documentation and code

- Installed version: `codex --version` prints `codex-cli 0.154.0`. Source code read at tag `rust-v0.154.0`, commit 6b9826e3aa83b1a5947db50f4332cb9c65f1b340. Source: local run and https://github.com/openai/codex/tree/rust-v0.154.0, checked 2026-11-20.
- The Codex MCP docs page (CLI view) lists "Supported MCP features" as stdio servers, Streamable HTTP servers and server instructions. It does not mention MCP Apps, `ui://` resources or the UI of a tool. Source: https://developers.openai.com/codex/mcp (served at https://learn.chatgpt.com/docs/extend/mcp?surface=cli), live fetch, checked 2026-11-20.
- The code knows the extension: `pub const MCP_APP_UI_EXTENSION_ID: &str = "io.modelcontextprotocol/ui";` with the comment "Extension ID for MCP App UI rendering" (end of quote). Source: codex-rs/protocol/src/mcp.rs:33 at rust-v0.154.0, checked 2026-11-20.
- Codex declares the extension to MCP servers only when its own app-server client declares it: `client_mcp_extensions` "Selects the MCP extensions Codex supports from those declared by the app-server host", and keeps `io.modelcontextprotocol/ui` among four known IDs. A test asserts that with no host extensions `capabilities.extensions` is `None`. Source: codex-rs/codex-mcp/src/client_capabilities.rs:11-45 and codex-rs/codex-mcp/src/rmcp_client.rs:1309-1340 at rust-v0.154.0, checked 2026-11-20.
- The in-process client sets `extensions: None` in its initialize capabilities; the `tui` and `exec` crates use this client. Source: codex-rs/app-server-client/src/lib.rs:213-235 at rust-v0.154.0, and `grep InProcessClientStartArgs` in codex-rs/tui/src/lib.rs and codex-rs/exec/src/lib.rs, checked 2026-11-20.
- Codex reads a tool's view URI from `_meta.ui.resourceUri`, then `_meta["ui/resourceUri"]`, then `_meta["openai/outputTemplate"]`, and passes it on in the app-server protocol as `appContext.resourceUri` of an `mcpToolCall` item, for the client to use. Source: codex-rs/core/src/mcp_tool_call.rs:1178-1179 and 1752-1768, codex-rs/app-server-protocol/schema/typescript/v2/ThreadItem.ts and McpToolCallAppContext.ts at rust-v0.154.0, checked 2026-11-20.
- Repository: a search for `repo:openai/codex "MCP Apps"` finds 1537 issues and pull requests; the newest open ones name Codex Desktop or Windows desktop, for example #55167 "MCP Apps: App-provided tools are not discoverable or callable in Codex Desktop" and #45913 "MCP Apps: explicitly allowed HTTP localhost iframe blocked by CSP". Source: GitHub issue search, checked 2026-11-20.

### Codex 0.154.0: test

- Run 1, the CLI with no person: `codex exec --skip-git-repo-check "<call show_swatch>" < /dev/null`, with the server in the scratch `CODEX_HOME/config.toml`. Codex started the server and sent legacy `initialize` with `protocolVersion` `2025-06-18`, `clientInfo` `codex-mcp-client` 0.154.0 and `capabilities` `{"experimental":{"codex/auth-change":{}},"elicitation":{"form":{},"url":{}}}`, then `notifications/initialized` and `tools/list`. No `extensions` member, no `resources/list`, no `resources/read`. Source: .artifacts/v1/trial/IDEA-005-14/logs/codex-exec.jsonl, checked 2026-11-20.
- In run 1 the model call failed with "401 Unauthorized: Missing bearer or basic authentication in header", because the scratch home has no sign-in. So what `codex exec` gives back for the tool call was not observed. Source: .artifacts/v1/trial/IDEA-005-14/logs/codex-exec-run.txt, checked 2026-11-20.
- Run 2, `codex app-server` driven by a test client in the role of a GUI host, without a model: `initialize` (without and then with `capabilities.extensions["io.modelcontextprotocol/ui"]`), `thread/start`, `mcpServer/tool/call` and `mcpServer/resource/read`. Neither step needed a sign-in. Source: .artifacts/v1/trial/IDEA-005-14/hosts/codex/app-server-client.mjs and logs/codex-appserver-*-transcript.jsonl, checked 2026-11-20.
- When the app-server client declared the extension, Codex passed it on to the MCP server: its `initialize` carried `"extensions":{"io.modelcontextprotocol/ui":{"mimeTypes":["text/html;profile=mcp-app"]}}`. When the client did not declare it, the `initialize` had no `extensions`. Source: .artifacts/v1/trial/IDEA-005-14/logs/codex-appserver-with-ui.jsonl and codex-appserver-without-ui.jsonl, checked 2026-11-20.
- In run 2, `tools/call` reached the server with `_meta.threadId`, and the app-server client received the server's full result: the text `content` item and `structuredContent` `{"color":"red"}`. `resources/read` of `ui://trial-swatch/view.html` reached the server only when the test client asked for it with `mcpServer/resource/read`; Codex did not read the view by itself. Source: the same logs and transcripts, checked 2026-11-20.
- So in this test the terminal paths (`codex exec`, and the in-process client of the TUI per the code) do not declare MCP Apps, and the app-server passes the declaration through from a client that renders. The test did not show a view rendered by any Codex client. Source: the findings above, checked 2026-11-20.

### Gemini CLI (0.58.0): its own documentation and code

- Installed version: `gemini --version` prints `0.58.0`. Source read at tag `v0.58.0`, commit ac9431c9e2290d68af31a77614ff2fddb2391ca3, and at `main`, commit d4cb1713fd7fc30f1c03f9ca7cbfed341c97dffd of 2026-11-19. Source: local run and https://github.com/google-gemini/gemini-cli, checked 2026-11-20.
- Neither tree contains `io.modelcontextprotocol/ui`, `profile=mcp-app`, `MCP Apps` or a `ui://` URI, in code or in `docs/`. The only `resourceUri` hits are test variables for `resource://` URIs. Source: `grep -rn` over both trees, checked 2026-11-20.
- The MCP client registers only the `roots` capability (`listChanged: true`), on `@modelcontextprotocol/sdk` 1.23.0. Source: packages/core/src/tools/mcp-client.ts:1846-1861 and packages/core/package.json:34 at v0.58.0, checked 2026-11-20.
- The release notes of the last 100 releases (v0.56.0-nightly of 2026-08-21 to v0.71.0-nightly of 2026-11-20) do not mention MCP Apps, `ui://`, `mcp-app` or widgets. Source: https://api.github.com/repos/google-gemini/gemini-cli/releases?per_page=100, checked 2026-11-20.
- Repository: issue searches for `SEP-1865` and `"io.modelcontextprotocol/ui"` in google-gemini/gemini-cli find nothing; `"MCP Apps"` finds 7 items, none about MCP Apps views. Source: GitHub issue search, checked 2026-11-20.

### Gemini CLI 0.58.0: test

- Setup: the server in the scratch `HOME/.gemini/settings.json`, and the scratch project marked trusted in the scratch `HOME/.gemini/trustedFolders.json` (simulated trust, as in RES-077). Source: .artifacts/v1/trial/IDEA-005-14/home/.gemini/, checked 2026-11-20.
- `gemini mcp list` showed "trial ... (stdio) - Connected". Its check uses a separate client: `initialize` with `protocolVersion` `2025-06-18`, empty `capabilities` and `clientInfo` `mcp-test-client` 0.0.1, then `ping`. Source: .artifacts/v1/trial/IDEA-005-14/logs/gemini-list-run.txt and gemini-list.jsonl, checked 2026-11-20.
- `gemini -p "<call show_swatch>"` with no auth stopped before any MCP connection: "Please set an Auth method ..." (exit 41). Source: .artifacts/v1/trial/IDEA-005-14/logs/gemini-prompt-run.txt (first run, overwritten by the second; the message is quoted here), checked 2026-11-20.
- With `GEMINI_API_KEY` set to an invalid dummy value (no account, no sign-in), the session client connected first: `initialize` with `protocolVersion` `2025-06-18`, `capabilities` `{"roots":{"listChanged":true}}` and `clientInfo` `gemini-cli-mcp-client` 0.58.0, then `notifications/initialized`, `tools/list` and `resources/list`. No `extensions` member and no `resources/read`. Source: .artifacts/v1/trial/IDEA-005-14/logs/gemini-prompt.jsonl, checked 2026-11-20.
- The model call then failed with "API key not valid. Please pass a valid API key." (`API_KEY_INVALID`, status 400). So what Gemini CLI gives back for the tool call was not observed. Source: .artifacts/v1/trial/IDEA-005-14/logs/gemini-prompt-run.txt, checked 2026-11-20.

## Follow-ups
- Do Claude Desktop's Code tab and Codex Desktop render MCP Apps views from a local stdio server? Open issues in both repositories suggest they do, with gaps; those hosts were out of scope here.

## Next action
None.
