Decided 2026-09-19 by Peter.

# Generate the component manifest with the standard analyzer

Use `@custom-elements-manifest/analyzer` as a development dependency to generate the planned Custom Elements Manifest. Peter selected it over Lit's analyzer/generator and extending our custom extractor. Its Lit and inheritance support, and use in Web Awesome and Spectrum, support sharing one standard description across docs, editors and agent references.

The current extractor omits 32 runtime properties and misnames one attribute. The selected analyzer's output has not yet been trialled against this repository. Before replacing the extractor, compare inheritance, accessors, custom decorators and actual attribute names with runtime metadata. Add authored annotations for slots, events and styling hooks where the code cannot supply complete information.

This selects the tool and its development-dependency role. Installation into the project, source annotations, generated output paths and integration remain part of the approved migration sequence; no source changes start before Phase 5 approval.

Evidence: [documentation investigation](../analysis/documentation-site.md), [Lit review](../analysis/lit-practice-review.md), and [official analyzer documentation](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/).
