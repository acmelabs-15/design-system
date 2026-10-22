# Surfaces and structured content — R07

**Status: approved contract.** Peter approved the complete proposal set on 2026-09-20. The stated recommendations are selected; explicitly recorded later resolutions are incorporated below. [Approval](../docs/decisions/0049-inventory-approval.md). Verification evidence retains its original date and scope.

**Approved family contract.** Use [shared conventions](SPEC-foundations.md), assigned reference behavior and the selected distinctions among Card, Item, List, Field and selection controls. None becomes a universal interactive row.

## C-01 Card

Family acme-card, acme-card-header, acme-card-body, acme-card-footer. Root props variant: default|outline|subtle=default; size small|medium|large=medium; as: div|section|article=div. Root default slot composes optional sections; sections each have default content. Header may contain Heading, Text and actions; no automatic heading level. root/header/body/footer parts; common padding/radius/color hooks use generated tokens.

Linked Card uses one real Link placed in the heading/content with a documented stretched-hit-area style; independent actions stay outside that link and above its hit layer. Do not render an anchor around nested buttons. Root has no selected/open state or new action events. Header/footer are regions, not aliases for heading text. Inset can bleed media to the surface edge without a second border.

Source: [one Card decision](../docs/decisions/0012-canonical-card.md), historical Card/Panel/Link Card implementations, Chakra/Radix/Web Awesome and Material experimental comparison in [container analysis](../docs/research/06-codebase-systematization.md#phase-2-container-family). The selected replacement maps Panel/Panel Head/Panel Foot/Link Card/Tile surfaces to this family and recipes.

Acceptance: omitted sections, rich media, linked surfaces with independent actions, heading hierarchy, native as, responsive/RTL, unequal content, theme padding/radius and Inset focus clipping.

## C-02 Item

Family acme-item, acme-item-media, acme-item-content, acme-item-heading, acme-item-description, acme-item-metadata, acme-item-actions. Root props variant: default|outline|muted=default; size small|medium|large=medium; orientation horizontal|vertical=horizontal. Each part has a default slot and no competing value source. Part names match suffixes; root/content/media/actions remain ordinary real boxes.

Item is descriptive structure. It supplies no selected value, list role, link destination, disclosure or keyboard engine. Link/Button/Radio Card/Checkbox Card own activation. For a navigation row, place the main content in a real Link and secondary actions in sibling action content. Do not wrap the whole row in a button when it contains another control. Heading part does not force an h-level; compose Heading or plain text appropriate to context.

Source: [focused Item decision](../docs/decisions/0050-item-content-family.md), complete shadcn Item and multi-system row comparison, Pro settings/webhook/property-panel examples. Entity/Entity Content/Entity List/Items/Setting Row/Setting Rows remain removed by the selected replacement. Stripes and separators are List/Stack recipe styling, not a new Item Group.

Acceptance: media absent/large, action overflow, long headings/metadata, selectable-card label boundaries, native link focus and real list/tree/field compositions. No action is hidden solely on hover when needed by keyboard/touch.

## C-03 List

**Tag:** acme-list. Root marker: native|none|custom=native; spacing?: responsive spacing token. Default slot contains an author-owned native ul or ol with native li children. Use native start/reversed/value attributes for ordered numbering. Rich Item content sits inside li; nested lists retain their native structure. There is no acme-list-item wrapper around an li.

The root supplies generated scoped document styling and inherits tokens; its shadow part is root. Native list/item/marker hooks use documented data-acme-list-part attributes and CSS variables, not nonexistent shadow parts. This uses the native-content approach selected for Table and Data List and avoids invalid custom children directly under ul/ol.

No selection/current value, roving focus or listbox keys. Nested controls retain their behavior. Custom markers do not remove accessible list identity or duplicate spoken numbers. Source: [List decision](../docs/decisions/0054-list-component.md), Chakra List/Pro compositions and [Material List comparison](../docs/verification/systematization/material-list-specs-2026-09-19.json). The native-content delivery is a Lit adaptation, not an assertion that Chakra requires this markup.

Acceptance: ordered starts/reversal, nested mixed lists, rich items/actions, custom markers, document stylesheet delivery and real screen-reader collection counts. Verify the host and native list together; preserving tags alone is not enough. The completed pass tracked this requirement under E02.

## C-04 Data List

**Tag:** acme-data-list. Root orientation horizontal|vertical=horizontal; size small|medium|large=medium; columnWidth?: CSS size. Default slot contains an author-owned native dl with optional div pair groups, native dt terms and dd definitions. Rich badges, links, formatted values and copy controls remain framework-owned inside dd. No acme-data-list-item wrapper disrupts native relationships.

The root supplies generated scoped document styling. Root is the shadow part; native item/label/value hooks use documented data-acme-data-list-part attributes. No value-array form submission, selection or keyboard state. This is a native definition list, not an HTML datalist or Field.

Description and KV are replaced by this contract and examples. Sources: [Data List decision](../docs/decisions/0023-data-list.md), the historical description.ts and Chakra/Radix comparison. The native-content composition keeps exact terms/definitions visible to the browser and framework; it needs stylesheet, layout and accessibility verification.

Acceptance: multiple definitions per term, grouped pairs, long labels, dynamic rich values, responsive stacking, direction and accessible relationships.

## C-05 Disabled Wall

Tag acme-disabled-wall. Props disabled=false; reason="" optional explanatory text. Default slot is existing content; explanation slot may supply richer noninteractive guidance; root/content/explanation parts. It does not replace Fieldset or mutate children's own disabled settings. When disabled, apply native inert to content and expose the explanation outside that inert subtree; preserve content state. No special selection/form owner or action event.

If disabling would strand focus inside, move focus to a named focusable explanation/owner supplied by the application or the nearest safe control according to the integration contract; verify rather than silently focus body. Historical baseline: src/components/disabled-wall/disabled-wall.ts; form grouping belongs to Fieldset. Acceptance includes dynamic disable/enable, focus recovery, native-form submission responsibility, pointer/keyboard suppression and retained child disabled state.

## Required recipes and migration mapping

| Retired arrangement | Selected composition and owner |
| --- | --- |
| Settings rows | Field owns associations; Item supplies descriptive content/actions; Card optional surface; Stack arranges rows |
| Integrations/link cards | Card with a real content link and separate secondary actions |
| Tile/Tiles and metric rows | Card for subjects; Stat for measurements; ordinary Stack/Grid for placement |
| Bar Row/Bar Rows | Item/List with Progress for completion or Meter for bounded measurement |
| Task/Tasks | Item/List containing Code/Snippet and application-owned action/result status; no library task runner |
| Stat Strip/Strip Item | Radio Cards for one selected metric or Checkbox Cards for multiple; Stat inside; Group only for joined presentation |
| Check Row | Field/Checkbox or Item plus a Checkbox with explicit label association; no second check engine |

Example content can include badges, timestamps and callbacks, but examples do not imply working webhook/network backends. Lit/React keep ownership of child content and events; composed wrappers must not redispatch one action twice.
