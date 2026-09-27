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
