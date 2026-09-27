# Release 0.3.0

Requested by Peter on 2026-09-27. This authorizes the release work that was previously held: push the reviewed branch, run Linux CI, merge through the normal repository flow, publish the coordinated packages and deploy the generated documentation once its checks and account prerequisites succeed.

## Current state

- Local acceptance is complete; see [final verification](evidence/m26-final/README.md).
- Four packages target 0.3.0. npm currently has core0.2.0; the three companion names do not yet exist.
- The release branch is109 commits ahead of remote main, with no remote-only commits.
- GitHub access is administrative. Package and Pages opt-in variables are unset. Pages currently serves main/docs.
- A scan of all new Git history found no npm/GitHub token or private-key pattern; no credentials were printed by this check.
- npm's signed-in package-settings session requires user-controlled one-time verification. The authentication page is open; no code was requested in chat.
- Linux verification, npm publisher configuration and release/deployment remain pending. Manual platform limits from local acceptance remain documented; release authorization does not turn those checks into passing results.

## Intended sequence

Push the reviewed branch and open a release PR. Run the complete Linux gate before merging or publishing. Verify npm publisher permissions and the first-publication path for each companion package. Merge with a merge commit, release the coordinated version through the verified workflow, verify registry artifacts/provenance, then deploy the reviewed site through Pages and verify public routes. Keep the existing site and package version available until their replacements succeed.

## First Linux run

PR #1 is open and attached to the task. Run36311630026 passed install/lint and core/docs compilation, then found a case-sensitive license-path defect in optional tooling: clsx ships lowercase license. The collector now discovers the exact root license filename, rejects absent/ambiguous notices and records that filename in provenance. Two focused tests pass; the actual optional bundle rebuild passes. The new Git history scan has no secret-pattern matches.

## Publication prerequisites verified from npm documentation

The three companion names return404 from the public registry. npm's trusted-publisher CLI requires an existing package, and staged publishing also explicitly excludes brand-new packages. Therefore these names need an authenticated first publication before their normal OIDC relationship can be configured. No placeholder versions, long-lived repository tokens or reuse of the previously exposed credential are approved by this investigation.

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
