# Lit practice review

Current-pass update: the dated section at the end records fresh 2026-09-19 measurements. Historical counts below are not current task counts.

Researched 2026-09-10 against lit.dev and the installed packages, then every actionable claim was
checked against this repository before being written down. Linked from `PLAN.md`.

Peter's prompt was the `cache` directive: are we leveraging Lit's own mechanisms where they would help?
The honest answer is that `cache` is not the gap. Four other things are.

## Checked against our code, and NOT a problem here

Recorded so nobody re-investigates:

| Claim | Reality here |
|---|---|
| `delegatesFocus` combined with a roving-tabindex controller is a focus bug | **Does not apply.** choicebox, menu and tabs use `RovingTabindex`; none sets `delegatesFocus`. |
| The Lit template compiler may not run under a Bun build | **It runs.** `scripts/build.ts` drives the TypeScript transpiler directly with `compileLitTemplates()` as a `before` transformer, so Bun's bundler is not involved. The build reports 129 modules with compiled templates. |
| `match-sorter` drags in a Babel runtime | **Does not apply.** Ours is hand-written in `src/shared/match-sorter.ts` with no imports. |
| Form controls are not form-associated | **Already correct.** Every one declares `formAssociated`, and 14 files use `ElementInternals`. |
| Elements lack typed tag declarations | **Already correct.** All 151 declare `HTMLElementTagNameMap`. |

## Found, fixed already

**Reflected defaults wrote attributes nobody set.** Lit reflects a property on first render, default
included, so `acme-sheet` wrote `side="right"` and `acme-entity` wrote `as="li"` onto bare hosts. Wrong
twice: the consumer's markup gains an attribute they never wrote, and the census reads selectors against
the host, so a spurious attribute can change what a rule matches. Both now declare `useDefault: true`,
with a regression test in `src/shared/__tests__/reflect.test.ts`.

## Real gaps, in value order

### 1. No custom-elements manifest — the highest-leverage missing piece

We ship 151 elements with no `custom-elements.json`. Generating one with the standard analyser and
pointing `package.json#customElements` at it gives every consumer editor autocomplete, attribute
documentation and type hints. Every major web-component library ships one. It is driven from JSDoc tags
we would add anyway: `@slot`, `@csspart`, `@cssprop`, `@fires`, `@attr`.

### 2. `sideEffects: true` blocks tree-shaking

Ours is a blanket `true`, which tells a bundler nothing can be dropped. A blanket `false` would be an
outright bug, because registering a custom element **is** a side effect. The correct shape lists the
registering modules while leaving pure class modules shakeable. Worth pairing with the packaging linters
that check an `exports` map and its types.

### 3. `:state()` instead of reflecting for styling

We reflect 94 properties. Some of those reflect only so CSS can select them. Custom state selectors are
the modern mechanism for that and keep the attribute surface clean. Audit which of the 94 exist purely
for styling and move those.

### 4. Only four directives across 151 elements

We import `styleMap`, `classMap`, `unsafeHTML` and `repeat`. That is a thin slice of the 21 available.
The useful ones for us, with when they earn their place:

| Directive | Earns it | The mistake |
|---|---|---|
| `ifDefined` | Omitting `href`/`src` rather than emitting an empty one | With several expressions in one attribute, the whole attribute drops if any is nullish |
| `live` | A value that changes outside Lit, such as a native input's `.value` | Using it when we own the value |
| `ref` | Imperative handles: focus, measurement | Reading it in `render()` instead of `updated()` |
| `keyed` | Forcing teardown so stale state clears | Confusing it with `repeat` keys |
| `cache` | A container toggling repeatedly between a few *heavy* subtrees | There is **no eviction**: every template ever rendered at that position is retained. Wrong for one-shot switches |
| `guard` | Skipping expensive work behind an immutable reference | With a mutable array the reference never changes and updates are silently dropped |

On `repeat` versus `.map()`: `repeat` earns its place only when items **reorder** *and* rows hold DOM
state that must travel with them, such as focus or an open dropdown. Otherwise `.map()` is smaller and
faster. Reaching for `repeat` reflexively "for performance" costs a key map and buys nothing.

Two traps to avoid entirely: `unsafeHTML` on a public property is a cross-site-scripting hazard for
every consumer, and static expressions cache every unique value permanently, so dynamic tag names leak.

## Corrections to common assumptions, verified

- **There is no Lit 4.** Current is 3.3.3. No labs package has graduated since October 2023.
- **The template compiler is the lowest maturity tier**, labelled prototyping, and we ship it in
  production. It works and the gains are real, so keep it — but pin the TypeScript version and make sure
  tests exercise compiled output, because compiled and uncompiled templates take different code paths.
- **Scoped registries shipped natively** in Safari 26 and Chrome 146, but not Firefox, and Lit core does
  not use the native API yet. Our decision to defer them until after the port stands, and the reason is
  now stronger: the labs package's own documentation is stale on browser support.
- **Signals are still an early-stage proposal**, not near standardisation. Keeping them out of our public
  surface was right, and we have now removed the last unused import.
- **`@lit-labs/forms` exists at version 0.1.0** with a single release. Our own `ElementInternals` usage is
  the safer path; it is a well-specified platform API and that package is the least proven thing here.

## Accessibility: our current approach is right

We set ARIA on inner elements rather than through `ElementInternals`. Distinguish two scope rules:
plain identifier-reference attributes resolve within the same tree; reflected element-reference
properties can reach the same tree or a parent tree. An outside element's reference into a child
shadow root remains a separate problem; out-of-scope references can be silently dropped. Use `ElementInternals` for host-level
role and state defaults; keep relationship attributes on inner elements. Revisit when the reference-target
mechanism ships across engines.

## What to do, and in what order

1. Generate the custom-elements manifest and wire it into the package.
2. Fix `sideEffects` to list registering modules.
3. Audit the 94 reflected properties: add `useDefault` where a default exists, move styling-only ones to
   custom state selectors.
4. Adopt `ifDefined` where we emit possibly-empty attributes, and `live` where a native value can change
   outside Lit. Leave `cache` alone unless a container proves it needs it.

## Accessibility: the evidence for keeping our approach

Researched separately and in depth, including empirical checks in a current browser. The conclusion is
stronger than "our approach is acceptable": **migrating to host-level ARIA would be a step backward.**

What the three leading web-component design systems actually do, read from their source: all three put
ARIA on inner shadow-DOM elements. None uses `ElementInternals` for ARIA generally. They use it for form
association and custom states, which is exactly what we use it for.

Three reasons a migration would hurt, each verified:

1. **It breaks the role and value pairing.** A textbox or combobox exposes a live value. Put the role on
   the host while the editable control stays in the shadow DOM, and the value and the role sit on
   different nodes, so the accessible value stops tracking the control.
2. **Our own tests could not read back what they assert.** Host ARIA set through internals is invisible to
   DOM inspection: reading the attribute returns nothing while the internal value is set. There is still
   no standard way to query it, and the proposal to add one is open.
3. **It does not solve the problem that motivates it.** An identifier reference still cannot cross into a
   shadow root. Element reflection, which is broadly available, works **outward** only: a component can
   label itself from slotted light DOM, but an outside label cannot reach in. Setting it that way fails
   *silently*, reading back as empty.

So the shape to adopt:

| Case | Mechanism |
|---|---|
| Relationship attributes within one shadow root | Keep them on inner elements. Plain identifier references work there. |
| A component labelling itself from slotted light DOM | Element reflection. Broadly available and works in that direction. |
| Host role for something with no live value and no native element surrendered | `ElementInternals` is reasonable here, and only here. |
| An outside label reaching into a shadow root | Wait. The reference-target mechanism is the real fix, unflagged in one engine only and behind flags elsewhere. Design for it; do not depend on it. |

One practical note: accessibility rule checkers produced false positives on elements using internals ARIA
until a recent version. If we adopt any of it, pin a current checker.

**On `delegatesFocus`:** correct for a single-control wrapper, wrong for a composite or anything with a
roving tabindex. We already have that right — no element combines it with the roving controller. The one
trap to avoid is pairing it with a host `tabindex`, which creates two tab stops where there should be one.

### Primitive naming and scope check, 2026-09-20

The [standalone primitive probe](../alignment/evidence/primitive-semantics-probe-2026-09-20.html) distinguishes these mechanisms in Chrome 153. An inner native h2 with slotted text exposes level 2. A host-only aria-label names a separate generic node without renaming that heading; copying it to both produces two named accessibility nodes. An inner section's aria-labelledby string fails to resolve an outside ID, while assigning the outside element through ariaLabelledByElements produces a region named from that element. These are DOM/accessibility-tree observations, not actual screen-reader speech or an all-engine result.

This outward reference from an inner element to a parent-scope label is available; it must not be confused with the outside-to-inner reference-target problem above. [MDN documents both scope rules](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes#reflected_element_references). The naming vote selects ordinary aria-label, aria-labelledby and aria-describedby inputs with shared forwarding to the inner semantic element. Define lifecycle, removal, changes to referenced nodes and descriptions against the actual API; the probe only exercises a static name reference.

The complete Material Web internal/aria/delegate.ts and aria.ts at 56a486b147b8b7e95e6e8035fa02aed7e0009a85 were inspected. Its helper shifts supported scalar ARIA attributes into data attributes and overrides attribute/property access to avoid duplicate host/inner announcements. It explicitly lacks ID-reference support. Do not treat its storage or method overrides as a selected implementation. Preserve canonical house state, deliberate property metadata and component-specific semantics; verify the forwarding mechanism in all three engines before approving the affected interfaces. [Decision](../decisions/additional-component-capabilities.md#text-tag-set-and-standard-accessible-naming), [source and probe record](../alignment/evidence/primitive-interfaces-review-2026-09-20.json).

## Systematization recheck, 2026-09-19

The AST baseline now finds 150 registered elements and no actual Lit `@state` declarations. Local state uses 129 `@atomState` declarations in 52 files. The older migration count is obsolete. See [codebase-systematization.md](codebase-systematization.md) for the method and limits.

Two current defects directly affect interface predictability:

- `docs-src/api.ts:45` assumes kebab-case default attributes. [Lit specifies lowercase property names](https://lit.dev/docs/components/properties/#observed-attributes). Comparing against the runtime confirms one wrong entry: `acme-stat.meterLabel` is documented as `meter-label` but observes `meterlabel`.
- `docs-src/api.ts:33` reads each class in isolation. The same runtime comparison finds 32 missing properties, across menu-button, search, and multi-select. A manifest or replacement extractor must preserve inheritance and accessors, not merely reproduce the current tables.

The copy button's derived store also fails to follow its plain Lit `copied` property after initial rendering. This is now confirmed in both happy-dom and isolated Chrome 153. This identifies a gap between the two reactive systems; it is not evidence against the chosen state package. Validate the bridge and test property transitions when designing the shared state pattern.

Official Lit publishing guidance was read on 2026-09-19: <https://lit.dev/docs/tools/publishing/>. It supports publishing unbundled modules, declarations, and tag-name types, with CDN bundles kept distinct. It also recommends explicit file extensions in import specifiers. The existing build's unbundled/CDN split is therefore useful infrastructure to preserve while investigating entry-point size and registration effects.

## Phase 1.2 conclusions

Walkthrough decisions, 2026-09-19: Peter selected the [standard manifest analyzer](../decisions/custom-elements-manifest.md) and [required Chromium, Firefox and WebKit checks](../decisions/browser-verification.md). The source-code freeze still applies.

**Recommendation: fix contract metadata and native form/state behaviour before adopting more framework mechanisms.** Keep the controllers and shared stylesheet objects already working here.

| Mechanism | Current evidence | Recommendation and cost |
|---|---|---|
| Reactive controllers | Interaction, Places, state adapters and RovingTabindex already use them | Consolidate common lifecycle ownership; each controller must reconnect, clean up and avoid duplicate state |
| Directives | Form binding is an AsyncDirective; Book uses animate; templates use classMap/styleMap/repeat/unsafeHTML | Use live for native values that change outside Lit when the approved contract needs it; ref/ifDefined where they remove actual ambiguity. Do not adopt cache or repeat merely to increase directive count |
| ElementInternals/form association | 13 declarations; Input reset and FormData work in Chrome, but required validity and fieldset-disabled forwarding are incomplete | Standardize value, validity, reset, disabled state and event propagation in the form-control contract; keep TanStack Form as the higher-level form library |
| CustomStateSet | No `.states.add/delete/has` calls found in current source | Use for genuinely private styling state after mapping/census support is designed; preserve public reflected attributes that consumers depend on |
| Scoped registries | The agreed pre-1.0 adoption remains; MDN BCD lists constructor support in Chrome 146, Safari 26 and Firefox preview | Keep the fallback decision explicit and inventory composition dependencies before implementation |
| SSR | Bare import succeeds; compiled rendering fails in the controlled experiment, and Fieldset initializes MutationObserver without a guard | Do not claim SSR-ready. If required, provide a compatible server build and lifecycle/hydration tests |
| Manifest | Current custom extractor misses 32 runtime properties and one attribute name | Generate a standard CEM, compare it against runtime metadata, and annotate slots/events/parts/properties; use it for both docs and agent references |
| Testing | 608 passing tests; happy-dom lacks attachInternals, CustomStateSet and layout | Keep Bun's unit tier and add real-browser fixtures for the missing platform behaviour; unit success is not behaviour parity |

The [controller lifecycle](https://lit.dev/docs/composition/controllers/) explicitly supports connect/disconnect and before/after update ownership. [Property documentation](https://lit.dev/docs/components/properties/) distinguishes input attributes from optional reflection and recommends `useDefault` where appropriate. The source scan still finds only two `useDefault` occurrences against 95 reflected-property occurrences; audit intent, not just the count.

[MDN compatibility data for :state](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/state.json) gives Chrome 125, Firefox 126 and Safari 17.4 for the current selector syntax. The older Chrome 90 CustomStateSet API entry does not mean `:state()` itself worked then. [Registry data](https://github.com/mdn/browser-compat-data/blob/main/api/CustomElementRegistry.json) still distinguishes stable support from Firefox preview. Check the selected support floor before relying on either.

[ElementInternals.setValidity](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/setValidity) is the explicit form-validity channel. Rendering a required native input inside a shadow tree is not enough to give its custom-element host the same validity. The browser fixture demonstrates that gap here; Select already forwards a subset of validity at `select.ts:134`, so the current shapes differ within one control family.

The [CEM analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/) supports Lit and inheritance linking, while still requiring JSDoc for slots and styling hooks. Web Awesome, Spectrum and Nord publish manifests; Material uses Lit's analyzer. Recommend the standard analyzer as a development dependency, subject to Peter's package decision and a representative-output check.

The browser tier should use Bun orchestration with a browser driver initially, preserving the project's runtime rule. Spectrum's browser/Vitest setup is useful precedent, not authorization to replace Bun with Vitest. No new test framework is needed merely to reproduce the existing defects. The full browser matrix and assistive-technology checks remain acceptance work for the later implementation.

The current docs app still contains four `@state()` fields (`docs-src/app/docs-app.ts`), outside the source-only count. Include these in the TanStack integration work because the standing state rule applies throughout the project.

## Phase 1 extension: React and forms

Captured 2026-09-19. Peter selected [a separate React package](../decisions/react-integration.md), [native forms plus optional TanStack Form](../decisions/native-and-managed-forms.md), and [no server rendering](../decisions/server-rendering.md).

### React

The [Lit React guide](https://lit.dev/docs/frameworks/react/) motivates createComponent wrappers, but its blanket limitations on React properties/events need qualification: [React 19 custom-element support](https://react.dev/blog/2024/12/05/react-19#support-for-custom-elements) and the [React custom HTML element reference](https://react.dev/reference/react-dom/components#custom-html-elements) support properties and custom events with exact event naming/case. Wrappers still provide typed JSX and ergonomic event mapping.

Inspected @lit/react create-component source: reserved props, prototype-based property detection, property/listener synchronization and cleanup. Registry snapshots: @lit/react 1.0.8 and @lit-labs/gen-wrapper-react 0.3.5. The latter brings its own Lit analyzer; it must not replace the approved CEM analyzer silently. [Web Awesome's generator](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/scripts/make-react.js) provides a CEM-based precedent.

React children still need real DOM elements to carry slot attributes. Do not copy a display:contents workaround against our wrapper-box rule. No React runtime integration or JSX table-cell rendering was proven in this extension.

Later clarification: [Table is a consumer integration target](../decisions/tanstack-table-compatibility.md), not a house TanStack Table adapter. The application renders its own headers, rows and cells, using React for React content and Lit for Lit content. The required verification is that the house structure preserves that framework ownership, context, identity, event handling, element access and cleanup. A React-to-Lit cell-renderer bridge is not selected. TanStack Virtual is explicitly required for virtualization in both framework paths.

### Forms

src/shared/form.ts exports the existing TanStackFormController and bindField helper. The directive maps values/checked, touched/invalid errors, input/change/blur and connection cleanup. This is limited integration, not proof of full managed-form support.

Source inspection found setFormValue updates in the Input update cycle and gaps in validity/fieldset-disabled/state-restoration callbacks. Earlier Chrome probes showed that an empty required inner input could be invalid while the containing form was valid; disabled-fieldset behaviour did not reach the inner control. Input reset/FormData restoration worked in that probe. Do not describe declaring formAssociated alone as a complete native-form contract.

Material Web's actual [form-associated behaviour](https://github.com/material-components/material-web/blob/main/labs/behaviors/form-associated.ts) and [constraint-validation behaviour](https://github.com/material-components/material-web/blob/main/labs/behaviors/constraint-validation.ts) were read: synchronous name/disabled/value handling and validity callbacks are useful implementation references. Chakra's Input uses Ark Field; Radix TextField renders a native input. Those wrappers do not directly solve custom-element form association.

TanStack snapshots: form-core/react-form 1.33.5, lit-form 1.25.5, with its separate lit-store dependency. [Lit quick start](https://tanstack.com/form/latest/docs/framework/lit/quick-start), [validation](https://tanstack.com/form/latest/docs/framework/lit/guides/validation), [arrays](https://tanstack.com/form/latest/docs/framework/react/guides/arrays), [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) and [native validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) informed the comparison.

Acceptance must cover form values, serialization, validation, disabled state, reset/restoration and synchronous event/FormData consistency, plus nested/array fields, async validation and submission in managed mode. Shared native-form ownership is now selected in [native-form-architecture.md](../decisions/native-form-architecture.md). Exact control-specific rules and interfaces remain inventory work.

## Phase 3 state and form mechanism follow-up

The [expanded state-bridge comparison](../alignment/evidence/state-bridge-comparison-2026-09-19.json) runs the same fixtures against canonical-store accessors and a willUpdate copying bridge. Each passes nine post-update checks for defaults, explicit same-default reflection, number/boolean conversion, attribute removal, object identity, named change reporting through the property path and reconnect. Direct accessors additionally preserve synchronous agreement and state updates when shouldUpdate rejects rendering. Raw store-only changes without named Lit notification do not reflect attributes; render notification alone is not a public-property contract.

Peter reaffirmed canonical TanStack ownership. This rules out treating a Lit property as an independently authoritative mutable value and periodically copying it into the store. The remaining problem is complete notification/metadata integration, not which system owns state. Tests are Bun/happy-dom, not browser acceptance.

The installed-source audit found additional obligations: subclass metadata can replace or preserve accessors in different ways; preserved wrappers can capture base options; base initializers run before subclass private fields; pre-upgrade properties replay after defaults/attributes; useDefault has equal-value reflection rules; selector updates do not populate named change sets; and overriding Lit's property factories is deprecated in the installed implementation. Keep normal Lit declarations. CEM source recognizes standard property decorators/static declarations and getter/setter pairs; that is not a completed manifest run.

A parallel native-form comparison read fourteen complete Material/Web Awesome source files. Material uses ElementInternals/form/validation mixins and synchronous form-value updates; Web Awesome uses a specialised base plus validators and generally synchronizes during willUpdate. Radio ownership differs: Material associates each Radio, while Web Awesome's Radio Group owns submission and individual Radio submission is suppressed. These are concrete alternatives, not proof of one universal mechanism.

A controller still needs native callback/static/property bridges; Lit lifecycle hooks alone do not receive all form callbacks. Compare mechanisms through immediate FormData/validity after assignment, current/default/reset/restoration, disabled fieldsets and first-legend exceptions, external form ownership, one composite submission, changed/nested radio collections, RTL, cross-shadow Field labels and optional TanStack Form. Reference focus/label patterns do not certify arbitrary external Field-to-shadow-control associations. No native-form mechanism or implementation has been selected by this follow-up.

## Existing state integration verification

The existing atomState helper was imported unchanged into the public-property probe. Its existing regression suite and adapter-reconnection tests passed: eleven tests and twenty-five assertions. [Reproducible fixture and results](../alignment/evidence/existing-state-integration-2026-09-19.json).

The same twelve public-integration checks ran in happy-dom and Chromium using installed Lit 3.3.3 / ReactiveElement 2.1.2 and patched @tanstack/lit-store 0.13.2. Ten passed in both: synchronous canonical/derived state, named notifications through the property setter, conversions, explicit same-default reflection, attribute removal, gated rendering, detached property writes/reconnection, shared writes through the accessor and an inherited metadata case.

Two failures reproduced in Chromium:

- With the tested static declarations (noAccessor/reflect/useDefault), default count/value attributes appear initially when the contract expects them absent.
- An external shared-atom write updates rendering and the public getter, but the reflected attribute remains at its previous value and changedProperties is empty.

These are public-integration gaps, not proof that the helper's existing internal-state use is broken. Lit marks existing accessors as wrapped and treats their initial default capture specially; the helper's constructor-time named notification interacts with that path. For external atom writes, the installed selector requests rendering without a property name, whereas the helper's setter supplies the named notification. Both mechanisms need deliberate integration; a second state owner is not a solution.

The current published @tanstack/lit-store 0.14.1 archive was also inspected in memory with its integrity verified. Its complete exports/selector/atom sources add selector.value but still contain unnamed render notification and no hostConnected hook in the selector. No upgrade was installed, and no resolution of these integration gaps or the reconnect requirement is inferred merely from its newer version.

The evidence supports evaluating a focused refactor or rewrite of the existing helper rather than discarding it. It does not yet select the final mechanism. Remaining checks include initialization/upgrade timing, full inherited metadata, converters/equality/batching, internal and shared writes, CEM/compiler/React compatibility and Firefox/WebKit. No production source was changed.

### Focused state-helper refinement

A scratch copy now retains atomState's TanStack accessors and the official TanStackStoreAtom. It adds a lifecycle-managed named notification for external atom writes, reconciles changes on reconnection, and captures the initial shared value before consumer assignments. Public declarations use ordinary Lit property metadata registered before the atom accessor is installed. This uses public APIs; it does not read or change Lit's private default-value fields.

The [saved candidate and fixture](../alignment/evidence/existing-state-integration-2026-09-19.json) pass 24 targeted cases in both happy-dom and Chromium. The eleven existing regression tests also pass when copied into scratch with only the helper import redirected. Strict type checking of the candidate helper passes. The initial type check caught overloaded setter forwarding; the candidate now explicitly distinguishes updater functions from values, without suppressing the error.

The expanded cases cover assignments before connection, pre-definition property replay, preserving defaults after those assignments, external changes while detached, first connection after a shared change, NaN, signed zero, batching, and subclass attribute/converter changes. A control using only the revised declarations and the unchanged helper passes 19 of 24 cases. Declaration order resolves local initial reflection, but shared default capture and external-change notification also need the helper refinement.

This closes the bounded feasibility question: the existing integration can be extended without a second state owner or a replacement store engine. It is not final approval of this exact decorator API. The paired decorators are order-sensitive, and the prototype adds a named-notification subscription alongside the official render subscription. Authoring enforcement or improved composition, subscription/teardown costs, CEM output, the actual compiler pipeline, React wrappers and Firefox/WebKit remain explicit acceptance work before migration approval. Native-form evaluation can proceed against the synchronous canonical-state requirement without waiting for a final decorator spelling.

## Native form timing and callback probe

The [reproducible Chromium comparison](../alignment/evidence/native-form-mechanism-2026-09-19.json) holds the text control, TanStack state, native callback bridge and validation rule constant. It varies when ElementInternals receives the state: immediately on change or during Lit's update cycle. Immediate synchronization passes all fifteen checks. Render-cycle synchronization passes nine and fails six: immediate submission, required validity, clearing invalidity, a gated render, reset submission and the explicitly invoked restoration callback.

Both variants pass the after-update disabled-fieldset cases, including re-enabling, retaining a control's own disabled attribute and the first-legend exception. They also pass external form ownership, immediate name changes, reconnection and one submission despite the inner native input. The scratch controller receives form-associated, disabled, reset and restoration callbacks through a small host mixin. This establishes callback composition feasibility; it does not establish superiority over every specialised form base.

The result supports a specific module requirement: synchronize native submission and validity when canonical state changes, independently of rendering. Keep the browser's effective disabled state distinct from the control's own disabled attribute. Forward native callbacks through one deliberate host bridge; ordinary Lit controller hooks cannot replace them. Each control still supplies its serialization, restoration and validation rules.

The existing Input updates setFormValue in updated and has no inspected native disabled/restoration callback or validity mirroring. The earlier complete Material Web and Web Awesome source comparison supplies actual Lit references for different internal packaging. Chakra and Radix native-input wrappers and the already-reviewed Pro form compositions inform consumer composition, but they do not supply custom-element callbacks. The render-cycle fixture is a timing control, not a test of Web Awesome itself.

This is a text-control mechanism probe, not certification of forms. The restoration check calls the callback explicitly; browser history/autofill was not exercised. Checkbox/radio/compound values, submitters, reportValidity focus, cross-shadow Field associations, optional TanStack Form, React and Firefox/WebKit remain required before migration approval. No final controller/base/mixin interface is selected by this result.

### Style declaration order follow-up, 2026-09-20

The shared style-property review selects [Chakra declaration-order behaviour](../decisions/layout-spacing-properties.md#declaration-order-for-overlapping-properties) within a responsive condition. That is not automatically the order in which values most recently changed. Existing value/notification probe successes do not establish preservation of style declaration order.

Installed ReactiveElement source at node_modules/@lit/reactive-element/development/reactive-element.js:535–553 saves own properties set before upgrade by iterating constructor.elementProperties.keys(); lines 859–865 replay the resulting Map. The input values survive, but that traversal does not recover the author's original property order. This began as a source finding; the subsequent browser probe below reproduces the issue.

Before completing the shared style interface, define declaration order for static HTML, Lit and React, plus later updates, removal/re-addition and pre-definition writes. Evaluate the existing state helpers and registration/wrapper paths against that contract. Do not silently lower the requirement or assume a setter callback sequence supplies the missing information. If evidence requires a changed public contract, return that change to Peter. [Probe and source record](../alignment/evidence/shared-style-values-review-2026-09-20.json).

### Declaration-order browser comparison

The [saved in-memory fixture and results](../alignment/evidence/declaration-order-probe-2026-09-20.json) use installed Lit 3.3.3, ReactiveElement 2.1.2 and patched @tanstack/lit-store 0.13.2, importing the unchanged house atomState. The first virtual-module build used the wrong decorator emission mode and failed before the checks ran. The fixture was then transpiled with the repository's legacy-decorator/class-field settings and bundled in memory. No source or dependency file changed; this was not a strict type check or the production Lit-template compiler pipeline.

In Chrome 153, the baseline's thirteen checks include four failed assertions covering two pre-definition paths: direct property writes and Lit property bindings. Both initially declare paddingInline before padding, but Lit replays padding first. The resulting inline padding is 8px rather than the expected 16px. Post-definition writes/bindings and the tested HTML attribute order work. The failure is ordering through normal property registration, not loss of the canonical TanStack values.

An ordered-object alternative preserves object identity/order through normal Lit property registration and passes eight focused checks, including replacement and JSON attributes. It is comparison evidence; no change from individual style properties to one object was selected.

A separate capture candidate passes fifteen targeted checks. It keeps the same two public properties, omits them from Lit's reactive-property metadata, captures their own pre-upgrade properties before they are lost, and uses public observedAttributes/attributeChangedCallback handling. Values and the order array use the unchanged atomState helper. No private Lit hook is used. The checks cover pre-definition writes, early Lit bindings, initial attributes, later updates, removal/re-addition, detached upgrade and one mixed attribute/property case. These are candidate behaviours, not approval of a complete order protocol. The three groups have different targeted cases; their counts are not a uniform comparison benchmark.

The recommended investigation continues with a shared style-input module that preserves the selected individual properties. Its explicit style metadata must also serve attribute conversion and the manifest. The fixture's retained position on value updates, appended position on re-addition and mixed-source initialization need a complete contract; subclass defaults, constructor writes, store-origin changes, attribute reordering, lifecycle variations and all style properties remain to check. Keep this narrow CSS-input mechanism distinct from the existing public-state bridge for semantic controls unless evidence supports a reviewed change.

The complete @lit/react create-component.ts at 01dbc6673cdc211543932afd0ca04e223e567366 was read. It recognizes properties through the element prototype, iterates incoming props in object order and assigns them on every layout effect without value dirty-checking; removed props become undefined. A capture that simply retains each property's first position cannot represent a later reordering of the complete React props. Design explicit per-render order synchronization in the house wrapper, then verify it with React. React, @lit/react and react-dom were not installed locally for this probe; no React execution is claimed. The guide's older React-limitations and display:contents examples do not override our existing React 19 and real-box decisions.

Only the expected Lit development-mode warning remained after the fixture compiler repair. All probe tabs and temporary servers were stopped. At that initial capture, manifest, default/inheritance, actual compiler, React and remaining-engine checks were still open. The follow-up below resolves bounded parts of those checks; it does not establish a completed style module, approved migration or universal ordering guarantee.

### Style-input integration follow-up

Captured 2026-09-20 in the [integration evidence](../alignment/evidence/style-input-integration-review-2026-09-20.json). The record includes test sources, in-memory runners, package integrity checks, individual assertions and expected failing comparisons. It continues the two-property capture fixture using unchanged atomState. It is distinct from the earlier semantic-control helper refinement and native-form probes; their remaining acceptance work is not closed by these tests.

| Comparison | Chromium 153 | Firefox 155 | WebKit 26.6 |
| --- | --- | --- | --- |
| Original normal-Lit ordering baseline | 9/13 | 9/13 | 9/13 |
| Original ordered-object alternative | 8/8 | 8/8 | 8/8 |
| Original public-API capture candidate | 15/15 | 15/15 | 15/15 |
| React plain @lit/react wrapper | 15/21 | 15/21 | 15/21 |
| React wrapper with complete order synchronization | 21/21 | 21/21 | 21/21 |
| Same synchronized wrapper in React Strict Mode | 21/21 | 21/21 | 21/21 |
| CSS defaults and lifecycle cases | 14/14 | 14/14 | 14/14 |
| Constructor-assignment default comparison | 0/2 | 0/2 | 0/2 |

Each fraction is passed assertions/total assertions, not component coverage. The original Chromium ordering results are carried forward from the linked first probe; Firefox/WebKit are new reruns. The unequal original groups exercise different cases. Expected baseline failures remain in the evidence. WebKit automation is not an actual Safari application test.

**React:** integrity-checked React/React DOM 19.3.0, @lit/react 1.0.8 and scheduler 0.28.0 were bundled in memory. The plain wrapper loses order on reorder-only renders and subsequent update/re-addition cases. A house wrapper around createComponent sends the complete present style-key order from a layout effect, updating the canonical order only when it changes. It passes normal/Strict Mode cases, including refs/classes, slotted React state and node identity, one mapped event, omission/explicit undefined, removal/re-addition and unmount. This is a feasible proposed connection, not approval of its exact public method or a complete React package. Two setup build failures (duplicate helper and virtual-module import resolution) were repaired before execution; they are not runtime findings.

**Manifest:** the browser API of @custom-elements-manifest/analyzer 0.11.0 used its bundled TypeScript 5.4.2. Four Base/Child source forms were compared. observedAttributes plus plain fields, or class-level attribute annotations, did not associate each attribute with its field. Field-level or accessor-level @attribute annotations produced the expected attribute/field links and inherited metadata. @internal excluded helper fields. No custom analyzer plugin was needed for these cases. This does not establish the complete package manifest or slot/event/styling-hook coverage.

The isolated manifest API also emitted a superclass module reference such as /base while the module path was base.ts. Across six filename/import combinations, only an absolute fixture path with an explicit .ts import matched the module identifiers. Keep actual analyzer configuration, source-to-published paths, exports and module-reference normalization as a required integration check. This is not proof of a defect in a real CLI/project run, and it does not justify changing all source import spellings.

**Defaults and lifecycle:** derived constructor assignments overwrite early author values in the negative comparison. CSS defaults preserve supplied values/order, removal exposing defaults, theme-variable changes, initial attributes, detached writes and reconnect. The initial equality helper serializes arrays as JSON, which conflates undefined and null; extra strict checks in each engine establish that omitted inputs are actually undefined. These tests do not disprove a correctly implemented default-returning getter. Peter subsequently chose [undefined for omitted CSS inputs](../decisions/layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults); semantic-control defaults remain separate.

All owned probe tabs, browser instances and temporary servers were stopped. Playwright 1.63.0 and Firefox/WebKit binaries were installed only in the dedicated temporary test cache recorded in the evidence; the existing global cache and project dependencies were untouched. Runners use Bun. No production build, strict full-project type check or Lit-template compiler pass is claimed. Final metadata/attribute conversion, all 77 candidate styling properties, responsive combinations, inheritance/store-origin changes and the representative house CSS pipeline remain before approval.

### Package metadata and compiled fixture verification

The [next bounded verification](../alignment/evidence/style-package-verification-2026-09-20.json) runs analyzer 0.11.0's actual CLI API against all 330 source modules selected by the current build exclusions. It runs under Bun with noWrite:true and an external configuration explicitly setting packagejson:false; no package manifest or generated file in the project is written. The temporary install resolves the analyzer's TypeScript range to 5.4.5, distinct from the browser bundle's 5.4.2. The record saves the lockfile, scripts, hashes and results.

Raw output has 321 module-reference strings that do not match a declared module path. Three are external named exports wrongly classified as local modules: batch/createStore from @tanstack/lit-store and TanStackFormController from @tanstack/lit-form. The installed isBareModuleSpecifier removes single quotes but not double quotes, while named-export analysis passes getText(). A temporary one-line correction makes single-quoted, double-quoted and unquoted package names agree and repairs these three entries. This is an analyzer metadata defect, not evidence of broken component runtime imports. No project dependency patch or upstream report was made.

The remaining 318 path mismatches include leading-slash superclass paths, extensionless paths and relative named-export paths. A proposed publication transform resolves them with the installed TypeScript resolver, then applies the current build's src/*.ts → dist/*.js mapping to module paths and references. All 1,072 local references in the real-source result point to normalized module entries with no unresolved targets. The four-module fixture has twelve valid local references, and every mapped fixture module exists in the emitted output. Repository-wide emitted-file existence was not checked because no full build ran. Future package layout/exports need the corresponding approved output map; this does not approve today's dist wildcard as the final API.

The fixture also verifies .js import specifiers in TypeScript source: resolution reaches the .ts source and the emitted .js module. The initial browser experiment's explicit .ts-import workaround is therefore unnecessary for this tested integration. The quote defect should be corrected at its analyzer source (or through an upstream release with equivalent verification); published path mapping is a separate necessary build responsibility. Keep failures visible rather than silently dropping unresolved references. The scratch transform is evidence for a supported package-link step, not a complete selected plugin implementation.

**Compiler and declarations:** the two-field capture candidate, its annotated fields, a subclass and a verbatim copy of atomState pass strict TypeScript 5.9.3 checking and declaration/map emission. A consumer importing the emitted public entry accepts string/undefined assignments; separate negative cases report both expected errors for a required-string read and a numeric write. These are the fixture's string-only types, not approval of the planned token/responsive types. The analyzer retains inherited field/attribute links and omitted defaults. @internal hides helper members in CEM, but the present declaration options retain them in .d.ts; finish deliberate public/internal visibility before package approval.

The installed Lit compiler 1.1.2 runs through the same transpileModule transformer/options as scripts/build.ts. The original ordering fixture has no remaining html tagged templates after compilation. Chromium 153, Firefox 155 and WebKit 26.6 reproduce all fifteen capture passes, all eight ordered-object comparison passes and the same four failures among thirteen normal-Lit baseline checks. No page errors occur. This is compiler acceptance for that fixture, not a rerun of the complete React/default/form matrices or the generated-CSS pipeline.

The isolated bundle first lacked resolution for the compiler-generated lit-html/private-ssr-support.js import. Linking the existing installed lit-html into the temporary dependency directory resolves it; this does not demonstrate a current production failure. The final package must account for compiler-emitted runtime imports when verifying consumer installation. All probe browsers and the server are stopped. Production source/dependencies remain unchanged; temporary test caches remain available.

### Lit ordering with late and mixed inputs

The next cases in the [same evidence record](../alignment/evidence/style-package-verification-2026-09-20.json) expose a remaining authoring gap. In a stable Lit template, padding starts undefined before paddingInline="8px". Later setting padding to 16px appends it in the initial capture candidate, so all sides become 16px instead of leaving the inline sides at 8px. The reversed late-input case also fails. Retaining a position for explicitly written undefined values fixes those three assertions in the tested alternative; it does not by itself establish all removal or mixed-source rules.

A second case remains wrong with both candidates: a Lit property binding for paddingInline appears before a literal padding="16px" attribute. The literal attribute is applied before the dynamic property write, so the result is 8px on the inline sides, contrary to the selected declaration-order expectation of 16px. The initial candidate passes 1/5 ordinary-binding assertions; the retained-position variation passes 4/5. Results agree in Chromium, Firefox and WebKit. The child-identity assertion passes; these failures do not arise from replacing the child element.

Installed Lit source at development/lit-html.js:1197–1292 commits changed property values as assignments. The public PartInfo interfaces describe the current expression, not the full ordered combination of static attributes and sibling property bindings. This explains why setter arrival is insufficient; it does not prove that every possible integration is impossible. [Property expressions](https://lit.dev/docs/templates/expressions/#property-expressions), [public directive DOM access](https://lit.dev/docs/templates/custom-directives/#imperative-dom-access-update).

A small public ElementPart directive receiving the complete two-property input object passes six targeted checks per engine: child identity, canonical input access, late-value order/results and clearing an input. It writes the existing TanStack-backed properties and supplies their order; it does not create a second state store or use private Lit hooks. This first prototype targets already-defined elements and string values only. The subsequent lifecycle/registry study below extends definition and compilation coverage after Peter selected the helper; complete ownership/cleanup, responsive values, larger property sets and final types remain acceptance work.

**Selected follow-up:** Peter chose the complete-input Lit authoring helper, retaining the existing order rule, component properties and static HTML authoring. A restricted all-property-binding convention fixes the tested late-value cases but does not solve mixed literal/bound overlap; it is not equivalent coverage. Fixed property priority was not selected. Exact helper naming/types and input ownership still need the full contract. [Decision](../decisions/layout-spacing-properties.md#lit-helper-for-ordered-styling-inputs), [remaining return point](../alignment/phase-2-review.md#lit-style-authoring-and-declaration-order).

### Lit helper lifecycle and registry boundary

The [selected-helper follow-up](../alignment/evidence/lit-style-helper-review-2026-09-20.json) retains the baseline failure, reduced browser cases, final fixture sources/runners and all assertions. The helper prototype uses public AsyncDirective hooks and an ordered input object to write the same TanStack-backed properties. A generation check cancels stale pending work; a WeakRef avoids strongly retaining a discarded directive in a whenDefined callback. The checks establish callback effects, not garbage collection or subscription-cost measurements.

The first lifecycle run passes 21/21 cases in Chromium 153 and Firefox 155. WebKit 26.6 leaves the late-defined target as an HTMLElement; applying inputs then raises a missing-method error and the fixture stops before completing its suite. Additional calls to upgrade do not cure that case. Do not count the incomplete run as a full 21-case result or dismiss it as a timing delay.

A six-route reduction with plain HTMLElement subclasses removes the house component, TanStack and asynchronous helper. WebKit upgrades createElement and template cloneNode controls, but fails the late-defined document.importNode, ordinary Lit-template and element-directive cases. Chromium and Firefox upgrade all six. A fresh-page-per-case registry matrix confirms that WebKit's default import has a null associated registry; explicitly supplying the document registry or calling initialize permits upgrade. Chromium's default imported element already uses the global registry. Firefox lacks the scoped-registry/initialize surface in this run; its ordinary global import works. Earlier combined-page exploration is preserved but superseded to avoid shared template/registry state contaminating the comparison.

The current [DOM importNode algorithm](https://dom.spec.whatwg.org/#dom-document-importnode) supplies the document's registry when none is specified, and its options dictionary uses selfOnly and customElementRegistry. The MDN importNode page still describes the older boolean-only signature; it is insufficient for the modern dictionary shape. The final experiment uses selfOnly, not the unrecognized deep field from the earlier exploratory script. These results establish a mismatch in this tested WebKit build, not a claim that every Safari version fails.

The successful fixture makes registry selection explicit through Lit's public creationScope.importNode option. Where the registry API exists, it passes selfOnly and the intended document registry to importNode; otherwise it uses the ordinary boolean form. No global DOM method or Lit private hook is patched. This addresses node creation at the shared integration boundary rather than adding delays or replacing elements inside the style helper. It remains a proposed shared integration mechanism; no production or upstream change was made.

With that boundary in place, all 21 cases pass in Chromium, Firefox and WebKit, both with ordinary templates and after the installed Lit compiler transform. Cases cover latest-value/order preservation through definition, suppression of obsolete callbacks, same-value reordering without node replacement, clearing one/all inputs to expose CSS defaults, reading a mutated input object, cancelling writes after rendered content is removed, disconnect/reconnect and a detached rendered tree. An explicit update to an already-defined element updates canonical inputs synchronously even while its Lit part is disconnected; delayed definition work waits for reconnection. No page errors occur in the corrected runs.

The fixture uses two string-valued properties and the global registry only. It does not verify scoped registry selection, adoption into another document, competing writers, complete cleanup/ownership, final public types, responsive values or all styling properties. The original helper/semantic-form probes retain their separate acceptance requirements. All owned servers and browser processes are stopped; only temporary test artifacts/caches remain. Production source and project dependencies are unchanged.

The [standing scoped-registry direction](../../PLAN.md#7-decided-and-deferred) names @lit-labs/scoped-registry-mixin and a polyfill where needed before 1.0. This global-registry experiment neither verifies that integration nor replaces it with a native-only policy. Reevaluate the actual package/native API interaction with current evidence at the registry return point; Firefox's missing native surface is not permission to drop the three-engine requirement or the scoped capability.

### Lit helper ownership and batched updates

Peter selected two further rules: the helper manages only supplied settings and clears ones it previously managed when removed; it reapplies its currently supplied values on every helper render, even after an external property write. Unrelated settings remain intact. [Decisions](../decisions/layout-spacing-properties.md#settings-managed-by-the-lit-helper), [source/answer/probe record](../alignment/evidence/lit-style-ownership-review-2026-09-20.json).

The complete installed style-map.js and live.js were read alongside the official [styleMap](https://lit.dev/docs/templates/directives/#stylemap) and [live](https://lit.dev/docs/templates/directives/#live) documentation. styleMap records supplied keys, removes old keys that become nullish and writes all currently supplied names on updates. Ordinary property bindings compare against the last bound value; live compares against the current DOM. These are different update contracts. The house helper's reassertion rule is an explicit selection, not a claim that every Lit binding already behaves this way.

Existing src/shared/form.ts provides a public AsyncDirective, bind(field), which writes its supplied field values/errors during render and owns its event listeners. It is a relevant local pattern, not a substitute styling implementation. src/shared/state.ts already re-exports TanStack batch. The style probe uses that package API rather than introducing another state or transaction mechanism. [Batch signature](https://tanstack.com/store/latest/docs/reference/functions/batch).

The three-field fixture uses padding, paddingInline and backgroundColor with the unchanged atomState accessors and explicit global-registry node creation from the preceding study. All nineteen assertions pass in Chromium 153, Firefox 155 and WebKit 26.6, with no page errors. They verify unrelated canonical/source/native settings, computed output, synchronous property reads, coherent subscriber notification, removed keys/empty sets, new ownership, external writes, order and element identity. The unbatched control deliberately reveals a partly updated pair; that passing assertion demonstrates why notification batching is needed.

The helper prototype tracks the keys it previously supplied, clears removed keys, writes current values and updates their order inside TanStack batch. One derived subscriber sees the complete tested set once; there is no proof of rollback after a throwing converter or of every possible subscriber path. Reassertion after an outside write was tested as a proposal and then selected by Peter; no implementation change or redundant rerun was required after his answer.

When the fixture acquires backgroundColor and later removes it, its property becomes undefined and the CSS default applies; it does not restore the earlier value. This is not approval of unrestricted same-property writers or a complete attribute-reflection contract. Exact helper-expression removal, multiple/competing writers, types, scoped registries/adoption and the full responsive/property set remain open. The ownership harness was bundled without a new Lit compiler transform or strict type check; earlier compiled lifecycle results remain separate. All test browsers and the server are stopped. No production source or project dependency changed.

The [inspector decision](../decisions/design-system-devtools.md) leaves editing unselected. If editing is later included, distinguish temporary component-property edits from changes to the helper's supplied input; otherwise the next parent render can restore the supplied value. Record that dependency without deciding the inspector's editing UI or transport now.

## M00 native forms and scoped registries, 2026-09-20

The [saved executable evidence](../alignment/evidence/m00-prerequisites-2026-09-20.json) extends the earlier mechanisms to Chromium 153, Firefox 155 and WebKit 26.6. Tests use isolated contexts and native controls as the oracle. Production files remain unchanged.

**Native forms:** current Input fails all eight targeted cases and Checkbox fails all seven in each engine. Input synchronizes form value during updated, leaving immediate submission/reset stale; its native input's required validity does not reach ElementInternals. Checkbox also synchronizes during updated and reflects current checked into the attribute it later reads as its reset default. Effective fieldset disability does not reach the inner control.

The earlier synchronous candidate passes six of eight text cases; the render-cycle control passes two. The refined scratch candidate passes eight text and seven checkbox cases in each engine. TanStack owns current/default values and dirty flags. Native callbacks reset that state or update effective disability; native submission and required validity update synchronously. Fixtures compare explicit defaults, dirty values, same-value writes, attribute removal, reset and first-/second-legend movement with native inputs. These results do not certify restoration, user events, other constraints, Field associations, composite controls or managed forms.

**Scoped registries:** published @lit-labs/scoped-registry-mixin 1.0.4 uses the older customElements attachShadow option and ShadowRoot.importNode supplied by its polyfill. The native-first stock path fails in Chromium/WebKit; Firefox's polyfilled path works. Always applying the polyfill works in these cases but patches native implementations. A subclass also inherits its parent's static registry unless ownership is checked.

The scratch integration gives each concrete class its own registry, uses native customElementRegistry and Lit's creationScope importer where supported, and retains the selected published mixin/polyfill otherwise. Its importer reads the current ownerDocument and uses the DOM Standard's selfOnly option. This corrects the tested failures without global patches in native engines. Sources: [Chrome scoped registries](https://developer.chrome.com/blog/scoped-registries), [DOM importNode](https://dom.spec.whatwg.org/#dom-document-importnode), and the installed mixin source.

Cross-document adoption exposes a separate defect: the shadow root loses its stylesheets. All three engines reject assigning the original document's constructable sheet in the destination with NotAllowedError. The final candidate creates destination-owned sheets, caches by document/class and restores them during adoptedCallback. It passes seven behavioral outcomes per engine; the retained prior candidate passes five, failing adoption/return style assertions. New scoped children have the correct class, document, text, color and padding after both moves.

Limits: static sheets, same-origin active documents and constructable stylesheet support only. The scratch helper owns the entire adoptedStyleSheets list. Production integration must account for other stylesheet owners and verify nested Lit hosts constructed after adoption, inert documents, CSP and dynamic styles where required. The candidate is not a finished base class.

## M00 state, metadata and native semantics conclusion, 2026-09-20

The [completion evidence](../alignment/evidence/m00-completion-2026-09-20.json) adds 29 passing acceptance checks per engine with no page errors. The transaction candidate uses the unchanged repository atomState helper: validate scalar/array/responsive inputs first, then assign one complete canonical state. The deliberate incremental-write control demonstrates a partial update; the candidate prevents it. Readonly array snapshots, malformed JSON, bracketed scalar CSS, absent styles, reset and reconnect pass their tested cases.

Strict TypeScript declarations and CEM agree on scalar, readonly-array and responsive fields, attributes and class exports. A valid consumer compiles; an invalid consumer produces four expected type errors. This does not replace the earlier declaration-order, reflected-state, compiled-template and React evidence or certify all 77 styling properties.

Native List/Table/Data List fixtures preserve author-owned nodes and browser roles. Inline/block hosts retain actual boxes. External, scoped and adopted controls submit immediately. Input naming is checked against browser accessibility snapshots. The Field candidate uses same-shadow text mirrors plus registered activation targets; complex labels/descriptions and other control families remain implementation tests.

Firefox's first synchronous synthetic label click after iframe adoption does not focus, although the handler runs and later direct focus works. Real Playwright label clicks pass beside a native label/input oracle in all three engines. That synthetic observation remains recorded; no timer, retry or preventDefault workaround is introduced. These browser checks do not claim a screen-reader session or autofill/history certification.

## Owned store reconnect hook shipped through the package, 2026-09-20

Fresh M03 package consumers exposed the limit of the local lit-store patch. Normal registry installs did not apply it, and selectors stopped rendering after a move in all three engines. M00 had explicitly patched its consumer fixture. That passing result remains a representative mechanism check, not proof of transitive patch delivery.

The existing StoreSelector and atomState now share src/shared/store-connection.ts. It registers one requestUpdate-on-connect controller per host. The official TanStackStoreSelector and TanStackStoreAtom continue to own selection, subscriptions and values; there is no replacement state engine. The implementation works with unpatched @tanstack/lit-store 0.13.2. The removed dependency patch and its rationale remain in Git/history.

Fourteen focused tests pass, including detached shared-atom changes, repeated moves, exact active-subscription counts, one connection update for mixed bindings, and selector comparison options. Fresh packed consumers pass repeated Theme Switcher reconnection and detached catch-up in Chromium, Firefox and WebKit. M05 still owns the wider canonical public-state, declaration-order, external named-notification and theme-scope integration.

## M05-01 canonical public-state helper, 2026-09-20

The existing atomState helper now uses TanStackStoreAtom plus a lifecycle-managed named observer. Current getters and setters still read/write the TanStack atom. The helper retains only the previously notified value to populate Lit changedProperties; that record is not another writable state owner. Shared defaults are captured before consumer assignments. Public fields keep ordinary Lit property metadata with noAccessor: true, registered before atomState installs the accessor. The owned connection hook remains in place; no dependency patch returns.

The baseline helper failed five of the 24 saved public-state checks in each of Chromium, Firefox and WebKit, with both ordinary and compiled Lit templates. The implementation passes all 26 current checks in all six runs. The additional mixed external/accessor batch regression preserves the first old value rather than the intermediate store value. Defaults, explicit same-default assignment, synchronous derived values, render gates, attribute reset/conversion, detached changes, pre-definition replay, subclass metadata, NaN and signed zero are covered.

Each binding now has the official render subscription plus a named observer. Exact counts across moves and zero subscriptions after disposal remain tested; the per-host connection hook still schedules one update. Focused tests pass 25 cases/96 assertions; the full suite passes 604 tests. Strict helper/fixture typing and generated-manifest default/type/attribute checks pass. An independent review approves the bounded change. [Evidence and full reproductions](../alignment/evidence/m05-state-2026-09-20.json).

This enables the approved public-state pattern; it does not claim every existing component has already migrated its public fields. Authored/effective appearance, ordered styling, responsive rendering and nested themes remain separate M05 mechanisms, followed by M06 native-form integration.

## M05-02 inherited named appearance, 2026-09-20

The shared resolver now separates authored presence from effective size/variant values in TanStack atoms. It accepts the current participating Group provider explicitly. An explicit child input wins, including an input equal to the component default. Clearing it restores inheritance. A fresh nested provider does not merge ancestor defaults. Unsupported inherited values use the child default and expose immutable diagnostic data.

Nine focused tests and strict TypeScript checks pass. Eleven browser checks pass in each of Chromium, Firefox and WebKit; independent review finds no required defects. [Sources, reproduction and results](../alignment/evidence/m05-appearance-2026-09-20.json). This implements the state rule only. Group membership, DOM provider selection and component integration remain M07 and the relevant family batches.
