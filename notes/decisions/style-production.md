Decided 2026-09-19 by Peter.

# Convert compiled CSS into generated Lit style modules

Keep generator-owned sources authoritative. Compile their CSS, then emit generated Lit style modules as a component delivery format. Peter selected this direction after the Material Web, Spectrum and Web Awesome comparison, saying “Great, then let's go with that direction.”

Produce document tokens, approved global/recipe styles, property registrations and metadata from the appropriate source records through explicit output paths. Do not recover those outputs by reverse-parsing generated Lit TypeScript. Shared sources do not imply identical shadow and document stylesheets; selector scope and component-only behaviour require deliberate treatment.

The evidence supports this architecture for the house's existing outputs, not a claim of universal community preference or measured performance superiority. Material and both Spectrum generations demonstrate compiled CSS feeding Lit modules; Web Awesome supplies a contrasting authored-Lit model. Representative published artifacts and a five-case in-memory converter probe support the transformation's feasibility.

The original direction did not select Sass, Vite, Lightning CSS, Spectrum plugins or a new runtime styling engine; the later compiler selection below now governs Lightning CSS. The Bun requirement, generator ownership and [committed generated-style location](generated-style-location.md) stand. Exact compiler/minifier, output metadata, registration delivery and source-map policy remain design and verification work.

Before implementation approval, verify representative house styles, escaping, scope conversion, registration defaults/inheritance and conflicts, deterministic output, invalid-input failures, selective imports and useful source maps. Test rendered outcomes in Chromium, Firefox and WebKit. The inspected upstream source maps do not prove continuous authored-CSS debugging; no full house build/browser acceptance is claimed.

Evidence: [completed comparison](../analysis/repository-layout.md#completed-bounded-style-pipeline-comparison), [artifact and probe record](../alignment/evidence/style-pipeline-comparison-2026-09-19.json), [Phase 3 review](../alignment/phase-3-review.md).

## Migration approval with technical prerequisites

On 2026-09-20 Peter [approved the migration plan](migration-approval.md). The technical checks above remain prerequisites for dependent source edits; they do not require another approval of the same migration plan. [M00 evidence](../alignment/evidence/m00-prerequisites-2026-09-20.json) now includes a three-engine candidate. At that evidence checkpoint Lightning CSS was a candidate; Peter's subsequent selection is recorded below. The later [M00 completion evidence](../alignment/evidence/m00-completion-2026-09-20.json) verifies useful CSS debugger maps through the actual generated Lit/minified-bundle path; the subsequent compiler selection closes that prerequisite.

## Compiler selected, 2026-09-20

Peter chose option A: add Lightning CSS 1.33.0 as a build-only dependency, close M00 and begin the approved migration. Bun remains the JavaScript runtime and bundler. Consumers gain no Lightning CSS runtime dependency.

Bun 1.4.0 and 1.4.2 omitted CSS maps in the tested modes. Lightning CSS provides the parsed CSS interface and maps required by the approved output architecture; representative browser/map delivery and all 167 current CSS outputs pass after the demonstrated generator correction. esbuild offers CSS compilation/maps but requires a separate parser for the registration analysis. [Comparison and checks](../analysis/repository-layout.md#m00-compiler-map-and-package-conclusions-2026-09-20).

Pin 1.33.0 initially. Generated output, registration validation and maps still ship through the house generator; this does not introduce a second runtime styling system. M00 is closed at its representative prerequisite boundary. Final family, accessibility, visual and real release-environment acceptance remain assigned in the approved migration.
