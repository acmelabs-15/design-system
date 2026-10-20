# Release 0.3.1 recovery

Peter's release authorization and [execution delegation](../decisions/execution-delegation.md) remain active. The0.3.0 core publication fails because its archive contains185,977 files; the three companions are published. Preserve those immutable versions and tag. [Original failure and evidence](release-0.3.0.md#core-registry-rejection-too-many-files).

## Current state

- Branch: `codex/release-publication-evidence`, based on the release merge `53427b5dffabd7e6fa32ab1c7afed125ec0f4e4f`. Publication records on this branch are separate from the tagged release source.
- The distribution correction is committed as 76ca79c04 and its archive-parser correction as 7db6b47be01bf96d6cda73b815b2d22fe6c580b4. [PR #3](https://github.com/acmelabs-15/design-system/pull/3) merges them with a merge commit after complete Linux acceptance.
- Peter reports a computer crash. The checkout remains clean at the pushed correction, and no pinned Bun release-check process remains. The additional local type-check run has no completion record and is not claimed as passed. Heavy local checks are not restarted.
- The restart removes the temporary Bun runtime and npm configuration. Bun 1.4.2 is restored under `.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun`; its official release ZIP SHA-256 is `90987a3a16d7db556d886ac3d551e7b6d3edf0a1cf43acaed622e8676be1d12f`, matching GitHub's asset digest and published checksum file. Global Bun is unchanged.
- [Fresh Linux run 39462005710](https://github.com/acmelabs-15/design-system/actions/runs/39462005710) passes every required stage: 1,018 unit tests, 190,614 assertions, all 24 browser invocations, 36 Flow distribution checks, 1,446 component checks, audit, archive validation and cryptographic verification. [Acceptance record](evidence/release-0.3.1/linux-acceptance.json); [browser results](evidence/release-0.3.1/linux-browser.json); [Flow results](evidence/release-0.3.1/linux-flow-distributions.json).
- Annotated tag `v0.3.1` points to `53427b5dffabd7e6fa32ab1c7afed125ec0f4e4f`; its tag object is `4a3d763396588e5e156880ac8f5dbb744f03adcb`. The merged source tree equals the verified PR head.
- [Exact-tag preparation run 39465791118](https://github.com/acmelabs-15/design-system/actions/runs/39465791118) passes full verification and signs all five archives. The original ZIP and all signatures are independently verified locally against the tag, commit, workflow and archive bytes. [Signed artifact evidence](evidence/release-0.3.1/signed-artifacts.json); [signed release record](evidence/release-0.3.1/signed-release.json). Automatic tag run 39465723748 is canceled in favor of this explicit preparation run; all gates still run.
- [Documentation run 39465604285](https://github.com/acmelabs-15/design-system/actions/runs/39465604285) passes at the same release merge. Its Pages artifact ZIP is downloaded and checksum-verified. The extracted site is `.artifacts/pages-release-0.3.1/site/`. Deploy job 118790542340 is skipped while deployment remains disabled.
- GitHub has a draft v0.3.1 release with the original signed ZIP and checksum file. Its asset digest matches the verified download. The body explicitly marks publication in progress.
- npm accepts the signed browser archive as stage `35864a21-e88a-4a66-8cc3-8713800ebcb9`, version 0.3.1, public access and latest tag. At the last check its status is `validating`. npm permits downloading it during validation; the downloaded SHA-512 matches the signed archive exactly. [Stage evidence](evidence/release-0.3.1/browser-stage.json). Wait for `staged`, then approve through npm's official security flow. No approval command is pending.
- Read-only status monitor `.artifacts/watch-browser-stage.ts` runs in exec session 38168. It checks once per minute, saves `.artifacts/browser-stage-current.json`, and exits when validation changes. It never approves or publishes.
- [Selected packaging correction](../decisions/browser-distribution-package.md): separate browser delivery and share equivalent declaration interfaces. Independent review supports this direction.
- The archive-budget regression now passes 11 tests, including actual gzip/tar fixtures at the 60,000-entry boundary and malformed archives. It uses the pinned npm tar parser in strict mode and requires gzip format. No test timeout is raised.
- The budget is checked after packing and during release validation. Normal npm publication uses warning-level logs so file listings cannot bury registry failures.
- Package splitting, compact declarations, exact exports, native tag inference and coordinated 0.3.1 metadata are implemented. All seven consumer-skill version records and generated CDN examples use the new release.
- Direct Bun 1.4.2 generation succeeds for styles, runtime, documentation and tooling. The first local package-script invocation used global Bun 1.4.0 inside its shell command; all generation is rerun with direct pinned script invocations before packing.
- [Actual candidate archive counts](evidence/release-0.3.1/local-archive-counts.json): core 55,399; browser 54,950; React 8,644; Devtools 16; MCP 11. These are local dirty-tree candidates, not publication artifacts.
- Static checks and strict types pass. The full unrestricted unit suite passes 1,017 tests with 190,613 assertions. The earlier sandboxed run blocks eight server/install tests and exposes a declaration fixture timeout. The fixture now loads only its required browser type libraries; its existing timeout is unchanged.
- The native audit has no unresolved high/critical findings, two verified dispositions and no lower-severity findings. Existing review deadlines remain in force.
- Independent review catches and closes a substituted-parent path gap at the actual packing boundary and a masked definition-only type regression. Separate consumer programs now cover definitions, registrations and both all entries. The previously surviving mutation fails.
- Complete local browser acceptance passes all 24 invocations through the standard driver. All 36 shipped Flow distribution cases pass, with actual worker-close events and saved diagnostics. [Browser results](evidence/release-0.3.1/local-browser.json); [Flow results](evidence/release-0.3.1/local-flow-distributions.json).
- The loopback signing probe and read-only public 0.2.0 provenance check pass. These do not establish new 0.3.1 publication permissions.
- [Linux run 39457416082](https://github.com/acmelabs-15/design-system/actions/runs/39457416082) passes install, static checks, generation without drift and strict types. Units report 1,016 passes and one failure: GNU tar accepts a short malformed gzip fixture that macOS tar rejects. The validator now uses npm's pinned tar parser in strict mode. All 19 focused tests pass, all five candidate archives revalidate, and independent review approves the correction. Disabling strict mode makes three malformed-archive tests fail. [Failure and correction evidence](evidence/release-0.3.1/linux-archive-finding.json). Fresh full Linux acceptance remains required.
- ACME_RELEASE_ENABLED is false; ACME_PAGES_ENABLED remains unset. Pages still serves main/docs.
- GitHub's0.3.0 release is marked prerelease and not latest, with a clear incomplete-publication notice. Core's npm latest remains0.2.0. React/MCP/Devtools latest are0.3.0.

## Work sequence

1. [x] Implement the browser package from the existing generated graph and explicit source links. Include styles, bundles and license records. Keep one build tree.
2. [x] Generate precise exports and compact declarations. Prove valid imports, invalid names and native tag inference. Full packed-consumer acceptance remains in step 4.
3. [x] Advance all five packages and generated consumer records to 0.3.1. Update CDN references and release validation.
4. [x] Pack and count every archive. Run static checks, types, unit tests, complete local browser/consumer acceptance and independent review. The Linux-only archive correction has focused verification; step 5 supplies its full fresh acceptance.
5. [x] Push the reviewed recovery PR, pass Linux verification and merge with a merge commit.
6. Prepare immutable signed0.3.1 archives. Establish the new browser name through the verified first-publication route. Configure existing companions' trusted publishers immediately before their real publication; then publish and cryptographically verify all five packages.
7. Deploy the verified documentation, compare public assets with its artifact, and test navigation and the README's CDN example.
8. Retire the244-file docs snapshot only after public verification. Update AGENTS.md and current generated-file records. Commit and merge final evidence.

The replacement isolated npm directory is `/private/tmp/acme-npm-login-6H5Kp2`, with private empty user/global configuration files created before npm login. Peter completes the official login and separate security authorization. All commands complete successfully; no authentication command is pending. Use these configurations only through npm's CLI; never print credentials or reuse the previously exposed token.

React, Devtools and MCP have no existing publisher configuration when inspected. Their new GitHub configurations all use repository `acmelabs-15/design-system`, workflow `publish-package.yml`, environment `publish-package`, and permissions `publish` plus `stage publish`. Their first successful workflow publication must validate them before npm's 48-hour expiry:

- React: `901ff37b-7f68-48e6-94c0-825a29e2c852`.
- Devtools: `ae915e25-1eec-4cbc-b28f-13c84289ee60`.
- MCP: `8412b52f-abdd-495e-b4ef-29c98892b246`.

Core's existing configuration is read back unchanged with the same workflow settings, ID `cc6c72cd-ee85-4c99-80df-d94a66731d87`. The browser package is now staged and requires its first publication. No browser publisher configuration is created at this checkpoint. [Publisher configuration evidence](evidence/release-0.3.1/trusted-publishers.json).

## Publication handoff

The preparation artifact is expected to be named `signed-release-53427b5dffabd7e6fa32ab1c7afed125ec0f4e4f`. Download it only after run 39465791118 succeeds. Save its original ZIP and checksum; extract to `.artifacts/signed-release-0.3.1/`. Verify all five archives with `scripts/release-attest.ts verify`, then compare the record's source commit with the tag target above. The earlier local dirty-tree archives are never publication inputs.

First-stage the verified browser archive with its matching provenance bundle through the isolated npm CLI configuration. Require the stage to finish validation; download the staged archive and compare its SHA-512 before owner approval. Require public metadata, actual tarball bytes and cryptographic provenance before counting it as published. The existing four packages then use the configured GitHub publishers through the normal release workflow.

Prepared local verification scripts:

- `.artifacts/verify-published-0.3.1.ts` requires `ACME_RELEASE_COMMIT`. It checks actual public tarballs, signed provenance and latest dist-tags. An optional package name limits the first browser check.
- `.artifacts/verify-release-cdn-0.3.1.ts` checks public CDN bytes against the signed browser archive, component imports and Flow worker layout/cleanup in three engines.
- `.artifacts/verify-pages-0.3.1.ts` requires `ACME_RELEASE_COMMIT`, `ACME_PAGES_RUN` and `ACME_PAGES_ARTIFACT`. Extract the exact reviewed Pages artifact to `.artifacts/pages-release-0.3.1/site/` first. It compares public file bytes and checks desktop/mobile navigation and deep links.

The new GitHub release stays clearly marked as publication in progress until public verification completes. Preserve the immutable 0.3.0 evidence. Enable Pages only after coordinated package publication; retain tracked `docs/` until the new deployment passes public checks.

## Upstream license records

The browser package preserves full notice text for 33 bundled packages. `@tanstack/markdown` 0.0.13 supplies an MIT SPDX declaration in its package metadata but no LICENSE, COPYING, NOTICE or README notice. [npm documents the SPDX metadata form](https://docs.npmjs.com/cli/v12/configuring-npm/package-json/#license).

For this exact package/version and installed manifest SHA-256, the notice collector copies the original package manifest as a JSON licensing record. Provenance explicitly says `package-license-metadata`, `noticeTextAvailable: false` and `sourceCommitBinding: unverified`. It does not invent copyright or license text. The source-history release commit is b54cce0943009ff76063b7656f99c2139823835f; the registry supplies no matching gitHead or attestation.

Unknown missing notices, changed version/manifest/license, ambiguous files and substituted paths still fail. The exact metadata fingerprint is 2885c8a041b10b4746cdc54d366937315311c0472ee8e3cd1c704fd9f2df500e. This preserves the information upstream supplies; it is not a claim of independent legal clearance.
