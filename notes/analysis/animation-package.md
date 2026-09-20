# Animation package investigation

Phase 1.5, researched 2026-09-19. **Decided by Peter: retain `@lit-labs/motion`, subject to browser verification.** The [decision](../decisions/animation-package.md) records the reasons and limits. Shared lifecycle design remains for Phases 3–5. No dependency or implementation changed.

## Existing evidence and needs

The [Book decision](../decisions/motion-on-the-book.md) already establishes that the directive can run a 3D transform through `onFrames`. It also establishes capture-before-state-change ordering and cancellation during reversal. This investigation does not reopen those findings. `src/components/book/book.ts:150` owns an AnimateController, while `collapse/collapse.ts:84` measures height manually; modal, drawer, toast, menu and tooltip retain their own enter/exit timing. Motion must cover size changes, entry, exit, interruption, reduced motion and disconnect cleanup while keeping the state styles measurable by the census.

## Compared candidates

All measurements use Bun 1.4.0, browser target, minified ESM, exporting the animation entry and the same `LitElement` baseline. This is package delivery cost, not a finished integration benchmark. The baseline is 28,330 bytes, 9,779 gzip. Exact outputs are in [package-bundles.json](../alignment/evidence/package-bundles.json).

| Candidate | Version | Bundle bytes | Gzip bytes | Integration and capability |
|---|---|---:|---:|---|
| Lit Motion | 1.1.0 | 39,102 | 12,952 | Native Lit directive/controller; before/after layout measurement, entry and exit hooks, custom frames |
| Motion mini | 13.4.0 | 38,733 | 13,604 | Small native-animation engine; needs our Lit lifecycle, size measurement and exit-retention integration |
| Motion hybrid | 13.4.0 | 85,999 | 30,471 | Adds independent transform axes, sequences and richer value types; larger than this task requires |
| Anime `animate` | 4.5.0 | 60,159 | 22,252 | Rich imperative animation; our integration must own Lit lifecycle and removal |
| Anime WAAPI | 4.5.0 | 38,689 | 14,213 | Small native-animation path; still requires the integration above |
| GSAP | 3.15.0 | 99,858 | 37,823 | Mature timeline tooling; larger cost and a separate imperative lifecycle |

Subtracting the shared baseline gives a 3,173-byte gzip increment for Lit Motion, 3,825 for Motion mini, and 4,434 for Anime WAAPI in this experiment. Compression is contextual; these are comparisons of complete probe bundles, not independent package weights that can be added to any application.

## Performance and maintenance

[Lit Motion's implementation documentation](https://github.com/lit/lit/tree/main/packages/labs/motion) describes native Web Animations with Lit-coordinated layout measurement. [Motion](https://motion.dev/docs/animate) and [Anime WAAPI](https://animejs.com/documentation/web-animation-api/) also expose native-animation paths. Engine choice alone therefore does not establish a frame-rate advantage. Avoid animating layout properties every frame, batch measurements, handle interruption, and retain the Book's proven state/capture ordering.

The npm registry reports Lit Motion's latest release on 2025-12-23; Motion on 2026-09-16; Anime on 2026-06-22; GSAP on 2026-04-13. Downloads for 2026-09-10 through 16, compared with the sampled 2025 week: Lit Motion 19,116 vs 13,742; Motion 19,198,663 vs 1,888,922; Anime 969,015 vs 294,927; GSAP 4,329,364 vs 1,029,541. [Package survey](../alignment/evidence/package-survey.json) records versions, dates and licences from the official registry and npm download API. Two weekly samples are an adoption signal, not proof that one library displaces another; these counts include other frameworks and CI.

Lit Motion still carries the Lit Labs warning about possible breaking changes or discontinued support. No investigated alternative supplied a demonstrably better maintained, smaller **Lit-native** replacement for its update-cycle and removal integration. Motion's much larger ecosystem is a real advantage if its extra capabilities become requirements; it is not evidence that this library needs them today.

## Proposed application

Use one documented lifecycle policy for cancellation, completion, disconnection and reduced motion. Let each element provide its geometry and frames. Move collapse's measured-height transitions and overlay entry/exit onto that policy, with browser tests for rapid reversals and content resizing. Keep CSS state rules as the resting source of truth for the census. Do not start an architecture rewrite before Phases 3–5 approve the shape.

Peter clarified during the review that the best long-term result decides every choice, regardless of implementation effort. Retention rests on Lit-coordinated measurement, entry/exit support, demonstrated custom frames and competitive measured delivery cost. Additional integration code is acceptable if it produces a better result; its lasting correctness and maintenance responsibilities still belong in the comparison. The shared lifecycle policy must address duplicated timing responsibilities whichever engine is used.

## Verification limits

No cross-library FPS ranking is claimed, no mobile performance trace was run, and the old extension-dependent Book hitch is not declared solved. Before implementation acceptance, test collapse resize, overlay exit retention, quick hover reversal and reduced motion in Chromium, Firefox and WebKit. Retention is selected, not proof of a comparative reliability winner. New contrary evidence can reopen the choice with Peter.

## Phase 1 extension: Material motion and shapes

Peter selected [Material spring roles with both schemes](../decisions/material-motion-system.md) and retained Lit Motion. The later [shape clarification](../decisions/shape-support.md) makes morphing specific to demonstrated house needs; it supersedes the earlier complete abstract-shape-library interpretation. No single global Standard/Expressive default was selected.

Read the supplied [motion physics](https://m3.material.io/styles/motion/overview/how-it-works), [easing/duration](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration), [transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns), [shape overview](https://m3.material.io/styles/shape/overview-principles), [corner scale](https://m3.material.io/styles/shape/corner-radius-scale) and [morphing](https://m3.material.io/styles/shape/shape-morph) main content. Interactive specification controls did not expose every value; do not invent missing parameter values.

The newer physics guidance has Standard and Expressive schemes, each with spatial/effects and fast/default/slow roles. Spatial motion can overshoot; opacity/colour effects should not. The transition-pattern page still uses legacy timing guidance. Cover container transforms, forward/back, lateral, top-level fade-through, enter/exit and skeleton/content changes without treating all pages as one identical parameter system.

The installed Lit Motion 1.1.0 has both the WAAPI animate directive and spring controllers derived from Wobble. It is not a ready-made Material motion-role implementation. Units, damping/stiffness mapping, completion, cancellation, velocity, reduced motion and lifecycle require tests.

Actual [Material Web tab implementation](https://github.com/material-components/material-web/blob/main/tabs/internal/tab.ts) measures old/new indicator rectangles, cancels previous animation and uses translate/scale with a timed 250ms transition; reduced motion uses an opacity path. Its [motion helper](https://github.com/material-components/material-web/blob/main/internal/motion/animation.ts) supplies timed easing and cancellation. This is useful source evidence, not a shipped implementation of the newer spring roles. The later control-source comparison is recorded below; final house state acceptance remains unverified.

Official geometry read: AndroidX [MaterialShapes](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt) and [Morph](https://github.com/androidx/androidx/blob/androidx-main/graphics/graphics-shapes/src/commonMain/kotlin/androidx/graphics/shapes/Morph.kt). Rounded polygons become cubic curves; feature matching and curve splitting support different shapes; progress is separate from geometry. Preserve curve closure and verify any overshoot. Material Web's latest shape-token source contains 20/32/48 additions, but its public shape guide has a narrower set and says cut corners are unsupported. Token presence does not prove abstract morphing support.

Community candidates initially inspected under the broader interpretation, and retained as background only:
- [material-shapes-ts](https://github.com/ruanspies/material-shapes-ts), npm 0.3.0, Apache-2.0, claims a 35-shape AndroidX port. Source tree and test presence were inspected; fidelity was not independently established. Its own animation driver is not approved over Lit Motion.
- [shape-morph](https://github.com/Thereallo1026/shape-morph), npm 0.4.0, MIT, master branch, optional React path; deeper implementation/fidelity evaluation pending.

No port, geometry dependency, new animation engine or concrete spring-token values were adopted. Applying shape morphs to focusable controls still needs clipping/hit-target/focus-ring tests. The later candidate probes and corrected needs-driven approach are below.

## Control state and ripple source review

Read 2026-09-19. These are source observations, not a browser comparison of completed house animations. [Peter selected optional ripples, off by default](../decisions/optional-ripples.md). This is separate from control selection/state motion and does not reopen Lit Motion or the selected Material motion roles.

### Current house controls

- Checkbox: checkbox.styles.ts:35–37 transitions the box for 200ms; checkbox.ts:87–90 renders separate check and mixed-state marks. It does not implement Material's mark morph.
- Radio: radio.styles.ts:24–26 transitions colour for 200ms; :84–95 scales the dot over 150ms.
- Switch, currently named toggle on disk: toggle.styles.ts:50–52 and :111–113 transition track colour and thumb position over 150ms. The current switch files represent the separate segmented-control concept.
- src/shared/interaction.ts supplies hover, pressed and keyboard-focus state attributes. It does not provide a ripple implementation.

### Actual Material Web implementation

- [Checkbox SCSS](https://github.com/material-components/material-web/blob/main/checkbox/internal/_checkbox.scss): separate outline, background and icon layers; selected scale moves from 0.6 to 1. Enter uses 350ms transform/50ms opacity; exit uses 150ms/50ms. Two SVG rectangles morph the check/mixed mark. Disabled and previous-disabled states set durations to zero; forced-colour rules use system colours.
- [Checkbox TypeScript](https://github.com/material-components/material-web/blob/main/checkbox/internal/checkbox.ts): tracks previous checked/indeterminate/disabled states so exit styles retain their starting form. A native input precedes the SVG for Chrome reportValidity behaviour. Form association and validation use shared behaviours. This form implementation is evidence for the existing form review, not approval to copy its submission semantics without testing.
- [Radio SCSS](https://github.com/material-components/material-web/blob/main/radio/internal/_radio.scss): 50ms fill/opacity and 300ms selected-dot growth, with disabled animation suppression and forced-colour handling.
- [Switch handle SCSS](https://github.com/material-components/material-web/blob/main/switch/internal/_handle.scss): 300ms position movement with an overshooting cubic curve; 250ms size changes, 100ms press sizing and 67ms fill. [Icon SCSS](https://github.com/material-components/material-web/blob/main/switch/internal/_icon.scss) uses 67ms fill, 33ms opacity and 167ms transform; rotation depends on available icons. Disabled states suppress these transitions.
- [Ripple TypeScript](https://github.com/material-components/material-web/blob/main/ripple/internal/ripple.ts): a separate attachable component; 450ms growth, 225ms minimum press and 150ms touch delay to distinguish scrolling. It handles pointer identity, primary-button input, cancellation, repeated presses, keyboard centring and CSS zoom. The inspected JavaScript does not itself establish a reduced-motion policy.
- [Ripple SCSS](https://github.com/material-components/material-web/blob/main/ripple/internal/_ripple.scss): independent hover and pressed layers can combine. Press uses a radial gradient with 375ms fade and 105ms entry; disabled/forced-colour states hide it. The [ripple guide](https://github.com/material-components/material-web/blob/main/docs/components/ripple.md) documents parent/for/imperative attachment, bounded/unbounded treatment, positioning and colour tokens.

These timed implementations do not prove that the newer spring roles are already shipped in Material Web. Use the control anatomy and state handling as references; verify the selected house spring mapping separately. The inspected Chakra Button recipe uses colour feedback. Only the Radix Button wrapper was inspected in this follow-up, so it does not establish a complete finding about BaseButton internals.

### Recommendation and open work

Keep selection-state animation and optional press feedback distinct in the shared design. Preserve interruption, reversal, disabled-state changes, reduced motion and cleanup. Validate keyboard focus, forced colours, hit targets and combined-state contrast. Exact durations, spring parameters, configuration scope and applicable controls belong to the later architecture/inventory review. No control animation or ripple was implemented by this research.

The [evidence record](../alignment/evidence/blue-control-review-2026-09-19.json) also records the blue choice and probe limits. The complete state/browser matrix remains required; source reading alone is not an acceptance result.

## Shared selection indicator

[Peter selected one shared active-indicator component](../decisions/shared-selection-indicator.md) for suitable single-selection groups, extending the tab-only scope without changing each control's appearance or selection rules. His later clarification places Lit Motion inside this component: it owns movement and resizing, while Tabs, Segmented Control and other suitable controls supply the selected target. Both horizontal and vertical orientations are required capabilities of the shared component. A separate indicator animation in each control is excluded. Public naming and the target/measurement interface remain for architecture review. Checkbox and multi-select controls do not use this travelling indicator. No additional Zag package is selected.

The actual [Material Web Tab](https://github.com/material-components/material-web/blob/main/tabs/internal/tab.ts) measures the previous/current indicator rectangles, cancels existing animations and applies a translate/scale animation for 250ms. Reduced motion falls back to opacity. This is timed tab-specific source, not a generic spring implementation. Current house Tabs and the segmented control (switch.ts) update selection without a shared travelling-indicator mechanism.

[Chakra's Segmented Control guide](https://chakra-ui.com/docs/components/segmented-control) exposes an Indicator part. Its recipe reads width/height/top/left variables. Ark's use-segment-group.ts uses @zag-js/radio-group with direction/root context; there was no separate @zag-js/segment-group machine at the inspected path. This is implementation evidence, not authorization to add the radio-group dependency. [Radix Segmented Control](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/segmented-control.tsx) also renders an indicator and currently uses ToggleGroup type=single. Its current source differs from the earlier plan's radio-backed characterization; the house subsequently selected [radio-based Segmented Control](../decisions/segmented-control.md), while preserving this reference difference as evidence.

Required later cases: interrupted/reversed selection, differing item sizes, font/content changes, reordered or removed items, scrolling, horizontal and vertical orientations, changes of orientation or text direction, RTL, reduced motion and cleanup. The moving visual must remain distinct from accessible selected state and keyboard focus. No shared implementation or browser acceptance ran. [Source record](../alignment/evidence/foundation-followup-2026-09-19.json).

### Shared indicator ownership and visual references

Captured 2026-09-19 during the Group review. Peter's clarification settles the animation owner: one shared active-indicator component contains the Lit Motion integration and owns movement and resizing. He also explicitly requires support for both horizontal and vertical orientations. A consuming control supplies the selected target. Its selection state, form value where applicable, keyboard behavior and focus remain with that control. TanStack Store and generated CSS remain the selected house approach.

Peter subsequently selected radio-based Segmented Control composed with Group presentation and the shared indicator. This selects ownership, not an exact public API or identical keyboard behaviour for all single-selection controls. Group supplies the arrangement; it must not silently acquire selection ownership. Checkbox and multi-select controls retain their own selected-state presentation and do not participate in a travelling indicator.

The two user attachments specify a related visual treatment:

- [Source/Output Tabs](../alignment/evidence/tabs-variant-reference-2026-09-19.png): white rounded outer surface, light outline, and an inset rounded light-gray fill behind Source. Peter requested this as an additional Tabs variant.
- [Icon Segmented Control](../alignment/evidence/segmented-control-reference-2026-09-19.png): grid/list choices in three example sizes or proportions, using the same outlined outer surface and inset selected fill. The attachment establishes the visual relationship, not exact size or radius tokens.

No variant name, default treatment, exact dimensions, dark-theme mapping or new duration was selected from these images. The [Material primary-tab treatment](../decisions/material-tab-indicator.md) remains available with its own appearance and states. The shared component must support each participating treatment without duplicating the animation implementation.

#### Source evidence and its limits

The Group investigation read Chakra's Segmented Control implementation, its style configuration, all 11 documentation examples, and the Tabs style configuration at commit `1ff9873754e9913fc3d849d23c0844a628f5f20d`. Relevant sources are [Segment Group](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/segment-group/segment-group.tsx), [Segment Group styles](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/theme/recipes/segment-group.ts), and [Tabs styles](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/theme/recipes/tabs.ts). The [Group evidence record](../alignment/evidence/group-review-2026-09-19.json) carries the complete file census, source versions and observed contracts.

The same investigation read the published Ark UI `5.39.2` Segment Group hook/root and the complete Zag `1.43.3` Radio Group connector. Ark's Segment Group is backed by Radio Group. Zag supplies indicator geometry through left/top/width/height variables and a 150ms CSS transition. That reference explains how the selected target determines the indicator bounds; it does not select Zag's runtime, state machine, CSS animation or duration for this library. House movement and resizing belong inside the shared Lit Motion component.

Ark's inspected Segment Group hook and root do not consume Field context. A documentation example placed inside Field therefore does not prove automatic group-label, help-text, error-text or invalid-state association. Those connections require an explicit contract and browser verification.

#### Dependencies before implementation

- **Field and Radio:** establish group naming, help/error association, required/disabled handling and form ownership before accepting the proposed composition.
- **Group:** preserve layout and joined-surface behavior without making Group own selection or indicator animation.
- **Tabs and Segmented Control:** establish each control's keyboard and selection contract. Keyboard focus and selected target can differ; the indicator follows selection, not focus by accident.
- **Orientation, RTL and geometry:** support both horizontal and vertical orientations. Verify changes of orientation and text direction, logical placement, scrolling, different item sizes, content/font changes, resize, removal and reorder. The target interface must handle these without per-control animation copies. Consumer-specific orientation support remains an inventory decision.
- **Motion and shape:** keep house-specific shapes, interruption/reversal, reduced motion and cleanup in the shared implementation. Determine how each visual treatment supplies its resting shape and bounds before choosing exact parameters.

These dependencies return during the Field/Group/Radio/Tabs decisions and the architecture/inventory review. Source reading and the screenshots are evidence; they are not a completed implementation or a browser acceptance result.

## Needs-driven shape evaluation

Peter clarified that we should identify our own shape-transition needs before choosing a geometry implementation. The full Material catalogue is not a required deliverable. This removes the generic geometry-package decision from the Phase 1 gate; it does not prohibit a later targeted port when the inventory demonstrates a need.

Current source and planned behaviour suggest ordinary geometry first: indicator translation/scale/dimensions; corner-radius changes where a control requires them; Switch thumb movement/size; Checkbox mark geometry; and container bounds during entry/exit. Current generated Button, Checkbox, Radio, Toggle, Tab, Drawer and Modal styles already express related radii/transforms/scale. These are representation candidates, not approval to animate every property or a completed implementation. Lit Motion's installed declarations/documentation expose keyframes, measured properties and onFrames; exact use belongs in the later design.

### Background comparison and limits

Researched material-shapes-ts 0.3.0 and shape-morph 0.4.0 in a temporary Bun installation. Both expose geometry separately from optional Vue/React bindings and their own animation helpers. Only the two packages were installed. Their own animation drivers are not selected. README/source inspection covered shape definitions and Morph algorithms, with official AndroidX MaterialShapes excerpts as a reference. No AndroidX runtime golden comparison or browser clipping/rendering test was run.

Both expose 35 named shapes. A source discrepancy is concrete: AndroidX's MaterialShapes.circle uses 10 vertices; material-shapes-ts calls Shapes.circle with its default 8; shape-morph calls createCircle(10). Matching names therefore does not prove matching geometry.

The initial probe checked finite, nonempty cubic chains and adjacent endpoint continuity at progress 0, .25, .5, .75 and 1. It stopped each pair at its first gap above 1e-6, so its frame totals are not a complete sweep. A follow-up sampled all 1,225 ordered pairs and 6,125 frames per package. Raw adjacent-cubic gaps above 1e-6 appeared in 73 and 75 pairs respectively; above .001, in 4 and 6 pairs. These gaps alone are not proof of disconnected SVG output: an SVG C command starts from the preceding endpoint, not from a separately stored cubic start.

A further sampled-area check followed that serialization rule, using 256 samples per cubic. In material-shapes-ts, Ghostish → Arch at progress 1 produced area .8128278860 versus its own target Arch's .8842320248, a relative difference of about 8.08%. In shape-morph, Ghostish → PixelTriangle had a large raw chain gap but matched its own target's sampled area to numerical precision. This distinction prevents overstating the first probe as 73/75 visibly broken morphs. Same-package endpoint comparisons still do not establish fidelity to AndroidX.

[Detailed evidence](../alignment/evidence/shape-geometry-review-2026-09-19.json) preserves versions, methods and limits. These findings remain useful if a future concrete transition needs geometry. They do not justify importing or repairing a complete catalogue now. Phase 1 closes with the needs-driven scope; specific shapes, transitions, algorithms and their acceptance fixtures belong to the inventory and implementation plan.

## M00 motion and lifetime verification, 2026-09-20

The [saved fixtures and results](../alignment/evidence/m00-completion-2026-09-20.json) pass 24 candidate assertions in each required browser. Three original failures remain as explicit red controls: Interaction retains a window press listener and active state on disconnect; removing an open Overlay leaves body scrolling locked; inline flex separators become orphan dividers at line ends.

The scratch Interaction correction owns listeners through the element's document/window and clears transient state on detach. The modal candidate uses native dialog, selected remove-scroll and actual Lit Motion. It retains modality during its own exit, cancels exit on reopen, releases immediately on removal and ignores unrelated child animation lifetime. Resting styles plus fill:none avoid retaining finished animation effects.

The shared indicator contains Lit Motion and one stable TanStack atom for derived geometry. Both axes, movement/resizing, intermediate painted rectangles, interruption within 1px, resize, reduced motion, target removal and owner removal pass. Ignore unchanged ResizeObserver measurements; capture the painted rectangle before cancellation. A microtask lets cancelled-directive completion bookkeeping settle before applying new derived geometry in the tested WebKit reversal. Semantic selection remains with the consumer.

The fixture's 400ms linear timing is a deterministic test instrument, not a new house duration or replacement for approved spring roles. Final spring-role mapping, nested/anchored overlays, all indicator geometry cases and accessibility/visual acceptance remain implementation checks. The probes establish the selected stack's representative feasibility without adding an animation engine.
