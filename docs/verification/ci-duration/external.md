# CI speed-up: external research

Scope: official ways to cut the wall-clock time of the 20–28 min verification pipeline. Sources accessed 2026-10-27. GitHub docs pages carry no version; the access date applies. "Unverified" marks a claim I could not confirm in a primary source.

## 1. Verify once, reuse the result

- **Cross-run artifacts.** `actions/download-artifact` takes `github-token`, `repository` and `run-id`. A token is "required when downloading artifacts from a different repository or from a different workflow run". The README asks for a token with `actions:read`. The action checks the artifact digest and fails on a mismatch by default (`digest-mismatch: error`). Source: https://github.com/actions/download-artifact (README, action.yml, v8).
- **`workflow_run`.** It runs only when the workflow file is on the default branch. It chains at most three levels. `GITHUB_SHA` is the last default-branch commit, so use `github.event.workflow_run.head_sha`. The triggered run "is able to access secrets and write tokens". GitHub warns to "treat artifacts uploaded from other workflows with caution". Sources: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows ; https://docs.github.com/en/actions/reference/security/secure-use
- **Find a passed run by commit.** `GET /repos/{owner}/{repo}/actions/runs` filters by `head_sha`, `event` and `status=success`. A tag run can use it to confirm that the same commit already passed. Source: https://docs.github.com/en/rest/actions/workflow-runs
- **Pages deploy is bound to its own run.** `actions/deploy-pages` looks up the artifact "in this workflow run". A cross-run attempt fails with "No artifacts named github-pages were found for this workflow run" (actions/deploy-pages#338, comment of 2025-10-27). So the Pages deploy job must sit in the same run as the build. Reusable-workflow jobs run inside the caller's run. That last point is common practice; I did not find it stated verbatim in the docs. Source: https://github.com/actions/deploy-pages
- **Merge queue.** A required check needs a `merge_group` trigger. Merge queues are available in "any public repository owned by an organization". Each merge group is "a speculative commit … the exact commit that will end up on the target branch", and GitHub fast-forwards the base branch to it. That wording comes from Buildkite's docs, not GitHub's. GitHub's own docs say only that GitHub "will merge all these changes". With a merge queue, the push run on `main` sees an already-tested SHA and can skip by looking up that SHA. Sources: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue ; https://buildkite.com/docs/pipelines/tutorials/github-merge-queue
- **Without a merge queue.** A merge commit gets a new SHA. Reuse by tree hash would be custom logic, not a GitHub feature.
- **`concurrency`.** `cancel-in-progress: true` cancels superseded runs. It saves runner time, not the wall-clock time of one run. Source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency

**npm provenance and trusted publishing.**
- npm accepts publishes "from the specific workflow you've authorized". It needs npm CLI ≥ 11.5.1, Node ≥ 22.14.0 and a GitHub-hosted runner. Provenance is automatic for a public repository and a public package. Source: https://docs.npmjs.com/trusted-publishers/ (page dated 2026-10-06)
- Under `workflow_call`, "validation checks the calling workflow's name instead of the workflow that actually contains the publish command". Both workflows need `id-token: write`. Source: same page.
- **The docs do not require the build to run in the publishing workflow.** But the provenance statement records the *publishing* run: the workflow path, the ref, the commit and the `invocationId` run URL. A tarball built in another run would be attested as if the publish run had built it. Sources: https://docs.npmjs.com/generating-provenance-statements/ ("you must build your package with a supported cloud CI/CD provider"); example statement in https://github.com/slsa-framework/slsa-verifier/blob/main/docs/npm.md
- An honest cross-run chain: attest the tarball in the build run with artifact attestations, then run `gh attestation verify --signer-workflow …` before `npm publish <tarball>`. A build in a reusable workflow reaches SLSA Build L3. Source: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/increase-security-rating
- npm's own release example sets `package-manager-cache: false # never use caching in release builds`.

## 2. Fan-out, overhead, required checks, runners

- A matrix can create at most 256 jobs. Concurrent jobs on standard runners, account-wide: Free 20, Pro 40, Team 60. Source: https://docs.github.com/en/actions/reference/limits
- **Per-job overhead: GitHub publishes no figure.** A vendor benchmark (Vitko, 2026-10-21; the vendor sells a competing product) measured GitHub-hosted queue times of 3 s median and 31–39 s at the 95th percentile. Each job then repeats checkout, `bun install` and the browser install. Source: https://runners.vitko.inc/guides/github-actions-burst-of-20-jobs-queue-time-and-cost/
- **Path filters.** A workflow skipped by a path filter leaves required checks "Pending" and blocks the merge. A job skipped by an `if:` reports "Success". Use one aggregator job with `needs:` plus `if: always()` as the single required check. Source: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks
- **Standard runner for public repositories:** `ubuntu-24.04` has 4 CPU, 16 GB RAM and 14 GB SSD, and is free without limit. Source: https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- **Larger runners:** only for GitHub Team or Enterprise Cloud organizations. They are "always billed … even when used by public repositories". Linux per-minute prices: 8-core $0.022, 16-core $0.042, 32-core $0.082. Sources: https://docs.github.com/en/billing/reference/actions-runner-pricing ; https://docs.github.com/en/actions/concepts/runners/larger-runners

## 3. Playwright 1.63 as a library

- Browser contexts "are fast and cheap to create and are completely isolated, even when running in a single browser". Source: https://playwright.dev/docs/browser-contexts
- Concurrent pages in one process work: "call `newPage()` multiple time without waiting… there will be parallelism on the browser end" (yury-s, microsoft/playwright#2940, 2020-07-14). A maintainer also suggested "4 browser contexts on one browser" (pavelfeldman, #19696, 2022-12-25).
- The limit is CPU: "If you don't have more CPU cycles, running concurrently in the same worker will not help" (pavelfeldman, #37062, 2025-08-16). On 4 vCPU, expect at most about 4 busy pages across all engines.
- The test runner gets parallelism from worker processes, and "each starts its own browser". The library has no sharding, so split the script list across matrix jobs yourself. Source: https://playwright.dev/docs/test-parallel
- `waitUntil` defaults to `load`. `networkidle` is "DISCOURAGED". `domcontentloaded` and `commit` return sooner but need an explicit readiness wait. Source: https://playwright.dev/docs/api/class-page#page-goto
- Install only what a job needs. `--only-shell` skips the full Chromium for headless runs. Source: https://playwright.dev/docs/browsers

## 4. Bun test runner (1.4.x)

Source: https://bun.com/docs/test/parallel ; Bun 1.4 blog, 2026-08-20, https://bun.com/blog/bun-v1.4

- `--parallel[=N]` runs files in N worker processes; the default is the CPU count, so 4 on a standard runner. It implies `--isolate`, which re-evaluates imports per file.
- `--parallel --no-isolate` keeps one global per worker. The docs call it "the fastest way to run a large suite of small files". It fits a suite that already passes under plain `bun test`.
- `--shard=i/n` splits files across machines. Add `--timings` to balance shards by duration.
- `--concurrent` and `--max-concurrency` (default 20) work inside one file. This is cooperative I/O concurrency, "not extra CPU cores".
- The coordinator merges JUnit output and coverage.
- **Risk:** oven-sh/bun#39987 reports a `--parallel` worker deadlock on 1.4.0, in about 7% of runs on an 1,100-file suite, including on GitHub `ubuntu-latest`. It was still open on 2026-10-27 (checked with `gh`). Whether 1.4.2 fixes it is unverified. Use a job timeout or a no-output watchdog.

## 5. TypeScript native compiler

- TypeScript 7.0 went stable on 2026-07-08 as the `typescript` package with a `tsc` binary. The `tsgo` name is gone. Typical speed-ups are "8x and 12x on full builds", for example playwright 12.8 s → 1.47 s. Slack's CI type-check went from 7.5 min to 1.25 min. Default `--checkers 4`. Source: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- **Compatibility:**
  - TS 6.0 deprecations become hard errors: `baseUrl`, `moduleResolution: node`, `target: es5` and others.
  - New defaults: `types: []` (list `bun` explicitly) and `rootDir: ./`.
  - 7.0 has no programmatic API. Tools that import `typescript` must stay on `@typescript/typescript6`, run side by side.
- 7.1 Beta (2026-10-20) adds the API. The RC is planned about a month later. Sources: https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/ ; https://github.com/microsoft/TypeScript/issues/64709
- `experimentalDecorators` and `emitDecoratorMetadata` emit were ported (microsoft/typescript-go#2343, merged 2025-12-12). JSX, declaration emit and type checking are "done". `--noEmit` checks are unaffected by emit gaps. Source: https://github.com/microsoft/typescript-go

## 6. Other evidence

- **Browser binaries:** do not cache them. "Caching browser binaries is not recommended… restore… comparable to… download". OS dependencies are not cacheable. Source: https://playwright.dev/docs/ci
- **Playwright image:** `mcr.microsoft.com/playwright:v1.63.0-noble` contains the browsers and OS dependencies. Its pull time is unverified. Source: https://playwright.dev/docs/docker
- **`actions/cache` keyed on input hashes** can skip an unchanged build. Limits:
  - A pull-request cache "can only be restored by re-runs of the pull request".
  - Default-branch caches reach pull requests and tags.
  - The cache holds 10 GB and evicts entries unused for 7 days.
  - Low-trust triggers get read-only access to default-branch caches.

  Source: https://docs.github.com/en/actions/reference/dependency-caching-reference

## Summary

| Technique | Expected effect here | Official source | Main risk or limit |
|---|---|---|---|
| One push-to-main workflow: verify job(s), then deploy-pages in the same run | Removes one of four full runs | deploy-pages README; reuse-workflows docs | Pages must deploy from its own run |
| Tag run: look up a passed run by `head_sha`, then build and publish without browser checks | Tag run drops from ~20 min to ~4–5 min (estimate) | REST workflow-runs | Custom gate logic; tag must point at a verified commit |
| Cross-run tarball plus artifact attestation | Tag run ~1–2 min (estimate) | download-artifact; artifact attestations | npm provenance names the publish run; needs `gh attestation verify` |
| Merge queue | Push to `main` reuses the tested SHA | merge-queue docs | Org-owned public repo only; adds a `merge_group` run |
| Matrix fan-out of browser checks (per script/engine) after one build artifact | Browser stage ~15–20 min → ~3–5 min (estimate) | limits; troubleshooting required checks | ~0.5–1.5 min setup per job; 20 concurrent jobs on Free |
| Concurrent contexts/pages per engine inside a job | Splits the 7-min scripts; bounded by 4 vCPU | browser-contexts; #2940, #37062 | CPU-bound; shared-state flakiness |
| `bun test --parallel --no-isolate` | 81–114 s → roughly 30–50 s (unverified) | bun.com/docs/test/parallel | Deadlock #39987 open |
| TypeScript 7 `tsc --noEmit` | 37–54 s → ~5 s (8–12× claim) | TS 7.0 announcement | No API until 7.1; TS 6 deprecations become errors |
| `actions/cache` for build output keyed on inputs | Skips 144–211 s build on unchanged inputs | dependency-caching reference | PR-scoped caches; avoid in release builds |
| Install only needed browsers, `--only-shell` | Cuts the 44–50 s install per job | playwright.dev/docs/browsers | Do not cache binaries |
| Larger runner (8/16-core) | More concurrency per job | runner pricing | Paid even for public repos; needs Team plan |
