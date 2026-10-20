# Release 0.3.1 recovery

Peter's release authorization and [execution delegation](../decisions/execution-delegation.md) remain active. The0.3.0 core publication fails because its archive contains185,977 files; the three companions are published. Preserve those immutable versions and tag. [Original failure and evidence](release-0.3.0.md#core-registry-rejection-too-many-files).

## Current state

- Branch: codex/release-finalization, based on mergedffe1a9824c1f2e2b7571ee52cee73dd1fc8b4541.
- [Selected packaging correction](../decisions/browser-distribution-package.md): separate browser delivery and share equivalent declaration interfaces. Independent review supports this direction.
- The archive-budget regression passes10 tests, including actual gzip/tar fixtures at the60,000-entry boundary and malformed archives. Native plain listing avoids costly verbose metadata formatting; no test timeout is raised.
- The budget is checked after packing and during release validation. Normal npm publication uses warning-level logs so file listings cannot bury registry failures.
- Package splitting, compact declarations, exact exports, native tag inference and coordinated 0.3.1 metadata are implemented. All seven consumer-skill version records and generated CDN examples use the new release.
- Direct Bun 1.4.2 generation succeeds for styles, runtime, documentation and tooling. The first local package-script invocation used global Bun 1.4.0 inside its shell command; all generation is rerun with direct pinned script invocations before packing.
- [Actual candidate archive counts](evidence/release-0.3.1/local-archive-counts.json): core 55,399; browser 54,950; React 8,644; Devtools 16; MCP 11. These are local dirty-tree candidates, not publication artifacts.
- Static checks and strict types pass. The full unrestricted unit suite passes 1,017 tests with 190,613 assertions. The earlier sandboxed run blocks eight server/install tests and exposes a declaration fixture timeout. The fixture now loads only its required browser type libraries; its existing timeout is unchanged.
- The native audit has no unresolved high/critical findings, two verified dispositions and no lower-severity findings. Existing review deadlines remain in force.
- Independent review catches and closes a substituted-parent path gap at the actual packing boundary and a masked definition-only type regression. Separate consumer programs now cover definitions, registrations and both all entries. The previously surviving mutation fails.
- Complete browser acceptance is running through the standard driver. It now includes the 36 shipped Flow distribution cases, with actual worker-close events and saved diagnostics.
- ACME_RELEASE_ENABLED is false; ACME_PAGES_ENABLED remains unset. Pages still serves main/docs.
- GitHub's0.3.0 release is marked prerelease and not latest, with a clear incomplete-publication notice. Core's npm latest remains0.2.0. React/MCP/Devtools latest are0.3.0.

## Work sequence

1. Implement the browser package from the existing generated graph and explicit source links. Include styles, bundles and required notices. Keep one build tree.
2. Generate precise exports and compact declarations. Prove valid imports, invalid names, native tag inference and explicit artwork imports in a fresh consumer.
3. Advance all five packages and generated consumer records to0.3.1. Update CDN references and release validation.
4. Pack and count every archive. Run static checks, types, unit tests, complete browser/consumer acceptance and independent review.
5. Push the reviewed recovery PR, pass Linux verification and merge with a merge commit.
6. Prepare immutable signed0.3.1 archives. Establish the new browser name through the verified first-publication route. Configure existing companions' trusted publishers immediately before their real publication; then publish and cryptographically verify all five packages.
7. Deploy the verified documentation, compare public assets with its artifact, and test navigation and the README's CDN example.
8. Retire the244-file docs snapshot only after public verification. Update AGENTS.md and current generated-file records. Commit and merge final evidence.

No authentication request is pending. Use the isolated existing npm configuration only through npm's CLI; never print credentials or reuse the previously exposed token.

## Upstream license records

The browser package preserves full notice text for 33 bundled packages. `@tanstack/markdown` 0.0.13 supplies an MIT SPDX declaration in its package metadata but no LICENSE, COPYING, NOTICE or README notice. [npm documents the SPDX metadata form](https://docs.npmjs.com/cli/v12/configuring-npm/package-json/#license).

For this exact package/version and installed manifest SHA-256, the notice collector copies the original package manifest as a JSON licensing record. Provenance explicitly says `package-license-metadata`, `noticeTextAvailable: false` and `sourceCommitBinding: unverified`. It does not invent copyright or license text. The source-history release commit is b54cce0943009ff76063b7656f99c2139823835f; the registry supplies no matching gitHead or attestation.

Unknown missing notices, changed version/manifest/license, ambiguous files and substituted paths still fail. The exact metadata fingerprint is 2885c8a041b10b4746cdc54d366937315311c0472ee8e3cd1c704fd9f2df500e. This preserves the information upstream supplies; it is not a claim of independent legal clearance.
