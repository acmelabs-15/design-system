# Project status

Updated 2026-11-12, on branch `v1`. This file is the sole current handoff for the 1.0 refactor. The status of `main` stays on `main`.

## Current work

The 1.0 refactor replaces the whole design system on the long-lived branch `v1`. Release 0.3.3 is the latest, so the next major version is 1.0.0. [Peter's kickoff prompt](design/v1-kickoff-prompt-original-2026-11-12.md) sets the scope, the phases and the interview rules.

The work is in the define phase. Six ideas hold it. Each idea file has its intent, its map of questions and its out-of-scope list.

| Idea | Subject | Rows ready now |
|---|---|---|
| [IDEA-001](ideas/IDEA-001-component-inventory.md) | Component inventory: list, names and part compositions | 01 and 02 (research), 03 (question) |
| [IDEA-002](ideas/IDEA-002-design-specs.md) | Design specs, designer route and token pipeline | 01 (research), 03 to 05 (questions) |
| [IDEA-003](ideas/IDEA-003-lit-core.md) | Lit core and its composition architecture | 01 to 03 (research), 04 (question) |
| [IDEA-004](ideas/IDEA-004-framework-packages.md) | Framework packages: React, Preact, Redact, Solid | 01 (research) |
| [IDEA-005](ideas/IDEA-005-mcp-and-skills.md) | MCP server and skills inside the package | 01 and 02 (research), 08 (question) |
| [IDEA-006](ideas/IDEA-006-devtools.md) | Devtools for all framework versions | 01 and 02 (research), 03 (question) |

The program rules for all six ideas are in the Notes of IDEA-001. A dependency between two ideas is a task row named "Import ..." in the later idea.

## Next step

Peter reviews the six scopes. No interview question and no research has started. The first interview question waits on the three items under **Pending for Peter**.

## Red checks

- Brain workspace: this repo is on brain's layout 1. `docs/agents/workspace.md` and `docs/agents/capabilities.md` do not exist. `brain status` reports only the layout, so it does not track the six ideas. `brain check` reports 140 findings, all for the names of the 0.3.3 decision and research records; the six idea files have none.
- Capability gaps: no skill named Anthropic's deep research skill is installed; no Figma MCP is connected; the folder `.agents/skills/` does not exist. The seven consumer skills are in `skills/`.

The design system MCP of release 0.3.3 answers real read-only calls over stdio (`resolve_version` and `search_docs`, 2026-11-12, Bun 1.4.2, from the built package in the `main` checkout).

## Pending for Peter

1. Run `/brain:setup-brain` for the `v1` worktree. It migrates the repo to layout 2 and needs Peter's approval of the concrete file moves. Until then, no DEC file is created: new DEC numbers collide with the legacy records 0001 to 0116.
2. Name the tool for the four landscape sweeps (IDEA-001#01, IDEA-004#01, IDEA-005#01, IDEA-006#01): install the deep research skill, or select an installed one (`firecrawl-deep-research` or `exa:search`).
3. Correct any idea boundary. One boundary is open in the files: no idea names the documentation website (IDEA-005#08).

## Working tree and branches

- `v1` starts at ee37be98e, the tip of `main` on 2026-11-12. Its worktree on Peter's machine is `/Users/peterkloss/Dev/ACMElabs/design-system-v1`. All 1.0 work happens there.
- `main` is unchanged. Its checkout holds uncommitted files of other sessions; they are not part of `v1`.
- The branches `claude/ci-speed` and `claude/issue-12-strict-style-policy` have their own worktrees and belong to other sessions. They change the system that 1.0 replaces.
- The open maintenance issues of 0.3.3 stay in the [local tracker](../.scratch/maintenance/issues/README.md).

## Runtime and authorization

Use Bun 1.4.2. The `v1` worktree has no local runtime yet; the verified executable is in the `main` checkout:

```text
/Users/peterkloss/Dev/ACMElabs/design-system/.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun
```

This path is machine-specific. Verify it before use. No product check has run on `v1`: the branch changes records only, and its code equals `main` at ee37be98e, where the quality run passes.

The kickoff prompt authorizes commits and pushes of this work on `v1`. It authorizes no merge, release or publication.
