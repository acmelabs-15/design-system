# Navigation and disclosure — R08

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation follows the approved migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved family contract.** All entries inherit [conventions](foundations.md). Native links own navigation; collection controls own selection; disclosures own expanded state. Assigned references and exact house differences are in the linked decisions and [joint analysis](../../analysis/codebase-systematization.md#joint-content-selection-and-navigation-review). Source-defined defaults must be verified rather than turned into preference questions.

## N-01 App Bar

Family acme-app-bar with optional acme-app-bar-start/content/end parts. Root placement: static|sticky=static, size small|medium|large=medium; default/ start/end slots. Header region can contain identity, Breadcrumbs, Search, Toolbar and application links. It owns no route, global theme or keyboard collection. Native header semantics are scoped to context; do not automatically mark every dialog header as the page banner. Parts root/start/content/end. Sticky styling uses house offsets and logical dimensions, not Material dp copied as CSS pixels.

Replace Appbar/Topbar and their forced Theme Switcher/Shell relationships. Responsive arrangements use existing layout; scrolling/hide-on-scroll is not silently added. Acceptance: nested dialogs/page headers, narrow overflow, sticky focus clearance, empty regions, direction and accessible landmarks. [Decision](../../decisions/app-bar.md), complete Material App Bar/Toolbar/Search and Pro examples.

## N-02 Toolbar

acme-toolbar props orientation: horizontal|vertical=horizontal, loop=true, disabled=false; required accessible name. Default/start/end content; part=root. Related action controls register with a single focus manager. Toolbar has no selected value or form submission and emits no extra action event.

Button/Icon Button/Toggle Button/Menu Trigger participate as action targets. Embedded text inputs keep editing keys; Radio/Segmented/other composites keep their selection owner. The exact nested focus routing follows the already selected [responsibility split](../../decisions/toolbar-group-responsibilities.md), relevant APG/Radix contracts and the verified composition, not indiscriminate bubbling interception. No duplicate arrow handling. Generic Group can supply attached presentation inside Toolbar without acquiring its role.

Acceptance: one coherent tab-entry model, arrows/Home/End/RTL/vertical, disabled action discovery, nested selection/input/menus, overflow and dialog focus return. The nested-target routing mechanism is E01/E04 work, not a new preference interview or a claim the current layout-only Toolbar already implements it.

## N-03 Sidebar

Family acme-sidebar, acme-sidebar-trigger and acme-sidebar-content. Root expanded=true, mobileOpen=false; collapsible=true; placement: start|end=start; width="16rem", collapsedWidth="3rem" proposed house defaults; mobileBelow="medium" proposed breakpoint. Compose shared Drawer for small screens. Root accepts default content and trigger slot; parts root/content/trigger.

Application owns routing/current link and preference persistence. acme-expanded-change { expanded } for desktop collapse, acme-open-change { open:mobileOpen } for mobile Drawer; not one state that unintentionally persists a mobile dismiss into desktop collapse. Preserve author-owned children and form state across mode switches; transfer focus before hiding/moving its surface. Trigger is explicit and named.

The 16rem/3rem widths and medium transition are proposed configurable house defaults, not claimed reference constants. Q12 is resolved as that coherent default proposal; verify actual layouts and revise if evidence shows a problem rather than ask Peter about each dimension. Sidebar is not resizable by default; a Resizable composition is available. Acceptance includes mode resize while open/focused, nested scroll, independent mobile/desktop state, reduced motion, RTL and links/TOC/Tree contents. [Decision](../../decisions/responsive-sidebar.md).

## N-04 Table of Contents

acme-toc props source?: Element|string selector; items?: readonly { id, href, label, level }[]; levels: readonly heading levels=[2,3]; scrollRoot?: Element (document default); offset: CSS length="0px"; variant: line|minimal|numbers=line. Explicit items take precedence when supplied; otherwise discover within source. Explicit-over-discovered precedence is the proposed engineering rule. Q13 is closed: use stable authored IDs and report/omit missing targets; TOC does not create IDs on author content.

Native links navigate real targets; current is derived from observed visible sections. Use aria-current=location, not checked/selected. parts root/list/item/link/indicator; no action-value form events. acme-current-change { current } reports user/scroll location once without owning application routing. Method refresh() is not required; observe appropriate heading/label changes within the supplied scope with bounded subscriptions.

Discover native headings plus registered house Heading targets through an explicit heading-discovery interface; a document h1–h6 query alone misses shadow headings. Do not traverse arbitrary private shadow trees. Missing/duplicate IDs are reported; the proposal recommends application-supplied stable IDs over silently rewriting them. Scroll offsets, hash/history and focus must work with sticky App Bar and reduced motion. Shared indicator reuse is visual-only if selected; no Radio semantics.

## N-05 Breadcrumbs

Family acme-breadcrumbs and acme-breadcrumb. Root label defaults to localized Breadcrumb; separator optional content/house icon. Item href="", current=false, disabled=false proposed; default label; root/list/item/link/separator parts. Use native nav/ol/li/a meaning with the real-wrapper semantic gate; current last item is text or aria-current=page link. No automatic router or custom change event. Collapse long paths as a Menu recipe with complete labels; do not hide ancestors without access. Source current Breadcrumbs/Breadcrumb and assigned reference examples.

## N-06 Tree View

Family acme-tree-view and acme-tree-item. Root items: readonly TreeNode[]=[], expanded: readonly string[]=[], value?: string, selection: none|single=single proposed, disabled=false. TreeNode={ id:string, label:string, children?:readonly TreeNode[], disabled?:boolean, href?:string }. Default item content can be supplied through child item parts keyed by id; choose a single documented data/content precedence at its assigned verification gate rather than two conflicting identity sources.

Item props value required, expanded/selected derived, disabled=false; slots start/end/description; root/tree/item/content/indicator/children parts. Stable IDs are required; accessible label is separate from icon/filename metadata. Source tree semantics: one focus owner; arrows/Home/End/typeahead; expansion distinct from focus/selection; disabled nodes follow the selected reference's discovery policy.

acme-change { value } for selection; acme-expanded-change { expanded:string[] } for expansion; acme-request { action:"activate", value } for application action. Methods focus(value), expand(value), collapse(value). No filesystem access, mutation or form submission.

Q14 is closed: this pass includes core single-selection/expansion and the file-tree recipe. Advanced multi-select, checkbox propagation, built-in async children, filtering, rename/reorder and virtualization are excluded from this Tree contract. If virtualization is included, TanStack Virtual is mandatory. Existing File Tree/Folder/File become this family and recipe, with no aliases. [Decision](../../decisions/general-tree-view.md).

## N-07 Menu and Context Menu

Family acme-menu, acme-menu-trigger, acme-menu-content, acme-menu-item, acme-menu-section, acme-menu-separator; optional item type action|checkbox|radio=action. Root open=false, closeOnSelect=true, loop=true; placement bottom-start, sideOffset=4 proposed shared house spacing. Trigger uses native Button semantics, content menu semantics. Item value required, disabled=false, checked=false only for checkbox/radio types; group name required for radio items. Slots root trigger/default content; item default/start/end/description; named parts mirror the family.

Activate an action with acme-request { action:"select", value }; checkbox/radio changes emit acme-change { value, checked }. Root open uses acme-open-change. No DOM nodes or callback objects in event detail. Arrow navigation/typeahead/disabled discovery/Escape/submenus follow the assigned Radix/Chakra/APG behavior; a plain navigation link list does not become Menu just for appearance.

acme-context-menu composes the same menu owner with a default trigger region and content slot; disabled=false, open=false. Opens on native context-menu gesture, keyboard ContextMenu/Shift+F10 and verified touch behavior; anchor can be a pointer position. Preserve ordinary browser context menu when disabled. Outside dismissal and focus return remain shared overlay rules. Radix shadow5 on the actual menu surface only.

Current Menu Button/Divider/Section/Item imports map to consistent family names; Dots Menu becomes Icon Button + Menu recipe. No built-in business actions. Test pointer/keyboard paths, nested submenus, async application actions, check/radio items, trigger removal and focus return.

## N-08 Command Menu

Family acme-command-menu, acme-command-group, acme-command-item, acme-command-separator. Root open=false, query="", loading=false, filter: existing command-score or supplied ranking function; hotkey?: string (no global registration unless explicitly supplied); placeholder="", heading="", description="". Items value required, label text required, keywords:string[]=[], disabled=false. Group heading slot/text provides a group label.

Compose Dialog, Input, Scroll Area and command collection; no second dialog engine. Application controls pages/data and handles acme-request { action:"select", value }; live query emits acme-input { value:query }; open uses acme-open-change. Items keep owner-provided command callbacks outside serializable event detail. Preserve complete names, keyboard navigation, empty/loading/error content and current scoring package; published match-sorter belongs to ComboBox, not an automatic replacement here.

Infinite data uses an explicit application load-more request at a documented threshold, not a callback returning ambiguous success. No hidden network fetch or route mutation. Parts root/dialog/input/list/group/item/empty/loading. Verify hotkey scope/disposal, nested pages and Escape hierarchy, composition input, long lists, async stale results and clear naming.

## N-09 Accordion and Collapsible

Accordion family acme-accordion, acme-accordion-item, acme-accordion-trigger, acme-accordion-content. Root expanded: readonly string[]=[], multiple=false, collapsible=false, disabled=false; item value required, disabled=false. Trigger sits in a native heading chosen by the author; content is correctly labelled. Collapsible family acme-collapsible, acme-collapsible-trigger, acme-collapsible-content uses expanded=false and disabled=false for one section.

Default mounting preserves content hidden/inert after exit; lazyMount=false and unmountOnExit=false follow the refreshed Chakra [Accordion](https://chakra-ui.com/docs/components/accordion) and [Collapsible](https://chakra-ui.com/docs/components/collapsible) API tables. Keep these opt-in mounting options; do not adopt React Activity as a second house runtime. Expanded state uses acme-expanded-change { expanded }, not overlay open vocabulary. Root owns the event; parts do not duplicate it. Keyboard activation, coordinated trigger movement and focus return on collapse follow the assigned reference. Shared Lit Motion handles height/opacity exit and cancellation without timing child-owned animations.

Remove Collapse/Collapse Group/Fold. Compact collapsed summaries are recipes. Acceptance: single/multiple/required-open behavior, empty/dynamic items, trigger heading levels, mounting policy, focused descendants, rapid reversal, nested groups and reduced motion.

## N-10 Steps

Family acme-steps, acme-step, acme-step-trigger, acme-step-content, acme-steps-previous, acme-steps-next. Root value=0 (zero-based index), linear=false, orientation=horizontal; item value: stable string with order-derived index; disabled=false; completed?: boolean (default earlier than current). Root label required. Step content is a panel tied to its trigger, not a route.

Before a user move emit cancelable acme-request { action:"step", value:nextIndex, previousValue }. If not prevented, update and emit acme-change { value }. Applications may prevent the request while asynchronously validating, then assign the new value; no hidden promise/validation engine. Previous/Next use the same path. End completion is represented explicitly, not an out-of-bounds accidental index.

Parts root/list/item/trigger/indicator/separator/content/actions. Source is the selected Zag/Chakra behavior port with house state/motion. Verify non-linear versus linear limits, disabled steps, native form validation composition, dynamic steps, keyboard/RTL, controlled updates and completion labels.

## N-11 Timeline

Family acme-timeline and acme-timeline-item. Root orientation: vertical|horizontal=vertical; item default content plus indicator/date/heading/description slots. Parts root/item/indicator/connector/content. It is ordered descriptive history/process content, not interactive Steps or an auto-playing timeline. Native ol/time semantics where applicable; dates are authored/format components. No selection/value/events. Styling derives from reviewed Chakra Pro documentation examples and house layout; connectors are decorative. Test empty/one/many items, custom indicators, long dates, responsive layout and screen-reader order.

## N-12 Show, Show More and Load More

acme-show when=false, preserveState=false; content and fallback are explicit templates/render functions, not arbitrary child text evaluated as code. false mounts fallback; true mounts content. Static HTML uses template children; Lit uses a render function returning its template; React wrapper conditionally mounts React-owned content under the same when contract. preserveState=true is an explicit keep-mounted hidden/inert option. No disclosure button or new public event. Exact template ownership must pass cross-framework tests at its assigned verification gate.

acme-show-more expanded=false, loading=false; default slot label with localized More/Less fallback; native Button activation requests/toggles expanded and emits acme-expanded-change. It is the reusable control, not an implicit owner of unrelated content. acme-load-more loading=false, disabled=false; default action content; acme-request { action:"load-more" }; application owns loading/results/end-of-data. Source noGap/noBorderRadius/placeholder booleans become ordinary styling and explicit content, not new semantic modes.

Acceptance: real conditional mount/unmount, child cleanup, form state preservation only when requested, fallback focus, repeated load requests during loading, disabled actions and exactly-once events.

### M13 Menu engineering resolution — 2026-09-22

Under execution delegation, Menu Content is the manual-popover surface. Menu Item supports native href/target/rel for action links, textValue for an explicit typeahead label, and a submenu slot containing a nested Menu. A submenu uses its containing item as opener. Section exposes heading without consuming the native title attribute. Use the reviewed disabled-focus policy: arrow/typeahead can discover disabled items, while all activation and navigation remain blocked. [Resolution and evidence](../../decisions/execution-delegation.md#menu-composition-and-completion--2026-09-22).

### M15 Steps engineering resolution — 2026-09-23

Under execution delegation, value=count is the documented completed state for a nonempty sequence, matching the reviewed upstream model. The read-only count and completed properties expose it. The completed slot supplies its content. Values above count report a diagnostic and block user progression; a value can be supplied before its items mount. Linear mode uses Previous/Next instead of direct trigger jumps. Non-linear arrows move focus without triggering validation; explicit activation requests the change. Disabled items are skipped, and Step.completed can override the positional completion indicator. [Acceptance](../evidence/m15-steps-timeline-2026-09-23.json).

### M15 navigation engineering resolution — 2026-09-23

Toolbar skips native disabled controls and starts each external reentry at its first available control. Editing controls retain their keys; place a conflicting editor last as APG recommends. Popup boundaries retain their own keyboard owner. App Bar medium retains the existing 52px --bar-h baseline; small/large vary by the existing spacing-2 token. App Bar parts are optional real boxes; start/end parts default to their corresponding slots. Breadcrumb separator customization belongs to each item so content is not cloned between owners. [Acceptance](../evidence/m15-navigation-2026-09-23.json).
