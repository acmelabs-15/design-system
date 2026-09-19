Decided 2026-09-19 by Peter.

# Separate generated styles from authored component code

Move generated component and shared style modules under `src/generated`, retaining them in version control for now. Peter selected this over leaving generated files beside each component. Existing warning headers did not prevent edits that generation overwrote; a distinct path makes ownership visible before a file is opened.

Material Web demonstrates that adjacent generated styles can work: it builds Sass into CSS and Lit `*.cssresult.ts` modules beside components, then excludes those outputs from Git. Our pipeline differs because the reference corpus is excluded from Git and the current publishing workflow consumes committed generated styles. Do not remove those inputs until regeneration is reproducible in that environment.

Update generator destinations, imports, build readers and ownership documentation together in the approved migration. Keep producer headers and generation checks; the directory alone does not prove correctness. This decision does not approve every other path in the layout proposal or authorize file moves before Phase 5 approval.

Evidence: [repository-layout investigation](../analysis/repository-layout.md), [Material Web build](https://github.com/material-components/material-web/blob/main/package.json), and [Material Web Git exclusions](https://github.com/material-components/material-web/blob/main/.gitignore).
