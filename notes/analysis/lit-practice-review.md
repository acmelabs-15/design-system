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

We set ARIA on inner elements rather than through `ElementInternals`. That remains correct, for a scope
reason rather than a support reason: an identifier reference reaches the same tree or a parent tree, so
inner-element references inside one shadow root work, while a reference from outside into a shadow root
does not, and an out-of-scope reference is **silently dropped**. Use `ElementInternals` for host-level
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
