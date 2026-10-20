# Release 0.3.0

Requested by Peter on 2026-09-27. This authorizes the release work that was previously held: push the reviewed branch, run Linux CI, merge through the normal repository flow, publish the coordinated packages and deploy the generated documentation once its checks and account prerequisites succeed.

## Current state

- Local acceptance is complete; see [final verification](evidence/m26-final/README.md).
- The coordinated0.3.0 release is incomplete. React, Devtools and MCP0.3.0 are published and verified. Core0.3.0 is rejected with E415, “Too many files”; its archive has185,977 files.
- PR #1 is merged at05aff0c130887055281824dc5d103cb942e794cd. Annotated tagv0.3.0 points to that commit.
- GitHub access is administrative. ACME_RELEASE_ENABLED is reset to false after the rejection. ACME_PAGES_ENABLED remains unset; Pages currently serves main/docs.
- A scan of all new Git history found no npm/GitHub token or private-key pattern; no credentials were printed by this check.
- Linux run39417304552 and exact-tag preparation/signing run39420121228 pass completely. All four signed archives also pass local signature/statement verification.
- Fresh CLI login succeeds as loriensleafs, with write access to core. Peter completes the separate npm security check; core's publisher matches publish-package.yml, acmelabs-15/design-system, environment publish-package, and permits direct and staged publication.
- The GitHub release is public, but run39433342050 fails at the registry after complete verification succeeds. Correct package composition before another release. Companion trusted-publisher setup belongs immediately before their next real version. Pages deployment remains pending. Manual platform limits remain documented.

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

Both authentication steps now succeed. The temporary CLI configuration remains isolated; no credential values were read or copied to the repository. Core's existing publisher is verified as the exact repository/workflow/environment with publish and stage-publish permissions. A later authenticated npm org ls confirms loriensleafs is an owner of acmelabs, so the account has organization authority for the new names.

Under the authorized release, add a prepare_only dispatch input to the existing publishing workflow. It runs the same complete Linux gate and exact-tag/commit/source checks, then signs the four archives with the pinned npm provenance implementation. It uploads the original archives and signed bundles without publishing versions. Verification checks Sigstore trust, the exact GitHub certificate identity, package SHA-512, tag, commit, workflow and hosted runner. Normal automated publication retains its existing guards and token-free authentication.

This supports first publication of the real companion0.3.0 archives using the authenticated owner and npm's documented provenance-file option. No placeholder versions or permanent CI token are introduced. The new command's regression starts red with the missing module and passes after implementation; it rejects altered bytes, subjects, commits, tags, repositories, workflows, runner claims and predicate types. Live signing and first publication remain pending until review and Linux verification pass. Keep the final tag/commit and downloaded artifact record identical; do not publish the older local archives.

Local verification passes lint/format/style, strict types, thirteen focused release tests and the full966-test suite under checksum-verified Bun1.4.2. The initial sandboxed suite passes959 tests and blocks seven server/temporary-install tests; the complete unrestricted rerun passes966 with190406 assertions. Original logs remain in .artifacts/release-unit-2026-10-20.log and .artifacts/release-unit-2026-10-20-unrestricted.log. Independent review approves the focused change; deleting subject validation in a private-copy mutation makes the regression fail. Live signing and the new Linux run remain required.

### Dependency audit correction

Commit2dd206413 is pushed. Linux run39412269192 passes build, types and units, then fails the native dependency audit with six advisories. Four disappear after reviewed updates: MCP SDK1.31.0, Solid1.9.17 with Seroval/Seroval Plugins1.6.11, and source-map-js1.2.2. Published Solid sources were compared;1.9.17 avoids a second runtime under the TanStack inspector and includes additional server-rendering validation. No unrelated lockfile refresh is included.

Braces3.0.3 has no published fix. A Bun patch bounds parser nesting and all three public syntax-tree walkers. Its normal-pattern, boundary and supplied-tree tests pass. The other remaining advisory concerns shared-cache cookie replay. npm12.0.2 uses a fixed private cache policy, excludes Set-Cookie from cached response metadata, and does not forward the option that could retain it. A real registry-fetch cache round trip verifies this. The disposition does not claim universal identity partitioning, safe shared caches, or correction of other cache-policy defects.

scripts/dependency-audit.ts still runs the native Bun audit. It accepts only those two exact advisory/severity/range tuples after checking installed source fingerprints, exact lockfile occurrences, private build-only scope, required patch configuration and a review deadline of2026-11-20. Changed/unknown high or critical findings, missing proofs, invalid audit output and expired reviews fail. The raw native findings and each disposition are saved to .artifacts/checks/dependency-audit.json; the [committed audit record](evidence/release-0.3.0/dependency-audit.json) preserves this checkpoint. Independent review found and corrected a missing cache-path fixture setting and an omitted consumer peer-dependency guard; the final five focused security tests pass with45 assertions.

Fresh [npm staged-publishing documentation](https://docs.npmjs.com/staged-publishing/) now permits new names, but automatically creates public0.0.0-stage placeholders. It also reserves the staged version until approval or rejection. The selected direct first publication with GitHub-signed provenance avoids those extra public versions; it does not depend on the older staging restriction.

The remediation passes frozen installation, lint/format/style, strict types, a complete drift-free build and971 unit tests with190451 assertions. The native audit retains two findings with verified dispositions and no unresolved high/critical findings. Logs remain under .artifacts/release-security. The final guard refinement separates requireReleaseEnvironment from requirePublishEnvironment: explicit prepare_only signs verified tag archives without turning on registry publication. Actual publication still requires ACME_RELEASE_ENABLED=true. Fourteen focused release tests and strict types pass after this refinement; independent review approves it. No second component build is needed for this workflow-only refinement. A fresh Linux run remains mandatory before merge.

Latest pushed head:6e2a086da1452211cc8446768af78637a368cd1b. It includes f994ba15c (reviewed security remediation) and6e2a086da (signing/publication separation). PR #1's updated description discloses the audit dispositions. [Run39417304552](https://github.com/acmelabs-15/design-system/actions/runs/39417304552) is in progress. No merge, tag, release, package publication or Pages setting change has occurred. This checkpoint is intentionally not pushed during the running verification. Next: wait for the complete Linux result, then merge with a merge commit. Keep publishing disabled while the exact release tag's prepare_only workflow signs its verified archives. Authenticate the real companion versions' first publication using those archives/bundles, configure their exact trusted publishers, then enable and run normal coordinated publication. Deploy and verify Pages after package publication.

### Verified merge and tag

Run39417304552 completes successfully, including every browser/consumer check and public trust verification. PR #1 merges with merge commit05aff0c130887055281824dc5d103cb942e794cd. Annotated tagv0.3.0 has tag object88b31662c419cb328670ddb8ee376768aae7e55e pointing to that commit. Publication and Pages opt-in variables remain unset.

The downloaded [Linux verification record](evidence/release-0.3.0/linux-verified.json) confirms all23 browser invocations complete with zero failures, and the two exact audit dispositions pass against the fresh Linux installation. Diagnostic artifacts are preserved under .artifacts/release-security/linux-verification.

The automatic tag run39420011866 is cancelled in favor of [explicit preparation run39420121228](https://github.com/acmelabs-15/design-system/actions/runs/39420121228), dispatched onv0.3.0 with prepare_only=true. This replacement runs the entire quality workflow before signing, without enabling package publication. Main's ordinary quality/documentation runs39419958921 and39419959012 also started. The legacy Pages build39419948507 succeeds for the still-preserved main/docs snapshot; that is not the new generated-site deployment.

Next: require successful preparation/signing, download signed-release-05aff0c130887055281824dc5d103cb942e794cd from that run, and independently verify it with scripts/release-attest.ts verify under Bun1.4.2. Confirm release.json names commit05aff0c130887055281824dc5d103cb942e794cd. Publish the three real companion0.3.0 archives with the authenticated owner and their matching provenance-file bundles. Configure and verify each trusted publisher, then enable normal publication and finish the coordinated release. npm configuration remains isolated under /private/tmp/acme-npm-login-jxv9dw; do not print it or use the old exposed credential. These live status edits remain local.

### Signed archives verified; first publication awaiting npm check

Preparation run39420121228 succeeds, including live GitHub/Sigstore signing and verification of all four bundles. Artifact12263738717 is downloaded to .artifacts/signed-release-0.3.0.zip. Its SHA-256 matches GitHub's digest d4942071ef09872c5f670e8e68a41f0fe036eaa5752df5f5066089c7a05e4f72. It contains only release.json, four archives and four provenance bundles. Extraction is under .artifacts/signed-release-0.3.0.

scripts/release-attest.ts verify succeeds under pinned Bun1.4.2 for all four packages at05aff0c130887055281824dc5d103cb942e794cd. [Archive identities](evidence/release-0.3.0/release.json) and [signing verification](evidence/release-0.3.0/signing.json) preserve the result. A final public registry preflight returns404 for all four0.3.0 versions.

The first publication command for @acmelabs/design-system-react0.3.0 is active in terminal session31089. It uses the exact downloaded React archive and its provenance-file, scripts disabled, public access and the isolated authenticated npm configuration. npm requests a publishing-specific browser security check; the link is shown to Peter and sent to the browser pane. No version publication is confirmed yet. Resume by checking this session, then verify registry integrity before proceeding to Devtools/MCP. Keep the whole release incomplete until all four packages and documentation are verified.

### React package creation did not confirm version publication

Peter completes the publishing check. Session31089 exits0 and prints + @acmelabs/design-system-react@0.3.0. A sanitized request-log inspection shows the package PUT receives401, the browser authentication completes, then the retried PUT receives202. The command is direct publish, not stage publish; the archive manifest has version0.3.0 and no publishConfig.

Public metadata instead exposes only0.0.0-stage, created at2026-10-20T12:41:49.304Z. The version-specific endpoint still returns404 after delayed and cache-bypassing reads. Full and abbreviated registry metadata agree. The signed-in package page identifies a temporary holding version awaiting staged release, but both filtered/unfiltered npm stage list and the account's Staged Packages page show no version awaiting approval. Do not infer successful0.3.0 publication from the CLI exit code.

An identical direct publication retry is running in session13904, using the already verified archive and provenance bundle. npm requests a fresh publishing check; its link has been sent to Peter. No archive/source/version change, unpublish or other package mutation is made during this investigation. Check the retry result and registry integrity before continuing to the other packages. The package placeholder is an observed registry side effect, superseding the earlier expectation that direct publication would avoid it.

### Explicit staging succeeds; React waits on automated review

After Peter authorizes the retry, session13904 returns409 because React0.3.0 is already staged. An explicit stage submission of the same React archive also refuses the reserved version. Fresh CLI lists, the account's Staged Packages page, page0/page1 reads through npm's own client, and authenticated write=true metadata do not expose a user-approvable React stage. No further React writes are attempted.

The package's Versions tab supplies the missing explanation: React0.3.0 is Validating, and npm states that automated review has not finished and the version remains unavailable until that review completes. This is an external validation wait, not missing user authentication. npm's public status page reports no general publishing incident. The task does not unpublish the placeholder or bypass review with a new version.

Explicit staging returns stage999cb5af-fc43-43de-a9ed-927309a441af for Devtools and54127b66-45fd-4de9-ba9b-d8d9addb9f28 for MCP. Both staged tarballs are downloaded and SHA-512 checked against the GitHub-signed archives before approval. Peter completes each approval's npm check. Sessions86375 and27138 report successful publication. Public registry reads confirm0.3.0, exact signed-archive integrity and provenance endpoints for both packages.

The draft GitHub release forv0.3.0 is prepared at https://github.com/acmelabs-15/design-system/releases/tag/untagged-74871ff46f87344698f0. It has signed-release-0.3.0.zip and SHA256SUMS. GitHub's uploaded ZIP digest matches the original verified d4942071ef09872c5f670e8e68a41f0fe036eaa5752df5f5066089c7a05e4f72. Publishing the draft later triggers the normal release workflow; do not separately dispatch a duplicate normal publish run.

### Companion publisher setup timing

[npm's October2 policy](https://github.blog/changelog/2026-10-02-unvalidated-npm-trusted-publishing-configurations-now-expire/) expires new, unvalidated trust configurations after48 hours. Validation requires the configuration's first successful publish; a token exchange alone is not enough. The initial companion versions use authenticated owner publication with verified GitHub provenance, so an unused configuration created afterward would expire before an unspecified future release.

Create each companion trust configuration immediately before its next actual version, then validate it through that release's real CI publication. Do not invent another version just to activate a configuration. Core's existing validated publisher completes the current0.3.0 release once React becomes available. A Devtools configuration attempt in session6308 was interrupted while waiting for its unshown JSON-mode authentication link; no successful configuration response was observed. Confirm actual state before creating future configurations. No npm operation remains waiting for Peter at this checkpoint.

Main documentation verification run39419959012 succeeds. Its deployment job118628797360 is skipped because Pages is disabled. After all four npm packages are verified, configure workflow-based Pages and enable its opt-in. The official GitHub rerun-job endpoint may permit deploying the already-verified artifact by rerunning that job; this has not been tested. If unavailable, dispatch the normal Pages workflow. Keep all existing safety gates.

### React review completes; coordinated publication starts

React0.3.0 becomes public without another upload or user authentication. The downloaded registry tarball matches the signed SHA-512. Its public Sigstore bundle verifies against the exact GitHub workflow, tag and commit. Devtools and MCP pass the same actual-tarball and cryptographic checks. The [companion publication record](evidence/release-0.3.0/published-companions.json) preserves those three results; core remains unverified.

ACME_RELEASE_ENABLED is set to true. The prepared GitHub release becomes public at https://github.com/acmelabs-15/design-system/releases/tag/v0.3.0. Its published event starts [run39433342050](https://github.com/acmelabs-15/design-system/actions/runs/39433342050) on the immutable05aff0c130887055281824dc5d103cb942e794cd tag target. Require that workflow's success and all four public-package checks before switching Pages.

### Registry confirmation follow-up

The live npm202 response exposes a release-script defect: CLI success alone does not establish public availability. On codex/release-registry-verification, scripts/release-registry.ts waits for exact public package/version metadata, matching SHA-512 and the expected registry provenance link. Existing versions complete confirmation before any new upload. New uploads complete confirmation before the success log. Pending review, absent provenance, conflicting metadata and registry errors cannot pass.

The helper verifies metadata; the release's separate acceptance script verifies actual tarballs and cryptographic provenance. This follow-up changes future automation, not the signed0.3.0 source or archives. Static checks and strict types pass. The full suite passes976 tests before review strengthening; the final focused suite passes15 tests with52 assertions. Independent review requests read/wait counts and a persistent-missing-provenance regression; both are added. Final review approves: private-copy mutations that accept absent or empty provenance fail the tests.

The fix is committed as3b7e84e177dd4da23649ef9e40fcb91423d35580. [PR #2](https://github.com/acmelabs-15/design-system/pull/2) passes the complete [Linux run39433828669](https://github.com/acmelabs-15/design-system/actions/runs/39433828669) and merges with merge commitffe1a9824c1f2e2b7571ee52cee73dd1fc8b4541. The final records/cleanup branch is codex/release-finalization. The release tag remains unchanged.

Run39433342050's complete verification job passes. Its actual core publication starts at2026-10-20T14:16:10Z and is still running at this checkpoint. A public-registry confirmation attempt correctly exhausts while core0.3.0 remains absent; do not infer availability from the active upload step. The three companion latest tags are verified as0.3.0. Pages remains unchanged.

### Core registry rejection: too many files

The publication job ends at2026-10-20T14:21:57Z. npm returns E415, HTTP415, “Too many files” for the core package PUT. The pinned CLI reports185,977 files,21.7MB compressed and152.6MB unpacked. The [sanitized failure record](evidence/release-0.3.0/publication-failure.json) preserves the exact registry result. The complete verification job passes, exposing a missing package-count gate rather than an authentication failure.

Independent archive enumeration agrees:97,129 JavaScript files,42,235 declarations,42,235 declaration maps and4,351 JSON files. Generated icon modules and repeated declarations dominate. The browser graph alone contains approximately54,884 files. Removing maps alone cannot make the combined archive small enough.

Primary publisher evidence records [59,869 accepted and69,045 rejected files](https://github.com/pulumi/pulumi/issues/11504#issuecomment-1333920882), plus [65,284 rejected files](https://github.com/pulumi/pulumi-azure-native/issues/2294). These are observations, not current official npm limit documentation. Use60,000 as a conservative project budget while retaining actual publication as the final registry check. No test package is published to probe npm's cutoff.

Under delegated execution, investigate a separate browser distribution and a shared declaration for equivalent artwork imports. Retain precise class, definition and registration declarations. An independent review also notices that current definition-only declarations erase native tag types despite the recorded delivery contract; the correction must cover that consumer case. No icon/style/runtime behavior is to be removed to satisfy the file budget.

ACME_RELEASE_ENABLED is reset to false. The failed0.3.0 tag and signed archives remain immutable; the published companions are not unpublished or rewritten. Record the corrected release identity before tagging. The working branch is codex/release-finalization. A delegated test-only task prepares the actual archive-count regression; implementation and final packaging selection remain pending.

The [selected packaging correction](../decisions/browser-distribution-package.md) proceeds as coordinated0.3.1. Its [recovery plan](release-0.3.1.md) is the current execution record. GitHub's0.3.0 release is marked prerelease/not latest with an explicit incomplete-publication notice; its tag and signed assets remain unchanged.
