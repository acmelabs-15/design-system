# Working in this repository

This is `@acmelabs/design-system`: Peter's house design system, Lit web components with the `acme-` prefix, built so AI-generated artifacts have a real design language to render. The Geist port is closed. The current work is the **systematization pass**: fewer elements, one name per concept, one shape per kind of interface, a small set of primitives the rest compose.

Your global `AGENTS.md` carries how Peter works everywhere. This file carries what is specific here.

## Start of every session

Read these in order, in full.

1. `notes/alignment/README.md` — the current pass. Its `## Where we are` block says what is decided, what is in progress, and the next step.
2. `PLAN.md` §1 — the standing build rules and the mandated package stack. The rest of `PLAN.md` is the parity port's record; read a section when the pass touches what it covers.
3. `notes/decisions/*.md` — every decision Peter has made, with its evidence. A decision is reopened only with new evidence.
4. `notes/analysis/*.md` — living analysis. Extend the file on a subject; a second file on the same subject is a mistake.
5. `README.md` — the consumer's view, and the list of generated files.

Then tell Peter where we are and what the next step is, in your own words, and wait.

## Rules this repo adds

- **Best, not fastest.** Every decision is the best decision for what we are building. Where the best path and the quick path differ, name both and take the best one.
- **Investigate first.** Every item Peter lists, and everything you find, gets analysis before a recommendation: what the code does (file and line), what the community does (a source you read), what a reference system does (its docs or rendered output). Unsure means ask.
- **Research keeps going.** A discovery in the code or in conversation that changes what we know sends you back to research, and the findings land in `notes/analysis/` in the same turn.
- **Peter's decisions go through `ask-user-question`**, one at a time, with the research and your recommendation inside the question text.
- **A change replaces the old thing outright.** Nobody consumes the package yet. The new name, shape or element is the only one in the code: no alias, no fallback, no comment about what was there before. What replaced what, and why, is written in a decision note, an analysis document, or the plan.
- **This is Peter's first Lit project.** Explain the platform's trade-offs when they matter; take nothing as known.

## Keeping the record

- Analysis documents, decision notes and plan sections are updated in the turn the information changes.
- Decision notes: `notes/decisions/<slug>.md`, opening with "Decided <date> by Peter". Nothing hand-written goes under `docs/`; it is build output.
- Pass documents: `notes/alignment/`.
- **The handoff test closes every turn:** a fresh agent reading this file and `notes/alignment/README.md` can resume with no other context. `## Where we are` is current, every new document is linked from the pass README, and every decision made this turn has its note.

## Skills

Repo skills live in `.agents/skills/`; Codex lists them in the skill selector, and any agent can read them as files. Paths inside them are already adapted to this repo.

| Skill | Use it |
|---|---|
| `domain-modeling` | Whenever a term is challenged, a glossary entry is written to `CONTEXT.md`, or a decision note is recorded (its `ADR-FORMAT.md` gives the bar and shape) |
| `codebase-design` | The architecture vocabulary (module, interface, depth, seam, adapter, leverage, locality). Read before any architecture discussion |
| `improve-codebase-architecture` | Phase 3 of the pass, when Peter says |
| `grill-me` | The one-question-at-a-time decision walk: inside Phase 3, and per inventory entry in Phase 4 |
| `wait-what` | Peter's signal that a message did not land; re-pitch it as the skill says |

`ask-user-question` is installed on Peter's machine, not in this repo.

## Standing build rules an agent trips on

The full set, with evidence, is `PLAN.md` §1.

- Every CSS declaration ships through the generator. A defect is fixed in `tools/geist/`; a `*.styles.ts` is never edited by hand.
- Nothing under `src/` names the reference (vercel.com/geist), in code, comments or JSDoc.
- The package stack in `PLAN.md` §1 is mandated. Where it lacks something and the work is complex, research and propose a package; Peter decides.
- Wrappers keep a real box; `display: contents` stays off wrappers.
- Pure Bun. Tests in `__tests__/` beside the file, `<file>.test.ts`, `bun:test`.

## Where things are, and what is generated

Several **generated files are committed**, in places that read as source. The scripts overwrite them.

| Path | Written by | Source of truth |
|---|---|---|
| `tokens.css` (repo root) | `bun run split` → `scripts/split-css.ts` | the audited house sheet in `tools/geist/` |
| `dashboard.css` (repo root) | `bun run build` → `scripts/build.ts` | `scripts/build.ts` |
| `src/components/<name>/<name>.styles.ts` | `bun run split` / `bun tools/geist/gen.ts <name>` | `tools/geist/maps/<name>.ts` and the spec |
| `docs/` (entire directory) | `bun run docs` → `docs-src/build.ts` | `docs-src/` |
| `dist/` (gitignored) | `bun run build` | `src/` |

Hand-written: `src/` except `*.styles.ts`, `docs-src/`, `scripts/`, `tools/geist/` except `corpus/`, `notes/`, `.agents/`, `README.md`, `PLAN.md`, this file.

Build order: `bun run split && bun run build && bun run docs && bun test`. `docs` needs `dist/` from `build`.

Phase 1.7 of the pass reviews this layout; until it lands, the table above is the map.
