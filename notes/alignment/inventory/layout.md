# Remaining layout components — R02

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation follows the approved migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved layout contracts.** Core Box/Flex/Stack/Grid/Simple Grid/Group contracts stay in [inventory.md](../inventory.md). Apply [shared conventions](foundations.md). These entries finish the rest of the layout scope; they are not new inclusion decisions.

## L-06 Inset

**Tag:** acme-inset; React Inset. **Purpose:** extend media/content to a surrounding surface's padding edge without changing Card ownership. Reference: Radix Themes Inset capability named in the pass; preserve house spacing and real wrapper boxes.

**Inputs:** side: "all" | "inline" | "block" | "start" | "end" = "all"; clip: boolean = true; padding?: responsive spacing value; common parent sizing/placement properties. The side vocabulary is a proposed logical-direction adaptation. The nearest participating Card/surface supplies its content inset through a documented internal context, not a hardcoded negative margin. Outside such a surface the inset is zero and content remains ordinary.

**Content:** one default slot; part=root; no events, methods, interaction state or focus behavior. Native child events/semantics remain. clipping follows the parent corner treatment only on touched edges. Images and interactive controls remain author-owned.

**Acceptance:** Card header/body/footer, no Card ancestor, nested surfaces, changed padding/radius, logical sides/RTL, overflow/zoom and focus-ring clearance. The precise public side set is proposed; verify Radix source mapping at its assigned verification gate rather than infer physical-side equivalence.

## L-07 Separator

**Tag:** acme-separator; React Separator. Existing source: src/components/separator/separator.ts. **Inputs:** orientation: horizontal|vertical = horizontal; decorative: boolean = true. One optional default slot is not proposed; content-bearing separators are a layout recipe. part=root. No new events/methods/value state.

Default line is the existing house 1px gray-200 rule, through generated styles. A decorative separator is hidden from accessibility; decorative=false supplies separator semantics and the perpendicular native aria-orientation meaning. It is not a resize handle and receives no tab stop. Host remains a real box; the existing comment claiming display:contents does not describe its implementation.

**Acceptance:** both orientations, stretch/intrinsic size, forced colors, themes, line thickness, accessibility tree and Stack's internal decorative usage. Shared styling hooks --acme-separator-color and --acme-separator-width default to the audited house values. They do not change Stack's selected per-side gap behavior.

## L-08 Scroll Area

**Family:** acme-scroll-area root; acme-scroll-viewport; acme-scrollbar; acme-scroll-thumb; acme-scroll-corner; optional acme-scroll-button. React wrappers match. The root composes these parts; sensible bars/thumb/corner can be rendered internally when omitted. Custom part composition must not create two scroll owners.

**Inputs:** root orientation: horizontal|vertical|both = both; scrollbarVisibility: hover|always=hover; size: tiny|small|medium|large=medium; viewport tabindex=0 when needed for keyboard scrolling; button direction: inline-start|inline-end|block-start|block-end, step?: positive CSS length (absent uses viewport-relative movement). Optional edgeFades=false.

**Methods:** getViewport(): HTMLElement; scrollTo(options: ScrollToOptions); scrollBy(options: ScrollToOptions). Read actual native scroll positions from the viewport. **Events:** native scroll from the exposed viewport; no fabricated acme-change for every pixel. Button actions use native scroll behavior and reduced-motion preference.

**Parts/slots:** root default receives viewport and optional controls; viewport default receives arbitrary content; parts root/viewport/scrollbar/thumb/corner/button. State is derived overflow, drag and visibility; content layout and virtualization remain outside this family. Scrollbars overlay/recede under the selected behavior, preserving native wheel/touch/keyboard scrolling.

**Reference:** [Scroll Area decision](../../decisions/scroll-area-behaviour.md), Chakra/Zag port with Radix comparison; the refreshed Chakra 3.37.0 [API](https://chakra-ui.com/docs/components/scroll-area) supplies hover/always with hover default; no public scrollHideDelay is added from a different library by assumption. Keep Scroller fades/buttons as optional capability; remove its mobileGrid mode in favor of ordinary layout.

**Acceptance:** drag capture/cancel, wheel/touch, overflow updates, RTL scroll conventions, keyboard focus reveal, nested areas, resized viewport/content, disconnect/reconnect and TanStack Virtual measurements. Focusable controls cannot be hidden behind decorative overlays. Scroll Area never owns the virtualizer.

## L-09 Resizable panes

**Family:** acme-resizable, acme-resizable-panel, acme-resize-handle; React equivalents. Replace the old acme-panels layout and use Grid for its non-resizing compositions. Reference: [selected native Zag Splitter port](../../decisions/resizable-panes.md), shadcn composition and APG separator behavior.

**Root inputs:** orientation: horizontal|vertical = horizontal; sizes?: readonly number[] (percentages in visual/DOM pane order; omitted distributes available space equally); disabled=false. **Panel inputs:** value: required stable string; minSize=0; maxSize=100; defaultSize?: percentage; collapsible=false; collapsed=false; collapsedSize=0. **Handle inputs:** disabled=false; keyboardStep=1 percentage point; largeKeyboardStep=10. Step values are concrete house proposals with explicit units, correcting the source documentation mismatch.

**State:** sizes, collapsed keys and previous open sizes, using canonical state. **Methods:** getLayout() → { sizes: `Record<string,number>`, collapsed: string[], previousSizes: `Record<string,number>` }; setLayout(layout); collapse(value); expand(value). Input arrays map to stable panel keys; reordering preserves keyed state. Reject duplicate keys and unsatisfiable constraints with a diagnostic rather than silently assign negative space.

**Events:** acme-input { sizes } during user resize; acme-change { sizes, collapsed, previousSizes } on commit. Restore previous size on reopen, clamped to current limits; drag, keyboard and methods use the same restore path. Application owns persistence. Responsive orientation changes preserve keyed shares where possible; resizing cannot overwrite an independently chosen collapsed state.

**Content/parts:** panel default slot; root default interleaves panels/handles. root/panel/handle parts. Handle is a focusable separator perpendicular to the layout direction, with controls/value/min/max semantics. Collapsed content is absent from focus/accessibility but its author-owned state remains mounted. No arbitrary template cloning or moving React children.

**Acceptance:** 2+ panes, min/max conflicts, pointer cancellation, arrows/Home/End/Shift-step, RTL, collapse/reopen, nested layouts, changed pane order/count, zoom, focus recovery, programmatic restoration and three engines. The recorded source orientation and collapse-path defects are corrected targets, not behaviors to copy. Fixed-pixel panel sizes and automated preference storage are not added.

## Composition examples

Proposed markup:

```html
<acme-resizable>
  <acme-resizable-panel value="navigation" min-size="15" collapsible>
    <acme-scroll-area><acme-scroll-viewport>Navigation</acme-scroll-viewport></acme-scroll-area>
  </acme-resizable-panel>
  <acme-resize-handle aria-label="Resize navigation"></acme-resize-handle>
  <acme-resizable-panel value="content">Main content</acme-resizable-panel>
</acme-resizable>
```

Lit supplies .sizes and handles acme-change; React supplies sizes and the typed onChange mapping. Both save preferences in application code, never in the pane root. State/layout measurements remain the same Lit implementation. No example here is claimed to run in the current package.

## Implementation checkpoint — 2026-09-21

L-07 Separator is implemented. Its canonical properties, decorative default, semantic opt-in, root part and generated color/thickness hooks pass unit/manifest checks and nine native checks in each engine. Vertical lines stretch in both definite-height and intrinsic-height flex rows; the previous percentage-height approach fails the intrinsic case. Forced colors uses CanvasText. Static HTML uses decorative="false", following the [delegated default-true attribute clarification](../../decisions/execution-delegation.md#default-true-property-attributes--2026-09-21). [Evidence](../evidence/m07-separator-2026-09-21.json). Other M07 layout entries remain in progress.
