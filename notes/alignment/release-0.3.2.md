# Release 0.3.2 production build correction

Peter's release authorization and [execution delegation](../decisions/execution-delegation.md) remain active. The five 0.3.1 versions are public and cryptographically verified. Their immutable tag, archives and provenance stay unchanged.

## Current state

- Branch: codex/release-delivery-closure, based on b052e5e913313209ffad12ec3a51c79480bf7050. [PR #5](https://github.com/acmelabs-15/design-system/pull/5) starts from reviewed commit 34af1027e6dbaaf2ebfd2c7483f8401fb4618191. Its first CI build succeeds but the generated-input gate detects the dashboard producer fingerprint changed with scripts/build.ts. The normal style writer refreshes only that fingerprint; all generated CSS bytes remain unchanged. Rerun full CI on the corrected head in the same PR. [Initial CI failure](evidence/release-0.3.2/ci-fingerprint-failure.txt).
- The public Pages file check matches all 25,120 files. Browser acceptance then finds Lit development-mode warnings. [Exact failure](evidence/release-0.3.2/pages-development-failure.txt).
- The deployed source map lists Lit development JavaScript. The actual published minified browser bundle also contains the development runtime.
- A reduced Bun 1.4.2 build of Lit and React confirms that minification alone selects development dependencies. Explicit production export conditions and a production NODE_ENV definition remove those inputs. The fixture changes from 415,153 to 197,201 bytes; this is a fixture measurement, not the complete library size.
- One shared browser build helper now supplies both settings to documentation, selective browser entries, complete bundles, standalone delivery and Devtools. The independently copied table build supplies the same settings without depending on repository scripts. Unminified delivery keeps readable output and CSS maps. Unbundled core modules keep consumer-controlled resolution.
- The new regression fails before the correction and passes afterward. Three focused tests pass with 19 assertions. The normal three-engine documentation navigation gate now rejects console warnings. [Failing regression](evidence/release-0.3.2/production-browser-red.txt); [passing tests](evidence/release-0.3.2/production-browser-green.txt).
- All five package versions and their coordinated peers, lockfile, README examples and seven consumer-skill records advance to 0.3.2. No dependency version changes.
- Independent review approves the correction. Scoped strict types and the complete static gate pass. Versioned inspector metadata is regenerated through its writer. The corrected documentation build and navigation pass in Chromium, Firefox and WebKit with zero warnings. [Local navigation](evidence/release-0.3.2/local-navigation.json); [build](evidence/release-0.3.2/local-docs-build.txt); [static checks](evidence/release-0.3.2/local-static.txt). Full clean Linux and public delivery acceptance remain required.
- The existing 36-case shipped Flow distribution gate also rejects warnings across all six entries and both origins. It still checks real layout and worker closure.
- Browser trusted-publisher creation waits for Peter on npm’s official authorization page. The current local command and approval URL are recorded in `.artifacts/release-session.json`. It creates exactly repository acmelabs-15/design-system, workflow publish-package.yml, environment publish-package, publish and stage-publish permissions. Do not start another auth command while this one is pending. Existing core, React, Devtools and MCP publishers already complete real publications. Use only the isolated configuration from the 0.3.1 handoff; never read its credentials.

## Remaining sequence

1. [x] Finish focused static/type checks, regenerate the versioned metadata and obtain independent review.
2. Pass full clean Linux acceptance for the exact correction head, then merge with a merge commit.
3. Tag 0.3.2, sign and verify its exact archives, and publish through the established workflows. Verify every public tarball, provenance statement and latest tag.
4. Deploy the corrected reviewed Pages artifact. Verify public content and three-engine navigation with unchanged strict assertions. Keep the original failure evidence.
5. Retire the 244-file tracked snapshot only after that public acceptance. Update generated-file records, review and merge the cleanup.
6. Close the GitHub release as stable/latest with exact published assets and evidence. Preserve 0.3.0 and 0.3.1 history.

## Evidence and limits

The first public file-check attempt encounters HTTP 503; that URL later returns 200. The complete recheck uses four concurrent requests and bounded retries for transient responses. Every file must match its expected SHA-256. [Initial response evidence](evidence/release-0.3.2/pages-initial-transient-failure.txt).

The production configuration corrects delivery of development dependency variants. It does not establish that every diagnostic emitted by development dependencies indicates incorrect component behavior, nor prove those lifecycle paths independently. Existing functional and lifecycle browser gates remain required.

Actual Safari, assistive technology, operating-system input/autofill and background-window checks remain unperformed. The [credential incident](../analysis/developer-tooling.md#credential-handling-incident) remains owner-controlled; do not read or reuse the exposed credential.

Sources: [Bun export conditions and definitions](https://bun.sh/docs/bundler), [Lit production builds](https://lit.dev/docs/tools/production/), installed Lit and React conditional exports, the verified public artifact and the reduced local build. [Previous release records](release-0.3.1.md).
