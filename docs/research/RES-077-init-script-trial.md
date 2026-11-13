---
id: RES-077
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-005#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-13
---
# RES-077: Trial: an init script from the package's bin installs the MCP server and the skills

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
Does an `init` script from the package's `bin` install a working MCP server and skills into a consumer project?

Needed by IDEA-005#04, the decision whether the MCP server and the skills ship inside the design system package or as separate packages, and IDEA-005#05, what `init` installs, into which agent hosts, and how it updates on a new version.

## Answer
Answered on 2026-11-13. The result file `.artifacts/v1/trial/IDEA-005-03/IDEA-005-03-result.md` gives an observed outcome, or "not performed" with the reason, for each of the six cases. The completion condition is met.

In short, as observed:

1. `init` ran from the `bin` after an install from a local tarball with npm 11.19.0 (`npx --no-install trial-ds init`), pnpm 12.3.4 (`pnpm exec trial-ds init`) and the pinned Bun 1.4.2 (`bun x trial-ds init`). Each wrote the same files: `.mcp.json`, `.cursor/mcp.json`, `.gemini/settings.json`, `.codex/config.toml`, symlinks in `.claude/skills/` and `.agents/skills/`, copies in `.cursor/skills/`, `.gemini/skills/` and `.github/skills/`.
2. The server answered `initialize`, `tools/list` and `tools/call`, and the modern `server/discover` and `tools/call` with `_meta`, started by the exact command `init` wrote (`node node_modules/trial-ds/mcp/server.mjs`) from the project root. Started from a subfolder, the same command failed (module not found).
3. Claude Code 2.1.323 found the server as "Pending approval"; after a simulated approval it showed "Connected" and loaded both skills through the symlinks. Codex 0.154.0 found the skills through the `.agents/skills` symlinks without trust, and the server only after a simulated trust. Gemini CLI 0.58.0 disabled the server and the skills in an untrusted folder; after a simulated trust the server was "Connected" and the symlinked skills overrode the copies. Cursor, VS Code Copilot and Devin Desktop: not performed (no read-only listing command; Devin not installed).
4. After an update to 1.1.0 without a new `init`: the server answered as 1.1.0; pointers matched 1.1.0 for a changed skill, dangled for a removed one and missed an added one; copies stayed at 1.0.0. After a new `init`: pointers and copies matched 1.1.0 and the added skill was present; the removed skill's dangling links and 1.0.0 copies stayed.
5. A second `init` beside other MCP servers, other config keys and other skills kept all of them; the `trial-ds` entry and the Codex block appeared once.
6. A consumer that installs only `trial-framework`, which depends on `trial-ds`: npm and Bun hoisted `trial-ds` and linked the `bin`; pnpm created no `node_modules/.bin`, and `pnpm exec trial-ds init` failed with "Command "trial-ds" not found".

Method: a throwaway package `trial-ds` (a dependency-free MCP server over stdio with one read-only tool, two skills, a `bin` with `init`) and a package `trial-framework` that depends on it were packed into local tarballs and installed into fresh consumer folders, each with its own `package.json` and `git init`. All commands ran with `HOME`, the XDG folders and the package-manager caches set inside the scratch folder (`env.sh`), so no host and no package manager wrote to the real home folder. Host approval and trust were simulated by writing each host's own state file inside that scratch `HOME`. No sign-in took place and no model ran.

Limits: one macOS arm64 machine, one run, the installed host versions. Approvals and trust were simulated, not given in the hosts' dialogs; Claude Code's `hasTrustDialogAccepted` is an internal state field. No host was seen to use a skill or call the tool in a model session. Cursor 3.29.9, VS Code 1.145.0 and Devin Desktop were not observed. The trial `init` adds and replaces but never removes. The first `--version` checks ran before `HOME` was redirected.

## Findings
- Claude Code project skills may be symlinks: "a `<skill-name>` entry in the enterprise, personal, or project location can be a symlink to a directory elsewhere on disk"; Claude Code prompts before it uses `.mcp.json` servers and lists an unapproved one as "Pending approval". Source: https://code.claude.com/docs/en/skills.md and https://code.claude.com/docs/en/mcp.md, checked 2026-11-13.
- "Codex supports symlinked skill folders and follows the symlink target when scanning these locations"; it scans `.agents/skills` from the working directory up to the repository root. Source: https://developers.openai.com/codex/skills (served at https://learn.chatgpt.com/docs/build-skills), checked 2026-11-13.
- Cursor loads project skills from `.agents/skills/` and `.cursor/skills/`, and "for compatibility" from `.claude/skills/`; the page says nothing on symlinks. Source: https://cursor.com/docs/skills, checked 2026-11-13.
- Gemini CLI 0.58.0 reads workspace skills from `.gemini/skills/` or the `.agents/skills/` alias, and the alias wins within a tier; its trusted-folders page says the feature "is **disabled by default**". Source: https://raw.githubusercontent.com/google-gemini/gemini-cli/v0.58.0/docs/cli/skills.md and https://raw.githubusercontent.com/google-gemini/gemini-cli/v0.58.0/docs/cli/trusted-folders.md, checked 2026-11-13.
- The MCP specification's latest revision, 2026-07-28, has no `initialize` handshake: "There is no negotiation handshake. Every request carries its protocol version"; versions up to 2025-11-25 are "Legacy". Source: https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning, checked 2026-11-13.
- Case 1: `init` ran from the `bin` after installs with npm 11.19.0, pnpm 12.3.4 and Bun 1.4.2 and wrote the same 14 entries for five hosts. Source: .artifacts/v1/trial/IDEA-005-03/logs/case1-npm-init.log, case1-pnpm-init.log, case1-bun-init.log and case1-files.log, checked 2026-11-13.
- Case 2: the server, started by the command in `.mcp.json`, answered legacy `initialize`, `tools/list`, `tools/call` and modern `server/discover` and `tools/call` from the project root in all three consumers, and failed from the subfolder `src/` with `Cannot find module '.../src/node_modules/trial-ds/mcp/server.mjs'`. Source: .artifacts/v1/trial/IDEA-005-03/logs/case2-stdio.log and case2-stdio-subdir.log, checked 2026-11-13.
- Case 3, Claude Code 2.1.323: "Pending approval" without approval; "Connected" with simulated approval, in the modern era (`negotiatedProtocolVersion` 2026-07-28), with a note that `tools/list` lacked `ttlMs` and `cacheScope`; 2 project skills loaded through the symlinks; "Failed to connect" when run from `src/`. Source: .artifacts/v1/trial/IDEA-005-03/logs/case3-claude-untrusted.log, case3-claude-approved.log, case3-claude-debug-session.log and case3-claude-subdir.log, checked 2026-11-13.
- Case 3, Codex 0.154.0: without trust, no MCP server and both skills from the `.agents/skills` symlinks; with simulated trust, `trial-ds` listed as enabled; a connection was not observed, because `codex mcp list` does not start the server. Source: .artifacts/v1/trial/IDEA-005-03/logs/case3-codex-untrusted.log, case3-codex-prompt-untrusted.json and case3-codex-trusted.log, checked 2026-11-13.
- Case 3, Gemini CLI 0.58.0: with an empty `HOME`, the consumer was untrusted, the server "Disabled" and "No skills discovered", which disagrees with the doc's "disabled by default"; with simulated trust, the server "Connected" and the `.agents/skills` symlinks overrode the `.gemini/skills` copies. Source: .artifacts/v1/trial/IDEA-005-03/logs/case3-gemini.log and case3-gemini-trusted.log, checked 2026-11-13.
- Case 3, Cursor 3.29.9, VS Code 1.145.0 and Devin Desktop: not performed; the two editor launchers have no read-only listing of MCP servers or skills, the Cursor Agent CLI is not installed, and `devin` is not installed. Source: `cursor --help`, `which cursor-agent agent devin` in this run, checked 2026-11-13.
- Case 4: after an update to 1.1.0 without a new `init`, the server answered as 1.1.0, pointers matched 1.1.0 for the changed skill, dangled for the removed skill and missed the added one, and copies stayed 1.0.0; after a new `init`, pointers and copies matched 1.1.0, and the removed skill's dangling links and 1.0.0 copies stayed. Source: .artifacts/v1/trial/IDEA-005-03/logs/case4-before-init.log and case4-after-init.log, checked 2026-11-13.
- Case 4, hosts without a new `init`: Claude Code loaded 1 skill and logged nothing for the dangling link; Gemini CLI served the removed `trial-ds-tokens` from the stale 1.0.0 copy in `.gemini/skills`. Source: .artifacts/v1/trial/IDEA-005-03/logs/case4-hosts-before-init.log, checked 2026-11-13.
- Case 5: two runs of `init` kept `other-server` (with an `env` entry), `remote-docs` (HTTP), the keys `theme` and `model`, and `other-skill` in five folders; the `trial-ds` entry and the Codex block appeared once. Source: .artifacts/v1/trial/IDEA-005-03/logs/case5.log and case5-before.sha, checked 2026-11-13.
- Case 6: with only `trial-framework` installed, npm and Bun hoisted `trial-ds` and linked its `bin`; pnpm created no `node_modules/.bin`, `pnpm exec trial-ds init` failed with "Command "trial-ds" not found", and a run by the hidden path wrote versioned `.pnpm/...trial-ds-1.0.0.tgz...` paths into every config and link. Source: .artifacts/v1/trial/IDEA-005-03/logs/case6.log, checked 2026-11-13.

## Follow-ups
None.

## Next action
None for this row. The result feeds IDEA-005#04 and IDEA-005#05. Open points that the result leaves to the owner are listed under its Limits: a real approval in each host's dialog, a model session that uses a skill and calls the tool, and the Cursor, VS Code and Devin hosts.
