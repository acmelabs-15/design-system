# Generate the component manifest with the standard analyzer

Use `@custom-elements-manifest/analyzer` as a development dependency to generate the Custom Elements Manifest. Peter selected it over Lit's analyzer/generator and extending our custom extractor. Its Lit and inheritance support, and use in Web Awesome and Spectrum, support sharing one standard description across docs, editors and agent references.

Decided 2026-09-19 by Peter.

The extractor inspected at selection time omitted 32 runtime properties and misnamed one attribute. The selected analyzer was trialled against the repository's source, with isolated inheritance/custom-field and package-path checks as below. Replacement required comparison against runtime metadata across all retained components, plus authored annotations for slots, events and styling hooks where code could not supply complete information.

This selects the tool and its development-dependency role. Installation, source annotations, output paths and integration were not completed by this initial tool selection.

Evidence: [documentation investigation](../research/09-documentation-site.md), [Lit review](../research/15-lit-practice-review.md), and [official analyzer documentation](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/).

## Bounded source and package verification

The [style-input comparison](../verification/systematization/style-input-integration-review-2026-09-20.json) establishes field/accessor-level @attribute linking and inherited metadata without a custom decorator plugin. The [actual CLI/source follow-up](../verification/systematization/style-package-verification-2026-09-20.json) analyzes 330 then-current source modules read-only. It reproduces inconsistent local module paths and three external named exports misclassified because of double-quote handling. A correction in the temporary analyzer install fixes the classification; a TypeScript-resolved publication map makes all 1,072 local references consistent with normalized output module paths.

The annotated two-property fixture passes strict declaration emission and consumer-type checks, and its mapped emitted files exist. This supports continuing with the selected analyzer. It does not approve the exact temporary patch/plugin, certify all API metadata or finalize future package exports. The replacement requirements were to fix the analyzer defect at its source, tie path mapping to the approved output layout, reject unresolved references and verify full runtime/manifest agreement. Keep semantic-control helper checks distinct from this CSS-input fixture. No project installation or production annotation was made by those probes.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
