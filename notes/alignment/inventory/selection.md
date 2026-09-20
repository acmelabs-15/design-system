# Selection and tabs — R05

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation awaits the Phase 5 migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved family contract.** These components share semantics/behavior primitives, not one ambiguous selected-state property. Use [foundations](foundations.md), native forms, house blue state roles and the [selected internal indicator](../../decisions/shared-selection-indicator.md). References and house differences are recorded in [selection review](../../analysis/codebase-systematization.md#phase-2-closure-review) and [Group review](../../analysis/codebase-systematization.md#comprehensive-chakra-group-review).

## S-01 Checkbox and Checkbox Group

acme-checkbox props checked=false, indeterminate=false, value="on", name="", disabled=false, required=false; size: small|medium|large=medium; invalid=false presentation; ripple?: boolean. Default slot is label; description slot optional. root/control/indicator/label/description parts. Native checkbox semantics, focus and successful-value behavior; indeterminate is independent of submitted checked value. User action emits acme-change { checked, indeterminate:false } after canonical/form synchronization.

acme-checkbox-group props value: readonly string[]=[], name="", disabled=false, required=false; size?: shared size; invalid=false. Default slot holds Checkbox or Checkbox Card members; group label uses Field/Fieldset or standard ARIA. Membership values are unique. It owns the array and aggregate requirement; repeated form entries serialize selected members exactly once. Emits acme-change { value } once; contained change is internal coordination. No roving keyboard focus or automatic check-all/parent propagation. Methods focus() to first enabled member; no hidden toggle-all API.

## S-02 Radio and Radio Group

acme-radio props value: required nonempty string, checked=false standalone, name="", disabled=false, required=false; size: small|medium|large=medium; ripple?: boolean. Default label and description slots; root/control/indicator/label/description parts. In a Radio Group, checked is derived from the group's value, not an independent writable competing state. Outside a group, normal radio/name grouping must be verified across scopes.

acme-radio-group props value?: string, name="", disabled=false, required=false, orientation: horizontal|vertical=vertical, loop=true. No selection by default unless explicitly supplied. Arrow behavior and Space follow the assigned radio reference, with RTL and disabled members; one tab stop among enabled members. Emit acme-change { value } once. Native form owner is group; children do not submit duplicates. Group presentation can be nested without stealing membership or keyboard ownership. focus() targets selected enabled member or first enabled member.

## S-03 Checkbox Card and Radio Card

Tags acme-checkbox-card and acme-radio-card. Use the corresponding control/value contract above, size small|medium|large=medium, variant: default|secondary=default. Default slot contains rich descriptive content; heading/description/start/end slots provide structured alternatives, with slot precedence explicitly over same-role text properties if such properties are later added. No heading/description string props are proposed here. root/control/indicator/content/label/description parts.

Whole-card activation belongs to one native control/label relationship. Do not nest arbitrary interactive actions inside a label hit surface. Independent secondary actions occupy a documented action region outside that activation target. Preserve native accessible names and keyboard behavior; visual selection is not enough. General Group joins documented card surfaces; Checkbox Cards never acquire a single travelling indicator.

Radio Card List/Checkbox Card List are recipes using the corresponding state-owning group plus Group/Stack/List as appropriate, not extra competing selection families. A selectable Stat is content inside the card, not a separately clickable Stat.

## S-04 Switch

Tag acme-switch replaces current Toggle; old Switch/Switch Control become Segmented Control. Props checked=false, value="on", name="", disabled=false, required=false; size small|medium|large=small; labelPosition: start|end=start; ripple?: boolean. Default label slot; root/control/thumb/label parts. Binary native checkbox behavior with switch role; Space toggles, form submission/reset follows checked. acme-change { checked }. Preserve state transitions through Lit Motion independently of optional ripples; no label-casing/no-margin aliases.

## S-05 Segmented Control

Family acme-segmented-control and acme-segmented-control-item. Root props value?: string, name="", disabled=false, required=false, orientation: horizontal|vertical=horizontal, size small|medium|large=medium; item value required, disabled=false. Items contain default content or icons with accessible labels.

Compose shared Radio Group behavior, Group presentation and internal single-selection indicator. Empty selection is allowed until required validation; no implicit first choice. Root owns one value/form entry and acme-change { value }; arrows/Space/RTL follow Radio, not Toggle Button. root/item/indicator/label parts. The requested outlined/inset-highlight appearance is the default treatment; source screenshot/house tokens define its visual reference, with exact contrast/geometry checked at its assigned verification gate.

## S-06 Tabs

Family acme-tabs, acme-tab, acme-tab-panel. Root props value?: string; orientation horizontal|vertical=horizontal; activation: automatic|manual=automatic; variant: primary|inset=primary; disabled=false. Tab value required, disabled=false; Panel value required. Root default slot holds tabs, panels slot holds panels. Native tablist/tab/tabpanel relationships use shared registration/IDs; no form value.

If value omitted, choose the first enabled tab once when members are available, consistent with the existing family behavior unless source verification identifies a required correction. Arrow keys move focus; automatic mode selects on focus, manual requires activation; Home/End/RTL follow APG/reference. Emit acme-change { value } only from root. Panel state is derived, not separately writable.

Primary indicator follows the selected Material primary-tab anatomy/states/motion; inset follows Peter's outlined/pill screenshot. Both use the shared internal indicator. For vertical orientation, propose the same primary indicator along the logical start edge of the selected tab, with the shared indicator's vertical movement. This is a named house adaptation of Material's horizontal treatment, not a claim that Material specifies vertical tabs. Its dimensions/contrast and source-token mapping must pass visual review at its assigned verification gate; no unsupported variant/orientation combination is silently accepted. Inactive panels remain mounted but hidden/inert by default. lazyMount=false and unmountOnExit=false follow the verified [Chakra Tabs API](https://chakra-ui.com/docs/components/tabs); opt-in unmounting uses framework-owned templates, not destructive child cloning. Q05 is resolved from sources and is not a user question.

Parts root/list/tab/indicator/panels/panel. Panel labels reference their Tab and focusable content remains reachable. No separate tooltip string API on Tab; compose Tooltip when needed.

## S-07 Shared indicator

Internal acme-selection-indicator is not a second public selection control. Inputs are selected target Element|undefined, orientation and treatment geometry from the owning family; no value/name/checked/keyboard state. It contains Lit Motion and supports horizontal/vertical translation and resizing, interruption, removal, reflow and reduced motion. aria-hidden and pointer-events:none. Its painted position never determines selected value. Public consumers use the family parts/theme hooks, not imperative indicator installation.

## Compositions and acceptance

```html
<acme-radio-group name="plan" value="standard" aria-label="Plan">
  <acme-group attached>
    <acme-radio-card value="standard"><span slot="heading">Standard</span></acme-radio-card>
    <acme-radio-card value="pro"><span slot="heading">Pro</span></acme-radio-card>
  </acme-group>
</acme-radio-group>
```

Lit binds .value and @acme-change; React supplies value and typed onChange. Neither wrapper renders a second hidden submission control. Field/Fieldset supplies group help/errors separately.

Verify state/ARIA/form agreement, no duplicate events/submission, disabled/nested Group behavior, conditional/reordered members, missing/duplicate values, true indeterminate state, native reset/restoration, keyboard focus/activation, RTL and Toolbar key ownership. Verify both indicator axes, scroll/resize/interruption, themes, forced colors, compact click targets and genuine screen-reader relationships. No control is accepted solely from a rendered screenshot.
