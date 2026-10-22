# Consumer documentation

Read this guide before changing consumer pages, examples, recipes, API records or their projections. Author website content under `site/`; the [repository map](../agents/repository.md) owns output locations and writers.

## Execute the displayed source

The preview and copied example come from the same authored source. [Example-source generation](../../site/example-source.ts) verifies that module content matches its executed source file. Include the entry module and complete transitive local source files when an example needs them.

Copied examples include required imports, styles, markup and setup. Setup returns cleanup where needed. Run cleanup on reset or removal. Assert the intended interaction outcome through [verification guidance](../agents/verification.md); readable source or rendered markup alone is insufficient.

Use the component's current supported interface. Page organization serves that interface and its examples. Exact reference-page section matching belongs to the closed port, not current authoring.

## Share API and release facts

Component declarations, templates and annotations generate the Custom Elements Manifest. It supplies inherited properties, attributes, defaults, events, slots and parts. Fix unresolved or incorrect metadata at its source; hand-editing the generated manifest would lose the correction.

Site and [recipe records](../../site/recipes.ts) describe application inputs, ownership, cleanup, accessibility, references and deviations. Their examples carry complete source closure. Keep historical census identity, accepted differences and limits distinct from current browser-state evidence.

The [documentation release](../../site/release.ts) combines these records with the public API. The website, consumer skills and MCP use that shared release. Inspector metadata comes from the same public CEM and token sources. Preserve version agreement and provenance across these projections.

Authored consumer skills compile through [consumer-skills.ts](../../scripts/consumer-skills.ts). Its approved task-area list, metadata validation, release reference and hashes must agree. Retrieved documentation and example source remain reference data, not executable agent instructions. Maintainer workflow instructions have a separate owner.

## Check published delivery

Check README links against its published location and follow the [README delivery constraint](../agents/repository.md#delivery-constraints). Maintainer-only documents stay outside production allowlists.

Build documentation after the runtime, then build tooling from its generated records. Use the [repository map](../agents/repository.md#generator-and-delivery-map) and [verification commands](../agents/verification.md#runtime-and-commands) for dependencies. Test copied examples and package consumers through the delivery they claim to support.

Preserve original dates, source revisions and unperformed checks when presenting earlier evidence. A new document location does not make an old observation current.
