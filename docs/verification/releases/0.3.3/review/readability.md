# Readability and simplicity review (axis 2)

Scope: diff-focused.patch, plus scripts/__tests__/workspace-install.test.ts in full. Verdict: no Required findings.

## scripts/__tests__/workspace-install.test.ts

**Optional / judgement** — the loop keeps a dead iteration.

```ts
for (const version of ["3.25.76", mcp.dependencies.zod]) {
  if (mcp.dependencies.zod === version) { continue; }
```

The array reads `mcp.dependencies.zod` once, before the loop. That value is the repo's current range, `^4.6.7`. The loop body skips any version equal to the current one. Only `3.25.76` runs, so the second entry never runs. On main the same dead entry existed in a quieter form: `"4.6.5"` matched the file, so it was skipped too. The edit keeps the dead entry and adds a reference that hides it. Fix: iterate over `["3.25.76"]` only. Better, drop the loop and the `continue` guard, and add one line saying the test moves zod to a different major to force a changed dependency. This also stops the test from needing an edit at each future zod bump. No hard rule breaks.

## docs/decisions/0116-mcp-dependency-ranges.md

**Nit / judgement** — the third paragraph is dense. "Two alternatives were presented..." packs two options into one sentence. A two-row table (option, what it delivers, what it leaves open) fits the "table for a choice" rule in the plain-talk block. The sentences are otherwise short and active. The file uses the glossary words "release" and "consumer" consistently.

## docs/STATUS.md

**Nit / judgement** — "Peter approves the plan on 2026-10-27" mixes present tense with a dated event. This follows the file's existing style, so drop it unless you also change the style elsewhere.

**FYI** — the rewritten "Current work" and "Next step" are short and give the next action, as AGENTS.md task-end step 3 requires. No finding.

## .scratch/maintenance/issues/006-bun-bundled-dependency-lock.md

**Nit / judgement** — the sentence "So bun.lock records a resolution of npm's declared ranges that Bun never installs, and `bun audit` reads that recorded resolution." joins two ideas. Split it. The table of two paths, lock version and installed version is clear and carries the point.

## Mechanical edits (no findings)

- README.md, packages/*/package.json, spec and skill link edits: pure version or path bumps. Nothing to simplify.
- packages/mcp/package.json: the caret ranges match core's existing style (see decision 0116).
- bun.lock is generated; skipped.
- docs/decisions/README.md row 0116: matches the neighbouring rows.

## Glossary gap

I did not read CONTEXT.md in full. The new records use "advisory", "audit disposition" and "bundled dependency". If CONTEXT.md lacks them, flag them for the domain-modeling skill. Do not coin synonyms. I cannot confirm this gap from the diff alone.
