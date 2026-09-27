# Developer tooling: Phase 1 extension

Checkpoint 2026-09-19. [Oxlint toolset adoption](../decisions/lint-toolchain.md) is selected for the later migration. [TanStack Devtools](../decisions/design-system-devtools.md) is also selected; the Config convention review is complete, with migration recommendations still unapproved.

## Oxlint, Oxfmt and Ultracite

Current project evidence: package.json uses Biome for lint/check/fix; installed Biome is 2.5.12. biome.json enables embedded snippets, uses 200-column formatting and all trailing commas, and disables selected any/non-null/banned-type rules. scripts/format-generated.ts invokes Biome after generation. The editor settings mention biomeInspector. None was modified.

Tested outside the repository in /tmp/acme-tooling-probe.fuNif5:
- Ultracite 7.12.0; Oxlint 1.83.0; Oxfmt 0.68.0.
- oxlint-tsgolint 7.0.2002; Stylelint 17.15.0; postcss-lit 1.4.1.
- Execution used Bun 1.4.0. Installed project dependencies were untouched.

[Ultracite's Oxlint provider](https://github.com/haydenbleasel/ultracite/blob/main/apps/docs/docs/provider/oxlint.mdx) uses Oxlint plus Oxfmt, with optional JS-plugin presets. The inspected core preset has 536 configured rules and excludes generated directories. Oxfmt's preset uses 80 columns, ES5 trailing commas and import/package/Tailwind sorting. These differ from the project and need explicit mapping.

[Oxfmt embedded formatting](https://oxc.rs/docs/guide/usage/formatter/embedded-formatting) supports css/html template literals. Six copied/probe files were formatted successfully, and a second check passed. This proves the sampled formatting path, not complete semantic or browser equivalence.

A fixture with duplicate colour declarations and an unknown CSS property produced both expected CSS errors in Biome. Oxlint reported JavaScript issues but neither CSS error. Stylelint with [postcss-lit](https://github.com/43081j/postcss-lit) recovered both checks. Oxfmt formatting alone did not reject the invalid CSS.

Read-only checks:
- Biome: 532 checked files, 15 errors and 693 warnings, with formatting and assists disabled.
- Oxlint native + unchanged Ultracite core: 528 files, 419 active rules, 4,331 diagnostics.
- Type-aware/type-check mode: 528 files, 474 active rules, 6,394 diagnostics, including eight TypeScript diagnostic instances.
- Stylelint probe over TS and raw CSS: 530 files, no reported parser errors; rule counts are in the evidence.

These runs have different languages, rules and exclusions. Counts and one-run timings are not a speed or correctness ranking. Thousands of preset findings concern conventions; they are not thousands of demonstrated bugs. Stylelint reports many repeated custom properties in the generated sheet: intentional fallback declarations must be distinguished from accidental duplicates.

### Limits to preserve

- An Oxlint JSON report captured through a Bun pipe ended prematurely. Capturing directly to a file returned complete parseable JSON. The cause was not established; complete reporting needs a regression check in the eventual runner/CI.
- Type-aware lint uses TypeScript-Go. Official [compatibility guidance](https://oxc.rs/docs/guide/usage/linter/type-aware) targets TypeScript 7+, while this project uses TypeScript 5.9. The probes ran; that does not prove compiler equivalence. Retain the current compiler check.
- postcss-lit documents limitations for partially interpolated CSS syntax and can skip unsupported templates. A zero parse-error field is not universal coverage proof.
- Ultracite's Stylelint preset imports Prettier-related machinery. It was inspected but not adopted wholesale; the CSS probe used an explicit small rule mapping.
- No initializer, project autofix, editor installation, CI migration or formatter change was performed.

[Durable probe evidence](../alignment/evidence/tooling-evaluation-2026-09-19.json) includes full rule counts and representative diagnostics. The migration must preserve the generator pipeline and protect registered controllers from unsafe “unused” fixes.

## TanStack Devtools

**Selected:** [one shared design-system inspector with Lit and React integrations](../decisions/design-system-devtools.md). Peter explicitly confirmed the additional Solid dependency after asking what it meant.

Read the [quick start](https://github.com/TanStack/devtools/blob/main/docs/quick-start.md), [custom-plugin guide](https://github.com/TanStack/devtools/blob/main/docs/building-custom-plugins.md), [lifecycle](https://github.com/TanStack/devtools/blob/main/docs/plugin-lifecycle.md), [production guidance](https://github.com/TanStack/devtools/blob/main/docs/production.md), core and React adapter source, and the published package metadata.

The core supplies a DOM container and plugin props; Lit can render into it. React uses portals into containers managed by the same core. The surrounding interface uses Solid. The generic integration API is not a dependency-free implementation. Optional Vite source/log integrations do not automatically work in our Bun pipeline.

### Bounded integration probe

Temporary directory /tmp/acme-devtools-probe.XOV6Nd; Bun 1.4.0; Chrome 153. Packages: core 0.14.2, React adapter 0.10.12, React/React DOM 19.3.0, Lit 3.3.3.

Both a synthetic Lit panel and React panel:
- Mounted in the Devtools interface.
- Updated their displayed counter from 0 to 1 after a real click.
- Ran cleanup on unmount and left zero child elements in the mount host.

The first Lit fixture used class fields that shadowed reactive accessors; it was corrected to constructor assignments before successful testing. This was a fixture issue, not evidence against the integration.

The initial bundle requested two missing fonts. Published font modules construct relative URLs from import.meta.url; bundling relocated those modules without emitting/rebasing their font assets. A scoped Bun onLoad probe converted the two modules into file imports with an explicit public path. Both fonts then returned HTTP 200. The corrected Lit reload had no error-level console messages; React also reloaded with no failed resources.

A conditional development entry compiled to a 59-byte production stub with no Devtools or font output. That proves this probe's exclusion path, not every future package export. Development output included both frameworks for comparison; its size is not an estimate for the final inspector.

[Durable probe record](../alignment/evidence/devtools-probe-2026-09-19.json) includes the fixture source and limits. The probe pages and server were closed. Unrelated browser pages were left alone.

### Remaining design and verification

- Define useful properties/events/theme/state views; read-only inspection versus temporary editing is not selected.
- If editing is selected, account for [helper-controlled styling inputs](../decisions/layout-spacing-properties.md#external-writes-to-helper-managed-settings): a direct property edit is effective immediately but can be overwritten by the next helper/template render. Distinguish that temporary edit from a persistent change to supplied input. No editing bridge or inspector mutation behavior is selected by this dependency.
- Verify the real inspector in Chromium, Firefox and WebKit, including repeated mount/unmount, hidden panels, subscriptions and controlled components.
- Keep all normal library/CDN/React production entries free of the inspector, Solid and developer assets.
- Design the Bun asset and optional source-location integration; no Vite migration is selected.
- Verify current event-client exports. Main-branch docs and released packages use evolving names.
- The published core package also declares a binary named intent. Avoid ambiguous bare executable resolution alongside @tanstack/intent; verify the final package scripts.
- Material Web's targeted tree search found no corresponding inspector implementation. Lit's own development builds/debug events are useful supporting diagnostics, with overhead when enabled.

No project package, inspector implementation, event network or editor bridge was installed.

## TanStack Config

**Review complete at the convention level; recommendations are not new package adoptions.** Read all seven convention/provider docs: [overview](https://github.com/TanStack/config/blob/main/docs/overview.md), [package structure](https://github.com/TanStack/config/blob/main/docs/package-structure.md), [dependencies](https://github.com/TanStack/config/blob/main/docs/dependencies.md), [CI/CD](https://github.com/TanStack/config/blob/main/docs/ci-cd.md), [publishing](https://github.com/TanStack/config/blob/main/docs/publish.md), [Vite](https://github.com/TanStack/config/blob/main/docs/vite.md), and [ESLint](https://github.com/TanStack/config/blob/main/docs/eslint.md). Also read the root manifest, PR workflow and publish-config implementation.

The docs require Node and pnpm; the current root pins pnpm 11.11.0. Its test placement, ESLint and build conventions differ from our chosen Bun/colocated-test/Oxlint setup. The Vite guide labels the custom setup legacy and recommends newer alternatives for future projects. The registry's older @tanstack/config 0.22.2 umbrella should not be mistaken for a current drop-in recommendation.

Recommended practices to bring into the later migration:
1. Validate the actual packaged artifact: exports, types, styles, skills and runnable consumer examples.
2. Expose separate lint, type, unit, browser, build and package checks with explicit input/output ownership.
3. Record package release intent before version changes; assess Changesets with the eventual package/version strategy.
4. Check workspace dependency alignment and unused-dependency reports against actual usage and mandated future packages.

These do not select publint, Changesets, Sherif, Knip, Renovate, Nx, tsdown, package previews or a new release automation individually. Tool choices and acceptance remain for the migration review. Tests can remain beside source while the build/package allowlist excludes them; our current builder already skips __tests__.

The inspected older publish-config helper changes package versions before its CI guard, then can commit, publish, push and tag in CI. Its “dry run” is not a read-only inspection path. It was read, not executed. The current Config repository uses Changesets in its root scripts, so the old helper and current workflow are distinct evidence.

### Existing publishing and the Bun gap

The full local .github/workflows/publish-package.yml is already configured for npm trusted publishing, id-token permission and provenance. This was a source inspection, not a fresh verification of npm account settings. The final publish and version reads use npm/Node.

Bun's publish documentation was read. Examined upstream proposals do not establish a released replacement: [provenance PR 30522](https://github.com/oven-sh/bun/pull/30522) was open/unmerged; [OIDC PR 29374](https://github.com/oven-sh/bun/pull/29374) was closed/unmerged at inspection. This is not an exhaustive proof that every Bun-based route is impossible.

Preserve the existing trusted-publishing/provenance guarantees while resolving a verified path consistent with the pure-Bun rule. Do not silently replace them with a permanent token or claim the runtime conflict is solved. No publication or credential/configuration action was performed.

## Complete inspector proposal

The [Phase 4 inspector contract](../alignment/inventory/documentation-tooling.md#inspector) specifies explicit mounting/disposal, scoped collection, bounded event retention, sensitive-value redaction, Lit/React use of one tool and production exclusion. Q08 asks only the actual remaining read-only-versus-temporary-editing scope. The selected Solid/TanStack Devtools delivery and helper-controlled-input boundary stand; no persistent editing bridge or source rewriting is silently added. Proposal assembly does not certify the real packaged inspector.

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/migration-approval.md) through “approved”. M00 technical prerequisites remain active before dependent implementation. Production implementation has not started; approval is not a runtime result.

## M00 Bun release probe, 2026-09-20

The [saved Bun-only probe](../alignment/evidence/m00-prerequisites-2026-09-20.json) runs npm CLI 12.0.2 under Bun 1.4.0 in an isolated scratch package. npm pack succeeds with an explicit file allowlist and lifecycle scripts disabled. Empty temporary npm configuration files and a loopback registry isolate the fixture; no account configuration or project files change.

A local mock exercises the unmodified npm OIDC helper: request an identity token with the registry audience, exchange it for a scoped registry token, query public package visibility and automatically enable provenance for a public repository/package. All assertions pass. Fake tokens stay local. An in-memory configuration recorder prevents disk writes.

This supports a possible Bun-hosted npm CLI route. It does not establish official Bun support or a finished publisher. [npm trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/) states Node/npm requirements. The installed provenance source invokes Sigstore; actual signing, transparency-log behavior and GitHub Actions integration remain unverified. No package publication or external signing request occurred. Preserve trusted publishing and provenance rather than replacing either with a permanent token.

## M00 release mechanism conclusion, 2026-09-20

The [completion probe](../alignment/evidence/m00-completion-2026-09-20.json) now runs the unmodified npm 12.0.2 publication library and Sigstore signing code under Bun 1.4.0. All endpoints are loopback test services. A local certificate issuer verifies proof of possession; Bun executes real ECDSA signing. Independent signature verification passes, tampering fails, the statement's SHA-512 matches the packed tarball, workflow claims match the fixture, and npm attaches both tarball and provenance to its outgoing local request. The mock witness is explicitly not a real trusted transparency-log proof.

Together with the earlier npm CLI pack and OIDC-exchange tests, this establishes a concrete Bun-hosted npm route without replacing trusted publishing or provenance. Candidate invocation: Bun runs the pinned npm CLI JavaScript entry with the prepacked tarball, public access, provenance and lifecycle scripts disabled. It requires no Node executable and no long-lived publication token. Workspace packing is covered by the package-delivery fixture.

This is bounded local runtime compatibility, not an assertion of official npm support for Bun. npm documentation still names Node. M25 must pin and run the same smoke checks on the Linux release runner, then verify actual GitHub/npm identity configuration and real Sigstore behavior before enabling publication. Those environment checks cannot be represented by fake local credentials. M00 performs no remote publication, signing-service write, account change or workflow dispatch. OpenSSL issues only the local test certificate; production signing remains npm/Sigstore running under Bun.

## Implemented style tooling checkpoint

Lightning CSS is now the build compiler. Its integration, corpus-free build, source-map delivery and before/after browser comparisons are recorded in [M02 evidence](../alignment/evidence/m02-css-pipeline-2026-09-20.json). Biome remains the current authored-code formatter until M25; generated files are excluded because compiler output and map offsets must stay aligned. The obsolete format-generated wrapper is removed. The wider strict TypeScript check retains nine pre-existing diagnostics; the touched generator's four errors are fixed. New script checks and all 624 unit tests pass.

## M24 inspector scope verification — 2026-09-26

The installed official `@tanstack/devtools` 0.14.2 source exposes a scope conflict
that the earlier synthetic panel probe did not test. `src/devtools.tsx` always
mounts `SourceInspector`, renders SEO and Marketplace destinations through
`components/workbench-header.tsx`, and portals its surface to `document.body`.
`src/core.ts` exposes configuration for source hotkeys/actions but no exclusion
switch for those capabilities. The shell's context also persists settings.
Embedding that complete shell would add whole-page inspection beyond the approved
root-scoped read-only component inspector.

The implementation therefore uses the official `@tanstack/devtools-ui` 0.7.1
public `MainPanel`, `Section`, `JsonTree` and `ThemeContextProvider` components with
Solid 1.9.15 in the optional package. This is the selected ecosystem's UI layer,
not a claim that the full shell's behavior is equivalent. Its source was inspected
at `dist/esm/components/{main-panel,section,tree,theme}.js` and
`dist/esm/styles/semantic-theme.js`. The UI layer installs its packaged font and
forced-colors styles; it has no source inspector, marketplace, event bus or settings
persistence. The inspector disables JsonTree copying and only displays already
redacted snapshots. The full shell is not a runtime dependency.

The current official [custom-plugin guide](https://tanstack.com/devtools/latest/docs/building-custom-plugins)
was also read. Its event client supports application-to-panel communication and
optional commands, but this inspector needs neither remote transport nor a global
event bus. It observes only explicitly selected component roots through Lit's
public controller interface and generated public metadata. `hostUpdated` supplies
property notifications; DOM observation discovers insertion/removal and public
attribute changes. No component prototype or private store is patched.

This paragraph records the source-backed implementation choice. Full-browser,
packaged-asset, redaction and production-exclusion results are recorded separately;
source inspection alone is not their acceptance result.

### Inspector runtime findings and bounded fixes

The real Input fixture exposed an observation loop absent from synthetic controls.
Reading the public `validity`, `validationMessage` and `willValidate` accessors
calls `NativeForm.sync()` (`src/shared/native-form.ts`). That synchronizes internal
native attributes. Observing every shadow attribute caused those reads to schedule
themselves again. The optional observer now reacts only to declared public-host
attributes, real value changes and theme/style dependencies; shadow roots supply
child discovery. A regression test verifies a public getter can synchronize native
attributes without an observation loop. Core component behavior stays unchanged.

Visual inspection found that Devtools UI 0.7.1's JsonTree omits keys for null-valued
fields. Its `dist/esm/components/tree.js` key condition tests only
`typeof value !== "object"`; JavaScript classifies null as object. The optional
runtime builder corrects that exact condition to include null. It verifies package
version and original SHA256 `a7a7a305ff7256bc71e423fc6cefdf14726bc1d57dc19e1ab0ea0a49beaa06a3`
before applying the one-expression change. Browser verification checks that
`"form": null` remains visible. The correction is bundled into the optional
package; consumers do not need to apply a package-manager patch.

The upstream font modules use relative URL expressions. A first bundler can emit
those assets correctly, but a downstream consumer can move the emitted URL strings
again. The optional runtime therefore embeds the two small fonts (82,204-byte
Bricolage Grotesque and 72,920-byte Inter) as data URLs. Both OFL notices, third-party
MIT notices, font hashes and correction provenance ship in the optional package.
The normal production graph excludes this package and its font data.

The final scoped fixture uses the compiled optional runtime and bundles it again
with actual Lit and generated React Input consumers. It passes 13 outcome checks
in each of Chromium, Firefox and WebKit: scoped collection, no settings record,
keyboard expansion, desktop/narrow rendering, redaction, visible null-field keys,
loaded embedded fonts, property-only updates in both frameworks, bounded public
events, ancestor theme updates, detach/reconnect, unmount/remount/disposal, and no
outbound requests or browser errors. The runner is
`notes/alignment/evidence/m24-devtools/browser-run.ts`; results and screenshots are under
`.artifacts/m24-devtools/`. A separate production branch in that runner contains
102 input modules and no Devtools UI, Solid or font output. Those are local compiled
consumer results; final packed-consumer verification remains the release gate.

Firefox returns quoted `FontFace.family` names while Chromium returns unquoted
names. Both fonts were already loaded; the test now normalizes that serialization
before asserting family identity. No runtime font workaround was added for this
harness discrepancy. Public declarations contain no TanStack Devtools UI or Solid
imports. The runtime has no Lit import either; it uses the host's public controller
interface and its generated metadata.

## Coordinated release candidate — 2026-09-26

A public registry read confirms @acmelabs/design-system0.2.0 is already published. The replacement API therefore prepares coordinated version0.3.0 for core, React, MCP and Devtools under delegated execution. The optional package metadata now represents implemented release candidates rather than private placeholders. Root remains a private build workspace. Skill version metadata, generated facts and peer versions advance together; this is local release preparation, not publication.

The public0.2.0 package advertises a Sigstore provenance endpoint. Read-only verification of that existing statement can check real trust handling under Bun without issuing a new signature or publishing anything. Actual future OIDC policy, signing and Linux CI still need explicit verification; the publishing workflow remains gated.

### Release runtime verification

The read-only public0.2.0 provenance check fails under Bun1.4.0 while bootstrapping trusted TUF root signatures. The same pinned npm/Sigstore stack succeeds under isolated, checksum-verified Bun1.4.2: tarball integrity, provenance digest, GitHub workflow and certificate identity/issuer, trust verification and rejection of a tampered payload all pass. CI and release checks therefore pin1.4.2; the user's global runtime is unchanged. No signature was issued and nothing was published. Final build/test checks will run with that same isolated runtime.

## M25 toolchain implementation — 2026-09-26

The selected toolchain now has executable project configuration and a Bun-only
runner. Versions are Oxlint 1.85.0, Oxfmt 0.70.0, Ultracite 7.12.0,
Stylelint 17.15.0 and postcss-lit 1.4.1. The [tooling evidence](../alignment/evidence/m25-tooling/README.md)
links the exact preset mapping and repeatable checks. The root command, editor
and CI cutover remains a separate integration step; this checkpoint does not
claim publication or a completed release.

The initial full preset check was not treated as a defect count. After the
selected mechanical formatting pass, it reported 4,694 findings, most involving
syntax preferences that the project had not adopted. The final configuration
records each changed setting with a reason. It preserves ordered keys and
initializers, sequential work, controller registration, getter initialization,
parser captures, reactive branch reads, and existing public TypeScript type
shapes. Narrow file overrides cover demonstrated false positives for collection
snapshots, owner captures, Worker messaging, executable source strings, sparse
fixtures and concrete extension hooks. There is no diagnostic-count baseline or
blanket exclusion of authored application code.

The mechanical pass changed 612 tracked JavaScript/TypeScript files. The strengthened
syntax guard passes for every file. Its regressions distinguish `const` from
`let`, preserve optional-chain boundaries such as `(obj?.x).y`, retain raw tagged
template text, and reject changes to key order, dependency reads and JSDoc
attachment. The pass left all 147 authored CSS files unchanged. At 200 columns,
Oxfmt changed JSDoc attachment inside the generator's `Entry` type. A tested
280-column override for that file preserves the original syntax ownership. CSS
formatting also changed opaque custom-property whitespace in compiled output;
CSS therefore stays with its compiler and Stylelint rather than receiving a
formatter rewrite.

Stylelint checks all authored CSS, canonical compiled CSS, and the five source
test files with actual `css`-tagged templates. It does not send arbitrary
TypeScript strings to a CSS parser. The syntax boundary disables automatic
source-map discovery for JavaScript text and fails if postcss-lit skips a real
CSS template. Tests retain unknown-property and duplicate-declaration errors,
while permitting consecutive different-value CSS fallbacks.

Two focused cleanup runs pass: 73 runtime/tool tests and 68 generator/package/
native-content tests. These cover the changed Pin Input bindings, Calendar and
option-control dependency reads, constructor/event behavior, generated CSS,
package processing and copied source graphs. Native Chromium accessibility
checks remain separate from the linter. The consumer-skill tests now derive the
coordinated core version rather than embedding the previous release number.

The runner captures Oxlint JSON through a fresh truncated file descriptor. A
regression fixture starts with a larger existing report, then verifies that the
shorter replacement parses completely. The original pipe-truncation cause is
still not established; the selected capture path avoids it and separately fixes
stale trailing bytes on report reuse. TypeScript 5.9 remains the type gate;
these results do not establish TypeScript-Go equivalence.

### Development dependency audit

Bun's high-severity audit reports three advisories against the direct happy-dom15.11.7 dependency: [VM context escape](https://github.com/advisories/GHSA-37j7-fg3j-429f), [cross-origin cookie selection](https://github.com/advisories/GHSA-w4gp-fjgq-3q4g), and [module export injection](https://github.com/advisories/GHSA-6q6h-j7hj-3r64). Their fixed versions are20.0.0,20.8.9 and20.8.8 respectively. The direct dependency and global registrator are now pinned together at20.14.0, the version already used by the test environment. No Happy DOM code enters the production library. The follow-up audit reports zero vulnerabilities across639 installed packages; eleven affected parser/census tests pass. The final full suite remains part of release acceptance.

### Final local tooling gates

The [final Bun 1.4.2 run](../alignment/evidence/m25-tooling/2026-09-26.json)
passes Oxlint with **zero diagnostics across 811 authored JS/TS files and 342
active native rules**, Oxfmt, Stylelint and the strict root TypeScript check.
Stylelint covers 147 authored CSS files, 167 canonical compiled CSS outputs and
the five actual Lit-template test files. The combined toolchain/release/version
fixture run passes 26 tests with 151 assertions. The saved focused groups overlap
and are not presented as one summed suite count. This closes the local toolchain
implementation; final build/package acceptance and command/editor/CI integration
remain the root task's responsibility.

### Credential-handling incident

During a delegated registry investigation in this continuation, an unnecessary read of local npm configuration printed an npm authentication token into tool output. The value is not reproduced here, was not added to repository files and was not reused. Peter was informed in commentary. The token should be revoked and replaced by its owner; no credential rotation or account change was attempted. Keep this follow-up visible in the final handoff without reading or printing the token again.
