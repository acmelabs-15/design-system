Decided 2026-09-19 by Peter.

# Convert compiled CSS into generated Lit style modules

Keep generator-owned sources authoritative. Compile their CSS, then emit generated Lit style modules as a component delivery format. Peter selected this direction after the Material Web, Spectrum and Web Awesome comparison, saying “Great, then let's go with that direction.”

Produce document tokens, approved global/recipe styles, property registrations and metadata from the appropriate source records through explicit output paths. Do not recover those outputs by reverse-parsing generated Lit TypeScript. Shared sources do not imply identical shadow and document stylesheets; selector scope and component-only behaviour require deliberate treatment.

The evidence supports this architecture for the house's existing outputs, not a claim of universal community preference or measured performance superiority. Material and both Spectrum generations demonstrate compiled CSS feeding Lit modules; Web Awesome supplies a contrasting authored-Lit model. Representative published artifacts and a five-case in-memory converter probe support the transformation's feasibility.

This selection does not adopt Sass, Vite, Lightning CSS, Spectrum plugins or a new runtime styling engine. The Bun requirement, generator ownership and [committed generated-style location](generated-style-location.md) stand. Exact compiler/minifier, output metadata, registration delivery and source-map policy remain design and verification work.

Before implementation approval, verify representative house styles, escaping, scope conversion, registration defaults/inheritance and conflicts, deterministic output, invalid-input failures, selective imports and useful source maps. Test rendered outcomes in Chromium, Firefox and WebKit. The inspected upstream source maps do not prove continuous authored-CSS debugging; no full house build/browser acceptance is claimed.

Evidence: [completed comparison](../analysis/repository-layout.md#completed-bounded-style-pipeline-comparison), [artifact and probe record](../alignment/evidence/style-pipeline-comparison-2026-09-19.json), [Phase 3 review](../alignment/phase-3-review.md).
