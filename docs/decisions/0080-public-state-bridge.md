# Back public state properties with the canonical store

Peter selected store-backed public state properties over copying Lit inputs into the store during updates. Reading or writing public state such as open, value or checked reaches the canonical per-instance TanStack value. Lit retains responsibility for attributes, reflection and rendering. Do not maintain a second independently writable copy.

Decided 2026-09-19 by Peter.

The 2026-09-19 Copy Button's derived value failing to follow its plain copied property was previously reproduced in happy-dom and isolated Chrome. Lit supports custom reactive accessors. An isolated Bun/happy-dom feasibility probe on that date passed initial derived state, absence of an unrequested default attribute, synchronous derived reads, property rendering/reflection, attribute removal and reconnect.

## Evidence audit qualification

The six-case probe establishes feasibility only. It does not establish a universally correct decorator/accessor utility, prove superiority to every explicit update bridge, or certify initialization, inheritance, all converters, compiler/CEM integration, React wrappers or actual browser behaviour.

The original investigation required equivalent acceptance cases for the selected pattern and a disciplined update bridge. At that point, exact helper implementation and per-property rules remained open. The later [foundations contract](../../spec/SPEC-foundations.md) and [inputs/forms contract](../../spec/SPEC-inputs-forms.md) record the selected integration; the [release record](../releases/0.3.0.md) records its verification scope.

[Lit accessors](https://lit.dev/docs/components/properties/#accessors-custom), [review](../history/systematization/architecture-review.md#evidence-audit), [probe record](../verification/systematization/phase-3-checkpoint-2026-09-19.json).

## Canonical ownership clarification

Peter explicitly reaffirmed that TanStack Store manages the state and is where that state is read. Public properties are access paths to the store; Lit rendering/reflection is not another state owner.

The [expanded comparative probe](../verification/systematization/state-bridge-comparison-2026-09-19.json) supports that distinction. Both minimal approaches passed nine after-update checks, but only direct accessors preserved immediate public/store agreement and kept canonical state current when rendering was gated. An unbridged raw store write still failed attribute reflection: the installed selector requests rendering without identifying which public property changed.

The shared bridge must cover store-origin changes with the appropriate named Lit notification while keeping TanStack as the sole owner. This does not require a second writable copy or justify moving state management to Lit. At this checkpoint, the exact notification mechanism remained unverified; the probe does not certify browsers, inheritance, compiler/CEM or React integration.

## Existing helpers are the baseline

Peter reminded us that this project already has Lit/TanStack integration. Rechecking the source on 2026-09-19 confirmed that atomState already provided per-instance TanStack-backed getters/setters and called requestUpdate(name, oldValue). shared/state.ts re-exported the official StoreSelector and provided lifecycle-managed StoreEffect. The installed adapter also had the existing reconnect patch and regression tests.

The recent two-pattern feasibility probe did not exercise atomState itself. It therefore cannot justify replacing that helper or creating a parallel integration. Its raw-store reflection finding concerns the unbridged write path in the fixture, not proof that the existing setter lacks named notifications.

The investigation next covered existing helpers with public Lit property metadata, attributes/reflection/defaults, derived values, internal/shared-atom writes and reconnect. Evidence was required to justify reuse, extension or replacement. TanStack remains the sole state owner; this decision does not select a new store or subscription engine.

Peter clarified that these helpers may be refactored, rewritten or renamed when that produces the best implementation. They must be evaluated rather than disregarded; their existence does not require preserving their current design. Compare the current implementation and its regression tests with proposed changes, preserve required behaviour, and record the evidence and reason for any replacement. That permission covered evaluating redesign; implementation still awaited the then-pending migration approval. The historical Phase 5 gate is retired.

The subsequent [existing-helper verification](../research/15-lit-practice-review.md#existing-state-integration-verification) reproduces two public-integration gaps in Chromium while all eleven existing regression tests pass. This was evidence for focused refinement, not proof that an unexamined replacement was better or approval for source changes at that time.

The later [style-order comparison](../research/15-lit-practice-review.md#declaration-order-browser-comparison) also uses unchanged atomState. Normal Lit registration reorders separate CSS inputs written before definition; a narrow public-API capture candidate avoids that path for style inputs and passes fifteen targeted checks in Chromium, Firefox and WebKit. The [integration follow-up](../research/15-lit-practice-review.md#style-input-integration-follow-up) adds React, manifest and CSS-default evidence for that fixture. These tests do not certify the separate semantic-control helper refinement, replace its accepted state bridge, approve a second state owner or select the complete metadata/attribute implementation. The later contracts coordinate both modules; this fixture does not prove their complete acceptance.

Peter selected [undefined for omitted CSS styling inputs](0052-layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults); visual defaults come from CSS. This does not change semantic state defaults or TanStack's canonical ownership. The tested CSS-input values and order remain in TanStack; computed visual styles are not another writable state store.

The selected [helper external-write rule](0052-layout-spacing-properties.md#external-writes-to-helper-managed-settings) preserves that ownership: an outside property assignment changes the canonical value immediately, and a later helper render writes its supplied value through the same accessor. Getters do not read a shadow copy from the helper. The [three-field batching check](../research/15-lit-practice-review.md#lit-helper-ownership-and-batched-updates) reuses the existing TanStack batch export so the tested subscriber sees a complete style set. It does not certify all converter/error paths or the separate semantic-control helper refinement.
