# Convert compiled CSS into generated Lit style modules

Keep generator-owned sources authoritative. Compile their CSS, then emit generated Lit style modules as a component delivery format. Peter selected this direction after the Material Web, Spectrum and Web Awesome comparison, saying “Great, then let's go with that direction.”

Decided 2026-09-19 by Peter.

Produce document tokens, approved global/recipe styles, property registrations and metadata from the appropriate source records through explicit output paths. Do not recover those outputs by reverse-parsing generated Lit TypeScript. Shared sources do not imply identical shadow and document stylesheets; selector scope and component-only behaviour require deliberate treatment.

The evidence supports this architecture for the existing outputs, not a claim of universal community preference or measured performance superiority. Material and both Spectrum generations demonstrate compiled CSS feeding Lit modules; Web Awesome supplies a contrasting authored-Lit model. Representative published artifacts and a five-case in-memory converter probe support the transformation's feasibility.

The original direction did not select Sass, Vite, Lightning CSS, Spectrum plugins or a new runtime styling engine; the later compiler selection below now governs Lightning CSS. The Bun requirement, generator ownership and [committed generated-style location](0044-generated-style-location.md) stand. At the initial decision, exact compiler/minifier, output metadata, registration delivery and source-map policy remained design and verification work. Later compiler and prerequisite results are recorded below.

Initial acceptance required representative styles, escaping, scope conversion, registration defaults/inheritance and conflicts, deterministic output, invalid-input failures, selective imports and useful source maps, with rendered outcomes in Chromium, Firefox and WebKit. The inspected upstream maps did not prove continuous authored-CSS debugging; the initial probe did not claim full build/browser acceptance.

Evidence: [completed comparison](../research/18-repository-layout.md#completed-bounded-style-pipeline-comparison), [artifact and probe record](../verification/systematization/style-pipeline-comparison-2026-09-19.json), [Phase 3 review](../history/systematization/architecture-review.md).

## Migration approval with technical prerequisites

On 2026-09-20 Peter [approved the migration plan](0064-migration-approval.md). The technical checks above remained prerequisites for dependent source edits within that migration, without another approval of the same plan. [M00 evidence](../verification/systematization/m00-prerequisites-2026-09-20.json) now includes a three-engine candidate. At that evidence checkpoint Lightning CSS was a candidate; Peter's subsequent selection is recorded below. The later [M00 completion evidence](../verification/systematization/m00-completion-2026-09-20.json) verifies useful CSS debugger maps through the actual generated Lit/minified-bundle path; the subsequent compiler selection closes that prerequisite.

## Compiler selected, 2026-09-20

Peter chose option A: add Lightning CSS 1.33.0 as a build-only dependency, close M00 and begin the approved migration. Bun remains the JavaScript runtime and bundler. Consumers gain no Lightning CSS runtime dependency.

Bun 1.4.0 and 1.4.2 omitted CSS maps in the tested modes. Lightning CSS provides the parsed CSS interface and maps required by the approved output architecture; representative browser/map delivery and all 167 current CSS outputs pass after the demonstrated generator correction. esbuild offers CSS compilation/maps but requires a separate parser for the registration analysis. [Comparison and checks](../research/18-repository-layout.md#m00-compiler-map-and-package-conclusions-2026-09-20).

The initial selection pinned 1.33.0. Generated output, registration validation and maps ship through the generator; this does not introduce a second runtime styling system. M00 closed at its representative prerequisite boundary. Final family, accessibility, visual and real release-environment acceptance remained separate work. The later [release record](../releases/0.3.0.md) records that scope; current versions belong to the manifests and lockfile.
