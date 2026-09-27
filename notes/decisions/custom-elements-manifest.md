Decided 2026-09-19 by Peter.

# Generate the component manifest with the standard analyzer

Use `@custom-elements-manifest/analyzer` as a development dependency to generate the planned Custom Elements Manifest. Peter selected it over Lit's analyzer/generator and extending our custom extractor. Its Lit and inheritance support, and use in Web Awesome and Spectrum, support sharing one standard description across docs, editors and agent references.

The current extractor omits 32 runtime properties and misnames one attribute. The selected analyzer has now been trialled against the repository's source, with isolated inheritance/custom-field and package-path checks as below. Before replacing the extractor, complete the comparison against runtime metadata across all retained components. Add authored annotations for slots, events and styling hooks where the code cannot supply complete information.

This selects the tool and its development-dependency role. Installation into the project, source annotations, generated output paths and integration remain part of the approved migration sequence; no source changes start before Phase 5 approval.

Evidence: [documentation investigation](../analysis/documentation-site.md), [Lit review](../analysis/lit-practice-review.md), and [official analyzer documentation](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/).

## Bounded source and package verification

The [style-input comparison](../alignment/evidence/style-input-integration-review-2026-09-20.json) establishes field/accessor-level @attribute linking and inherited metadata without a custom decorator plugin. The [actual CLI/source follow-up](../alignment/evidence/style-package-verification-2026-09-20.json) analyzes 330 current source modules read-only. It reproduces inconsistent local module paths and three external named exports misclassified because of double-quote handling. A correction in the temporary analyzer install fixes the classification; a TypeScript-resolved publication map makes all 1,072 local references consistent with normalized output module paths.

The annotated two-property fixture passes strict declaration emission and consumer-type checks, and its mapped emitted files exist. This supports continuing with the selected analyzer. It does not approve the exact temporary patch/plugin, certify all API metadata or finalize future package exports. Before replacement, fix the analyzer defect at its source, tie path mapping to the approved output layout, reject unresolved references and verify full runtime/manifest agreement. Keep semantic-control helper checks distinct from this CSS-input fixture. No project installation or production annotation was made.
