# Shared conventions and foundations — R01

**Status: approved contract.** Peter approved the complete proposal set on 2026-09-20. The stated recommendations are selected; explicitly recorded later resolutions are incorporated below. [Approval](../docs/decisions/0049-inventory-approval.md). Verification evidence retains its original date and scope.

**Cross-family contract.** This file owns the cross-family contract. The selected responsive/style rules and detailed layout property table remain in [the core inventory](SPEC-design-system.md#c-resp-shared-responsive-convention); this file does not reopen them. [The closed decision register](../docs/design/systematization-decisions.md) records the selected recommendations separately from engineering verification.

## Contract used by every entry

An entry lists its additions to this contract. A property absent from both places is not implicitly public. Properties, slots, events, methods, parts and examples define the approved interfaces. The implementation snapshot is dated evidence, not a compatibility promise.

Unless a family specifies otherwise, a named structural part has one default slot, its same-named CSS part, no own value/state/method/event and no added keyboard behavior. It uses an ordinary native content container; a header/footer part name does not automatically create a page landmark. Stateful/focusable parts use their explicit family rules instead.

| Subject | Rule |
| --- | --- |
| Tags and exports | acme- plus kebab-case concept; Acme plus PascalCase class; React removes the Acme prefix. Family parts include the family prefix. Component file/folder follows the tag suffix. |
| Definitions and classes | Side-effect-free class export and explicit definition entry per component; documented dependencies register through the supported scoped/global definition mechanism. No component import registers the entire library. |
| Properties/attributes | camelCase properties; kebab-case attributes unless the platform already defines a native spelling. Object/array/function/Element inputs are properties; only explicitly specified structured attributes get JSON conversion. Native boolean attributes use presence/absence. Approved default-true boolean properties use an explicitly string-valued attribute with false as the opt-out; omission restores the entry default. See the [2026-09-21 default-true resolution](../docs/decisions/0035-execution-delegation.md#default-true-property-attributes--2026-09-21). |
| Values | Empty string represents an empty text value; no value for single-choice collections is undefined; multiple values use a fresh readonly string array. Keys are stable strings. Native form serialization is defined per control and does not stringify arbitrary objects. |
| Style values | Selected numeric spacing/size tokens and property-valid CSS. Missing CSS input reads undefined. Semantic booleans and values retain entry defaults. No implicit all-CSS property interface on every control. |
| States | checked for Checkbox/Radio/Switch; pressed for Toggle Button; highlighted for navigated options; selected for collection value; current for navigation; focused for actual focus. open for overlays, expanded for disclosures. |
| Content | heading, description, metadata, header, footer have glossary meanings. start/end are inside reading-order affixes; start-addon/end-addon are outside attached surfaces where an entry explicitly supports them. |
| Named sizes | tiny, small, medium, large, extraLarge, extraExtraLarge as needed; each entry lists its supported subset. No short aliases. Numbers used as CSS dimensions or formatter values are not size tiers. |
| Inherited named appearance | For size/variant provider inputs, track authored presence separately in canonical state; effective value is explicit child input, then compatible nearest Group input, then an applicable logical collection default, then component default. A Checkbox Group size is such a collection default; it does not override a nearer general Group or an authored member value. Getters expose the effective named value; clearing the authored value resumes inheritance. This is distinct from raw CSS-property getters, which retain the selected undefined-when-absent rule. Never mistake a constructor default for an explicit child override. |
| Shapes | circle/pill/square express the selected concepts; border radius is separate. No rounded alias for pill. Individual entries expose only supported shapes. |
| Slots/parts | Content uses slots/child parts; CSS uses explicitly listed parts and documented tokens. Private shadow selectors are not a contract. Forward a public part through internal compositions only deliberately. |
| State ownership | Canonical TanStack state backs public properties. Retain/refine existing atomState and StoreSelector/StoreEffect integration; Lit handles metadata/rendering, not another writable state copy. |
| Native meaning | Dedicated native controls keep platform behavior. Structural as is restricted to each entry's selected set. Accessible naming reaches the actual semantic/focus target, with no duplicate host role/name. |
| Lifecycle | Disconnect cleans transient listeners, timers, observers, placement and animation work; reconnect derives current inputs once. Late definition, scoped registries and adoption must work without replacing author-owned children. |
| Completed replacements | The retired interfaces named in these contracts remain removed. No alias, deprecated attribute, legacy export or old-path fallback restores them. Decision records and Git retain the migration history; future API changes require their own scope. |
| Localization | lang/dir follow the nearest scope; explicit locale where an entry formats data. Applications supply translated content. Built-in control labels use configureMessages(locale, stringRecord). Catalogs are copied, frozen, replaced per locale and resolved through locale ancestry. Visible and accessible Kbd labels have separate keys. Supplied locale messages replace fixed English labels. [2026-09-21 resolution](../docs/decisions/0035-execution-delegation.md#typography-implementation-resolutions--2026-09-21). |

**Evidence:** [terminology decisions](../docs/design/component-vocabulary.md), [property-name priorities](../docs/decisions/0079-prop-naming-vs-reference.md), [state](../docs/decisions/0080-public-state-bridge.md), [reference rule](../docs/decisions/0082-reference-systems.md), [current AST snapshot](../docs/verification/systematization/current-public-interfaces-2026-09-20.json). The generated manifest must cover runtime/inherited metadata gaps without exposing private queries as public methods.

Structured HTML attributes are explicitly supported for data-only values in these contracts: Avatar Group members; Checkbox Group/Pin Input/Slider array values and Slider thumbLabels; Tree items/expanded and multiple values if selected; Calendar range value/presets; Chart data/series without callbacks; Sparkline values; Flow Diagram nodes/edges; JSON View value; formatter options; Resizable sizes; and the already selected responsive styling fields. HTML uses validated JSON, while Lit/React pass actual values. Functions, stores, DOM references and regex objects remain property-only. Unknown fields or malformed structures cannot become executable templates. The shared converter contract distinguishes absent values, parse failures and valid scalar inputs.

## Public events

Uniform event settings: bubbles=true, composed=true. Ordinary notifications are not cancelable. Event detail contains serializable values and reason strings, not DOM nodes or an original event. Native click/focus/input events keep platform behavior; do not synthesize duplicate native events.

| Name | Meaning and detail | Timing |
| --- | --- | --- |
| acme-input | Live editable value: { value }; entry adds numeric value only where specified | After canonical value and native form state update |
| acme-change | Committed user value change, such as { value }, { checked } or { pressed } | Once per effective user commit; no event for an unchanged value |
| acme-open-change | { open, reason? } for user overlay-state changes | Separate from value change so opening Select cannot look like clearing its value |
| acme-expanded-change | { expanded } for disclosure/hierarchy state | Separate from selection/value changes |
| acme-visible-change | { visible } for explicit display-state controls such as password reveal | Separate from edited text/value changes |
| acme-current-change | { current } for navigation-location observation | Does not imply form selection or application navigation ownership |
| acme-copy / acme-load / acme-complete / acme-dismiss | Entry-defined completed-operation notifications | Never mislabel an already completed result as an application action request |
| acme-request | Application-owned action: { action, ...entry fields } | Before application work; cancelable where entry allows preventing local default behavior |
| acme-after-open / acme-after-close | { reason } for completed owned overlay transitions | Once after the owned transition; canceled/replaced transitions do not report stale completion |
| acme-error | { code, message } for an entry's failed asynchronous operation | After failure; no secrets, input text or arbitrary application data in default diagnostic detail |

Programmatic assignments update canonical/native state without pretending to be a user input/commit. Store subscriptions remain the programmatic observation path. Reset/restoration synchronize without synthetic user changes. A composite stops internal coordination from becoming duplicate public notifications. Controlled application-owned components (Pagination, Table data processing, action confirmation) emit requests and render supplied state; they do not run the application's work.

These approved payload/timing rules implement the selected meaning-based event direction. They do not rename native platform events or treat a changed Lit property map as an emitted DOM event. Test user, programmatic, reset and reconnect paths separately for each family.

## Forms and focus

Native-form controls share name="", disabled=false, required=false where meaningful, form attribute/association, validity/checkValidity()/reportValidity()/setCustomValidity(message), and focus(options). Read-only applies only where platform semantics support it. Form state synchronizes immediately, independently of a render cycle. Effective disabled state incorporates disabled Fieldset without overwriting a control's own disabled setting.

Reset restores defaultValue/defaultChecked, exposed with the corresponding control value type and initial entry default. Initial HTML value/checked establishes that default; later programmatic writes to current value/checked do not silently replace it. Setting the explicit default updates the reset target; pristine/current synchronization follows native control behavior and is verified separately from controlled application writes. Restoration uses the control's serialized value shape. Checkbox-style unchecked values are absent; repeated collection values use repeated entries; empty scalar values serialize as empty strings when named/enabled. Radio/Card/Segmented composites own one successful value, not one hidden submission per visual wrapper.

Field owns label/help/error relationships; the control owns value/validity and actual focus. Roving focus belongs to the control collection/Toolbar, never general Group. One component owns a gesture or key. Enter/Space, arrows, Home/End, Escape and typeahead follow the assigned reference and native control type. Do not force application navigation links into menu/radio behavior.

**Evidence and gates:** [native-form direction](../docs/decisions/0068-native-form-architecture.md), [timing probe](../docs/verification/systematization/native-form-mechanism-2026-09-19.json), [form/Field review](../docs/research/15-lit-practice-review.md). Required acceptance includes disabled first-legend exceptions, external form association, submit-before-render, reset, autofill/history restoration and actual accessible relationships in all three engines. Directly calling a callback is not autofill verification.

## Theme scope and customization

Selected: full themes, page/nested-section inheritance, scope-correct overlays, independent size/spacing categories and no automatic preference persistence. API:

- registerTheme(name, definition): registers an immutable named theme before first use; duplicate identical registration is harmless, conflicting registration fails. ThemeDefinition contains colors, fonts, fontSizes, fontWeights, lineHeights, spacing, sizes, radii, shadows and motion. Values are CSS token values under category validation; a partial theme inherits the default design-system theme.
- acme-theme: theme?: registered name, appearance: "auto" | "light" | "dark" (auto default), density: "normal" | "compact" (normal default), locale?: string and dir: native direction. One default slot; part=root; no own focus or new change events. Nested omitted properties inherit effective scope; root omission uses default theme/auto/normal.
- Named theme definitions use registerTheme; local one-off overrides use ordinary documented CSS custom properties. Do not add a second .tokens object interface without a demonstrated need. This is the selected resolution of the original Q01.
- Theme Switcher emits a preference request. The application decides whether/where to save it. Importing Button or another component never rewrites root theme settings.
- Overlay lifetime captures and follows the opener's effective theme; moving/changing scopes updates an open surface. Menus, Dialogs and Toasts reset inherited density to normal under the selected rule.
- Shared blue action roles use the selected darker-blue/white direction. Final token values must pass combined rest/hover/press/focus/ripple states in both appearances. Existing comparison colors are evidence, not automatic final values for every control.

Named registration plus CSS local overrides is approved. Q02 is closed in favor of role-specific compact tokens and the recorded comparison targets. The API retains that scope without treating unmeasured values as verified density results. Theme validation reports unknown token categories and malformed registrations at startup; browser-specific CSS-variable computed validity remains native.

**Sources:** [custom themes](../docs/decisions/0022-custom-themes.md), [theme ownership](../docs/decisions/0109-theme-resolution-architecture.md), [blue measurements](../docs/research/07-design-foundations.md#blue-accent-contrast-and-visual-choice), [density](../docs/decisions/0025-density.md). Historical source baseline: shared/state.ts and base.ts supplied root-only behavior before the replacement. [M05 theme integration](../docs/verification/systematization/m05-theme-integration-2026-09-21.json) records the later scope implementation and its limits.

## Responsive layout and styles

Use [the core shared responsive contract](SPEC-design-system.md#responsive-authoring), selected names/thresholds/native font bases and the full spacing/size scale. Scalar, named object and five-position array forms remain selected. The HTML structured converter must preserve scalar bracketed CSS. The selected ordering model, helper, native query font bases and default targets remain part of the contract.

styleInputs owns only its supplied keys and reapplies them on each helper render. React synchronizes complete prop order through its wrapper. Removing a supplied key clears that value; explicit styleInputs({}) clears the helper's remaining owned keys. Removing the expression or temporarily disconnecting preserves canonical values. A new helper does not inherit the removed helper's ownership. Conflicting overlapping writers remain unsupported; exact range-equivalence validation remains required.

Malformed structured HTML JSON removes that input's override to undefined, preserves unrelated inputs and issues a development diagnostic. Valid scalar CSS is recognized before JSON, so bracketed grid lines survive. No previous style snapshot or last-valid CSS store is retained. The original five-case Bun probe of @lit/reactive-element 2.1.2 established converter behavior only. Q03 selected this adaptation; browser and atomic-update evidence remains separate.

**M05 resolution, 2026-09-21:** Peter selected [explicit clearing with styleInputs({})](../docs/decisions/0052-layout-spacing-properties.md#explicit-clearing-for-the-style-helper), resolving the [helper-removal conflict](../docs/verification/systematization/m05-style-helper-lifecycle-2026-09-20.json). Expression removal and temporary disconnection preserve canonical values. Supplied-key ownership and next-render reassertion remain selected.

The implemented JavaScript path retains current authored CSS strings and lets native grammar/cascade determine their rendered effect. A grammar-invalid leaf does not keep its former valid declaration or discard valid sibling settings. Numeric/domain constraints and responsive structure validation remain distinct from CSS string processing. HTML keeps the selected strict scalar/JSON converter. [Current-input evidence](../docs/verification/systematization/m05-current-css-inputs-2026-09-21.json). Keep the same helper expression present while sending {}; a new helper does not inherit a removed helper's ownership.

## Motion, shapes and indicators

Use Lit Motion. Standard and Expressive Material roles are selected per context, not one universal scheme. Utility motion uses Standard; prominent demonstrative examples may use Expressive. Spatial/effect roles remain distinct. Reduced motion preserves state/focus outcomes with immediate or non-spatial transitions as applicable.

The internal shared indicator owns animation between single selected targets in either axis. Selection owner supplies target identity/geometry; layout supplies boxes. Checkbox/multiple-selection does not use a travelling highlight. Reversal, scroll, resize, removal and stale measurements cannot move selection.

Action/selection controls support ripple?: boolean, resolving absent to false. Per-control opt-in fulfills the selected capability; no additional global ripple switch is selected. This is the selected Q04 scope. It never blocks activation or owns selection. Cancellation/touch scrolling, keyboard origin, disabled state and combined contrast need checks. Shape morphing uses demonstrated needs; do not port the complete Material shape catalogue.

## Verification and implementation boundaries

Every contract requires meaningful native/HTML/Lit/React behavior checks, accessibility and all three engines. Entries identify visual references and deliberate adaptations. The reviewed Pro corpus complements the assigned reference systems. The original proposal assembly changed no source, dependency, generated output or consumer skill; that is historical scope, not a current implementation restriction.

The pre-implementation generated-CSS gate was completed in M00, and M01–M03 implemented the compiler, paths and package delivery. Those dated checks do not replace component browser acceptance. Current work and verification status belong to [STATUS](../docs/STATUS.md); [release evidence](../docs/releases/0.3.2.md) retains the completed pass's scope and limits.

## Convention audit and before/after examples

These measurements come from the 2026-09-20 pre-migration 150-class AST snapshot; they are direct declarations/literal occurrences, not inherited/runtime API coverage. They justify preserving established patterns and identify actual normalization work.

| Convention | Historical replacement mapping | Adoption measured on 2026-09-20 |
| --- | --- | --- |
| Element prefix | acme-button → acme-button | 150/150 registered tags already use acme- |
| JavaScript property casing | minWidth → minWidth, with explicit min-width attribute | 778/778 directly declared @property names use camelCase-compatible identifiers; attribute conversion must still be verified separately |
| Named sizes | Badge md → medium; numeric Avatar dimensions → explicit size/width separation | 15/23 size declarations have full-word small/medium initial values; four have abbreviated initials, two numbers and two empty strings; this does not certify their complete enums |
| Text regions | Chart head → header; Stat desc/foot → description/footer | Eight of 124 literal named-slot occurrences use head/foot/desc/title; native title keeps its own platform meaning |
| Inside affixes | start-icon → start where it is inside leading content | 22/124 named-slot occurrences are already start/end; other slot purposes are not automatically violations |
| Public event prefix/meaning | acme-toggle/acme-expand → acme-expanded-change; slider live acme-change → acme-input | 68 captured public event literal occurrences already have acme-; 25 distinct captured names still need meaning/timing/payload normalization |
| Exports/types | ad-hoc imports → explicit class/definition entries and separate typed React package | Core entries and packed-consumer checks completed in M03; React wrappers were still assigned to M22 at that checkpoint |
| CSS hooks | private selector access → documented parts/tokens/native-content hooks | Existing metadata extraction does not establish full public hook coverage; CEM/runtime comparison is the required completion check |

Keep palette/reference token values distinct from semantic component roles. Generate a documented token manifest that maps each public theme key to one CSS custom property and source role; no duplicate alias names are introduced. Existing palette variables are not renamed solely for novelty. New shared numeric spacing/size variables must reflect the selected categories and full scale, with replacement mappings retained in decision/history records. Exact emitted variable names must agree with generated output and the public manifest.
