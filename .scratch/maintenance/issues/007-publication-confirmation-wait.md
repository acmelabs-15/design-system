# Publication confirms each package within one minute, but npm review takes longer

Status: needs-triage
Type: task
Owner: maintainer investigation

## Observed result

`publishRelease` in scripts/release.ts publishes one package, then waits for npm to serve it before it publishes the next. `waitForPublishedArchive` in scripts/release-registry.ts tries 30 times, 2 seconds apart: about one minute.

npm's review holds a new version for longer than that:

| Release | Evidence | Result |
| --- | --- | --- |
| 0.3.2 | Core uploaded about 21:40Z on 2026-10-20; npm served it about 22:01Z | Three publish attempts; all five packages public about 53 minutes after the first upload. [Release record](../../../docs/releases/0.3.2.md) |
| 0.3.3 | Publish run [40593827273](https://github.com/acmelabs-15/design-system/actions/runs/40593827273), 2026-10-27 | The core upload succeeds; the wait ends at release-registry.ts:54 and the job fails. No package is public at that point. |

A rerun is safe only after npm serves every uploaded version. A rerun before that publishes the same version again, and npm rejects it. So each release needs a person or agent to watch the registry and rerun the job once per package.

## Open questions

- Can the job upload all pending packages first and then wait, so npm reviews them in parallel?
- Should confirmation move to a separate, longer job or a scheduled check, instead of the 15-minute publish job?
- Does the bounded wait protect anything that a longer wait would lose?

## Completion

Decide the publication flow through the applicable workflow, with a test for a delayed registry response. A successful manual rerun does not close this issue.

## Comments

2026-10-27: recorded during the 0.3.3 publication. Related to the CI duration research for issue #9's follow-up work.
