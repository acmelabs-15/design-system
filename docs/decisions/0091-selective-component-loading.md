# Make selective imports the normal artifact-loading path

Agents generating HTML should normally import the components the page needs. Retain the complete standalone bundle as an explicit option. Peter chose selective imports because the root entry reviewed on 2026-09-19 registered unrelated components even for a small page. The measured Button probes retained 19,755 gzip bytes through its direct module versus 298,278 through the root entry.

Decided 2026-09-19 by Peter.

Those figures are local bundle probes, not observed CDN transfer or startup timings. The then-current unbundled output retained extensionless imports, so the probe did not establish a direct-browser delivery path. Acceptance required browser-ready selective CDN entries for static HTML, including component dependencies, shared runtime and styles. Agents must list the components they use; missing-import behaviour and authoring guidance belong in the final delivery contract.

Material Web supplies individual component definitions and an all-components entry; its production guide uses individual imports. Exact export names, registration/class separation, optional heavy entries and default core membership were left to the later [documentation/tooling contract](../../spec/SPEC-documentation-tooling.md). The [release record](../releases/0.3.0.md) records later delivery verification. This decision does not approve a global discovery loader, token deletion or SSR support. The historical Phase 5 gate is retired.

Evidence: [build investigation](../research/05-build-performance.md), [bundle probes](../verification/systematization/build-bundles.json), and [Material Web import guidance](https://github.com/material-components/material-web/blob/main/docs/quick-start.md#import).
