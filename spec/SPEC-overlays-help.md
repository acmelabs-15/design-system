# Overlays and contextual help — R10

**Status: approved contract.** Peter approved the complete proposal set on 2026-09-20. The stated recommendations are selected; explicitly recorded later resolutions are incorporated below. [Approval](../docs/decisions/0049-inventory-approval.md). Verification evidence retains its original date and scope.

**Approved family contract.** Use the selected [controller/native-surface architecture](../docs/decisions/0075-overlay-architecture.md), [Dialog/Alert Dialog split](../docs/decisions/0028-dialog-components.md), [help purposes](../docs/decisions/0076-overlay-help-components.md) and [shadow roles](../docs/decisions/0039-floating-surface-shadows.md). No new overlay engine or React runtime.

## Shared overlay contract

open=false is intended state; visibility during exit is derived. Native modal resources/scroll locking remain until the owned exit ends. Reopening cancels exit; removal cleans up immediately; stale Floating UI results are discarded. The opener and relevant theme scope survive into placement/focus handling; no duplicated shadow on composing wrappers.

Events: acme-open-change { open, reason } for a user-triggered state change; cancelable acme-request { action:"close", reason } before dismissing; acme-after-open/close { reason } on completed transitions. Programmatic open writes follow shared notification rules without fabricated user gestures. reason: trigger|escape|outside|close-control|selection|programmatic. Methods show(), hide(), focus() where meaningful.

Opening/closing in one task is deterministic; a child's unrelated animation cannot prolong modality. Each family explicitly defines Escape/outside/focus behavior below. All require accessible name, actual focus-target handling, nested-surface coordination, reduced motion and three-engine verification. An animation Promise is not by itself proof that native isolation is retained.

## O-01 Dialog

Family acme-dialog, acme-dialog-trigger, acme-dialog-close. Root open=false, modal=true, closeOnEscape=true, closeOnOutside=true, initialFocus?: Element|selector, returnFocus?: Element|selector. size small|medium|large=medium; placement=center. Selected widths are 400/540/800px within the viewport; medium retains the original 540px baseline. Slots trigger/header/default/footer; heading/description slots may supply direct naming content; parts root/surface/header/body/footer/close; native backdrop styling is exposed through surface::backdrop.

Use native modal dialog for modal=true. For non-modal presentation use the documented native surface mode with no modal isolation; verify focus/stack behavior rather than simply omit an attribute. Default initial focus follows native/accessible Dialog guidance, preferring explicitly supplied focus and avoiding forced focus into a destructive action. The selected focus-trap helper owns Tab containment only; native dialog owns modality/background inertness, the overlay coordinator owns dismissal/return focus, and TanStack owns state. Configure no helper initial/return focus, Escape/outside deactivation or subtree isolation; use open-shadow traversal and one trap stack per document, pausing when inert and releasing with the overlay. [2026-09-22 resolution](../docs/decisions/0035-execution-delegation.md#native-modal-focus-containment--2026-09-22). Return to connected opener or a deliberate fallback on close.

Action buttons are application-owned; success/failure does not automatically close the dialog. There is no implicit busy→disable-dismissal rule. Applications may explicitly set dismissal flags when justified; hidden in-flight work, cancellation and error reporting remain their responsibility. Modal and Destructive Modal remain removed; typed confirmation is a recipe using Alert Dialog or Dialog as appropriate, Field, Input and Button.

Acceptance: name/description, long content focus, nested menus/help/dialogs, close/reopen mid-exit, removed opener, external focus target, outside pointer sequences, form validation and no background interaction through exit.

## O-02 Alert Dialog

Family acme-alert-dialog with trigger/action/cancel parts. Same shared lifetime; modal=true, closeOnOutside=false; closeOnEscape=true by the selected reference default; explicit name/description required. Action is an ordinary Button that requests the application operation; Cancel is a close control. Do not infer success or automatic closure from pressing Action.

Default initial focus targets Cancel or another least-destructive response, unless the content requires a static reading target. This is the task-sensitive accessible contract supported by the reviewed reference; application can supply initialFocus. Confirmation text matching, action pending state and retry/error content are recipe-owned. Body/header/footer and action/cancel parts expose styling without a separate destructive family.

The reviewed Base example distinguishes Action from Cancel's close behavior; the existing old component's inconsistent loading/Escape policy is not retained. Verify keyboard/cancel, typed-value reset per opening, success/failure/retry and correct alertdialog semantics.

## O-03 Drawer

Family acme-drawer with trigger/close; root props open=false, modal=true, placement: start|end|top|bottom=end; closeOnEscape=true; closeOnOutside=true; initialFocus/returnFocus as Dialog. Size is a CSS dimension appropriate to the movement axis; the default is sizes.acme-drawer-size (24rem), and explicit size overrides the movement axis. This is not a copied Material pane width. Slots trigger/header/default/footer; parts surface/header/body/footer/close; style the native backdrop through surface::backdrop.

Compose native Dialog lifetime with directional Lit Motion. No automatic drag-to-dismiss capability is added without an assigned source requirement; it would need a separate pointer/focus contract. Mobile Sidebar uses this same implementation and preserves its own desktop/mobile state separation. Sheet is removed. Verify all placements, RTL, viewport/safe-area changes, nested scroll, focus, interruption and reduced motion.

## O-04 Tooltip

acme-tooltip props content="", open=false, side=top, align=center, sideOffset=4; openDelay=0 and closeDelay=100 milliseconds preserve the inspected current Tooltip timing (delayTime and LEAVE_MS), with component interaction verification still required. disabled=false. Default slot is the trigger; content slot may replace text with noninteractive simple formatting. root/content/arrow parts.

Opens on pointer hover and keyboard focus, closes on leave/blur/Escape. No focus trap or interactive controls in content. Trigger owns its accessible name; tooltip supplies a description. Avoid duplicate native title bubbles. Native control wrappers must preserve the actual focus target and pointer events. No plain-tooltip shadow, as selected. Do not make disabled native buttons focusable by stealth; use a deliberate wrapper/help composition when needed.

Acceptance: hover/focus/Escape, content replacement, touch expectations, delayed open cancellation, moving anchors, disabled trigger, descriptions and no pointer flicker. Rich previews move to Hover Card; interactive help moves to Toggle Tip.

## O-05 Hover Card

acme-hover-card props open=false, side=bottom, align=start, sideOffset=4; openDelay=600 and closeDelay=300 milliseconds from the reviewed Chakra 3.37.0 API; disabled=false. Default trigger slot and content slot; root/content/arrow parts. Supplementary preview only; no essential information exclusively inside it. Tooltip and Hover Card preview content is inert and provides a preserved trigger description; hover/focus neither replaces the native destination nor adds a wrapper tab stop. No touch interception is added.

The selected interactive-help rule overrides examples that put required actions in a hover-opened preview: use Toggle Tip for those. Trigger can remain a real navigation link; opening a preview does not cancel normal activation. Keyboard/touch users have access to the underlying destination/content. Focus does not jump into a hover preview. Shadow4; inherited relevant scope theme.

Acceptance: pointer transfer between trigger/content, delayed dismissal, keyboard/native link activation, touch, moving/removing anchors, no unreachable focusable content and reduced motion. Context Card is fully removed.

## O-06 Toggle Tip

acme-toggle-tip props open=false, side=bottom, align=start, sideOffset=4; closeOnEscape=true, closeOnOutside=true. Toggle Tip owns an explicitly activated native Button with a required name. Its trigger slot supplies label content, not another button; the native labelled-by relationship follows that live trigger. Content may contain links/actions; parts trigger/content/arrow/close. Slots trigger/default content.

Compose the shared non-modal anchored overlay; activation toggles open. Focus behavior follows content needs and the assigned Popover-based reference: move into interactive content when opened by keyboard, close on Escape, return to connected trigger, and avoid trapping focus as a modal. Shadow5. This is the named public help component; a separate universal public Popover is not added without an actual unmet requirement.

Acceptance: click/tap/keyboard parity, Tab/Shift+Tab, nested Dialog/Menu, outside dismissal, pointer transfer, trigger removal, content changes and accessible expansion/control relationships.

## Reference-derived defaults and engineering work

Delays are now explicit source facts: current Tooltip source supplies 0ms open/100ms leave; [Chakra Hover Card](https://chakra-ui.com/docs/components/hover-card) supplies 600ms open/300ms close. Those are different assigned contexts, not one arbitrary universal delay. Their exact rendered interaction still requires verification.

Required verification covers native top-layer mode, parent/child coordination, ARIA reference forwarding and real focus outcomes. Existing bounded probes establish only their recorded cases. Replacing custom surfaces with a native element does not by itself establish acceptance.

## Typed confirmation recipe

An Alert Dialog owns modality and naming. Field/Input owns confirmation text. Application compares the phrase, handles the operation, supplies pending/error status and closes only on its chosen outcome. Cancel closes through the normal path; it does not falsely claim to cancel a completed server action. Reset the local typed phrase on a fresh opening while preserving failure context during retries. Reuse this recipe in Lit/React without a second dialog state machine.

## O01/O02/O03 engineering resolution — 2026-09-23

The native backdrop is exposed through surface::backdrop, refining the original separate-backdrop-part proposal; explicit close controls expose their own shared action parts. Dialog medium retains the 540px baseline, with small=400px and large=800px, bounded by the viewport. Drawer uses the sizes.acme-drawer-size theme token (24rem by default); its optional size property overrides the movement axis. Generic Inset uses the shared body-padding context. A connected opener supplies its complete theme and public CSS tokens. If it disappears before native opening, connected focus or the dialog scope supplies the fallback. Removing an opener after opening preserves the captured scope. [Acceptance](../docs/verification/systematization/m17-native-dialogs-2026-09-23.json).


## O04/O05/O06 implementation resolution — 2026-09-23

[Help acceptance](../docs/verification/systematization/m17-help-2026-09-23.json) records the 2026-09-23 help-slice result; it does not erase the later baseline failure below. Toggle Tip owns its native Button; the trigger slot supplies label content, avoiding nested buttons. Its native labelled-by reference tracks the live trigger. Supplementary Tooltip/Hover Card previews are inert and their text supplies a preserved trigger description; interactive help belongs to Toggle Tip. Hover/focus do not replace a native destination or add a wrapper tab stop. No touch interception is added to supplementary previews. Context Card and all retired Tooltip producers are removed.

## Verification limit carried into the workflow migration

The 2026-10-21 baseline documents one failing Chromium Hover Card case: native destination activation leaves the fragment empty instead of #profile. The cause remains unverified. The required native-link/focus contract above stays intact; historical help acceptance does not certify this failing revision. See the [workflow specification baseline](SPEC-maintainer-workflow.md#current-baseline-finding). Actual Safari and assistive-technology behavior remain separately scoped verification.
