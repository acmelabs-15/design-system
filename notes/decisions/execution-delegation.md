Decided 2026-09-21 by Peter.

# Finish the approved migration without further decision questions

Peter instructed: “No more questions. Just do all the things that you would recommend doing when you have a question. I just want you to finish.” The agent now resolves remaining implementation, interface and package choices by taking its best evidence-supported recommendation, records the choice and continues. This supersedes the question/approval pauses for those choices in this pass.

The approved inventory, migration scope, evidence standard and verification requirements still govern the work. New findings require investigation and an updated record. They do not require another interview. Continue through implementation, review and final acceptance; do not treat a completed subtask or a passing prototype as completion of the migration.

The immediate application is the recommended @lit/context dependency for theme discovery and subscription transport. TanStack remains the canonical state owner. See [theme architecture](theme-resolution-architecture.md).

## Default-true property attributes — 2026-09-21

Implementation choice under Peter's delegated execution: keep approved boolean property names and defaults, and use an explicitly string-valued HTML attribute where a true default must be turned off in static HTML. Separator's boolean `decorative` property defaults to true; `decorative="false"` opts into separator semantics. Omission restores true. Ordinary boolean attributes whose property defaults to false retain native presence/absence behavior; `disabled="false"` does not enable a control.

The original blanket rule forbidding false strings conflicts with approved default-true properties and static HTML authoring. Lit documents that a default-true property cannot be set false through a native boolean attribute and recommends renaming or a string/number attribute. Preserve the selected names and use the latter approach. Reuse the existing default-true converter; no second alias or negative flag. [Lit boolean attributes](https://lit.dev/docs/components/properties/#boolean-attributes). The Separator unit/manifest and three-engine checks are recorded in the [M07 evidence](../alignment/evidence/m07-separator-2026-09-21.json).

## Typography implementation resolutions — 2026-09-21

Under this delegation, Relative Time uses `format` for long/short/narrow wording and `autoUpdate` (`auto-update`) for automatic refresh. The proposal's `style` and `update` names conflict with HTMLElement.style and LitElement.update. Preserve those platform members and replace the proposed names outright; add no aliases. ISO date-only values mean UTC midnight. ISO timestamps require an offset. Valid inputs normalize to an owned epoch value; invalid inputs produce no invented time. The installed @internationalized/date parser supplies the ISO validation.

Relative Time selects elapsed-duration units, including approximate months/years. It schedules the next rounded-value or unit transition with one owner-window timeout and releases it on disconnect. This retains the locale-sensitive Intl formatter without the removed popup. The reviewed [Shoelace implementation](https://raw.githubusercontent.com/shoelace-style/shoelace/next/src/components/relative-time/relative-time.component.ts) supplies the threshold reference; house tests cover boundaries, zero and lifecycle. No Shoelace or Moment runtime is added.

Kbd's `size` remains its approved small/medium tier; it does not also accept CSS font-size strings. The other shared typography properties still apply. Named key labels use the installed TanStack Hotkeys display formatter, with no hotkey registration. `configureMessages(locale, stringRecord)` supplies application-owned built-in labels. Catalogs are copied, frozen, replaced per locale and resolved through locale ancestry. Kbd's visible and accessible labels have separate keys; accessible text avoids relying on symbol pronunciation. This shared message catalog is the return point for later built-in control labels.

Heading exposes its native heading and registers its authored host ID through a private heading-target protocol. TOC (M16) consumes public native headings and registered house hosts; Markdown (M21) retains native content. The protocol does not crawl arbitrary private shadow roots or invent IDs. These choices implement the approved interfaces and resolve concrete platform collisions; they do not reopen the scope.

## Activity presentation — 2026-09-21

Spinner's omitted/empty label is decorative. A supplied translated label supplies the status text and accessible name through one local text node, with explicit aria-atomic semantics. The application or consuming control owns surrounding busy state. This avoids guessing ownership through ancestor inspection. Search/ComboBox and Button/Menu Button expose their own busy state when composing an unnamed Spinner. [W3C status-message guidance](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22) supports text inside the status container.

Use the approved five size tiers with the first five source geometries and cycle periods. Lit Motion owns opacity; generated CSS owns static blade placement. Explicitly dispose replaced directive controllers through public Lit APIs, retain generation guards and honor live reduced-motion changes. Icon Tile is a presentation container and preserves its child's accessible meaning; its size is an explicit CSS length and its public part is root.

## Native action implementation — 2026-09-21

Use a persistent hidden native submitter in the author's form tree and a native shadow form to bridge the visible action's uncanceled default. Native submitter identity, form data, submit/reset, overrides, external form ownership and implicit Enter pass in all three engines. No event-method patches or synthetic submitter identity are needed. Name the action through visible content or ARIA. The autonomous host is not a native label-for target. This resolves the engineering gate under Peter's delegation; [the action evidence](../alignment/evidence/m09-actions-2026-09-21.json) preserves the limits and tests.

Copy Button's success feedback remains owned by its one action and status region. The default feedback changes from copy to check after clipboard success, then resets; no additional decorative transition is required by the approved contract. Optional press ripple uses the shared Lit Motion controller. Loading retains existing focus while suppressing activation; explicit disabled retains native unfocusable behavior. Compact action sizes use dedicated size/padding roles, not changes to global spacing, text, icon or border scale.

## Identity implementation resolutions — 2026-09-21

Avatar uses native image loading with a separate loaded/error state and source-generation checks. A missing source makes no network request. Explicit initials take priority; otherwise derive first/last word initials with Intl word and grapheme segmentation in the inherited locale. Empty labels make the avatar image decorative; badge content retains separate meaning. Tiny/small/medium/large retain 16/24/32/48px geometry and explicit CSS width preserves a square footprint.

Avatar Group shows all real members when they fit, reserves one bounded slot for overflow when needed, and renders extra-only one as +1. limit=0 shows all supplied members. Count messages use avatarGroup.more plus the locale's plural category (for example avatarGroup.more.one and avatarGroup.more.other), with {count} substitution. Keyed immutable records preserve identity. Count surfaces retain dark black/white contrast through the corresponding theme tokens without resetting every color in the subtree.

Tag's existing 20px treatment is medium; small/large use 16/24px passive-label geometry with 6/10px inline padding. Badge/Pill retain 20/24/32px tiers. These passive sizes do not set the target size for action controls; removable Tag examples compose an explicitly named Icon Button. [Implementation analysis](../analysis/codebase-systematization.md#m09-identity-implementation-review--2026-09-21).

## Selection card action region — 2026-09-21

Expose an actions slot on Checkbox Card and Radio Card for the approved independent secondary-action region. Render it as a sibling of the native label activation surface. This makes the approved behavior concrete without nesting interactive actions inside a label. Heading/description/start/end/default remain selectable card content. General Group joins the outer card surface; the control and its logical selection group still own checked state and submission. Checkbox Cards retain individual marks and never use the travelling single-selection indicator.

## Selection notification boundaries — 2026-09-21

Selection controls and collections expose their own acme-change notifications. An independent action in a card keeps its own direct handler; its notification stops at the containing selection boundary rather than reaching ordinary Card/Group change handlers with the wrong payload. Native click/input/focus events keep normal platform propagation. Capturing instrumentation can still observe descendant events. This matches the approved separation of selection and independent actions and the source hook's owner-specific onValueChange callback. A real Toggle Button in actions reproduced the payload leak in all three engines before the guard.

## Logical collection appearance defaults — 2026-09-21

For selection members, resolve size as explicit member input, then the nearest general Group input, then the owning collection's size when that collection supports it, then the component default. This gives Checkbox Group's approved size property a useful defaulting role without overwriting an authored child size or taking appearance ownership away from a nearer general Group. Variant stays with the member and general Group; Checkbox Group supplies no variant. The existing appearance helper gains an optional readonly fallback source; behavior is unchanged for components without that source.

## Private indicator delivery and spring mapping — 2026-09-21

Under Peter's execution delegation, keep acme-selection-indicator under src/internal with @internal and a generated private definition. Public owning families register it transitively. Consumer exports, manifest/API pages and standalone CDN entries expose public families only. This implements S-07's approved internal boundary.

Map the selected Standard/Expressive roles through Lit Motion's public SpringController using unit mass and physical damping derived from the source damping ratio. Standard/default spatial serves the recurring selection indicator; no global scheme is chosen. The theme catalog exposes all 24 numeric role parameters. [Source and implementation evidence](../alignment/evidence/m10-selection-indicator-2026-09-21.json) records provenance, tested behavior and remaining integration gates.

## Segmented and binary selection details — 2026-09-21

Under the delegated implementation authority, Segmented Control composes one shared scalar selection owner, native radio items, Group presentation and the internal indicator. Root size is the default for its parts; items do not inherit unrelated standalone Radio properties. The outlined treatment uses four-pixel padding, a one-pixel frame and 24/28/32px item hit heights (34/38/42px overall). The selected gray fill gains a gray-800 inner outline to meet 3:1 state-boundary contrast while retaining the requested light fill.

Binary Switch retains its source track geometry and adopts the approved canonical checked/form contract. Its Standard/fast thumb spring is independent from optional ripple. Replacements remove old Toggle and segmented Switch Control exports and migrate their actual callers. [Acceptance and discoveries](../alignment/evidence/m10-segmented-switch-2026-09-21.json).

## Tabs relationship and mounting details — 2026-09-21

Use native element-reference properties and the registered public Tab/Panel hosts to establish relationships; a direct sibling-private label reference is filtered by WebKit. This resolves the engineering mechanism behind the inventory's registration/ID proposal. Ordinary panel children remain author-owned. An inert template or pure renderContent callback supports the approved lazy/unmount options, with generated content mounted in an owned light-DOM container so surrounding native forms keep their controls. Static slot content takes precedence and receives a diagnostic if mount control is requested without a renderer. React reconciliation remains the M22 adapter gate.

Keep the source 50px primary tab control, 24px inter-tab gap and 12px panel separation. Adopt only the selected primary indicator geometry: 3px thick, at least 24px long and inset 2px from the content region, using house blue roles. The vertical logical-start adaptation and the inset Group treatment retain their approved separate identities. [Implementation and verification](../alignment/evidence/m10-tabs-2026-09-21.json).

## Native container boundary for Fieldset — 2026-09-22

Under Peter's delegation, retain the approved Fieldset capability using a real native fieldset in the component's light DOM. A shadow fieldset does not disable projected controls. Move complete author node ranges without cloning them; require a native legend for native first-legend behavior. Structural reconciliation has a completion boundary; existing disabled-property changes remain synchronous.

Renderer adapters provide the stable native child before connection, so React owns the correct DOM parent. Record this as x-acme-native-root metadata and implement it in M22. Generated scoped styles apply in the host's actual tree root. [Browser, Lit, React and source evidence](../alignment/evidence/m11-fieldset-2026-09-22.json) supports this boundary. This retains native and house form controls without creating a second group-disabled state engine.

## Field association details — 2026-09-22

Keep Field required/optional as the approved label presentation and keep native required on the value control. Field invalid supplies presentation and active error association; native validity stays with the control. One Field can name one registered logical value owner, including a composite root or a native input/select/textarea. Explicit control naming and native labels remain authoritative. Help/errors supplement existing descriptions.

Use public element references where their scope is valid and retain scoped text mirrors for the remaining boundary. Transfer registry ownership before re-associating a moved control. Field disabled supplies a reversible context without replacing the control's own state. [Implementation evidence](../alignment/evidence/m11-field-2026-09-22.json).

## Text control implementation details — 2026-09-22

Under the delegated execution authority, retain raw string reset defaults separately from browser-sanitized current values. Preserve native event meanings and native textarea hard-wrap serialization. Bridge the native input's implicit submit action to the outer form using its default submitter, including cancellation and disabled-default behavior.

Expose all four approved affix slots together rather than discarding inside content when an outside add-on is present. This replaces the earlier one-cell precedence implementation in input-affix-api.md. Each outside action retains its own focus; Group still owns sibling attachment. The visible control boundary uses gray-700, following the selection-family contrast correction; final rendered contrast is checked before acceptance. Search and Password Input reuse the single-line implementation with fixed native types. Clearable Input is removed; Input owns clearable behavior. [Implementation analysis](../analysis/lit-practice-review.md#m11-text-control-implementation--2026-09-22).

## Number Input format and action boundaries — 2026-09-22

Under delegated execution, Number Input formatOptions uses Intl options with notation limited to standard. The selected Adobe parser and Adobe's own NumberField do not support reliable compact/scientific/engineering input parsing; local probes demonstrate wrong numeric results. Reject those options before changing state. Keep the full display-only Format Number API. This replaces the broader notation allowance implied by the inventory's original Intl.NumberFormatOptions type. [Evidence and source](../analysis/package-choices.md#m12-port-preparation--2026-09-22).

Optional increment/decrement parts bind to the nearest Number Input through the installed Lit context mechanism and read its TanStack state. The root supplies both actions when no custom control content is supplied. Authors who supply that content include the actions they need. Parts retain authored appearance, followed by Group defaults and then numeric-control defaults. A part outside a Number Input is disabled; moving a part transfers its owner.

## Menu navigation policy — 2026-09-22

Under delegated execution, disabled menu actions remain reachable by arrow navigation and typeahead, but cannot activate or follow links. This meets the approved disabled-discovery requirement and current Material/APG guidance. Material Web's contrary skip-disabled implementation is not copied. Native Tab leaves the menu; Escape closes the topmost menu and returns focus. Each menu owns only its immediate collection, including items in its sections and excluding nested menu collections. [Full review and source boundaries](../analysis/codebase-systematization.md#m13-menu-reference-review--2026-09-22).

## Menu composition and completion — 2026-09-22

Use Menu Content as the native manual-popover surface. Each Trigger, Content and Item registers with the nearest Menu through Lit context. Nest a Menu in an item's submenu slot; the item is that submenu's opener. Section uses heading; Separator is non-focusable. Native action links use href/target/rel, while checked items use native button activation and checkbox/radio menu roles. textValue supplies an explicit typeahead label when rich visible content needs one. These additions make the approved family concrete using the reviewed Radix/Chakra/Material contracts.

Public show(), hide() and open writes are programmatic and silent for user-change notifications. A completed owned transition still reports its completion. A focused closing menu returns focus before its content becomes inert. If application selection has already focused a dialog, the menu preserves that focus. Lit Motion's public spring state determines completion; there is no copied fixed exit timer. Composed-tree ownership, rather than CSS focus-within, checks focus across nested top-layer popovers: native probes showed CSS focus-within dropping the parent relationship.

Split Button composes Button, Group, Menu Trigger and Menu Content. Split Button Item reuses the full Menu Item contract, including descriptions and optional checked choices, rather than maintaining a second item implementation. Root menuLabel is required; an unnamed secondary trigger is disabled. The former Split Button presentation/event names and independent popup/navigation code are removed together with their callers.


## Selection trigger ownership — 2026-09-22

Under Peter’s instruction to complete the work using supported recommendations, Select and Multi Select retain ownership of their native trigger button. The trigger slot accepts noninteractive content inside that button. Styling uses its CSS part. The previous proposal for an arbitrary supplied native button is replaced. A Chromium native accessibility-tree probe shows that an external light-DOM button cannot expose its controls relationship to the internal shadow listbox; property readback is empty. Moving focus into a listbox could work for Multi Select, but WAI marks the equivalent single-select button/listbox example deprecated. Keeping the modern select-only combobox relationship, one consistent trigger model and author node identity is preferred. No content cloning or external button adoption is introduced. The source fixture and AX output are captured in the M13 selection preparation evidence.


## Ranked option projection — 2026-09-22

Under the same delegated authority, ComboBox options are direct children and optional section text supplies native labelled result groups. Rich noninteractive children inside each Option remain supported. The root projects the exact ranked subset with manual slots and never moves author nodes. Each contiguous section run creates one group, so a section label can repeat when rankings interleave sections. Empty built-in queries retain author order; custom-filter order wins. Select and Multi Select keep their ordinary nested-section projection. Arbitrary wrappers around ComboBox options receive an authoring diagnostic.

Evidence changes the earlier arbitrary-nested-section proposal for ranked ComboBox: moving keyed Lit child elements leaves deleted results visible in Chromium, Firefox and WebKit; direct-child manual projection works in all three engines, while nested descendants cannot be assigned. Chromium also lacks the tested aria-owns element-reference APIs, so CSS ordering with those properties cannot certify accessibility order. A data/callback renderer would replace the authored-option interface and require additional renderer adapters. Direct Option projection retains HTML/Lit/React node ownership with the smallest coherent contract. Grouped projection and renderer-update acceptance remain required before completion.


## Slider native label contract — 2026-09-22

Under delegated execution, the per-thumb accessible-name array is thumbLabels. The inherited labels property remains the native NodeList of associated label elements. The proposed labels array conflicts with AcmeFormElement and the platform-facing form contract; a specific thumbLabels name preserves both meanings without a type cast or a second form bridge. F-07 is updated. The Slider source/reference review records this finding and the remaining implementation checks.


## Calendar date runtime correction — 2026-09-22

Under delegated execution, correct the verified @internationalized/date 3.12.4 parser defects at their upstream implementation and ship one private generated runtime containing that exact correction. A local dependency patch alone does not reach fresh split-ESM consumers. All house runtime date imports use the private artifact; consumers do not need postinstall mutations, patch configuration or a registry fork. Retain the upstream types, exact-version/hash provenance and required Apache notices. RelativeTime and Calendar public regressions plus fresh package/CDN/bundle checks must pass before acceptance. This is a selected implementation direction, not a claim that the correction has shipped.


## Slider value and completion behavior — 2026-09-22

Preserve finite ordered programmatic values in the canonical store and native FormData. Bounds/grid/gap errors participate in validity; native thumbs use a constrained display projection. This follows Number Input and permits value-first or min/max attribute ordering without losing supplied values. User edits snap/clamp to legal neighboring bounds without pushing other valid thumbs. Pointer cancellation, focus transfer, disable and disconnect retain the last live edit and emit no completion. Overlapping thumbs choose the movable outer thumb from the initial drag direction, then retain its index. thumbLabels supports validated JSON in HTML as data-only accessible names, alongside property arrays in Lit/React. These details are resolved under delegated execution and require final integrated acceptance.
