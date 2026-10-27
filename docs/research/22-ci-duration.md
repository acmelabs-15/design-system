# Research 22: CI duration and how to shorten it

Status: research for the next CI plan. It records measurements, sources and estimates; it selects nothing. Recorded 2026-10-27.

## Scope

During the 0.3.3 release, Peter asks why CI is so slow. He selects reuse first (verify a commit once), then parallel jobs. He rejects 10–12 minutes per run as still too slow and asks for research.

Sources: [measurements](../verification/ci-duration/measurements.md) from GitHub run data, an [in-repository profile](../verification/ci-duration/in-repo.md) with local probes and code reading, an [external survey](../verification/ci-duration/external.md) of official documentation, and [unit timings](../verification/ci-duration/unit-timings-serial-local.json). Numbers marked CI come from ubuntu-24.04 standard runners (4 vCPU, free for this public repository); local numbers come from macOS on Apple silicon.

## Findings

### Runs per release

One release verifies the same source tree four times, each a full 20–28 minute run: the PR run, two runs on the push to main (quality, and documentation-pages, which calls quality again), and the publish run on the tag. The 0.3.3 merge tree equals the PR head tree.

### Where one run spends time (CI, run 40589927785)

| Step | Seconds |
| --- | --- |
| Checkout, setup, install, static | 17 |
| Build stage | 211 |
| Strict types | 54 |
| Unit tests | 114 |
| Packages | 20 |
| Browser installation | 50 |
| Browser stage | 1,212 |

Caching saves under one minute: install takes 1–2 s, and Playwright advises against caching browser binaries.

### Browser stage

All 24 invocations, engines, routes and component suites run one after another. Two checks take about 7 minutes each:

- Documentation pages: Firefox renders 125 pages in about 310 s. The check launches a new Firefox process for every route, as a workaround for an earlier Firefox 155 crash during sequential navigation whose cause is unverified. A local probe: 1.94 s per page today, 0.68 s with four concurrent launches, 0.59 s with a new context per route.
- Component checks: Chromium 93 s, Firefox 208 s, WebKit 132 s. The Flow Diagram suite relaunches the browser for every case in all three engines.

Concurrent checks collide on a few shared resources: port 4180 for four documentation checks, the shared consumer's `package.json`, the scoped-registration work directory, and single results files. Sharding needs one record per shard and a fan-in job that rejects missing, duplicate or failed invocations.

### Build stage

41,726 of the 42,235 compiled files are generated icon, define and register modules. Four TypeScript programs read the same source: declarations, manifest, React and the types stage. Transpile, declarations and manifest are independent: 136 s in one process, 72 s as three concurrent processes locally. Each program needs about 4 GB of the runner's 16 GB.

### Unit tests and types

`bun test --parallel=4` takes 60.5 s locally against 123.6 s serial. One timing-sensitive test failed once under load: the dev watcher test with a 5 s deadline. `scripts/__tests__/manifest.test.ts` alone takes 47 s, because it repeats the whole-repository manifest analysis. An open Bun report describes a `--parallel` deadlock on 1.4.0 ([oven-sh/bun#39987](https://github.com/oven-sh/bun/issues/39987)).

Types take 37–54 s with TypeScript 5.9. The two programs can run in parallel and must follow the build. TypeScript 7, the official Go compiler, has been stable since 2026-07-08 and reports 8–12x faster checks; it has no programmatic API until 7.1. Rust ports exist: `tsrs` from Cloudflare with VoidZero (experimental, announced 2026-10-20, up to 8x TypeScript 7.0) and `tsc-rs`, `tsz` and `ts-r`. For this pipeline they would save a few seconds beyond TypeScript 7. [Decision 0053](../decisions/0053-lint-toolchain.md) keeps TypeScript 5.9 as the gate until a native compiler's equivalence is proven.

### Records-only changes

No build output reads `docs/`, `tasks/` or `.scratch/`. One unit test does: `site/__tests__/recipes.test.ts` checks that referenced `docs/` and `spec/` paths exist. The removals check reads `spec/component-coverage.md`, so `spec/` is not records-only. Since 2026-10-13, 69 of 115 non-merge commits touched only the three records folders. A whole-PR path filter catches few of them; a key over the tree without the records folders catches more. main has no branch protection, so a skipped check leaves nothing pending.

### Reuse and trust

- A GitHub Pages deploy can use only an artifact from its own workflow run.
- npm provenance records the run that publishes. A tarball built in another run would be attested as if the publishing run built it. A tag run can instead find a passed run for the same commit through the REST API, rebuild the archives, compare their bytes with the verified record, and publish its own build. The 0.3.2 release proved byte-identical rebuilds.
- A merge queue tests the exact merge commit, but GitHub offers it only for organization-owned repositories.

### Publication wait

The publish script confirms each package within about one minute, but npm's review takes about 20 minutes. Each release therefore needs reruns of the publish job. [Issue 007](../../.scratch/maintenance/issues/007-publication-confirmation-wait.md) records this.

## Estimated effect

| Measure | Estimated saving | Main risk |
| --- | --- | --- |
| Verify a commit once: one main workflow verifies and deploys Pages; the tag run reuses the passed run and only rebuilds, compares and publishes | Two of four runs per release; tag to upload about 5 min instead of 30 | Custom lookup and byte comparison in the publish path |
| Skip build, types and browsers when the code tree key already passed; always run static checks and the recipes test | The whole run for about a third of runs | A hidden reader of the records folders |
| Browser stage in parallel jobs, split by engine and by suite group | 8–13 min per run | Fan-in proof of the complete plan; more flake surface; about 70–90 s setup per job |
| Four concurrent Firefox launches in the documentation check | About 3.5 min on that check | Load timeouts on 4 vCPU |
| Types and unit tests in a job beside the build-to-browser path; `bun test --parallel` | 2–3 min off the critical path | The dev watcher test; the Bun deadlock report |
| Build phases as concurrent processes | 1–1.5 min | Memory; producer order |
| TypeScript 7 | About 40 s of CPU; off the critical path once types run in parallel | Decision 0053; tools that import the TypeScript API |

## Achievable targets (inferred)

- A change that touches only records, on a code tree that already passed: about 1–2 minutes.
- A code change on standard runners: about 6–7 minutes on the critical path (setup, build of about 2.5–3.5 min, artifact transfer, the longest browser shard of about 2 min).
- A release from tag to npm upload: about 5 minutes, plus npm's own review.
- A code change under about 6 minutes needs a build cache keyed on every build input, or larger runners. Larger GitHub runners need a Team or Enterprise plan and are billed even for public repositories.

## Peter's selections

Recorded 2026-10-27 through the question tool. They scope the next CI plan; that plan and its approval are still to come.

- Reuse first, then parallel jobs: verify each commit once, then split the browser stage.
- A target below the 6–7 minute free-runner estimate for a code change, with a task-level build cache as well, aiming at about 5–5.5 minutes.
- The cache uses GitHub's `actions/cache`, with one key per build step. Turborepo is not used.

Still open for the plan: TypeScript 7 against [decision 0053](../decisions/0053-lint-toolchain.md), the Firefox per-route isolation in the documentation check, and the trust check in the publish path.

## Limits

These are estimates from one CI run, one main run and local probes; no changed pipeline has run. Local macOS timings differ from Linux CI. The cause of the earlier Firefox 155 crash is unverified, so a change to the per-route isolation needs its own evidence. Third-party compiler benchmarks come from their authors.
