# Release and CI verification — 2026-09-26

The prepared workflows run project code under Bun 1.4.2 with npm 12.0.2's JavaScript CLI. They retain npm OIDC and provenance. No Node command or setup-node step runs project code; standard GitHub-managed checkout/artifact/Pages actions retain their own platform runtimes.

## Verified locally

- 10 policy/archive/workflow tests pass with 70 assertions. The release scripts pass their strict TypeScript check.
- CLI version and packing work under pinned Bun. A fixture prepack script intentionally fails unless lifecycle execution is disabled.
- The loopback test exercises npm's unchanged OIDC exchange and provenance code. It checks public-provenance selection, proof of possession, a real local ECDSA signature, tamper rejection, archive SHA-512, workflow claims and exact archive/provenance attachments. Its issuer and witness are mocks, not trusted public services.
- Read-only verification of the existing public 0.2.0 archive matches registry integrity and provenance digest. Sigstore verifies the real certificate/trust/transparency material against the expected GitHub workflow identity and issuer. A tampered payload is rejected.

Bun 1.4.0 failed the actual TUF bootstrap with `root was signed by 0/3 keys`. The verified isolated 1.4.2 binary succeeds. Release commands now reject unsupported Bun versions. No trust check is bypassed. Runtime hashes and the original failure are retained in the dated evidence.

## Prepared workflow behavior

`quality.yml` runs lint/format, deterministic generation/build, types, unit/workspace tests, dependency audit, coordinated archive checks, pinned three-engine acceptance and release crypto/trust checks. It saves reviewed archives and `_site/` output. Browser gates reuse the portable React, documentation, recipe, icon, Tabs and installed-inspector acceptance runners.

`publish-package.yml` retains the trusted-publisher workflow/environment name and OIDC permission. Publication needs successful verification plus explicit `ACME_RELEASE_ENABLED=true`. It checks exact tag, commit, versions, peers, repository metadata, public package status and SHA-512 archive bytes. Registry errors and different existing bytes fail before writing. A retry skips only byte-identical previously published packages. npm receives only allowlisted CI identity context and empty temporary npm configuration files.

`pages.yml` deploys the reviewed site artifact only with explicit `ACME_PAGES_ENABLED=true` on main. The frozen `docs/` tree and live Pages configuration remain unchanged.

## Required external acceptance

The Linux workflow has not run. Future GitHub OIDC exchange, all package publisher configurations, new real Sigstore signing and actual publication have not been exercised. No workflow was dispatched, package published, Pages setting changed or deployment run. npm's official support statement still names Node; the Bun route is verified compatibility, not an official support claim.

Enabling either opt-in variable is an external setup action. Keep both disabled until the matching external checks and user authorization are complete. Initial publication policy for the new package names must be verified separately from the existing core package's historical provenance. Each trusted publisher must explicitly permit the retained npm publish command.

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

Release records now use schema 2 and require `sourceTree:"clean"` or `sourceTree:"dirty"`. A dirty local candidate is a working-tree build based on the recorded HEAD, not an exact committed-source artifact. Local preparation and validation remain available; publication rejects dirty records. A missing source-tree field is rejected without an old-schema fallback. The root must prepare final archives again after committing the completed source.

Focused orchestration/policy checks pass 12 tests with 124 assertions. The archive/source-record tests pass 2 tests with 5 assertions. This update verifies the orchestration and guards; it does not claim the newly assembled browser stage or Linux workflow has run successfully. No deployment or publication occurred.
