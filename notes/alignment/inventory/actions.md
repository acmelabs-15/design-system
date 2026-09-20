# Actions, icons and identity — R04

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation follows the approved migration plan. [Approval](../../decisions/inventory-approval.md).

**Complete proposal for review.** All entries use [shared conventions](foundations.md). Their common layout/style inputs are only those explicitly listed, not the entire layout API by accident. Sources: existing classes recorded in [the AST snapshot](../evidence/current-public-interfaces-2026-09-20.json), assigned Geist behavior, [icon decisions](../../decisions/material-symbols-icons.md), [Toggle Button](../../decisions/toggle-button.md), [Avatar Group](../../decisions/avatar-group.md).

## A-01 Button

**Tag:** acme-button. Props variant: default|secondary|tertiary|error|warning|unstyled=default; size: tiny|small|medium|large=medium; shape?: square|circle|pill; disabled=false; loading=false; type: button|submit|reset=button; href="", target="", rel=""; fullWidth=false; ripple?: boolean. Explicit CSS width/height replace pixel-only width. Standard control naming/ARIA and native form association apply.

Default/start/end slots; parts root/label/start/end/spinner. Without href use native button; with href use native anchor. Native submitter inputs name="", value="", form, formAction, formMethod, formEnctype, formNoValidate=false and formTarget preserve their platform meanings; they are not text-field values or validation state. Disabled/loading suppress both anchor activation and button actions. Loading uses Spinner in start, preserves accessible name and marks busy. User activation uses native click; do not invent duplicate acme-click. focus() targets the actual control. Shared form integration must verify submitter identity/value/overrides across the shadow boundary rather than assume an internal button automatically belongs to the outer form.

Keep tiny/small/medium/large source geometry 24/32/36/40 CSS pixels as baseline before density/theme validation. The selected blue/white treatment replaces the old neutral default. default and primary are one look, so retain only default. rounded becomes shape=pill; svgOnly becomes Icon Button; per-state custom color objects become theme/token/CSS customization with equivalent examples. These are proposed final mappings, not compatibility aliases.

Acceptance: native submit/reset outside and inside forms, disabled anchors, keyboard/Space/Enter, loading focus, size/shape, affixes, contrast in combined states, RTL, ripple cancellation and no nested interactive labels.

## A-02 Icon Button

**Tag:** acme-icon-button. Same action/size/variant/disabled/loading/href/type/ripple contract; shape: square|circle=square. Required accessible name uses aria-label or valid labelledby. Default slot holds one icon; no separate icon name property or hidden text heuristic. root/icon/spinner parts. No own events beyond native action. Square means equal dimensions; radius remains a separate styling input. Verify actual hit area, focus, missing name diagnostics and icon-loading replacement.

## A-03 Toggle Button

**Tag:** acme-toggle-button; replaces Chip. Button presentation plus pressed=false; native button type=button; no href and no automatic form submission. Emits acme-change { pressed } after user toggle; programmatic writes update state without user events. aria-pressed reflects persistent state; transient pressing remains separate. Group may arrange multiple toggles but never makes them exclusive. Use Radio/Segmented for one choice. Default/start/end slots and Button parts. Source: selected Radix Toggle/Chakra Button composition comparison.

## A-04 Split Button

**Family:** acme-split-button, acme-split-button-item. Root uses Button for primary action and Menu for secondary actions. Props size/variant from Button; disabled=false; loading=false; open=false; menuLabel: required accessible name. Default slot is primary action text/content; named items slot contains menu items; start/end apply inside the primary action. Item props value: required string, disabled=false; default slot label.

Primary action emits acme-request { action:"primary" }; item activation emits acme-request { action:"select", value } once. Menu open changes follow shared overlay events; item activation closes through Menu rules. root/primary/trigger/menu parts. Escape/focus return and disabled-item discovery follow Menu; primary and trigger are separate tab/action targets. A shadow belongs only to the menu surface.

## A-05 Copy Button

**Tag:** acme-copy-button. Button presentation props plus value="" (the exact string to copy), copiedDuration=1000 milliseconds from current source behavior. Default slot optional action label; start/end slots; root/icon parts. copy(): `Promise<void>` resolves only after clipboard success. Emit acme-copy {} on success and acme-error { code:"clipboard", message } on failure; do not include copied secrets in detail. copied is read-only derived state, not another writable value. Default localized action label is Copy.

Reuse one Button/clipboard action owner. Do not dispatch success before the promise settles, show a global error Toast without application choice, or announce both wrapper and child events. Restore idle feedback after duration; cancellation/disconnect clears timers. [Existing composition defect/fix](../../decisions/compose-the-copy-button.md) remains a required regression.

## A-06 Per-icon elements and Icon Tile

Each selected symbol has `acme-<symbol>-icon` and a matching class/import; default family Rounded and unfilled are selected. Common props family: rounded|outlined|sharp (inherits configured library default), filled?: boolean, size?: CSS length, label?: string. An absent label makes decorative artwork aria-hidden; a label gives an image role/name. SVG uses currentColor; no network fetch, font icon or markup injection.

Provide configureIcons({ family, filled }) before first use and explicit family/artwork imports. Package one pinned official catalog at the baseline weight/optical size, with all selected families/fills verified by the generated manifest. Requested unloaded/absent artwork produces an explicit diagnostic and accessible missing-artwork fallback, never a silent unrelated glyph or network request. Exact fallback rendering and catalog verification are engineering work, not Q11 preference votes. Generated records include symbol name, source revision/license and supported assets. Remove inline competing glyph libraries after mapping.

**Icon Tile:** acme-icon-tile remains a presentation container, default slot icon, size?: CSS length, root part. No value, action or icon-loader engine. Rounded Icon is removed; use the icon element plus suitable Box/Icon Button.

Acceptance: complete catalog manifest, meaningful name mapping, license notices, selective payloads, unavailable family handling, both themes, scale/weight consistency and no accessible duplicate icon inside labelled controls.

## A-07 Avatar

**Tag:** acme-avatar. Props src="", label="", initials="", size: tiny|small|medium|large=medium, shape: circle|square=circle, loading=false. Explicit width permits non-tier dimensions. Slots fallback and badge; parts root/image/fallback/badge. src loads a native image; display fallback on absence/error. Prefer supplied initials over deriving from a name; when deriving, use grapheme-aware initials and locale. No service username URL construction in the core; service-avatar URLs and service marks become recipes with explicit src/content.

No new action; image completion emits acme-load {} and failure emits acme-error { code:"image",message }, without URL secrets. User-chosen label is the accessible image name; a labelled surrounding control may make the Avatar decorative. State includes loading/loaded/error. Verify missing/failed images, changed src, no stale completion, intrinsic dimensions, fallback contrast and naming.

## A-08 Avatar Group

**Tag:** acme-avatar-group. Props members: readonly { id:string, src?:string, label:string, initials?:string }[]=[], size=small, limit=3, extra=0, reverse=false, overlap: auto|CSS length=auto. Limit 0 means all; otherwise it includes the overflow presentation. Extra is a nonnegative count not included in members. Default absent members produces no invented avatar; counts are derived, never decremented below zero.

Propose an overflow slot receiving no secret data; custom content can replace the displayed count while its accessible label uses the full hidden count. Default counts follow the existing +N/9+ visual convention with exact full-count accessible text. The overflow is passive unless the application supplies an explicit action. Parts root/member/overflow. No member menu or live person lookup. Compose general Group internally for arrangement, preserving keyed identities.

Acceptance: 0/1/many members, limit0/1, extra-only, reordering, duplicate IDs diagnostic, overflow count accuracy, reverse stacking, inherited theme and meaningful names. Source preserves counting responsibility; exact legacy one-hidden-member edge treatment is verified against Geist before implementation.

## A-09 Badge, Pill and Tag

| Entry | Proposed inputs/defaults | Content and behavior |
| --- | --- | --- |
| acme-badge | variant: gray\|blue\|purple\|amber\|red\|pink\|green\|teal\|inverted\|trial\|turbo=gray; contrast: high\|low=high; size: small\|medium\|large=medium | Default label, start/end; root part. Passive status/category label, no selection or keyboard engine. Existing source visual enums retained with full size names. |
| acme-pill | size: small\|medium\|large=medium; variant: outline\|solid=outline; count=false; href="", target="", rel="" | Default/start/end; root part. Link only when href supplied; otherwise passive. Count controls numeric presentation, not a fetched value. |
| acme-tag | size: small\|medium\|large=medium | Default/start/end; root part. Passive tag content. Removable tags compose explicit Icon Button; no automatic input/selection system. |

Do not merge these distinct source presentations merely to reduce names. Their anatomy/role differences must remain documented. Tag-list wrappers use Stack unless Group-specific behavior is needed. Badge legacy short size aliases and Pill solid boolean are removed by the new contract.

## A-10 Theme Switcher

**Tag:** acme-theme-switcher. value: auto|light|dark=auto; disabled=false; size: small|medium|large=small. Use Segmented Control or Menu composition with accessible names for all modes; emit acme-request { action:"appearance", value }. It does not change root settings or write storage by import. Application passes the chosen appearance to its Theme scope and optionally persists it. Parts root/control; no arbitrary external theme network resolution. Verify system changes in auto, nested scopes and focus.

## Group compatibility resolved with these entries

General Group can supply size and variant to declared participants. Button/Icon Button/Toggle Button/Split/Copy accept the common Button variants; Radio/Checkbox Cards accept only their listed intersection. A value unsupported by a child does not silently map to another appearance. size uses each family's supported named subset. Explicit child values override; nested Group resets provider defaults. This is a concrete proposal for the complete review, not proof of rendered attached borders.

Example: `<acme-group size="small" variant="secondary" attached>` contains Button/Icon Button actions. Simple wrapping tags use HStack. A disabled collection of form controls uses Fieldset, not Group.
