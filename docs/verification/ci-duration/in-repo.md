# CI time inside the repository: where it goes and what can move

Research for the CI speed record, 2026-10-27. Source: origin/main 998d72c8c in a scratch worktree, pinned Bun 1.4.2. No CI file was changed.

Labels: **[CI]** measured from the PR #10 job log (ubuntu-24.04, 4 vCPU; the repository is public, so standard runners cost nothing). **[local]** measured on macOS, Apple silicon, 10 cores. **[code]** read from code. **[inferred]** an estimate.

## 1. Build stage

| Sub-step | CI | Local |
|---|---|---|
| split | 1.5 s | 1.2 s |
| build.ts setup and transpile, to the `modules:` line | 61 s | 54 s |
| declarations and manifest | 88 s | 112 s (cold), 111 s (warm) |
| date runtime, CDN graph, bundles | 9 s | 18 s |
| React wrappers | 33 s | 28 s |
| docs | 13 s | 6 s |
| tooling and drift check | 4 s | 2 s |

- **Icons dominate.** 41,726 of the 42,235 source files are generated icon, define and register modules. Transpiling them takes 22.6 s; the other 509 files take 1.9 s. [local]
- **Four TypeScript programs cover the same source.** Declarations (`scripts/declarations.ts:25`), manifest (`scripts/manifest.ts:316`), React (`scripts/react.ts:79`) and the types stage (`scripts/check.ts:171`). [code]
- **The manifest runs 2.7 times slower when it shares a process with the declarations.** `scripts/build-modules.ts` runs transpile, declarations and manifest in one process (lines 30, 42, 55). Warm in-process timing: transpile 25.4 s, declarations about 32 s, manifest 79.2 s. In a fresh process the manifest takes 29.5 s. [local] Likely cause: the declarations program is still alive while the manifest runs, which adds GC pressure. [inferred]
- **The three phases are independent.** Transpile writes `dist/**/*.js`, declarations write `dist/**/*.d.ts`, and the manifest reads only `src/`. Timings: 136 s in one process, 79 s as three processes one after another, 72 s as three concurrent processes. [local] After them, three steps need different inputs and can run at the same time: React needs the CEM and the d.ts files; the CDN graph and bundles need the JS; docs needs the JS and the CEM. Tooling needs documentation.json, so it runs after docs. [code]
- **No build output is unused.** cdn-metafile and both extra bundles have readers (`scripts/browser-package.ts`, `flow/distributions.browser-check.ts`). PR-run Pages and archive uploads are unused but cost only 4 s and 3 s. [code] [CI]
- **Skipping and the drift check.** The drift check covers only committed generated source (`scripts/check.ts:121`), written by cheap producers that should always run. The expensive gitignored outputs (`dist/`, React, `_site`, archives) are proven by the package and browser checks. A cache for them needs a key over every input: `src scripts site examples assets skills styles packages/*/src`, `package.json`, `bun.lock`, `patches/`, Bun version. [inferred]

## 2. Unit tests

Serial run: 123.6 s, 1,127 pass [local]; CI takes 81–114 s.

| File | Seconds |
|---|---|
| scripts/__tests__/manifest.test.ts | 47.3 |
| scripts/__tests__/workflow-migration.test.ts | 17.3 |
| scripts/__tests__/entries.test.ts | 10.5 |
| site/__tests__/build.test.ts | 10.3 |
| scripts/__tests__/workspace-install.test.ts | 7.3 |
| scripts/__tests__/dev.test.ts | 7.0 |
| scripts/__tests__/dependency-audit.test.ts | 3.9 |
| src/shared/__tests__/inherited-appearance.test.ts | 3.3 |
| scripts/__tests__/package-contents.test.ts | 1.9 |
| examples/table/__tests__/review-feature.test.ts | 1.9 |

The top ten take 90% of the time. [local, `bun test --timings --update-timings`]

- **Bun 1.4.2 supports parallel and sharded runs.** `bun test --help` lists `--parallel=N` (implies `--isolate`), `--shard=K/N`, `--timings`/`--update-timings` for balancing, and `--changed`. [local]
- **`--parallel=4` takes 60.5 s**, compared with 123.6 s serial. One test failed: the dev watcher test ("Expected watcher outcome was not observed"). It passes alone and also beside manifest.test.ts. Its 5 s deadline (`scripts/__tests__/dev.test.ts:17`) is sensitive to machine load. [local]
- **manifest.test.ts sets the lower bound.** It re-runs the whole-repository `analyzeManifest()` (`scripts/__tests__/manifest.test.ts:56`), the same work the build has already done. [code]
- **Blockers are small.** The preload registers Happy DOM globals once per process (`bunfig.toml` `preload`, `scripts/test-setup.ts:4`). One full run under `--isolate` passed, so no file depends on another file's registrations. The only fixed port is rewritten to 0 (`dev.test.ts:35`). Tests that write files use `mkdtemp`. [code] [local]

## 3. Types

- **Root program:** 48,190 files, 25.9 s, 4.4 GB. **Strict scripts program:** 9,811 files, 8.9 s, 1.8 GB. [local, `--extendedDiagnostics`] CI total: 37–54 s.
- **They can run in parallel.** Both programs are read-only and run one after the other (`scripts/check.ts:171–196`). Running them together saves only the shorter one, about 9 s locally and about 12 s on CI. [inferred]
- **Types must follow the build.** `site/app/docs-app.ts:7` imports `../../dist/index`. Types do not need to precede the packages or browser stages. [code]
- **No native compiler.** tsgo and `@typescript/native-preview` are not installed. Decision 0053 and `docs/research/08-developer-tooling.md:42,410` keep TypeScript 5.9 as the gate and record that TypeScript-Go equivalence is unproven. Adopting it is a decision for Peter. [code]

## 4. Browser stage

- **Everything runs one after another.** The 24 invocations (`scripts/check.ts:54–62`), page engines (`pages.browser-check.ts:13`), routes (`:32`), component engines (`component-browser-checks.ts:198`) and suites (`:203`). [code]
- **Why Firefox takes about 2.5 s per page.** `pages.browser-check.ts:15,34–38` launches a new Firefox process for every route. This works around an older crash in Playwright's patched Firefox 155 during sequential navigation, whose cause is still unverified (`docs/verification/workflow-migration/verification-summary-audit.json:2669`). CI still installs Firefox 155.0 (v1543). Official Firefox 156 separately covers sequential navigation. Local probe on 24 routes, all passing [local]:

| Mode | Seconds per page |
|---|---|
| New browser per route (current) | 1.94 |
| Same, four concurrent workers | 0.68 |
| New context per route, one browser | 0.59 |
| Sequential, one page | 0.40 |

- **flow-diagram relaunches the browser per case in all three engines** (`component-browser-checks.ts:246–257`), though the comment names only Firefox. In CI it is the slowest suite: Firefox 32 s, WebKit 18 s, Chromium 9 s. No other suite exceeds 15 s, so suites balance well across shards. [CI] [code]
- **Concurrency inside one job.** Concurrent contexts against the static stage server are safe for reads. These collide [code]:
  - Port 4180 (`check.ts:232`) serves only docs-pages, navigation, recipes and recipe-accessibility. All other checks bind port 0. One server can serve all four.
  - `package-check.ts:26,62,67` rewrites the shared consumer's `package.json`. `packed-browser-check.ts` writes files into the consumer.
  - The two scoped invocations share `ACME_SCOPED_WORK` (`check.ts:95`).
  - Component results go to one `results.json` (`component-browser-checks.ts:293`). Page results go to one `fullsite-results.json` (`pages.browser-check.ts:69`).
- **What sharding needs** [code] [inferred]:
  1. Split `browserCheckPlan` by engine. Components accept `ACME_COMPONENT_ENGINES`/`ACME_COMPONENT_SUITES`, but the plan clears them (`check.ts:89–90`); docs-pages has no engine filter.
  2. One record per shard (today one `browser.json`, `check.ts:254`) with the ordered invocation list, release version, commit and archive digests.
  3. A fan-in job that rejects missing, duplicate or failed invocations, an empty plan and mixed release records.
  4. Separate artifact paths and consumer installs (about 8 s) per shard.
- **Per-shard overhead** is about 70–90 s: checkout, setup, artifact download, browser install (apt 28 s plus 3–4 s per engine). [CI] [inferred]

## 5. Records-only changes

- **No build output reads docs/, tasks/ or .scratch/.** [code] Recipe `references` are copied as strings (`site/recipes.ts:142,173,309`; `site/release.ts:59`). The site build reads `site/`, `examples/`, `assets/` and `dist/` (`site/build.ts:28–34`; `site/example-files.ts:12`). Lint covers only `src scripts site examples packages styles tools/geist` (`scripts/lint-files.ts:5`); Oxfmt ignores `docs/**`. The scoped polyfill is a `scripts/` fixture (`scoped-registration/browser-check.ts:83`).
- **One check reads docs/.** `site/__tests__/recipes.test.ts:40–43` requires that each referenced `docs/` or `spec/` path exists. Line 95 parses `docs/verification/systematization/m23-docs/recipes-results-2026-09-26.json`. A records-only change can fail this unit test. [code]
- **spec/ and notes/ are not records-only.** `scripts/verification/removals/check.ts:5` reads `spec/component-coverage.md` during the browser stage. [code]
- **The release record changes with every commit.** It embeds `git rev-parse HEAD` (`scripts/release.ts:39`), but the archive contents stay the same. Reusing artifacts for a publish needs the same commit. [code]
- **How often this applies.** Since 2026-10-13, 69 of 115 non-merge commits touched only these three directories. 10 of the last 29 quality runs had the same non-records tree as the run before them. That is mostly main pushes after a PR run, plus docs-only pushes. [measured, git and gh]
- **A whole-PR path filter catches few of these.** Pull-request path filters judge the whole PR diff. A key-based skip catches more: hash the tree minus records paths, and skip when that key was already verified. [inferred]
- main has no branch protection or rulesets, so a skipped run leaves no required check pending. [measured, gh api]

## Ranked savings

| Rank | Change | Estimated saving | Main risk |
|---|---|---|---|
| 1 | Shard the browser stage into parallel jobs after one build job: engine shards for docs-pages and components, plus 2–3 groups for the other checks. | Browser stage goes from 870–1,212 s to about 400 s (Firefox docs shard plus overhead): **8–13 min per run** | The complete-plan proof moves to a fan-in job (section 4). More runners means more flake surface. |
| 2 | Skip build, types and browsers when the non-records tree key was already verified. Always run `site/__tests__/recipes.test.ts`. Reuse the pages artifact. | **The whole 20–28 min** on about one third of recent runs | A hidden reader of records. Only recipes.test.ts and the spec/ reader were found. Pages deploy and publish need artifacts from the same tree and commit. |
| 3 | Run Firefox isolated renders concurrently (4 workers), or use a new context per route. | 310 s down to about 100–110 s: **about 3.5 min**. With sharding, the longest shard shrinks to about 4–5 min. | Load timeouts on 4 vCPU. Context mode weakens the isolation behind the unverified Firefox 155 crash. Concurrent launches keep it. |
| 4 | Run types and unit in a job parallel to packages and browsers. Use `bun test --parallel`. Compare manifest.test.ts against the build's CEM. | **2–2.8 min** off the critical path (types 37–54 s plus unit 81–114 s). Unit alone drops to about half (60.5 s locally). | The dev watcher test failed under load (5 s deadline). Changing manifest.test.ts weakens its independence from the build. |
| 5 | Run build-modules phases in separate processes, concurrently. Run React, CDN/bundles and docs together. | **About 1–1.5 min** (local: 136 s down to 72 s for the three phases) | Memory: each program needs about 4 GB, and the runner has 16 GB. Ordering mistakes between producers. |

Not ranked: each main push runs quality twice (`quality.yml` push and `pages.yml` verify, separate concurrency groups, `quality.yml:13–15`), and the tag runs it again; reuse by commit saves runner minutes and about 20 min on the release path. Caching icon outputs by content hash would remove most of the 22.6 s icon transpile.

Probes and raw logs: `scratchpad/research/` (`build-local.log`, `unit-serial.log`, `unit-par4.log`, `timings-serial.json`, `tools/`). The scratch worktree is removed. Side effect: `git fetch origin` refreshed the shared repository's remote-tracking refs; no checkout file changed.
