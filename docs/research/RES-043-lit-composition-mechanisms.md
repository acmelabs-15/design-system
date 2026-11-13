---
id: RES-043
status: resolved # in-progress | resolved
kind: research
from: IDEA-003#02
date: 2026-11-12
outcome: answered
---
# RES-043: The composition mechanisms of Lit and their limits

## Question
Which mechanisms does Lit give for composition between a parent component and its parts (slots, light DOM children, context, shadow parts), and what are the limits of each?

Needed by IDEA-003#05 (composition architecture of the Lit core), IDEA-003#06 (is the convenience component an element of the core) and IDEA-003#11 (delivery from a CDN with no build step).

## Answer
Sufficient answer: for the current major version of Lit and the web platform today, with versions and browser support named, facts on each mechanism (slots, light DOM children that are custom elements, context, shadow parts and CSS custom properties, reactive controllers, and the shadow-boundary limits on ARIA references, focus delegation and form participation): what it does in plain words, how a parent and its parts use it to share state and coordinate, what it cannot do, and whether it works in plain HTML and JavaScript with no build step. Also how the picture changes when the parts sit in the light DOM of the parent as against its shadow DOM.

This record states facts only. It makes no recommendation.

### Versions and the no-build baseline
The current major version is Lit 3 (`lit` 3.3.3) with `@lit/context` 1.1.6. Lit is published as ES2021 and runs in the latest Chrome, Edge, Safari and Firefox. The npm package uses bare module specifiers, which a browser cannot resolve by itself. Lit therefore also ships single-file bundles (`lit-core.min.js`, `lit-all.min.js`) that a page imports from a CDN in a `<script type="module">`. `@lit/context` 1.1.6 imports only its own files by relative paths, so a page can load it from a CDN too. Decorators (`@property`, `@provide`, `@consume`, `@queryAssignedElements`) need a compiler, because no browser runs them natively. Each decorator has a plain-JavaScript form: static properties, the `ContextProvider` and `ContextConsumer` controllers, and direct calls to `slot.assignedElements()`. All the platform features below (slots, `slotchange`, `::part`, `ElementInternals`, `delegatesFocus`, element reflection) are browser features and need no build.

Two words used below:
- **Light DOM**: the ordinary child elements that the page author writes between a component's tags.
- **Shadow DOM**: a hidden inner tree that the component renders for itself. Page CSS and `document.querySelector` do not reach into it.

### 1. Slots
In plain words: a slot is a hole in the parent's shadow DOM. The author's light DOM children show up in that hole. They stay where the author put them in the DOM and are only rendered at the slot's place. A default slot takes every child that has no `slot` attribute. A named slot (`<slot name="nav">`) takes only children with `slot="nav"`. A child whose `slot` names a missing slot does not render.

How a parent and its parts use it: the parent reads its parts with `slot.assignedElements()` (Lit: `@queryAssignedElements`, with `slot`, `selector` and `flatten` options). It reacts to added or removed parts on the `slotchange` event. It then sets properties on the parts (properties go down) and listens for their events (events go up). Material Web `md-tabs` reads `@queryAssignedElements({flatten: true, selector: '[md-tab]'})` and re-runs its logic on `slotchange`. Shoelace `sl-tab-group` reads `assignedElements()` of a `nav` slot and its default slot.

Limits:
- Only top-level children of the host are assigned to slots. A part wrapped in an extra element (for example a `<div>` that a framework adds) is not itself assigned. The wrapper is assigned, and `assignedElements()` returns the wrapper. `flatten: true` resolves only nested `<slot>` elements, not wrapper elements. The record found no source that makes slots see through a non-slot wrapper.
- `slotchange` fires only when the set of assigned nodes changes. It does not fire when a slotted node's own children or attributes change. Shoelace adds a `MutationObserver` for attribute changes on its parts for this reason.
- Assigned elements exist only after the slot is rendered, so a Lit parent reads them in `firstUpdated`, `updated` or on `slotchange`.
- `::slotted()` styles only the slotted element itself (it takes a compound selector), not its descendants, and it never matches text nodes.
- Manual slot assignment (`attachShadow({slotAssignment: "manual"})` and `slot.assign(...)`) lets the parent choose which child goes into which slot without the author writing `slot` attributes. It still works only on the host's own children. It is Baseline widely available: Chrome 86 for the option and 92 for `assign()`, Firefox 92, Safari 16.4. In Lit, the option is set through `static shadowRootOptions`. lit.dev documents `shadowRootOptions` but has no page on manual assignment, so how it interacts with Lit rendering is not documented. UNVERIFIED.
- If a Lit component renders without shadow DOM (`createRenderRoot()` returns `this`), it has no slots. lit.dev says it "will not be able to compose elements into its internal DOM".
- No build step: slots, `slotchange`, `assignedElements()` and `assign()` are all plain DOM. Only the `@queryAssignedElements` decorator needs a compiler.

### 2. Light DOM children that are custom elements
In plain words: the parts are their own custom elements (`<x-stepper-item>`), written by the author as children of the parent. The parent must find its parts, and each part must find its parent.

How a parent finds its parts: through slot assignment (section 1), through `this.querySelectorAll(...)` / `this.children`, or with a `MutationObserver`. lit.dev says the parent "can't assume a static set of child nodes", because the author can add or remove them at any time.

How a part announces itself to its parent: there is no Lit-specific registration API. The documented means are events that bubble up from the part (the parent listens on itself), and context (section 3), where the part fires a `context-request` event in its `connectedCallback` and the parent answers it. lit.dev names this case ("HTML-based plugins": `<code-editor>` with plugin children that "add themselves to the editor").

Limits and edge cases:
- Upgrade order: `customElements.define()` upgrades the already-parsed elements of that one tag name in tree order. Whether the parent's or the part's code runs first therefore depends on which `define()` runs first, not on DOM nesting. Shoelace's tab group waits on `customElements.whenDefined('sl-tab')` and `whenDefined('sl-tab-panel')` before it sets initial state.
- Nested instances of the same component: `querySelectorAll` from the parent also finds parts of an inner, nested instance. Shoelace filters its observer's mutations with `target.closest('sl-tab-group') !== this` for this reason (their issue #2320).
- Part inside another component's shadow DOM: `querySelector` does not find elements inside another component's shadow root (lit.dev, "DOM scoping"). Slot assignment does not reach them either. An event that is `bubbles: true, composed: true` does cross shadow boundaries, and `context-request` is such an event.
- Part wrapped by a framework element: the part is no longer a top-level child, so slot assignment sees the wrapper (section 1). Bubbling events and context still reach the parent through the wrapper, because the wrapper is a normal ancestor.
- No build step: all of this is plain DOM and works from a page with no build.

### 3. Context (`@lit/context` and the Context Community Protocol)
In plain words: context lets an ancestor element offer a value (for example the stepper's state object) to any descendant that asks for it, without passing it through every element in between. It is similar to React context. The ask is a DOM event, so it works between elements built with different libraries.

How it works: the consumer (a part) fires a `context-request` event that bubbles and is composed (it crosses shadow roots). The event carries a context key, a callback, and a `subscribe` flag. The nearest provider with the same key (compared with `===`) calls `stopImmediatePropagation()` and calls the callback with the value. With `subscribe: true` the provider keeps the callback and calls it again on each change, passing an `unsubscribe` function. The protocol is a W3C Web Components Community Group document with status "Candidate" (last updated 2025-05-02). In Lit: `createContext()`, `ContextProvider` / `@provide` on the parent, and `ContextConsumer` / `@consume` on the part. `@consume` defaults to `subscribe: false`. lit.dev names context as the way to pass data from a parent to its light DOM children, "when data-binding isn't an option".

What happens when a part connects before its provider: the consumer fires its request once, in `hostConnected()`. If no provider answers, nothing in `ContextConsumer` asks again. A provider fires a `context-provider` event when it connects. That event helps in two cases only:
- An existing provider of the same key higher up re-dispatches its own subscriptions, so a new, closer provider can take them over.
- A `ContextRoot`, attached to an ancestor such as `document.body`, has buffered the unanswered requests and replays them when a matching provider appears. It buffers only requests with `subscribe: true`.

Without a higher provider or a `ContextRoot`, a part that connected first keeps no value. This happens on a no-build page when the part's `define()` runs before the parent's.

Limits:
- Context flows down the DOM tree only, from an ancestor to its descendants. Siblings coordinate through a common ancestor.
- The protocol says it is not a state-management system and not a dependency-injection framework.
- The value is delivered by callback. Coordination back up (a part tells the parent "I was clicked") still uses events or methods on the provided object.
- No build step: `ContextProvider` and `ContextConsumer` are plain-JavaScript controllers and `@lit/context` loads from a CDN by relative imports. Only `@provide` and `@consume` need a compiler.
- Server rendering: not examined (DEC-127).

### 4. Shadow parts (`::part`, `exportparts`) and CSS custom properties
In plain words: these are the two ways page CSS can style the inside of a component's shadow DOM.
- `part="label"` on an inner element lets outside CSS select it as `x-item::part(label)`.
- A CSS custom property (`--x-color`) set outside is inherited into the shadow DOM, where the component's CSS reads it with `var()`.

Facts:
- `::part` is Baseline widely available since July 2020: Chrome 73, Firefox 72, Safari 13.1.
- A part is visible only to the shadow root's direct parent tree. For a part in a nested shadow tree to be visible further out, every host in between must forward it with `exportparts` (with optional renaming, `exportparts="base:scroll-button__base"`, as Shoelace does).
- `::part()` accepts state pseudo-classes such as `:hover` but not tree-structural ones (`:empty`, `:last-child`). A `::part` cannot be chained to another `::part`.
- All CSS custom properties inherit across shadow boundaries, as do inherited properties such as `color` and `font-*` (lit.dev styles page).

Limits for composition: these mechanisms carry styling only. They carry no state and no behaviour between a parent and its parts. A parent can style its slotted parts only through `::slotted()` (top level only) or through custom properties that the parts read.

No build step: plain CSS.

### 5. Reactive controllers
In plain words: a reactive controller is a plain object that plugs into one component's update cycle (`hostConnected`, `hostUpdate`, `hostUpdated`, `hostDisconnected`) and can ask that component to re-render (`requestUpdate()`). It packages reusable behaviour, such as keyboard handling or a timer, without making a new element.

As far as it carries shared behaviour between a parent and its parts: a controller belongs to one host. It does not by itself link two elements. lit.dev shows controllers for external inputs, async tasks and animations, and states that a controller "can't (easily) be accessed by someone using the component, unless the component exposes a public API to it." Shared behaviour between a parent and a part arises when the parent's controller and the part's controller talk through context or events. `@lit/context` is itself built this way: `ContextProvider` and `ContextConsumer` are controllers. Controllers can be composed of other controllers.

No build step: controllers are plain JavaScript classes (lit.dev shows JS versions). Lit also offers class mixins, which add public API to the component.

### 6. Limits of the shadow boundary that touch composition
- **ARIA references by ID** (`aria-labelledby`, `aria-controls`, `<label for>`): an ID reference resolves only inside the same tree, either the document or one shadow root. Two parts that are both light DOM children of the same parent are in the same tree, so ID references between them work. Shoelace links tab and panel this way with `aria-controls` and `aria-labelledby`. An element inside the parent's shadow DOM cannot point by ID at a light DOM part, and the reverse fails too.
- **Element reflection** (`ariaLabelledByElements`, `ariaControlsElements`, and the same on `ElementInternals`): an element may reference elements in its own tree or in an enclosing tree, never in a nested shadow root. An element inside a parent's shadow DOM can therefore reference the parent's light DOM parts, but light DOM cannot reference into a shadow root. Baseline 2025: Chrome 135, Firefox 136, Safari 16.4.
- **Reference Target** (`referenceTarget` / `shadowrootreferencetarget`) forwards ID references aimed at a host to a chosen element inside its shadow root, to fill that last gap. State on 2026-11-12:
  - Chrome, Edge and Opera ship it from version 152 (MDN data).
  - Firefox 144 and Safari 26 have it behind a flag. Firefox's standards position is positive and WebKit has given no signal.
  - The WHATWG HTML pull request #10995 is still open. MDN marks the option "Experimental, Non-standard".
  - It is proposed for Interop 2027, and a community polyfill exists. Chrome's status entry says real polyfilling is hard.
- **Focus delegation**: `delegatesFocus: true` (Lit: `static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true}`) gives focus to the first focusable element inside the shadow root when a non-focusable part of it is clicked, and gives the host `:focus` styling. Support: Chrome 53, Firefox 94, Safari 13.1. It concerns one host's own shadow tree. Roving focus across slotted parts is the parent's own code: Material Web and Shoelace set `tabIndex` on each part and call `focus()` on keydown.
- **Form participation**: a custom element with `static formAssociated = true` and `attachInternals()` takes part in its form with `setFormValue`, `setValidity`, `form` and `labels`. `ElementInternals` is Baseline since March 2023: Chrome 77, Firefox 93/98, Safari 16.4. `ElementInternals` also sets default ARIA semantics (`internals.role`, as Material Web does with `role = 'tablist'`): Chrome 103, Firefox 119, Safari 16.4. `states` (custom `:state()`) arrived in Chrome 90, Firefox 126 and Safari 17.4. HTML finds a form owner as the element's "nearest form element ancestor". UNVERIFIED: that a native `<input>` inside a shadow root therefore does not join a `<form>` outside the host. The record did not find a sentence that says so directly.

### Parts in the parent's light DOM as against its shadow DOM
- **Parts in the light DOM** (the author writes `<x-stepper><x-stepper-item>…`): the author composes, reorders, wraps and adds markup, which is the composition model the convenience-plus-parts export needs. The parent learns about its parts only through slots, DOM queries, observers, events or context, and must allow for parts appearing late, in any order, wrapped, or nested in other instances. Parts can style themselves and be styled by page CSS directly. ID-based ARIA between sibling parts works. ARIA from the parent's shadow DOM to a part works only through element reflection.
- **Parts in the shadow DOM** (the parent renders them in its own template): the parent owns them. lit.dev says the parent should be "the source of truth for the subcomponents in its shadow DOM": it sets their properties in its template and listens to their events, with no discovery problem. The author cannot recompose them. Outside styling needs `::part`, `exportparts` or custom properties, and outside ARIA references into them need Reference Target.
- Both placements can be mixed: the parent renders fixed internals in its shadow DOM and takes author parts through slots.

### What remains unconfirmed
- How Lit rendering interacts with `slotAssignment: "manual"` (no lit.dev page).
- A primary-source sentence that a native control inside a shadow root does not associate with a form outside the host.
- How React and other frameworks place wrapper elements is out of scope (IDEA-004#01, RES-029).

## Capability check
- Loaded brain:source-driven-development (SKILL.md from the brain 0.13.0 plugin cache) on 2026-11-12.
- Web tool: Firecrawl scrape (mcp__claude_ai_Firecrawl__firecrawl_scrape) answered with a real read of https://lit.dev/docs/components/shadow-dom/ (HTTP 200) on 2026-11-12, and answered for every later read.
- `brain sdd-cache lookup` is not a command of brain 0.13.0 ("unknown command: sdd-cache"), so no validators are recorded.

## Findings
- The current `lit` release is 3.3.3; it depends on lit-element ^4.2.0 and @lit/reactive-element ^2.1.0. Source: https://registry.npmjs.org/lit/latest, checked 2026-11-12.
- The current `@lit/context` release is 1.1.6; it depends on `@lit/reactive-element ^1.6.2 || ^2.1.0`. Source: https://registry.npmjs.org/@lit/context/latest, checked 2026-11-12.
- Lit is published as ES2021, uses bare module specifiers, and runs on the latest Chrome, Edge, Safari and Firefox; browsers do not resolve bare specifiers. Source: https://lit.dev/docs/tools/requirements/, checked 2026-11-12.
- Lit ships single-file bundles (`lit-core.min.js`, `lit-all.min.js`) that are standard JavaScript modules with no dependencies, importable in a `<script type="module">` from `https://cdn.jsdelivr.net/gh/lit/dist@3/...`. Source: https://lit.dev/docs/getting-started/#use-bundles, checked 2026-11-12.
- Lit decorators need a compiler (TypeScript or Babel); no browser implements decorators yet. Source: https://lit.dev/docs/components/decorators/#enabling-decorators, checked 2026-11-12.
- The modules of `@lit/context` 1.1.6 import one another by relative paths only (index, decorators, controllers, context-root, context-request-event). Source: https://cdn.jsdelivr.net/npm/@lit/context@1.1.6/development/index.js and its lib/ files, checked 2026-11-12.
- Children of an element with a shadow tree do not render unless the template has a `<slot>`; slotted children are not moved but rendered as if they were children of the slot; named slots take only children with a matching `slot` attribute; children whose `slot` names no slot do not render. Source: https://lit.dev/docs/components/shadow-dom/#slots, checked 2026-11-12.
- Slotted children are read with `slot.assignedNodes()` / `assignedElements()` and the `slotchange` event; they are assigned only after the slot renders, so access waits for `firstUpdated` or `updated`; `@queryAssignedElements` takes `slot`, `selector` and `flatten`. Source: https://lit.dev/docs/components/shadow-dom/#accessing-slotted-children, checked 2026-11-12.
- `shadowRootOptions` passes `ShadowRootInit` options such as `mode` and `delegatesFocus` to `attachShadow`; rendering into light DOM via `createRenderRoot()` returning `this` loses DOM and style scoping and the ability to "compose elements into its internal DOM". Source: https://lit.dev/docs/components/shadow-dom/#renderroot, checked 2026-11-12.
- Shadow DOM scopes DOM: APIs like `document.querySelector` do not find elements in a component's shadow DOM. Source: https://lit.dev/docs/components/shadow-dom/, checked 2026-11-12.
- With named slot assignment, top-level children of the host with a matching `slot` attribute go to that slot and top-level children without one go to the first unnamed slot; with `slotAssignment: "manual"` children are assigned only by `HTMLSlotElement.assign()`. Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#slotassignment, checked 2026-11-12.
- `attachShadow` option support: `slotAssignment` Chrome 86, Firefox 92, Safari 16.4; `delegatesFocus` Chrome 53, Firefox 94, Safari 13.1; `referenceTarget` Chrome/Edge 152, Opera 136, Firefox 144 behind a flag, Safari 26 behind a flag, marked Experimental and Non-standard. Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#browser_compatibility, checked 2026-11-12.
- `delegatesFocus: true` gives focus to the first focusable part of the shadow DOM when a non-focusable part is clicked, and gives the host `:focus` styling. Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#delegatesfocus, checked 2026-11-12.
- `HTMLSlotElement.assign()` sets a slot's manually assigned nodes; it decides the displayed content only in a shadow root created with `slotAssignment: "manual"`; removing a node from the host keeps its manual assignment. Baseline widely available since March 2023 (Chrome 92, Firefox 92, Safari 16.4). Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assign, checked 2026-11-12.
- `slotchange` fires when the nodes assigned to a slot change; it does not fire when the children of a slotted node change. Support: Chrome 53, Firefox 63, Safari 10.1. Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event, checked 2026-11-12.
- `::slotted()` takes a compound selector, works only in CSS inside a shadow DOM, and does not select text nodes. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted, checked 2026-11-12.
- Lit's composition guidance is "properties down, events up"; a component is the source of truth for subcomponents in its shadow DOM; siblings coordinate through a mediator. Source: https://lit.dev/docs/composition/component-composition/#passing-data-up-and-down-the-tree, checked 2026-11-12.
- Light DOM children are managed from outside the component and can be added or removed at any time, so the component cannot assume a static set of children; it controls where they render with `<slot>` and learns of changes from `slotchange`. Source: https://lit.dev/docs/composition/component-composition/#light-dom-children, checked 2026-11-12.
- `customElements.define()` enqueues upgrades for the elements of that local name in shadow-including tree order. Source: https://html.spec.whatwg.org/multipage/custom-elements.html (define() steps), checked 2026-11-12.
- `@lit/context` is based on the Context Community Protocol; a consumer fires a `context-request` event carrying a context key, and any ancestor can answer; the event bubbles and is composed. Source: https://lit.dev/docs/data/context/#context-protocol, checked 2026-11-12.
- Lit names context for passing data "from a parent to its light DOM children", where the parent cannot use template data-binding; its example is a `<code-editor>` whose plugin children consume an API and add themselves. Source: https://lit.dev/docs/data/context/#html-based-plugins, checked 2026-11-12.
- Context keys are compared with `===`; `@consume` has `subscribe` default `false`; `ContextProvider.setValue(v, force)` notifies subscribed consumers; `ContextRoot` gathers unsatisfied requests and re-dispatches them when a matching provider appears, so providers can be added or upgraded after consumers. Source: https://lit.dev/docs/data/context/#api, checked 2026-11-12.
- The Context Protocol is at status "Candidate" (last update 2025-05-02); a provider that satisfies a request must call `stopImmediatePropagation`; it must not keep the callback unless `subscribe` is truthy; consumers should fire requests in `connectedCallback`; the protocol states it is neither a dependency-injection framework nor a state-management alternative. Source: https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md, checked 2026-11-12.
- `ContextConsumer` dispatches its request once, in `hostConnected()`, and unsubscribes in `hostDisconnected()`. Source: https://raw.githubusercontent.com/lit/lit/main/packages/context/src/lib/controllers/context-consumer.ts, checked 2026-11-12.
- `ContextProvider` fires a bubbling, composed `context-provider` event in `hostConnected()`; an existing provider of the same context that receives it re-dispatches its own subscriptions so a closer provider can take them over. Source: https://raw.githubusercontent.com/lit/lit/main/packages/context/src/lib/controllers/context-provider.ts, checked 2026-11-12.
- `ContextRoot` buffers only requests with `subscribe === true` and replays them from their source element when a matching `context-provider` event arrives. Source: https://raw.githubusercontent.com/lit/lit/main/packages/context/src/lib/context-root.ts, checked 2026-11-12.
- A reactive controller hooks into one host's update cycle (`hostConnected`, `hostUpdate`, `hostUpdated`, `hostDisconnected`) and requests host updates; the host API is `addController`, `removeController`, `requestUpdate`, `updateComplete`; controllers can be composed of other controllers; JS versions are shown. Source: https://lit.dev/docs/composition/controllers/, checked 2026-11-12.
- A controller is owned by its component and "can't (easily) be accessed by someone using the component, unless the component exposes a public API to it"; mixins become part of the component's public API. Source: https://lit.dev/docs/composition/overview/#controllers-and-mixins, checked 2026-11-12.
- `ContextProvider` and `ContextConsumer` are reactive controllers. Source: https://lit.dev/docs/data/context/#contextprovider, checked 2026-11-12.
- `::part` is Baseline widely available since July 2020 (Chrome 73, Firefox 72, Safari 13.1); parts are visible only to the direct parent DOM; `exportparts` forwards them; structural pseudo-classes cannot follow `::part()` and `::part` cannot be chained. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/::part, checked 2026-11-12.
- `exportparts` on a shadow host exports part names from its shadow tree, as a comma-separated list of mappings that can rename a part. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/exportparts, checked 2026-11-12.
- All CSS custom properties inherit into shadow DOM, along with inherited properties such as `color` and `font-*`, which makes components themable from outside. Source: https://lit.dev/docs/components/styles/#customprops, checked 2026-11-12.
- `ElementInternals` lets custom elements fully participate in HTML forms and exposes default ARIA semantics; a form-associated element sets `static formAssociated = true` and calls `attachInternals()`. Baseline since March 2023 (Chrome 77, Firefox 93, Safari 16.4); `form`, `setFormValue`, `setValidity`, `labels` from Firefox 98; `role` Chrome 103, Firefox 119, Safari 16.4; `states` Chrome 90, Firefox 126, Safari 17.4. Source: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals, checked 2026-11-12.
- The HTML form-owner algorithm refers to the element's "nearest form element ancestor". Source: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html (reset the form owner), checked 2026-11-12.
- ID references in attributes resolve only within the same document or shadow root; reflected ARIA element properties may target elements in the same scope or a parent scope, never in nested shadow roots. Source: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes#reflected_element_reference_scope, checked 2026-11-12.
- `ariaLabelledByElements` is Baseline 2025 (Chrome 135, Firefox 136, Safari 16.4). Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaLabelledByElements, checked 2026-11-12.
- Reference Target forwards ID references (`<label for>`, `aria-labelledby`, `popovertarget`, `commandfor`) aimed at a shadow host to an element inside its shadow root; Chromium ships it in 152; spec PR whatwg/html#10995 is open; Firefox position positive, WebKit no signal; Chrome's entry says it is difficult to polyfill. Source: https://chromestatus.com/feature/5188237101891584, checked 2026-11-12.
- Reference Target is proposed for Interop 2027; all engines have flagged implementations with passing tentative WPT tests; web-features lists it as "Limited Availability"; a community polyfill exists. Source: https://github.com/web-platform-tests/interop/issues/1333, checked 2026-11-12.
- Example of real use, Material Web `md-tabs`: reads parts with `@queryAssignedElements({flatten: true, selector: '[md-tab]'})`, reacts on `slotchange`, sets `internals.role = 'tablist'`, and moves roving `tabIndex` and focus across slotted tabs. Source: https://raw.githubusercontent.com/material-components/material-web/main/tabs/internal/tabs.ts, checked 2026-11-12.
- Example of real use, Shoelace `sl-tab-group`: reads tabs from `slot[name="nav"].assignedElements()`, waits on `customElements.whenDefined` for its part tags, adds a subtree `MutationObserver` filtered by `closest('sl-tab-group') === this` to ignore nested groups (issue #2320), links tab and panel with `aria-controls`/`aria-labelledby` IDs, and forwards a nested part with `exportparts="base:scroll-button__base"`. Source: https://raw.githubusercontent.com/shoelace-style/shoelace/next/src/components/tab-group/tab-group.component.ts, checked 2026-11-12.

## Follow-ups
None.

## Next action
None.
