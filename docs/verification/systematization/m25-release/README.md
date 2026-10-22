# Release and CI verification — 2026-09-26

This record preserves the original checkpoint and its exact evidence. Current reproduction paths are maintained separately from saved results.

At the 2026-09-26 checkpoint, the prepared workflows ran project code under Bun 1.4.2 with npm 12.0.2's JavaScript CLI. They retain npm OIDC and provenance. No Node command or setup-node step runs project code; standard GitHub-managed checkout/artifact/Pages actions retain their own platform runtimes.

## Verified locally

- 10 policy/archive/workflow tests pass with 70 assertions. The release scripts pass their strict TypeScript check.
- CLI version and packing work under pinned Bun. A fixture prepack script intentionally fails unless lifecycle execution is disabled.
- The loopback test exercises npm's unchanged OIDC exchange and provenance code. It checks public-provenance selection, proof of possession, a real local ECDSA signature, tamper rejection, archive SHA-512, workflow claims and exact archive/provenance attachments. Its issuer and witness are mocks, not trusted public services.
- Read-only verification of the existing public 0.2.0 archive matches registry integrity and provenance digest. Sigstore verifies the real certificate/trust/transparency material against the expected GitHub workflow identity and issuer. A tampered payload is rejected.

Bun 1.4.0 failed the actual TUF bootstrap with `root was signed by 0/3 keys`. The verified isolated 1.4.2 binary succeeds. Release commands now reject unsupported Bun versions. No trust check is bypassed. Runtime hashes and the original failure are retained in the dated evidence.

## Prepared workflow behavior

`quality.yml` runs lint/format, deterministic generation/build, types, unit/workspace tests, dependency audit, coordinated archive checks, pinned three-engine acceptance and release crypto/trust checks. It saves reviewed archives and `_site/` output. Browser gates reuse the portable React, documentation, recipe, icon, Tabs and installed-inspector acceptance runners.

`publish-package.yml` retains the trusted-publisher workflow/environment name and OIDC permission. Publication needs successful verification plus explicit `ACME_RELEASE_ENABLED=true`. It checks exact tag, commit, versions, peers, repository metadata, public package status and SHA-512 archive bytes. Registry errors and different existing bytes fail before writing. A retry skips only byte-identical previously published packages. npm receives only allowlisted CI identity context and empty temporary npm configuration files.

`pages.yml` deploys the reviewed site artifact only with explicit `ACME_PAGES_ENABLED=true` on main. At that checkpoint, the frozen docs tree and live Pages configuration were unchanged. The later [0.3.2 closure](../../../releases/0.3.2.md) records publication, deployed-artifact verification and snapshot removal.

## Required external acceptance

At this checkpoint, Linux execution, GitHub OIDC exchange, publisher configurations, new signing and publication were untested. No workflow dispatch, publication, Pages setting change or deployment occurred in this local verification. Those release-infrastructure checks subsequently closed in the linked 0.3.2 release record. npm's official support statement still names Node; the Bun route is verified compatibility, not an official support claim.

The original preparation left both opt-in variables disabled pending external checks and authorization. New-package publication policy and each trusted publisher's permission for the retained npm command required their own verification; prior core provenance did not establish them. This dated setup instruction is not the current release state or a new authorization.

## Reproduce

Use the pinned Bun 1.4.2 executable:

```sh
bun test scripts/__tests__/release-policy.test.ts scripts/__tests__/release.test.ts scripts/__tests__/release-workflows.test.ts
bun scripts/check.ts release
```

`bun scripts/check.ts --list` lists the shared CI/local stages. `bun scripts/check.ts all` runs them in dependency order and preserves its own Bun executable for nested package scripts. The browser stage needs port 4180 available; browser installation on Linux requests the required system libraries.

[Summary](2026-09-26.json), [local crypto](loopback-crypto.json), [public trust result](published-0.2.0-trust.json), [public provenance bundle](published-0.2.0-provenance.json), [prior runtime failure](bun-1.4.0-trust-failure.txt), [tests](unit-tests.txt).

Sources: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm provenance](https://docs.npmjs.com/generating-provenance-statements/), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and the pinned npm package's actual CLI, OIDC, publication and Sigstore implementations.

## Final orchestration review

The shared browser stage now includes the M26 default/ARIA audit, removal scan, table declaration regression, both scoped delivery paths, both bundle modes, worker consumers and the complete component-family runner. It also requires the official Firefox gate. Results go to `.artifacts/checks/`; historical reports stay unchanged.

Every runner executes even if an earlier runner fails. The driver writes each result with its exit code and error, then returns an aggregate failure after the last runner. Partial reports have `complete:false`; the final report has `complete:true`. An empty plan is rejected. This preserves failure while still collecting the remaining evidence.

The deterministic generation gate uses scoped Git status with all untracked files. It rejects tracked changes, staged changes and new generated registration files. A temporary-repository test verifies all three cases.

Playwright's patched Firefox 155 keeps all page-render assertions in a fresh browser per route, explicitly labelled `isolated-render`. Chromium and WebKit retain sequential navigation. Official Firefox 156.0.1 separately provides the mandatory sequential documentation and 20-cycle Flow regression. The [original Firefox 155 failure](firefox-155-sequential-failure.json) and [original sequential runner](firefox-155-sequential-run.ts) are preserved. No Flow page or assertion was removed, and no delay was added to conceal the crash.

Release records now use schema 2 and require `sourceTree:"clean"` or `sourceTree:"dirty"`. A dirty local candidate is a working-tree build based on the recorded HEAD, not an exact committed-source artifact. Local preparation and validation remain available; publication rejects dirty records. A missing source-tree field is rejected without an old-schema fallback. At that checkpoint, final archives still had to be prepared again from committed source. Current publication continues to reject dirty source records.

Focused orchestration/policy checks pass 12 tests with 124 assertions. The archive/source-record tests pass 2 tests with 5 assertions. That update verified orchestration and guards; it did not itself establish successful browser/Linux execution or perform publication. Later release evidence remains separate from those local checks.

## Workflow migration verification

The relocated checks are covered by [task 8 acceptance](../../workflow-migration/task-08.json) in local dirty-preparation scope. Final clean-candidate, live-caller and host-session acceptance remain tasks 10–12; no publication or actual-platform certification follows from this local run.
