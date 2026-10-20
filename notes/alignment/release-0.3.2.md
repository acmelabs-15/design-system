# Release 0.3.2 production build correction

Peter's release authorization and [execution delegation](../decisions/execution-delegation.md) remain active. The five 0.3.1 versions are public and cryptographically verified. Their immutable tag, archives and provenance stay unchanged.

## Current state

- Tag v0.3.2 points to reviewed merge 6ec538e70f3874d7543ce81816abc290dca60e6b. PR, tag and documentation verification all pass. The five archives reproduce across independent clean Linux builds.
- Core, React, Devtools and MCP 0.3.2 are public. Their actual tarballs, signed provenance and latest tags verify. [Core](evidence/release-0.3.2/core-publication.json); [React](evidence/release-0.3.2/react-publication.json); [Devtools](evidence/release-0.3.2/devtools-publication.json); [MCP](evidence/release-0.3.2/mcp-publication.json).
- Publish-only attempt 3 publishes Devtools and MCP, then accepts Browser and stops at public confirmation. npm reports Browser 0.3.2 as Validating. Read-only Browser monitor session 77276 verifies its public upload. After success, rerun only publish job 118915569199 to confirm the complete set. The original verification artifact remains unchanged. Details are in `.artifacts/release-session.json`. No authentication is pending.
- All five trusted publishers are configured. The browser configuration’s first actual trusted publication remains to verify.
- Pages deployment is held. Its reviewed 25,120-file artifact is downloaded and checksum-verified. After all packages verify, enable Pages and rerun deploy job 118905674804.
- The GitHub release remains a draft. The cleanup branch is codex/release-032-closure; release records are backed up on that branch. Keep the tracked snapshot until corrected public Pages acceptance passes.

## Release record

The checkpoints below preserve the sequence and the evidence available at each point. The current state above owns the resumption point.

- Current records/cleanup branch: codex/release-032-closure, based on release merge 6ec538e70f3874d7543ce81816abc290dca60e6b. [PR #5](https://github.com/acmelabs-15/design-system/pull/5) starts from reviewed commit 34af1027e6dbaaf2ebfd2c7483f8401fb4618191. Its first CI build succeeds but the generated-input gate detects the dashboard producer fingerprint changed with scripts/build.ts. The normal style writer refreshes only that fingerprint; all generated CSS bytes remain unchanged. Rerun full CI on the corrected head in the same PR. [Initial CI failure](evidence/release-0.3.2/ci-fingerprint-failure.txt).
- The public Pages file check matches all 25,120 files. Browser acceptance then finds Lit development-mode warnings. [Exact failure](evidence/release-0.3.2/pages-development-failure.txt).
- The deployed source map lists Lit development JavaScript. The actual published minified browser bundle also contains the development runtime.
- A reduced Bun 1.4.2 build of Lit and React confirms that minification alone selects development dependencies. Explicit production export conditions and a production NODE_ENV definition remove those inputs. The fixture changes from 415,153 to 197,201 bytes; this is a fixture measurement, not the complete library size.
- One shared browser build helper now supplies both settings to documentation, selective browser entries, complete bundles, standalone delivery and Devtools. The independently copied table build supplies the same settings without depending on repository scripts. Unminified delivery keeps readable output and CSS maps. Unbundled core modules keep consumer-controlled resolution.
- The new regression fails before the correction and passes afterward. Three focused tests pass with 19 assertions. The normal three-engine documentation navigation gate now rejects console warnings. [Failing regression](evidence/release-0.3.2/production-browser-red.txt); [passing tests](evidence/release-0.3.2/production-browser-green.txt).
- All five package versions and their coordinated peers, lockfile, README examples and seven consumer-skill records advance to 0.3.2. The later audit-driven SDK and HTTP dependency corrections are recorded below.
- Independent review approves the correction. Scoped strict types and the complete static gate pass. Versioned inspector metadata is regenerated through its writer. The corrected documentation build and navigation pass in Chromium, Firefox and WebKit with zero warnings. [Local navigation](evidence/release-0.3.2/local-navigation.json); [build](evidence/release-0.3.2/local-docs-build.txt); [static checks](evidence/release-0.3.2/local-static.txt). Full clean Linux and public delivery acceptance remain required.
- The existing 36-case shipped Flow distribution gate also rejects warnings across all six entries and both origins. It still checks real layout and worker closure.
- Peter completes the browser publisher authorization. npm creates configuration 161d04c9-aece-4a16-a6ea-9ea413dd8715 for the exact repository, workflow, environment and permissions. Its first real trusted publication still must validate it. [Configuration evidence](evidence/release-0.3.2/browser-trusted-publisher.json). No authentication is pending; all five packages now have configured publishers.

- ACME_RELEASE_ENABLED remains true. ACME_PAGES_ENABLED is temporarily false so the next main build cannot deploy documentation before all five patch packages are public. The existing site remains available. After package verification, enable Pages and rerun only the reviewed artifact’s deploy job.
- The preceding declaration-order correction now passes full-build reproducibility: two independent clean builds of the exact same source tree produce byte-identical archives for all five packages. [Comparison evidence](evidence/release-0.3.1/clean-build-reproducibility.json).

- Fresh run 39493302649 passes build, strict types and unit tests, then fails on a newly reported high-severity MCP SDK advisory. The supported 1.32.0 fix replaces 1.31.0. The refreshed audit also identifies a moderate Hono static-serving issue; the reviewed compatible Hono 4.13.13 and adapter 2.1.5 updates replace 4.13.9 and 2.1.1. No new dependency or override is added. Our server uses stdio and no task store or HTTP static server.
- Independent source review approves these exact upgrades. Eight MCP protocol/stdio/catalog tests pass with 65 assertions. The unchanged audit reports no unresolved high/critical findings, two existing verified dispositions and zero lower-severity findings. Fresh full CI remains required. [Upgrade evidence](evidence/release-0.3.2/mcp-security-upgrade.json); [tests](evidence/release-0.3.2/mcp-security-tests.txt); [audit](evidence/release-0.3.2/dependency-audit.json); [CI finding](evidence/release-0.3.2/ci-advisory-failure.txt).

- Current reviewed head: 1de2f23bd39fcda8eb6e679f37a63e9cc76c2414. Full CI run [39495252945](https://github.com/acmelabs-15/design-system/actions/runs/39495252945) passes every gate on PR #5. The earlier fingerprint and advisory failures are preserved and corrected. No local browser/server or npm authorization remains running.

- PR #5 merges exact reviewed head 1de2f23bd39fcda8eb6e679f37a63e9cc76c2414 as 6ec538e70f3874d7543ce81816abc290dca60e6b. Their Git tree is identical: 091eca0366d04993f78c731518a4ecd29c78cf4d. Annotated tag v0.3.2 points to the merge and is pushed.
- Tag publication run [39499520613](https://github.com/acmelabs-15/design-system/actions/runs/39499520613) passes every verification gate. Publish job 118902454892 accepts the core upload, then stops at its bounded public-confirmation wait. npm’s authenticated Versions page confirms 0.3.2 is Validating. No authentication is pending. Main quality run 39499435908 and documentation run 39499435937 verify the same commit. Pages deployment remains disabled until package verification. The GitHub 0.3.2 release is a draft.

- Complete Linux acceptance is preserved: 1,020 tests, 190,633 assertions, all 24 browser invocations, 36 shipped Flow checks, 1446 component checks, and navigation with zero warnings in all three engines. Static checks, strict types, audit, archive and crypto gates pass. The diagnostic ZIP matches GitHub’s SHA-256. [Acceptance record](evidence/release-0.3.2/linux-acceptance.json); [browser plan](evidence/release-0.3.2/linux-browser.json); [Flow](evidence/release-0.3.2/linux-flow-distributions.json); [components](evidence/release-0.3.2/linux-components.json); [navigation](evidence/release-0.3.2/linux-navigation.json); [audit](evidence/release-0.3.2/linux-dependency-audit.json).

- The exact publication artifact 12301416721 is downloaded, its ZIP SHA-256 matches GitHub, and all five archives validate against the tag/commit. [Publication record](evidence/release-0.3.2/publication-release.json); [npm review observation](evidence/release-0.3.2/core-review.json); [initial publish log](evidence/release-0.3.2/first-publication-attempt.txt). The core monitor completes successfully: actual public bytes, signed provenance and latest tag match the reviewed archive. [Core public verification](evidence/release-0.3.2/core-publication.json). Publish-only attempt 2 runs job 118911897500; original verification timestamps remain unchanged. Read-only React monitor session 87454 now runs the same verifier when that version becomes public. No authentication is pending.

- All five 0.3.2 archives match byte for byte between the independent verified PR and exact-tag builds. Both artifact ZIP digests and every archive SHA-512 are checked. [Reproducibility evidence](evidence/release-0.3.2/reproducibility.json).
- Documentation run 39499435937 passes. Its exact 25,120-file artifact 12303041169 is downloaded and SHA-256 verified, then extracted to `.artifacts/pages-release-0.3.2/site/`. Deploy job 118905674804 is skipped under the publication hold. After all packages verify, enable Pages and rerun only that deploy job. [Artifact evidence](evidence/release-0.3.2/pages-artifact.json).

- Attempt 2 confirms the already-public core and accepts React. npm’s authenticated Versions page shows React 0.3.2 as Validating. The same public confirmation limit ends the job; no artifact or source changes. [React review](evidence/release-0.3.2/react-review.json); [publish log](evidence/release-0.3.2/second-publication-attempt.txt).

- Attempt 3 completes Devtools and MCP publication within the workflow. Browser’s first trusted upload succeeds, then waits for npm automated review. Public verification remains required before declaring its publisher fully exercised. [Browser review](evidence/release-0.3.2/browser-review.json); [publish log](evidence/release-0.3.2/third-publication-attempt.txt).

## Remaining sequence

1. [x] Finish focused static/type checks, regenerate the versioned metadata and obtain independent review.
2. [x] Pass full clean Linux acceptance for the exact correction head, then merge with a merge commit.
3. Tag 0.3.2, sign and verify its exact archives, and publish through the established workflows. Verify every public tarball, provenance statement and latest tag.
4. Deploy the corrected reviewed Pages artifact. Verify public content and three-engine navigation with unchanged strict assertions. Keep the original failure evidence.
5. Retire the 244-file tracked snapshot only after that public acceptance. Update generated-file records, review and merge the cleanup.
6. Close the GitHub release as stable/latest with exact published assets and evidence. Preserve 0.3.0 and 0.3.1 history.

## Evidence and limits

The first public file-check attempt encounters HTTP 503; that URL later returns 200. The complete recheck uses four concurrent requests and bounded retries for transient responses. Every file must match its expected SHA-256. [Initial response evidence](evidence/release-0.3.2/pages-initial-transient-failure.txt).

The production configuration corrects delivery of development dependency variants. It does not establish that every diagnostic emitted by development dependencies indicates incorrect component behavior, nor prove those lifecycle paths independently. Existing functional and lifecycle browser gates remain required.

Actual Safari, assistive technology, operating-system input/autofill and background-window checks remain unperformed. The [credential incident](../analysis/developer-tooling.md#credential-handling-incident) remains owner-controlled; do not read or reuse the exposed credential.

Sources: [Bun export conditions and definitions](https://bun.sh/docs/bundler), [Lit production builds](https://lit.dev/docs/tools/production/), installed Lit and React conditional exports, the verified public artifact and the reduced local build. [Previous release records](release-0.3.1.md).
