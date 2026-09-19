Decided 2026-09-19 by Peter.

# Make selective imports the normal artifact-loading path

Agents generating HTML should normally import the components the page needs. Retain the complete standalone bundle as an explicit option. Peter chose selective imports because the current root entry registers unrelated components even for a small page; the measured Button probes retained 19,755 gzip bytes through its direct module versus 298,278 through the root entry.

Those figures are local bundle probes, not observed CDN transfer or startup timings. Current unbundled output retains extensionless imports, so it is not already a verified direct-browser delivery path. The migration must provide and test browser-ready selective CDN entries for static HTML, including component dependencies, shared runtime and styles. Agents must list the components they use; missing-import behaviour and authoring guidance belong in the final delivery contract.

Material Web supplies individual component definitions and an all-components entry; its production guide uses individual imports. Exact export names, registration/class separation, optional heavy entries and default core membership remain to design. This decision does not approve a global discovery loader, token deletion, SSR support or source changes before Phase 5 approval.

Evidence: [build investigation](../analysis/build-performance.md), [bundle probes](../alignment/evidence/build-bundles.json), and [Material Web import guidance](https://github.com/material-components/material-web/blob/main/docs/quick-start.md#import).
