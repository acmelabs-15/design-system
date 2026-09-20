Decided 2026-09-19 by Peter.

# Back public state properties with the canonical store

Peter selected store-backed public state properties over copying Lit inputs into the store during updates. Reading or writing public state such as open, value or checked reaches the canonical per-instance TanStack value. Lit retains responsibility for attributes, reflection and rendering. Do not maintain a second independently writable copy.

The current Copy Button's derived value failing to follow its plain copied property was previously reproduced in happy-dom and isolated Chrome. Lit supports custom reactive accessors. A new isolated Bun/happy-dom feasibility probe passed initial derived state, absence of an unrequested default attribute, synchronous derived reads, property rendering/reflection, attribute removal and reconnect.

## Evidence audit qualification

The six-case probe establishes feasibility only. It does not establish a universally correct decorator/accessor utility, prove superiority to every explicit update bridge, or certify initialization, inheritance, all converters, compiler/CEM integration, React wrappers or actual browser behaviour.

Before finalizing this shared module, compare the selected pattern and a disciplined update bridge with equivalent acceptance cases. Preserve the TanStack state rule and the accepted direction while investigating; bring any warranted revision to Peter. Exact helper implementation and per-property rules remain open.

[Lit accessors](https://lit.dev/docs/components/properties/#accessors-custom), [review](../alignment/phase-3-review.md#evidence-audit), [probe record](../alignment/evidence/phase-3-checkpoint-2026-09-19.json).

## Canonical ownership clarification

Peter explicitly reaffirmed that TanStack Store manages the state and is where that state is read. Public properties are access paths to the store; Lit rendering/reflection is not another state owner.

The [expanded comparative probe](../alignment/evidence/state-bridge-comparison-2026-09-19.json) supports that distinction. Both minimal approaches passed nine after-update checks, but only direct accessors preserved immediate public/store agreement and kept canonical state current when rendering was gated. An unbridged raw store write still failed attribute reflection: the installed selector requests rendering without identifying which public property changed.

The shared bridge must cover store-origin changes with the appropriate named Lit notification while keeping TanStack as the sole owner. This does not require a second writable copy or justify moving state management to Lit. The exact notification mechanism remains to verify; the probe does not certify browsers, inheritance, compiler/CEM or React integration.

## Existing house helpers are the baseline

Peter reminded us that this project already has Lit/TanStack integration. Rechecking the source confirms that atomState already provides per-instance TanStack-backed getters/setters and calls requestUpdate(name, oldValue). shared/state.ts re-exports the official StoreSelector and provides lifecycle-managed StoreEffect. The installed adapter also has the existing reconnect patch and regression tests.

The recent two-pattern feasibility probe did not exercise atomState itself. It therefore cannot justify replacing that helper or creating a parallel integration. Its raw-store reflection finding concerns the unbridged write path in the fixture, not proof that the existing setter lacks named notifications.

Next, test the existing helpers with public Lit property metadata, attributes/reflection/defaults, derived values, internal/shared-atom writes and reconnect. Reuse or extend them where the evidence supports it. TanStack remains the sole state owner; no store or subscription engine is being reinvented.

Peter clarified that these helpers may be refactored, rewritten or renamed when that produces the best implementation. They must be evaluated rather than disregarded; their existence does not require preserving their current design. Compare the current implementation and its regression tests with proposed changes, preserve required behaviour, and record the evidence and reason for any replacement. This is permission to evaluate redesign, not to bypass the Phase 5 implementation gate.

The subsequent [existing-helper verification](../analysis/lit-practice-review.md#existing-state-integration-verification) reproduces two public-integration gaps in Chromium while all eleven existing regression tests pass. This is evidence for focused refinement, not permission to replace the helper without comparison or change source before migration approval.
