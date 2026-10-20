# Release 0.3.0

Requested by Peter on 2026-09-27. This authorizes the release work that was previously held: push the reviewed branch, run Linux CI, merge through the normal repository flow, publish the coordinated packages and deploy the generated documentation once its checks and account prerequisites succeed.

## Current state

- Local acceptance is complete; see [final verification](evidence/m26-final/README.md).
- Four packages target 0.3.0. npm currently has core0.2.0; the three companion names do not yet exist.
- PR #1 is open and unmerged. The preceding verified head is 2924f850ea274c08ff69a0172e8e4fc6067a2886; the signing-only workflow change requires a new Linux run.
- GitHub access is administrative. Package and Pages opt-in variables are unset. Pages currently serves main/docs.
- A scan of all new Git history found no npm/GitHub token or private-key pattern; no credentials were printed by this check.
- Linux quality runs36315751267 and36354684865 both completed successfully. The latter verifies the preceding PR head.
- Fresh CLI login succeeds as loriensleafs, with write access to core. Peter completes the separate npm security check; core's publisher matches publish-package.yml, acmelabs-15/design-system, environment publish-package, and permits direct and staged publication.
- npm publisher configuration and release/deployment remain pending. Manual platform limits from local acceptance remain documented; release authorization does not turn those checks into passing results.

## Intended sequence

Push the reviewed branch and open a release PR. Run the complete Linux gate before merging or publishing. Verify npm publisher permissions and the first-publication path for each companion package. Merge with a merge commit, release the coordinated version through the verified workflow, verify registry artifacts/provenance, then deploy the reviewed site through Pages and verify public routes. Keep the existing site and package version available until their replacements succeed.

## First Linux run

PR #1 is open and attached to the task. Run36311630026 passed install/lint and core/docs compilation, then found a case-sensitive license-path defect in optional tooling: clsx ships lowercase license. The collector now discovers the exact root license filename, rejects absent/ambiguous notices and records that filename in provenance. Two focused tests pass; the actual optional bundle rebuild passes. The new Git history scan has no secret-pattern matches.

## Publication prerequisites verified from npm documentation

The three companion names return404 from the public registry. npm's trusted-publisher CLI requires an existing package. The September27 investigation recorded staged publishing as excluding new packages; the October20 fresh documentation below supersedes that claim. The selected first-publication path uses the real version with provenance. No placeholder versions, long-lived repository tokens or reuse of the previously exposed credential are introduced.

The signed-in npm browser has moved to password confirmation and remains under user control. The release cannot complete until that authentication and the legitimate first-publication path are resolved. Core's existing OIDC setup also needs verification before publication is enabled.

Sources: [trusted publisher prerequisites](https://docs.npmjs.com/cli/v12/commands/npm-trust/#prerequisites), [staged publishing prerequisites](https://docs.npmjs.com/staged-publishing/#prerequisites). npm supports attaching a pre-generated provenance bundle through provenance-file; the pinned CLI source verifies its subject/digest. That is a researched capability, not an implemented or authorized alternate publication path.

Linux run36312017815 includes the license fix and has passed install, lint, build, strict types, unit tests, dependency audit, archive validation and browser installation. Browser/consumer acceptance is currently running. PR: https://github.com/acmelabs-15/design-system/pull/1.

## Second Linux run

Run36312017815 passed22 of23 browser invocations and1445 of1446 family results. The only failure was a hardcoded native date-editor Tab expectation in WebKit. The case now uses a paired native dialog as its exact per-browser oracle; all27 local dialog cases pass in each engine. The shared full-release driver now clears diagnostic filters, with a failing baseline and passing regression. No runtime component was changed for this finding. The next Linux run must pass before integration/publication.

## Third Linux run

Run36313857937 confirms the paired native date check in all engines: Chromium/Firefox retain three editor stops, while LinuxWebKit moves directly to the next control. The only remaining failure was Firefox worker cleanup measured after a fixed30ms delay. The test now waits for actual worker close events and retains its zero-worker check. All13 local Flow cases pass per engine; no runtime component changed. The next Linux rerun must complete before release. npm password confirmation remains pending, and no tag, package publication or Pages change has occurred.

## Handoff awaiting npm authentication

Latest pushed release head: ee0b4ca25968e225af36ae5d196ff07632e31907. Latest Linux run: https://github.com/acmelabs-15/design-system/actions/runs/36315751267 (in progress when recorded). The worker-close correction passes all13 Flow cases in each local engine. The transcript-only follow-up superseded run36315713786; it was cancelled by normal workflow concurrency, not a test failure.

PR #1 remains open and unmerged. No v0.3.0 release tag or package publication was performed. A fresh registry read returns404 for version0.3.0 of all four packages. Publishing and Pages variables/settings have not been enabled or changed. The npm browser tab remains at password confirmation, with the password field observed empty; the user must complete that authentication directly.

On resumption: inspect the latest Linux result and diagnose any remaining failure without weakening gates. Complete npm authentication and the three companion packages' first-publication prerequisites. Verify package-specific trusted publishing before enabling the coordinated publishing workflow. Then merge through the normal verified flow, tag/release the verified commit and deploy/check Pages. Preserve the manual-platform limitations. Do not use the previously exposed npm credential, print credentials, or publish only a subset while claiming the coordinated release is complete.

This status-only note is committed locally after the pushed head; it is intentionally not pushed during the active CI run to avoid cancelling verification again.

## Authentication clarification — 2026-10-20

The current registry confirms that the @acmelabs scope already exists: core remains at0.2.0. The React, Devtools and MCP package names each return404. These are new package names within an existing scope, not a new namespace.

Package names can be created through an authenticated first publication with npm publish. Trusted publisher configuration also has a CLI command, npm trust github, but the package must already exist. The official CLI documentation requires account two-factor authentication for trust configuration. Website settings are therefore not the only configuration route; account authentication is still necessary.

The user reports that the password prompt is absent. The supplied browser URL is /package/escalate, which is a package page rather than the former /escalate password confirmation page. A fresh npm CLI web login completes successfully in terminal session91760. Peter then completes the separate security check in session49420. Credentials use an isolated mode0700 directory at /private/tmp/acme-npm-login-jxv9dw with mode0600 configuration files. Do not print their contents or read the previous npm credential. No publication or publisher configuration occurred.

Fresh GitHub checks confirm successful quality runs36315751267 and36354684865. PR #1 remains open, unmerged and mergeable, at2924f850ea274c08ff69a0172e8e4fc6067a2886 before the signing-only workflow change. This supersedes the earlier pending-run and local-only-head handoff. Account access and core's publishing permissions are verified. Continue through the authenticated first-publication sequence below.

Sources: [npm publish](https://docs.npmjs.com/cli/v12/commands/npm-publish), [npm trust](https://docs.npmjs.com/cli/v12/commands/npm-trust), [npm login](https://docs.npmjs.com/cli/v12/commands/npm-login). The current documentation selector reports npm12.2.0; the repository CLI remains pinned to12.0.2.

### Authenticated first-publication preparation

Both authentication steps now succeed. The temporary CLI configuration remains isolated; no credential values were read or copied to the repository. Core's existing publisher is verified as the exact repository/workflow/environment with publish and stage-publish permissions.

Under the authorized release, add a prepare_only dispatch input to the existing publishing workflow. It runs the same complete Linux gate and exact-tag/commit/source checks, then signs the four archives with the pinned npm provenance implementation. It uploads the original archives and signed bundles without publishing versions. Verification checks Sigstore trust, the exact GitHub certificate identity, package SHA-512, tag, commit, workflow and hosted runner. Normal automated publication retains its existing guards and token-free authentication.

This supports first publication of the real companion0.3.0 archives using the authenticated owner and npm's documented provenance-file option. No placeholder versions or permanent CI token are introduced. The new command's regression starts red with the missing module and passes after implementation; it rejects altered bytes, subjects, commits, tags, repositories, workflows, runner claims and predicate types. Live signing and first publication remain pending until review and Linux verification pass. Keep the final tag/commit and downloaded artifact record identical; do not publish the older local archives.

Local verification passes lint/format/style, strict types, thirteen focused release tests and the full966-test suite under checksum-verified Bun1.4.2. The initial sandboxed suite passes959 tests and blocks seven server/temporary-install tests; the complete unrestricted rerun passes966 with190406 assertions. Original logs remain in .artifacts/release-unit-2026-10-20.log and .artifacts/release-unit-2026-10-20-unrestricted.log. Independent review approves the focused change; deleting subject validation in a private-copy mutation makes the regression fail. Live signing and the new Linux run remain required.

### Dependency audit correction

Commit2dd206413 is pushed. Linux run39412269192 passes build, types and units, then fails the native dependency audit with six advisories. Four disappear after reviewed updates: MCP SDK1.31.0, Solid1.9.17 with Seroval/Seroval Plugins1.6.11, and source-map-js1.2.2. Published Solid sources were compared;1.9.17 avoids a second runtime under the TanStack inspector and includes additional server-rendering validation. No unrelated lockfile refresh is included.

Braces3.0.3 has no published fix. A Bun patch bounds parser nesting and all three public syntax-tree walkers. Its normal-pattern, boundary and supplied-tree tests pass. The other remaining advisory concerns shared-cache cookie replay. npm12.0.2 uses a fixed private cache policy, excludes Set-Cookie from cached response metadata, and does not forward the option that could retain it. A real registry-fetch cache round trip verifies this. The disposition does not claim universal identity partitioning, safe shared caches, or correction of other cache-policy defects.

scripts/dependency-audit.ts still runs the native Bun audit. It accepts only those two exact advisory/severity/range tuples after checking installed source fingerprints, exact lockfile occurrences, private build-only scope, required patch configuration and a review deadline of2026-11-20. Changed/unknown high or critical findings, missing proofs, invalid audit output and expired reviews fail. The raw native findings and each disposition are saved to .artifacts/checks/dependency-audit.json; the [committed audit record](evidence/release-0.3.0/dependency-audit.json) preserves this checkpoint. Independent review found and corrected a missing cache-path fixture setting and an omitted consumer peer-dependency guard; the final five focused security tests pass with45 assertions.

Fresh [npm staged-publishing documentation](https://docs.npmjs.com/staged-publishing/) now permits new names, but automatically creates public0.0.0-stage placeholders. It also reserves the staged version until approval or rejection. The selected direct first publication with GitHub-signed provenance avoids those extra public versions; it does not depend on the older staging restriction.

The remediation passes frozen installation, lint/format/style, strict types, a complete drift-free build and971 unit tests with190451 assertions. The native audit retains two findings with verified dispositions and no unresolved high/critical findings. Logs remain under .artifacts/release-security. The final guard refinement separates requireReleaseEnvironment from requirePublishEnvironment: explicit prepare_only signs verified tag archives without turning on registry publication. Actual publication still requires ACME_RELEASE_ENABLED=true. Fourteen focused release tests and strict types pass after this refinement; independent review approves it. No second component build is needed for this workflow-only refinement. A fresh Linux run remains mandatory before merge.
