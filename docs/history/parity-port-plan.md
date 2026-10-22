# Parity port plan

This is the closed parity-port history, including 2026-09-10 measurements and the standing-rule alignment recorded on 2026-09-26. Its status, commands, package observations and unchecked items describe those dates. They are not the current task queue or permission to execute the old pass.

Current ownership:

| Subject | Current owner |
| --- | --- |
| Startup, active work and handoff | [AGENTS](../../AGENTS.md), [status](../STATUS.md) and the [maintainer workflow](../../spec/SPEC-maintainer-workflow.md) |
| Approved system and family contracts | [Design-system specification](../../spec/SPEC-design-system.md) |
| Component conventions and complete replacements | [Component guidance](../development/components.md) and [interface navigation](../development/interfaces.md) |
| Dependency responsibilities | [Selected stack](../development/stack.md); manifests and lockfile own versions |
| Styles and generated source | [Style guidance](../development/styles.md) and [producer map](../agents/repository.md) |
| Generation/comparison evidence | [Generation guidance](../development/generation.md) and [tooling runbook](../../tools/geist/README.md) |
| Browser, consumer and release verification | [Verification guidance](../agents/verification.md) |
| Documentation examples and source comparisons | [Documentation guidance](../development/documentation.md) and [reference sources](../development/reference-sources.md) |

The systematization pass replaced the port's unconditional exact-parity goal with [interface consistency and verified adaptations](../decisions/0105-systematization-goal.md). Its Phase 0 records also covered [composition](../decisions/0018-composition-over-count.md), [added elements](../decisions/0070-non-canonical-elements.md), [reference roles](../decisions/0082-reference-systems.md), [floating shadows](../decisions/0039-floating-surface-shadows.md), [tab indicators](../decisions/0061-material-tab-indicator.md) and [icons](../decisions/0096-shared-icon-library.md). Peter confirmed scope on 2026-09-19.

Phase 1 retained [Lit Motion](../decisions/0004-animation-package.md), selected [Material Symbols SVGs](../decisions/0060-material-symbols-icons.md), [published match-sorter](../decisions/0058-match-sorter.md) and [native Lit behavior ports](../decisions/0114-zag-behaviour-ports.md). [Style production](../decisions/0104-style-production.md) selected compiled CSS feeding Lit/document outputs and later build-only Lightning CSS 1.33.0, with Bun as runtime and JavaScript bundler.

Research and terminology closed; [Phase 3 responsibilities](systematization/architecture-review.md#phase-3-closure), [complete inventory approval](../decisions/0049-inventory-approval.md) and [migration approval](../decisions/0064-migration-approval.md) followed. The [execution delegation](../decisions/0035-execution-delegation.md) applied to that completed implementation and local commits, excluding otherwise-unapproved push/publication/deployment. It does not authorize new work. [Systematization history](systematization/pass-history.md) and the [completed migration](../../tasks/done/systematization/plan.md) retain progress and scope.

Historical headings retain their original status notation: [x] meant done, [~] running, [ ] queued and [?] a Peter-owned question. Lists below use explicit recorded statuses. Later contracts and release evidence supersede those old queues.

---

## 1. What we are building

The recorded project was @acmelabs/design-system, Lit web components with the acme- prefix, in ~/dev/ACMElabs/design-system. It used Bun and GitHub Pages. The 2026-09-26 rule alignment recorded public npm 0.2.0 and locally prepared coordinated 0.3.0, with publication disabled during verification. Later release records supersede that status.

The replacement goal was the approved systematization inventory, consistent interfaces and reusable composition. Reference systems supplied evidence; named adaptations and component acceptance replaced unconditional port parity.

**Historical port scope (closed): a one-to-one port of <https://vercel.com/geist>**: style,
behaviour and functionality. Confirmed against the live site on 2026-09-10 — our saved snapshot holds
all 77 of its pages, name for name, and the pages carry that address in their own markup. Every docs page shows the same sections as the reference page. The
foundations pages match too.

**Parity is not implementation parity.** Decided by Peter on 2026-09-10, and recorded in [notes/decisions/parity-scope.md](../decisions/0077-parity-scope.md). The reference is
React; ours is Lit web components. Copying React's internal shape into a web component does not make
the port more faithful, it makes it worse on the platform it runs on. The port's implementation question was: *what is the best decision for a Lit web component that has to reach
style, behaviour and functional parity with the reference?*

The recorded API priority did not require identical reference names. Its order was:

1. **Consistent with itself** — one name for one concept, everywhere.
2. **Idiomatic for Lit and the web-component community** — where the reference's choice would
   surprise a web-component consumer, ours wins.
3. **Familiar to someone arriving from the reference** — they should recognise our API and guess it
   correctly. Novelty alone was not a reason to rename.

Where the reference contradicts itself, that is a licence to choose the better name, not an
instruction to reproduce the contradiction.

The port used exact census parity. The later systematization pass used approved component contracts, recorded adaptations and interaction/appearance evidence. A historical zero-difference census does not certify a rebuilt component.

**Functionality counts as much as appearance, and the census cannot see it.** The census reads
computed styles. It cannot tell you that a button does nothing when clicked. The port therefore required behavior checks for every element and example: the demo the reference page shows must actually
work here. A worked example of this failure is in section 6 — the virtualized table's Show More
button did nothing, because the demo listened for an event the element never fires, while every
style measured clean.

The original per-element behavior checklist covered:

- Reference-matching interactive controls: click, keyboard, focus order, escape.
- Examples exercised scrolling, filtering, expansion, virtualization and copying wherever the reference exposed them.
- Reference-matching event contracts. Where the reference control is *controlled* (the owner
  holds the state and the control only reports a click), the port selected the same ownership.
- Anything that cannot be checked in the hidden browser pane (motion, placement, pointer drag)
  was marked unverified pending Peter's Chrome check. This dated host procedure does not override current browser tools or permissions.

The port kept four deliberate differences from the reference. Custom themes later qualified appearance defaults:

| Ours | Detail |
|---|---|
| Fonts | Google Sans Flex for text, Google Sans Code for numbers, labels and code |
| Class names | Our own names throughout |
| Vocabulary | Nothing under `src/` names the reference, in code, comments or JSDoc |
| Packages | Our stack, listed below, not the reference's packages |

### The package stack Peter chose

The recorded dependency responsibilities were:

- `@lit-labs/motion` for animation, `@lit-labs/router` for the docs app,
  `@lit-labs/compiler` for build-time template compilation
- TanStack for state (`store`), virtualization (`virtual`), rate limiting (`pacer`),
  syntax highlighting (`highlight`), markdown (`markdown`), forms (`form`), charts, hotkeys
- `@floating-ui/dom` for overlay placement
- Native `<dialog>` and the Popover API for overlays
- `@zag-js/remove-scroll` for scroll lock
- `@internationalized/date` for dates
- A vendored copy of cmdk's command-score
- Our own controllers: `Interaction`, `RovingTabindex`

Additional selections during the completed pass:

- [Native Lit behaviour ports](../decisions/0114-zag-behaviour-ports.md) for Pin Input, Number Input, Scroll Area, Steps and resizable panes. This supersedes the earlier actual Zag component dependency/adapter selection. The ports retained TanStack Store, Lit Motion, generated styles and the selected stack. Zag supplied source behavior, without its createMachine/interpreter, vanilla runtime or store. Ports may create new components, rebuild existing ones or replace them outright. The capability selections survived; the completed Phase 5 gate is historical.
- Published `match-sorter` for ComboBox ranking, replacing the local copy after [compatibility verification](../decisions/0058-match-sorter.md). Command Menu's separate scorer stays unchanged.
- [@internationalized/number](../decisions/0072-number-utilities.md) as an independent Number Input utility, retaining the complete component implementation. It is installed; packages/core/package.json and the lockfile own the exact runtime version.
- A [separate React integration package](../decisions/0081-react-integration.md) and [native forms with optional TanStack Form](../decisions/0067-native-and-managed-forms.md). The coordinated core and React exports are implemented; consumer references describe their exact interfaces.
- Development tooling: [Oxlint + Oxfmt with Ultracite and Stylelint](../decisions/0053-lint-toolchain.md), now implemented with explicit rule mapping, CSS checks and source-preserving formatting. Biome is removed.

The extension also selects [Material motion roles](../decisions/0059-material-motion-system.md), [shape support](../decisions/0094-shape-support.md), [full custom themes](../decisions/0022-custom-themes.md) and the [blue accent](../decisions/0008-blue-accent.md). The font/appearance table above describes the default appearance; consumer themes can override visual settings under the new theme contract. [SSR is excluded altogether](../decisions/0092-server-rendering.md). [Toast uses the selected packages](../decisions/0110-toast-behaviour.md), not an extension of the four-control Zag approval. The later review selects [versioned consumer skills](../decisions/0019-consumer-skills.md), a [documentation/API MCP](../decisions/0027-design-system-mcp.md), [Intent development tooling](../decisions/0048-intent-tooling.md), and [TanStack Devtools for the optional inspector](../decisions/0026-design-system-devtools.md). [Live AI control is outside this pass](../decisions/0003-ai-authoring-scope.md). [Responsive scope/defaults](../decisions/0086-responsive-system.md) and [Box](../decisions/0009-box-primitive.md) are also selected. TanStack Config practices remain migration recommendations, not package or automation adoption.

The latest control review selects [darker blue with white text](../decisions/0008-blue-accent.md) and [optional ripples, off by default](../decisions/0074-optional-ripples.md). Approved state roles and ripple interfaces are recorded in the inventory and component acceptance.

The foundation follow-up selects [shared spacing-only density](../decisions/0025-density.md), normal by default, with normal inherited spacing for menus/dialogs/Toasts and a 24 × 24 CSS-pixel clickable-area floor in explicitly selected compact mode. Larger touch-friendly sizing remains available; no new universal normal-mode target is selected. [LTR/RTL support](../decisions/0007-bidirectional-support.md) covers pages/sections in Lit/React. [Shared moving indicators](../decisions/0097-shared-selection-indicator.md) use Lit Motion for suitable single-selection groups without adding another Zag dependency. The approved inventory and implemented family evidence specify their interfaces and eligibility.

[Shape morphing follows demonstrated component needs](../decisions/0094-shape-support.md). The full Material shape catalogue is not required. Ordinary shape properties were preferred; custom geometry required a concrete component need. No geometry package is selected.

[Table must support consumers who use TanStack Table](../decisions/0107-tanstack-table-compatibility.md); the design system does not integrate or run that package. Applications own its processing, state and optional experimental workers. TanStack Table is not part of the mandated design-system runtime stack. Consumer examples/checks can use TanStack Table; 9.2.4 is the pinned consumer-example baseline; its experimental worker declaration correction belongs to application setup. The later [Flow Diagram decision](../decisions/0040-flow-diagram.md) separately selects ELK for layout/routing with a Lit viewer; its implemented worker delivery and acceptance are recorded in M20. **TanStack Virtual is chosen for virtualization in both Lit and React.** [Reusable results pagination](../decisions/0087-results-pagination.md) supplies numbered/compact navigation and unknown-total support, with application-owned page state and data loading. The page-position, page-size and navigation parts are approved and implemented; application-owned results state remains separate from document navigation. The [current handoff](../STATUS.md) now owns new work; this is the recorded product scope.

The recorded stack mapping assigned highlighting to TanStack highlight rather than Shiki; hotkeys to TanStack hotkeys rather than hotkeys-js; virtualization, charts and rate limiting/debouncing to TanStack virtual/charts/pacer; placement to Floating UI; and animation to Lit Motion. The maintained stack owner above carries current responsibilities.

A selected package's vanilla build was adapted through a Lit wrapper/controller rather than replaced merely for lacking a Lit adapter.

The port warned that zero imports did not invalidate a selected package role; some planned consumers had not yet been reached. That staging premise is historical. Current dependency work checks approved roles and actual consumers through the maintained stack guidance.

The old package-selection procedure required research of maintained alternatives for a complex stack gap, including whether a popular older package had been superseded. Current source research and user-choice procedure belong to the installed brain workflow.

TanStack Query/DB was deferred to a separate future package; this history does not start that work.

### Package ownership

The later rule alignment recorded core runtime/public metadata in packages/core/package.json, a private root build workspace, and coordinated React/MCP/Devtools manifests. The subsequent browser package adds a separate delivery manifest without duplicating source. The [maintained producer map](../agents/repository.md) and manifests/lockfile own current details, not historical import counts.

### Current standing build rules

This heading preserves the original anchor. The former standing rules no longer live in this historical plan.

| Recorded meaning | Sole current owner or disposition |
| --- | --- |
| Approved product contracts and supporting evidence | Specifications and decisions; current [workflow](../agents/workflow.md) owns updates and approval scope |
| Selected stack, TanStack state and shared Lit/React behavior; application Table/Virtual/Form ownership | [Component guidance](../development/components.md) and [stack](../development/stack.md) |
| Producer-authored CSS and generated CSS/maps/Lit modules | [Style guidance](../development/styles.md) |
| Real wrapper boxes and native content where required | [Component guidance](../development/components.md) |
| Completed replacements with no retired-interface aliases or legacy implementations | [Component guidance](../development/components.md); no unmeasured no-consumers premise or standing future compatibility policy |
| Bun 1.4.2, colocated bun:test, strict types and current lint/format/style tools | [Verification guidance](../agents/verification.md) |
| Generator/build/docs/tooling dependencies, browser checks and local package preparation | [Verification guidance](../agents/verification.md) and [source/output map](../agents/repository.md) |
| Executed example source, reset/removal cleanup and outcome checks | [Documentation guidance](../development/documentation.md) |
| Handoff/analysis/decision updates and task permissions | Current [maintainer workflow](../../spec/SPEC-maintainer-workflow.md); the completed delegation is retired as authority |

### Historical parity-port rules and observations (2026-09-10)

These dated observations explain the old investigations. Current product and workflow owners are linked above. Old names/paths, exact-parity scope, display:contents exceptions and approval cadence below are historical facts, not active instructions.


- The port assigned CSS to generator inputs and fixes to the owning producer, rather than component workarounds. The later pipeline has several producer types; current style guidance identifies their owners.
- **Map ignore entries were permanent source claims.** Naming a class there
  says "this class produces no style in the reference", and the generator then drops it from every
  future run. The recorded evidence requirement was the rule that wins, read in the
  browser, with its selector. Reaching for it because a class *appears* inert is how a real
  declaration gets silently deleted — `my-4` on the code block was put there on that reasoning and
  reverted, because the class works and the reference's own docs page was zeroing it. **Confirmed on
  the live site 2026-09-10** by bisection: removing the demo's `aria-label` restores the 16px,
  changing its value restores it, and a plain div carrying that exact value is zeroed too. Their
  component keeps its margin; their docs harness cancels it on all 10 demos.
- **The old port allowed measured display:contents host exceptions.** `display: contents` is the
  exception, not the default, and it needs the same evidence as any other claim: the reference's own
  element is the box its container lays out, and a host of ours in between takes that place instead.
  Two carried it at that date, both measured — `acme-error`, whose alert takes a flex row's stretch, and
  `acme-kbd`, whose key sizes a row to 20px where our host made it 25. The exception addressed a host intercepting the box a container sized, stretched or ordered. The later real-box contract supersedes this technique; these measurements do not authorize it now.
- The selected link-button interface used href on the element, without a separate link-button element. The current component contract owns it.
- **The port removed shared/global focus rings.** Rings arrive through
  the generator, in the element that draws them, because that is what the reference does: it has no
  page-wide focus rule of any kind and leaves the browser's own ring on anything it does not style.
  See [notes/decisions/focus-ring-ownership.md](../decisions/0041-focus-ring-ownership.md).
- Port documentation matched reference sections. Extra measured states used census:true examples on /census/<id>. Later documentation contracts replace that page-shape requirement.
- The recorded test layout was colocated __tests__/<file>.test.ts with bun:test. Current verification guidance owns the convention.
- The old procedure used one question dialog at a time and commits only on request. Current workflow and actual task authorization supersede that repository procedure; global preferences remain unchanged.
- **The completed pass selected full replacements.** Its old rationale asserted no consumers, without a measurement of usage, and rejected deprecated aliases, fallback branches, retained-old-behavior options and old-interface explanations in current code/JSDoc/consumer docs. Mappings and reasons remained in historical records. The completed replacement outcomes stay final; the no-consumers premise and blanket future override retire. Future scope follows its own approval and workflow.
- **A clean result is only a pass if both sides compared the same number of roots, and that number is
  not zero.** Roots pair by order, so a mismatch makes every difference downstream meaningless, and a
  zero-root run reads as clean while measuring nothing. The collector now refuses to save an empty run
  and the comparison now fails loudly on either case, so this cannot be forgotten. See
  [notes/decisions/track-census-results.md](../decisions/0113-track-census-results.md).
- **The old record required checked evidence.** Its examples included file contents, counts, decisions, tool behavior and failure scope. Session memory alone was not proof; inaccessible checks remained labelled unverified with a reason. Current source research and verification guidance own the procedure.
- **Reference claims required observed evidence:** its own prose, its own example code, its compiled output, or its live behaviour. Finding
  that the reference wraps Radix, cmdk or react-aria tells us *where to look*, never what the answer
  is — a wrapper can pass different options, override a handler, use one part and hand-roll the rest,
  or pin an older version. The exact port gave observed reference behavior priority over generic upstream documentation. Later approved adaptations qualify that priority. Missing evidence remained unverified.
- **The recorded generation order was split, build, docs, then tests.** `tokens.css`
  and the style modules come from `styles/house.css` through `split`, and `docs/` comes from `dist/`, so
  building without splitting first served the previous CSS and a docs page shows a change that is not
  there. Testing a stylesheet/map edit against stale build output could therefore imitate an implementation defect. The recorded docs/ output name is historical; _site/ is the generated website now.
- **The old API audit tracked four places.** The element, its map under
  `tools/geist/maps/`, its census config under `tools/geist/census/`, and its tests. A map still
  naming the old classes regenerates the old stylesheet; a config still naming the old parts measures
  nothing and the collector refuses the run. That audit searched the old names. The maintained producer/verification map now covers additional package and metadata consumers.
- **A held `StoreSelector` is never dead code, whatever the linter says.** Constructing one
  registers it as a reactive controller, and that registration is the whole subscription; nothing
  reads the field afterwards. Both `tsc --noUnusedLocals` and Biome's
  `noUnusedPrivateClassMembers` report it as unused and offer to delete it. Deleting one stops the
  element re-rendering for that store. This has cost a regression once already — a late-slotted icon
  showing the wrong glyph — and the unit tests cannot catch it, because `slotchange` does not fire
  under happy-dom. The failure required a browser check; the unit run alone did not observe it.
- **The map correction matched layout roles rather than names.** Verified 2026-09-10 on code-block, which rendered its copy button
  clipped in half at the frame's edge. The reference is `button > span (the label wrapper) > div
  (a 16px stack) > two layers`; ours is `button > slot > stack > .check/.copy`. The map named our
  `.copy` layer for their span, so the span's `padding-inline` landed on an absolutely-positioned
  16px layer instead of the button's label wrapper, widening it past a frame with `overflow: hidden`.
  Both boxes hold the glyph, and only one takes the padding. The correction matched the reference subtree by layout role.
- **Composed host boxes affected flow as well as paint.**
  Verified 2026-09-10 on code-block's floating copy button, which sat in a 24px gap above the code.
  The reference's button *is* the absolutely-positioned box; ours has `acme-copy-button` and
  `acme-button` between it and the frame, and an in-flow inline host takes a line of the parent's
  `line-height` even when everything inside it is positioned. `display: contents` does not fix this
  — it removes the host but promotes the inner element into the same flow. A block host of zero
  height does. The case established that host flow must be considered separately from the inner element's absolute positioning.
- **A store change whose consequence is not a render is a `StoreEffect`, not a subscription field.**
  `src/shared/state.ts` carries it: `StoreSelector` re-renders, `StoreEffect` runs a side effect, and
  both followed the host's life. At that checkpoint, collapse-group, toaster and theme still hand-rolled a Subscription and disconnectedCallback. This is a dated migration observation.
- **An animation the census must measure stays keyed off the state attribute; the directive only
  times it.** Verified 2026-09-10 on the book. `@lit-labs/motion` runs only in Lit's update cycle,
  so an attribute-driven hover needs reactive state beside `data-hover`, never instead of it: the
  CSS rule keeps holding both states, the directive animates between them, and the census reads the
  same matrix as before. Replacing the CSS with script would break the harness that proves the
  animation is right. See [motion-on-the-book.md](../decisions/0065-motion-on-the-book.md).
- **The Book test initially dispatched at the wrong pointer target.**
  Verified the expensive way 2026-09-10: my book tests fired on `.wrap`, where `Interaction` has no
  listener, so `data-hover` was never set and I never saw the hitch Peter hit in Chrome. A handler
  that reads the box before a state attribute applies must also be BOUND before it — Lit registers a
  template listener at first render, `Interaction.attach` runs in `updated`, so on the same element
  the template's runs first.
- **A gesture that turns mid-flight must cancel the animation in progress.** The directive cancels
  only when it commits styles, never when a new animation starts on the same box, so the old one
  keeps advancing against the new one — the snap Peter found on a quick in-and-out. The correction captured the live matrix before the state change, then canceled the old animation.
- **The places beside content are `start` and `end`, in every element, and no element keeps its own
  `hasStart`/`hasEnd`.** Decided 2026-09-10 by Peter. Nine elements moved off `prefix`/`suffix`,
  `data-prefix`/`data-suffix` are gone (no generated stylesheet ever read them), and the eight that
  hand-rolled the same two booleans now share `src/shared/places.ts`, a reactive controller. Its then-current query was this.places.has("start"). See [start-and-end-places.md](../decisions/0099-start-and-end-places.md).
  `middle-truncate` keeps `prefix`/`suffix` for the two halves of a truncated string, which is the
  correct word for text rather than for a place.
- **An example heading in a map's `skip` list is the REFERENCE's heading, not ours.** Verified
  2026-09-10: `menu`, `context-menu`, `select-label` and `input-label` all name "Prefix and suffix"
  there, and the generator matches it against the reference spec. Renaming our docs heading is
  safe; renaming the map's entry silently stops skipping an example.
- **Uncommitted measurement results could still be overwritten.** Verified the expensive way 2026-09-10 on split-button: a first re-run measured three
  states the saved run never did and used selectors that read the wrong boxes, taking the page from
  60 hard to 1716 and overwriting the evidence. A copy under /tmp made that recoverable. Two configuration faults caused it: `states` belongs INSIDE each side (a
  top-level key is ignored, and the census then defaults to four state passes), and a part naming a
  composed element must hop to the real control — `acme-button.trigger` reads the HOST, giving
  cursor:auto and position:static for a button that is neither, while `acme-button.trigger >>
  [part=button]` reads the button.
- **The port stops at Vercel's own brand.** Decided 2026-09-10 by Peter: `acme-brands` was removed
  outright. It drew Vercel's wordmarks, Next.js, Turbo, Turbopack and v0 — their trademarks, not a
  design-system capability — The design-system scope excluded that brand identity. The element,
  its 20 trademark assets, its map, spec, census and docs page are deleted. The selected scope excluded other brand-identity copies on the same basis.
- **An element owns its own positioning context; the reference's docs page is not part of the port.**
  Verified 2026-09-10 on brands. Its copy button is absolute at top/right 16px, and the reference
  resolves that against *their docs page's* wrapper, which is `position: relative`. Ours had no
  positioned ancestor of its own, so the button escaped to whatever the consuming page happened to
  provide — measured at -96 top, -278 right on our docs page. Where the reference leans on its page
  for a positioning context, our element supplies one, because a consumer's page will not.
- **A shadow-root margin required a supported component property.** Verified
  2026-09-10 on the code block. Its `margin-block` is on `.code-block` in the shadow tree, so
  `.preview > * { margin-block: 0 }` on the docs page did nothing. The element now exposes
  `--acme-code-block-margin-block`, defaulting to the reference's value, and the docs preview sets
  it to `0`. See [demo-margin-ownership.md](../decisions/0024-demo-margin-ownership.md).
- **A difference between two docs pages is not automatically an element defect.** The reference's
  docs harness styles its own demos, so copying the element faithfully and copying the harness
  faithfully are two separate jobs. The investigation distinguished harness behavior from component behavior.
- **A deliberately different control could not reuse the reference control's sizing map.**
  Verified 2026-09-10 twice on code-block. Their tab strip's rules clipped our switch's ring, and
  their select wrapper's `h-8` left our host a 32px box around a 24px field. Both were mapped to the
  reference's node, so the generator wrote their sizing onto ours. The generator then reports an
  unmapped child, which is the accurate outcome and belongs in the map's comment rather than being
  silenced.
- **Generated values were controlled by their mapped inputs.** Verified 2026-09-10:
  `acme-button`'s `.tiny` height reads as a hard-coded 24px, and it is generated from the
  reference's own `h-[24px]`. An edit there is reverted on the next `gen.ts` run. Additional tokens could serve deliberately added tiers. This old observation does not make mapped values immune to later approved token changes; the producer inputs remain authoritative.
- **A rule written for the reference's control clips ours when the two are different boxes.**
  Verified 2026-09-10: the map pointed our `acme-switch` at the reference's tab-list node, so the
  generator wrote their scrolling strip rules onto it. Their underlined tabs scroll correctly; our
  segmented control has a `box-shadow` ring, which paints outside the border box and is therefore
  clipped by a scrolling ancestor. **The correction removed the incompatible control mapping.** Our element carries its own generated styles, and the
  unmapped-child report that follows is accurate rather than a defect to silence.
- **A composed variant's name did not establish its behavior.** Verified
  2026-09-10: I set the switcher's select to `variant="secondary"` because the toolbar reads as
  secondary. That variant is documented on `acme-select` as "no ring, the field shifted 12px left" —
  a borderless inline select that applies `translate: -0.75rem 0`. It put the chevron off-centre in
  a bordered control. The element's documentation supplied the actual variant contract.
- **Composed notifications could fire twice.** Verified 2026-09-10 on
  code-block's switcher. The hand-built control used the native `change` event, which does not
  collide; `acme-select` and `acme-switch` both fire `acme-change`, which bubbles and is composed.
  A listener on the composing element then sees every change twice — once from the composed element
  and once from the re-dispatch. The correction stopped that composed notification before redispatch. This is the recorded case, not a blanket stopPropagation policy; current component event contracts determine propagation.
- **The port used this plan as its decision/index entry point.** It required same-turn records for decisions, scope changes and clarifications so a fresh session did not need conversation history; longer records used notes/decisions and notes/analysis. That index procedure is retired. Current workflow uses selective specifications/decisions/research and docs/STATUS.md as the sole handoff.

### The tools, and what each decides

| Tool | What it decides | What it refuses to decide |
|---|---|---|
| `bun tools/geist/gen.ts <name>` | The element's whole stylesheet, from the map and the spec | Nothing — it is fully deterministic |
| `bun tools/geist/diff.ts <page>` | Hard, soft, or accepted, by exact rule | Whether a new difference should become accepted |
| `bun tools/geist/contract.ts` | Extracts 442 reference behaviour statements and 40 wired callbacks, sorted by who can decide them | Whether our element satisfies any of them |
| `bun tools/geist/config.ts <name>` | The mechanical half of a census config | The five fields that carry the measurement's meaning: prepare, viewport, width, text parts, hops |
| `bun tools/geist/reconstruct.ts [name]` | What a saved result says the working run was given: url, text parts, states, root count, part list. With no name, every measured page that no config names | The selectors, which a result does not store — take those from `config.ts` and the page |
| `window.__rings(side)` (`tools/geist/rings.js`) | What every keyboard-reachable box shows at rest and under focus, so the two sides can be compared | Whether a silent box is a defect — the same box on the reference decides that |

### Supporting documents

The table preserves the port's supporting-document index, with links relocated to their new owners. Its old mandatory reading order is retired. The source's assertion that docs/ was build output describes the former website layout; docs/ now holds maintainer records and _site/ is generated.

| File | What it holds |
|---|---|
| [tools/geist/README.md](../../tools/geist/README.md) | The full runbook for the parity pipeline, and every guarantee the generator makes |
| [notes/alignment/README.md](systematization/pass-history.md) | Historical systematization goal, phases, dispositions and dated state |
| [notes/decisions/systematization-goal.md](../decisions/0105-systematization-goal.md) | **Decided.** Interface consistency is the main test of success for the systematization pass; composition, appearance, and behaviour remain in scope |
| [notes/decisions/agent-skills-workflow.md](../decisions/0002-agent-skills-workflow.md) | **Decided.** Use Addy Osmani's Agent Skills for the remaining pass, preserving project decisions and approval steps |
| [notes/decisions/custom-elements-manifest.md](../decisions/0021-custom-elements-manifest.md) | **Decided.** Use the standard Custom Elements Manifest analyzer; verify its output on this repository before replacing the current extractor |
| [notes/decisions/browser-verification.md](../decisions/0011-browser-verification.md) | **Decided.** Require Chromium, Firefox and WebKit verification alongside the Bun unit tier |
| [notes/decisions/animation-package.md](../decisions/0004-animation-package.md) | **Decided.** Retain Lit Motion for its technical fit, subject to browser checks; implementation effort does not decide the choice |
| [notes/decisions/icon-element-shape.md](../decisions/0046-icon-element-shape.md) | **Decided.** One element per icon, with shared behaviour and selective imports |
| [notes/decisions/material-symbols-icons.md](../decisions/0060-material-symbols-icons.md) | **Decided.** Material Symbols SVGs, Rounded/unfilled defaults, three supported families and official filled/unfilled artwork; no icon font or two-tone |
| [notes/decisions/zag-behaviour-ports.md](../decisions/0114-zag-behaviour-ports.md) | **Current.** Native Lit ports using the selected packages; new/rebuilt/replacement components allowed. Supersedes Zag runtime/adapter adoption |
| [notes/decisions/zag-lit-integration.md](../decisions/0115-zag-lit-integration.md) | **Superseded.** Historical five-control Zag runtime/adapter selection |
| [notes/decisions/pin-input-behaviour.md](../decisions/0078-pin-input-behaviour.md) | **Decided.** Separate-field Pin Input; native Lit port |
| [notes/decisions/number-input-behaviour.md](../decisions/0071-number-input-behaviour.md) | **Decided.** Formatted Number Input and stepping; native Lit port |
| [notes/decisions/scroll-area-behaviour.md](../decisions/0089-scroll-area-behaviour.md) | **Decided.** Custom scrollbar controls over native scrolling; native Lit port |
| [notes/decisions/steps-behaviour.md](../decisions/0103-steps-behaviour.md) | **Decided.** Interactive Steps with navigation/content; native Lit port |
| [notes/decisions/match-sorter.md](../decisions/0058-match-sorter.md) | **Decided.** Published package replaces the local ComboBox ranking copy after wider compatibility tests |
| [notes/decisions/generated-style-location.md](../decisions/0044-generated-style-location.md) | **Decided.** Move generated styles under src/generated and retain them in Git for the current pipeline |
| [notes/decisions/documentation-publishing.md](../decisions/0030-documentation-publishing.md) | **Decided.** Build the website in a GitHub Pages workflow; stop committing generated pages |
| [notes/decisions/selective-component-loading.md](../decisions/0091-selective-component-loading.md) | **Decided.** Selective imports are the normal static-artifact path; the complete bundle stays available |
| [notes/analysis/systematic-approach.md](../research/20-systematic-approach.md) | Historical method: what a script decides, what a person decides, and the measured evidence for where that line falls |
| [notes/alignment/phase-1-review.md](systematization/research-review.md) | Completed Phase 1 findings and decisions; the later Phase 2 sequence is preserved in pass history |
| [notes/alignment/additional-functionality-review.md](../design/additional-capabilities.md) | Completed Phase 1 extension: decisions, evidence and later acceptance obligations |
| [notes/analysis/codebase-systematization.md](../research/06-codebase-systematization.md) | Phase 1 codebase census, shared-responsibility findings and focused browser reproductions |
| [notes/analysis/animation-package.md](../research/02-animation-package.md) | Animation comparison, measured package costs, retention decision and verification limits |
| [notes/analysis/icon-library.md](../research/14-icon-library.md) | Icon shapes, licences, historical import measurements and Material Symbols SVG evidence; records the selected shape/source and open defaults |
| [notes/analysis/repository-layout.md](../research/18-repository-layout.md) | Reference-library survey, proposed layout and verified generator ownership |
| [notes/analysis/build-performance.md](../research/05-build-performance.md) | Isolated build, selective-entry measurements, CSS delivery and SSR experiment |
| [notes/analysis/documentation-site.md](../research/09-documentation-site.md) | Proposed standard docs page, manifest contract and doc-component responsibilities |
| [notes/analysis/floating-surface-shadows.md](../research/11-floating-surface-shadows.md) | Shadow role evidence, Material plain/rich tooltip distinction, Toast comparison and verification limits |
| [notes/analysis/behaviour-verification-method.md](../research/03-behaviour-verification-method.md) | How behaviour parity gets proven: the four instruments, what each is for, and the traps. Includes the test-tier decision and the cheap checks we were missing |
| [notes/analysis/hand-rolled-audit.md](../research/13-hand-rolled-audit.md) | Living record of what we hand-roll that a package could own, with an assessment and reason for each |
| [notes/analysis/lit-practice-review.md](../research/15-lit-practice-review.md) | Which Lit mechanisms we use and which we are missing, checked against our own code. Includes the accessibility evidence for keeping ARIA on inner elements |
| [notes/analysis/package-choices.md](../research/16-package-choices.md) | Every package choice with its evidence: confirmed, worth adopting, or to avoid. Records that no Zag adapter for Lit exists |
| [notes/analysis/slotted-cascade.md](../research/19-slotted-cascade.md) | Why a shadow rule loses to the page when it styles slotted content, measured; what ten production systems do about it; and the 64 `!important` rules of ours, 11 of which genuinely need it. **No decision taken** |
| [notes/analysis/functional-parity-sources.md](../research/12-functional-parity-sources.md) | What is and is not obtainable for verifying behaviour, and the method that follows. Records that there is no source code to read, so nobody looks twice |
| [notes/decisions/track-census-results.md](../decisions/0113-track-census-results.md) | **Decided.** Measurement results are version-controlled, and the two guards that stop an empty run being read as a pass |
| [notes/decisions/parity-scope.md](../decisions/0077-parity-scope.md) | **Decided.** What parity means: style, behaviour and functionality, never implementation. The rule every API choice is judged against |
| [notes/decisions/prop-naming-vs-reference.md](../decisions/0079-prop-naming-vs-reference.md) | The button `type`/`typeName` case that raised the question, kept for its evidence. Settled by the parity-scope decision |
| [notes/decisions/state-on-tanstack-store.md](../decisions/0101-state-on-tanstack-store.md) | **Decided.** Every element holds its own state in a per-instance TanStack Store, as TanStack Form does. Carries the pattern, its four traps, the evidence gathered before deciding, and the migration order |
| [notes/decisions/input-affix-api.md](../decisions/0047-input-affix-api.md) | **Decided.** A field's prefix and suffix are two named places, not one concept with booleans: the name carries where the thing sits. Carries the measurement that proved the place is binary, and the group and icon elements deferred |
| [notes/decisions/focus-ring-ownership.md](../decisions/0041-focus-ring-ownership.md) | **Decided.** Every element draws its own focus ring; the shipped sheet carries no page-wide focus rule, because the reference carries none. Includes the 955-box sweep that proved nothing lost a ring |

---

## 2. How we prove parity

The port used tools/geist measurements as its parity evidence. The [tooling runbook](../../tools/geist/README.md) owns current operating instructions; the following method and ports are a dated snapshot.

### Three servers

These were the recorded servers and commands, not startup instructions for the current workflow.

| Port | Command | What it serves |
|---|---|---|
| 4180 | `bun scripts/dev.ts --no-build` | Our docs site |
| 4183 | `bun tools/geist/collector.ts` | Receives measurements; serves `/census.js` |
| 4184 | `bun tools/geist/serve.ts` | A mirror of the reference site, scripts stripped |

### The loop for one element

The original port loop had eight stages:

1. **Spec** — `bun tools/geist/extract.ts <page>` read the reference page into
   `spec/<page>.json`. A state the server HTML lacks (an open menu, a tooltip) is drawn by hand as
   a sketch and added with `extract.ts synth`.
2. **Map** — `maps/<name>.ts` recorded our root selector, each prop value to one modifier class,
   the children, the slotted tags.
3. **Generate** — `bun tools/geist/gen.ts <name>` wrote `src/generated/components/<name>/<name>.styles.ts` and its compiled CSS/maps.
   The report was reviewed until only known reference inconsistencies remained.
4. **Template** — the old port rebuilt DOM to match the reference with local class names and the selected stack. Source comments excluded the reference name. Later approved contracts supersede mandatory DOM mirroring.
5. **Build** — `bun run split && bun run build && bun run docs && bun test`.
6. **Census** — browser measurements used the mirror and local pages, injected census.js and window.__census({...}) for each side in both themes.
7. **Record** — census/<page>.config.json saved the exact run configuration.
8. **Diff** — the two diff commands targeted hard = 0 under the original exact-parity policy. Current rebuilt components use their approved adaptations and acceptance records.

### Reading the measurements correctly

These terms and measurements describe the original comparison harness.

- A **root** is one measured box. A **page** is one docs URL.
  **One page usually carries several roots.** The tooltip page carries four roots: the trigger,
  the bubble, the backdrop and the key inside the bubble. The menu page carries five.
- The `page` field in a result file is a **label the caller chooses**, not a URL. The collector
  writes `census/<label>.<side>.json` from that label. So `avatar`, `avatar-group` and
  `avatar-wrap` are three roots measured on the one avatar page.
- At this checkpoint: **125 measured roots across 69 reference pages.**
- A **hard** difference is a defect. A **soft** difference comes from the fonts and is expected.
- **A hard difference is a defect only after three other explanations are ruled out.** Each has bitten
  more than once, and each produces a difference that looks real and points at our element:

  | Explanation | How it shows | How to rule it out |
  |---|---|---|
  | The saved result is stale | A property we already fixed still differs | Read the value in the browser before believing the file |
  | The two preview columns differ in width | Anything full-width or in a percentage | Fix both sides with `width` |
  | **The reference's docs page styles its own demo** | A property with no plausible source in the component | Find the rule that wins, in the browser, and read its selector |

  The third is the most dangerous, because nothing in the harness separates a component's own style
  from the page furniture around it. The census reads the rendered page, so both look the same. A real
  case: the reference's code-block page carries `[aria-label="Hello world"] { margin: 0 !important }`,
  unlayered and keyed on the literal demo string, which zeroes a margin the component really has.

  It also cuts the other way: a page rule that styles their demo *towards* what we happen to do hides
  a real difference and reads as a clean pass. **Section 5.1b is the audit for both directions**, and
  it covers the pages at zero hard differences as well as the ones that report.

- **An incomplete stylesheet walk could produce a false negative.** A walk over
  `document.styleSheets` must recurse into every grouping rule — `@layer`, `@media`, `@supports`,
  `@container` — or it silently walks past their contents. The reference ships Tailwind v4, whose
  `utilities` layer alone holds 2,482 rules. A walk that misses them reports "no rule matches" for a
  rule that plainly applies, and every conclusion drawn from that is wrong. A known matching rule was required as a control for a negative result.

### Accepted leftovers

These were the port's accepted differences and reasons. Their old wrapper geometry, remote video sample and copied quirks are not automatically current component contracts.

| Leftover | Why |
|---|---|
| Wrapper box `min-width`: `auto` where the reference reads `0px` | Our root is a flex item of the wrapper; theirs is a block child. `auto` resolves like `0` in a column's cross axis. No visible effect. |
| Blockified `display` (`inline-flex` reads `flex`) | Same cause: a flex item blockifies. No visible effect. |
| Top-layer boxes read `position: fixed`, reference reads `absolute` | The top layer's containing block is the viewport, so viewport coordinates are the only correct placement. |
| Video's sample file | Streamed from the reference's address. |
| Reference quirks reproduced on purpose | A one-word-per-line right tooltip; two broken utility classes on select. |

---

## 3. Where things stand

| Measure | Value |
|---|---|
| Element directories | 151 |
| Maps written | 129 |
| Sketches | 187 |
| Specs extracted | 76 |
| Tests | 608 pass, 0 fail — and they pass with the corpus absent, the way CI runs |
| Build, docs build | pass |
| Committed | **0.2.0 released 2026-09-10.** Eight commits pushed to main, tag v0.2.0 published to npm |
| Pages at zero hard differences | **103 of 124**, with accepted leftovers classified by rule in `diff.ts` |
| Pages reporting real differences | 21, listed in section 5.1. All against measurements older than today's generator fixes |
| Elements the generator reproduces byte-identically | 90 of 95. The other five each drop an unused legacy variable or a duplicate line |
| Maps the generator reports clean | 93 of 129. The rest report cascade notes and documented reference quirks, not defects |

### Wave 3: overlays

- Recorded done — tooltip — top layer, floating-ui fixed strategy; kbd inside it fixed
- Recorded done — menu — top layer; Tab swallowed as the reference does
- Recorded done — select — a styled native select; no overlay machinery
- Recorded done — modal — native dialog; sheet form fixed
- Recorded done — combobox — a Radix popover with match-sorter filtering, not cmdk; `acme-combobox-option` and the list template are shared with the two below
- Recorded done — toast — store-driven queue; viewport in the top layer; the reference has no swipe and no violet type
- Recorded done — dots-menu — composes menu
- Recorded done — destructive-action-modal — composes modal, input, note, error and button
- Recorded done — context-menu — the reference is a Radix context menu, not its Menu; ours composes menu with the context list's own rules
- Recorded done — multi-select — the reference is a popover of checkbox rows with smart selection, not a chip combobox; nothing reused
- Recorded done — command-menu — cmdk-based; native dialog; vendored command-score; hotkeys through TanStack
- Recorded done — drawer — the reference is a Base UI drawer with no handle; the popup is the drag surface; native dialog
- Recorded done — sheet — a Radix dialog of its own, not the modal's sheet form; native dialog
- Recorded pending — **calendar** — dates through `@internationalized/date`; floating popover. On disk: spec, styles. Missing: map, sketches, census. Its agent stopped on a spend limit.
- Recorded pending — **context-card** — hover card on the tooltip base. On disk: spec, map, sketches, styles. Missing: census. Two real defects were found and fixed here (see section 6).
- Recorded pending — **relative-time-card** — hover card with time zones. On disk: spec, maps, sketches, census config. Missing: the census run itself.

Dependency tree:

```
menu ──┬── dots-menu
       └── context-menu
modal ──── destructive-action-modal
combobox ──┬── multi-select
           └── command-menu
tooltip ──┬── context-card
          └── relative-time-card
```

---

## 4. The measurement problem, and what actually caused it

This investigation explains why the then-saved parity numbers were not reliable.

### What was found

On 2026-09-09 every generated style module was rewritten between 15:13 and 16:33. Almost every
measurement had been taken earlier that day, between 07:24 and 16:01. So the measurements on disk
describe code that no longer exists.

A sweep of the 125 measured roots read 85 clean and 40 with hard differences, of which 29 carried
differences that were not accepted leftovers. Those numbers could not be trusted either way.

### The real cause: two generator bugs

Rather than re-measure blind, the generator was tested for faithfulness: regenerate every mapped
element and compare against what shipped. 84 of 95 matched byte for byte. Eleven did not, and the
differences exposed two genuine bugs in `tools/geist/simplify.ts`.

The simplifier decides when a later shorthand replaces an earlier longhand. It decided this by
**name prefix**: if a property's name starts with the shorthand's name plus a hyphen, it was
treated as reset. That heuristic is wrong for several real properties.

| Bug | What broke | Authority |
|---|---|---|
| `outline` was treated as resetting `outline-offset` | `outline-offset: 2px` was deleted from nine elements' focus rules | CSS UI spec: "outline-offset is not part of the outline shorthand" |
| `transform` was treated as resetting `transform-style` | `transform-style: preserve-3d` was deleted from book, which breaks its 3D flip | CSS Transforms 2 gives `transform-style` its own section |

**Both are fixed.** `simplify.ts` now carries a `NOT_RESET` table naming, per shorthand, the
same-prefixed properties it does **not** reset: `outline`, `transform`, `text`, `background`,
`border`, `overflow`, `flex`, `grid`, `mask`, `animation`, `page`, `column`, `font`.

Five tests cover the rule in `tools/geist/__tests__/simplify.test.ts`.

After the fix, 90 of 95 elements regenerate byte-identical. The five that still differ were each
checked by hand and are all **improvements**, not losses:

- `avatar-group`, `fieldset`, `tooltip`, `command-menu` — drop unused legacy custom properties
  (`--acme-secondary-light` and similar) that nothing reads; `command-menu` also **gains** the
  `outline-offset` the old bug had removed.
- `gauge` — drops a duplicated `transform-origin` and a `transition-property` that a later
  `transition` shorthand correctly resets.

### Where that leaves parity

The generator is now faithful and deterministic. The element code on disk is correct and passes
583 tests. What is missing is a fresh set of measurements taken against this generator.

At that checkpoint, the record reported no known broken implementation but unproved parity pending fresh measurements. This dated conclusion does not establish today's baseline.

---

## 5. What has to happen next, in order

The 2026-09-10 record paused sections 5.1–5.5 while systematization decided which elements to retain, replace or remove. It proposed returning to surviving comparisons under the amended scope and absorbing section 5.7 cleanup. The completed [systematization history](systematization/pass-history.md) and current family contracts supersede that queue. The original checked/unchecked state below remains historical provenance, not an instruction to resume it.

### 5.1 Re-measure the 21 pages that report differences `[ ]`

**Not all 124.** The full diff sweep, run with the accepted-leftover classification now in `diff.ts`,
reads **103 pages at zero hard differences**. Re-measuring those spends the most expensive resource we
have to confirm what we already know. The 21 that report real differences are the target:

```
badge  book  choicebox  clearable-input  code-block  collapse  collapse-group
description  error  input  pagination  pagination-next  progress  scroller-narrow
search-input  separator  snippet  split-button  split-button-trigger  tab  tabs
```

Their numbers come from measurements taken before today's generator fixes, so each may already be clean.

The planned per-page procedure measured both sides/themes and saved the configuration. The config tool supplied the mechanical half while leaving five judgment fields explicit. The two diff runs targeted zero hard differences under that port policy.

At that checkpoint, 67 of 125 roots had no saved configuration; the plan required recording each touched root.

### 5.1b Audit every measured root for page-furniture contamination `[ ]`

Raised by Peter on 2026-09-10 after the code-block case. The record then marked it not started. No later record inspected for this conversion establishes completion of the proposed provenance tool; this is historical research scope, not a newly approved implementation task.

The census reads the reference's **rendered** page. A rule its docs page applies to its own demos is
therefore indistinguishable from a rule the component carries, and nothing in the harness separates
them. Every number we have is exposed to this.

The case that surfaced it: the reference's code-block page carries

```css
[aria-label="Hello world"] { margin: 0 !important }
```

unlayered, `!important`, and keyed on the literal demo string, so `"Hello worlds"` does not trigger
it. It zeroes a `margin-block: 1rem` the component really has. Our element was correct and the census
reported ten hard differences against it. I misread that as the class being inert and put it in the
map's `ignore` list, which would have deleted a real declaration from our stylesheet permanently.

**It cuts both ways, and the second direction is worse.** A page rule can

- **invent** a difference, by styling their demo away from what the component does — what happened
  here, and at least it reports something; or
- **hide** one, by styling their demo *towards* whatever we happen to do. That reads as a clean pass.
  **So the 103 pages at zero hard differences are not exempt from this audit.** They are the larger
  and quieter risk.

The proposed audit's per-root scope was:

- Recorded pending — For every measured property, identification of the winning reference rule in the browser through a walk that recursed into `@layer`, `@media`, `@supports` and `@container` —
      the reference ships Tailwind v4, whose `utilities` layer alone holds 2,482 rules, and a walk
      that misses them reports "no rule matches" for a rule that plainly applies.
- Recorded pending — Classification of each winning rule as component or page styling. A selector keyed on a demo's own
      content (`[aria-label="Hello world"]`), or an unlayered rule beating the utilities layer, is
      the page's.
- Recorded pending — Where the page rule won, recording the component's own target value and the page-rule reason, avoiding deletion of valid component styling.

**Best done as a tool, not by hand.** The reading is mechanical: for each root and property, the
winning rule and its selector. A `provenance.js` beside `census.js` could emit that alongside the
readings, and the diff could then say "the reference's page wins this one" rather than "hard". That
also makes the result durable — a re-run re-derives it instead of trusting a note.

The unresolved proposal highlighted that an unexplained hard difference needed a winning-rule investigation before a component correction. A clean count alone could not exclude page-furniture contamination.

### 5.2 Fix what survives `[~]`

The initial checkpoint planned the 21 pages with reported differences by expected effort. It assumed all 21 had matching root counts and sound harnesses. Later measurements below disprove that assumption. Input had 22 reference roots versus 20 local roots; several other reported differences came from the harness. The initial counts did not establish component defects.

- Recorded done — **separator — at parity.** Its 5 differences were the docs page's own spacing. The reference's
  page spaces its row with `space-x-4` and `space-x-2`, which put a margin on every child; ours uses
  `gap` on the same row. Verified in the browser that the spacing is identical: 16px against 16, 8
  against 8, none where the row stacks. Recorded as soft, with the reason.
- Recorded done — **collapse and collapse-group — at parity.** 7 roots each side, both themes, 0 hard. Three
  causes, all in the measurement rather than the element:

  | Cause | Why |
  |---|---|
  | A class marker that two examples do not carry | `.border-b.border-t-0` found 6 roots against 8. The root is now `div:has(> h3)`, the block whose own child is the heading, which holds on every example. |
  | The snapshot carries a section the live reference removed | The mirror has a fifth "Standalone" section; the live page's sections are Default, Expanded, Multiple, Small and Best Practices, which is exactly what our docs page shows. **Our page is right and the snapshot is stale.** The new `previews` option names the four shared examples. |
  | Different container widths | The mirror's preview column is 200px against our 958, and the root fills its container on both sides, so every width in the chain differed by the container. `width` fixes both at 600px. |

  The expanded panel's height is recorded as soft, with the reason: **ours is correct and the
  reference's page is stale**, its panel measuring height 0 with content hidden by overflow while
  carrying `aria-expanded="true"`. Verified on the live site, where clicking the heading does not open
  it either.

- Recorded done — **tabs — at parity.** Its 1 difference was a state the census cannot reach on either side. The
  reference stops the tab row clipping through `has-[:focus-visible]:overflow-visible`; the census
  rewrites `:hover` and `:focus-visible` into attributes but **not** `:has(:focus-visible)`, so the
  reference's row can never be driven into that state and always reads `overflow: auto`. Ours
  implements the same behaviour through `data-focus-within`, set by a focusin listener when the focused
  tab matches `:focus-visible`, with the generated rule `.tabs[data-focus-within] { overflow: visible }`.
  **Both are correct; only the measurement cannot reach it.** Verified by reading both, and the state is
  dropped from the census. It belongs in the behaviour checks (5.4), not here.
- Recorded done — **pagination — at parity.** Its 1 difference was the gap between the links. The row is
  `space-between`, so that gap absorbs whatever the link text leaves, and the text is set in our own
  font. Read as soft, with `width` fixing both previews at 600px.
- Recorded done — **scroller-narrow — at parity.** Recovered from git rather than rebuilt, on Peter's prompt: the
  original config was in the pipeline commit and the original results in the tracking commit, so
  nothing was lost after all.

  Two things the recovered config explained at once:

  - **The marker reads inside sketch sections only** — `[data-sketch] [data-geist-scroller]`. That is
    why the mirror's 14 previews yield 9 roots, matching ours. My guessed marker read all 14, which is
    what made the page look mismatched.
  - **The one difference was already diagnosed by the previous session and never recorded.** The grid
    tracks are `1fr 1fr`, so each resolves to half the stage width: 276px on the reference's 552px
    sketch stage against 259px on ours. A stage-width difference like every other soft width. Now
    recorded as soft, so it stops reporting.

  Both sides run at a 600px viewport, as the config specifies, to exercise the mobile-grid rule.

  **The lesson is about method, not scroller.** I had written this page off as unrecoverable. Peter
  pointed out that tracking the results should mean it was recoverable, and it was. That recovery showed why the original history had to be checked before calling evidence lost.

- Recorded done — **snippet, error, description and search-input — all at parity.** None had a saved config, and
  the four I had written from guesses measured the wrong things. `tools/geist/reconstruct.ts` reads a
  saved result back for what the working run was given — its url, its text parts, its state list, its
  root count and every part of every root — so a config is rebuilt from the run's own record rather
  than from a guess. What each page needed:

  | Page | What it was |
  |---|---|
  | snippet | The mirror carries two extra example boxes our page has no counterpart for. `previews` names the seven shared ones. Its 2 recorded differences were a stale `text-align` reading; the browser shows both sides `start`. |
  | error | **A real element fix.** The reference's alert is the box its container lays out; ours had a host box between them, which took the row's stretch and left the alert at its own height. `:host { display: contents }` puts our root back in that place. Both sides now read 24px in the size row, and the three accepted leftovers went with it. |
  | description | Its 6 recorded differences were already fixed by earlier work; the results predated the fix. |
  | search-input | **Two real fixes and a harness fix.** See below. |

- Recorded done — **The kbd host had a box the reference does not have.** The reference's key is one element:
  `inline-flex` in prose, blockified to `flex` when a flex row holds it, so the row sizes to the key's
  own 20px. Our `acme-kbd` host sat between the row and the key and took that place, making the row
  25px. `:host { display: contents }`. Verified in both contexts: the search field's key row now reads
  58x20 with both keys 20x20, matching the reference exactly, and the standalone page still reads
  `inline-flex` at 26x24, 24x24 and 40x24, also matching.

- Recorded done — **The census rewrote pseudo-classes on the reference side only.** Its comment said ours keys
  every state off attributes already. That is true of most of our generated sheets and not of all of
  them: a rule the reference wrote as a real `:hover` or `:focus-visible` comes through the generator
  as one. Such a rule of ours was unreachable, so the state read as its resting value and the diff
  reported a difference the element does not have — the search field's clear button, on both its
  hover colour and its focus outline. Both sides are rewritten now.

  The rewrite also needed a second rule. It expands `:hover` into "the pseudo-class, or its attribute
  on the element **or an ancestor**", and that descendant clause is what carries a state down to the
  parts inside a focused element. A compound that is the pseudo-class alone must not take it, or a
  page-wide rule lands on every descendant. `tools/geist/__tests__/census.test.ts` pins both rules,
  and the test was proven by reintroducing the bug.

- Recorded done — **The page-wide focus ring is gone from the shipped sheet.** Decided by Peter; see
  [focus-ring-ownership.md](../decisions/0041-focus-ring-ownership.md). The reference has no page-wide focus rule of any kind and
  leaves the browser's own ring on anything it does not style itself, proven by probing a plain button
  and a plain div on its page. Ours put a Geist ring and a 6px radius on every focusable thing,
  through a published entry point, so it reached consumers' own controls too.

  Swept afterwards with `tools/geist/rings.js`: 955 keyboard-reachable boxes across 98 of our pages,
  every silent one checked against the same box on the reference. Three patterns account for all of
  them and the reference reads the same way in each. **No element lost a ring it had.**

- Recorded done — **input and select — at parity, after replacing their affix API.** Peter judged
  `suffix-container="false"` an ugly API expanding the surface for a bad reason. It was a faithful
  transcription of the reference's React props, which is an implementation rather than a behaviour,
  so it went. Two places per side, each a slot, the name carrying where the thing sits:
  `start-addon` / `end-addon` attached to the outside of the field, `start` / `end` inside its own
  box. Six properties become none; the select keeps one, `end="false"`, for a place that is empty.
  Recorded in [notes/decisions/input-affix-api.md](../decisions/0047-input-affix-api.md).

  Two measurement faults surfaced, both older than this work: **the input page never had matching
  root counts** (22 against 20, two of its examples being search fields we render elsewhere), so its
  reported differences were computed across misaligned roots; and the reference has one root with no
  cell at all, whose icon reads 24x16 against the 14x14 every cell icon reads.

- Recorded pending — Remaining: split-button-trigger (240), choicebox (558). code-block stands at 31, all three
  causes known (see below).

  **Done 2026-09-10.** badge: 0 hard, its 51 differences were the reference's own demos authoring
  `class="relative"` on the icons they pass in — now an ACCEPTED entry with that evidence.
  split-button: 60 → **0 hard**, both themes, after rebuilding its census config; the last 4 were
  one cause, and Peter accepted it rather than fixing it
  ([element-child-radius.md](../research/10-element-child-radius.md)).

  **book: 142 → 0 hard, both themes.** Every difference was the measurement, not the element: all
  162 geometry readings match exactly. Four faults, the first being that `BH179W_stripe` names two
  boxes per book. Written up in [book-census-config.md](../research/04-book-census-config.md), including two wrong turns —
  I blamed a transition the census already disables, and I compared the wrong roots.

  **code-block, 2026-09-10.** Its 31 hard differences are three causes only, and none is an element
  defect the census can see:

  | Cause | Count | Standing |
  |---|---|---|
  | `root.margin-top/bottom` 0 vs 16px | 20 | Page furniture, now fixed. See below. |
  | `copy.color` gray-1000 vs gray-900 | 9 | The inner-tree-`!important` cascade. Needs its own decision. |
  | `v0` width and missing root | 2 | Not yet investigated. |

  Its census results are stale and it has **no saved config**, so the diff never measured the
  clipped copy button fixed in 53d1744, and it does not yet measure the composed select and switch.
  Rebuilding that config comes before the count means anything.

  Two lessons already earned:

  - **A page with no saved config is more expensive than its difference count suggests**, because the
    config has to be rebuilt and verified before the count means anything.
  - **A saved result is the record of the config that produced it.** `reconstruct.ts` reads it back.
    The two sides can legitimately differ — search-input's reference run set `textParts: ["input"]`
    while ours set four — so read the side you are rebuilding, not the other one.

The port assigned source corrections to the generator and named accepted differences to diff.ts's ACCEPTED table, so repeated runs used the same classification. Current producer/oracle guidance owns that operating procedure.

### 5.3 Finish the last three elements, cheapest first `[ ]`

Measured, not estimated:

1. Recorded done — **relative-time-card — at parity, 2026-09-10.** All six runs read **0 hard**: card 4 roots,
   label 1, trigger 6, in both themes. The trigger's 16 accepted are the documented wrapper-box
   context value. The census config now carries two prepare steps it was missing, both recorded with
   their reason.
2. Recorded done — **context-card — at parity, 2026-09-10.** All four runs read **0 hard**: the card 8 roots, the
   trigger 17, in both themes.

   Every one of the 208 differences first reported was the harness measuring two different things, and
   each cause is now recorded in the config with its reason:

   | Cause | Cost | Why |
   |---|---|---|
   | Different viewport widths | 64 | The layer is fixed to the viewport, so its width is the window's. Read both sides at 1367 by 924. |
   | The card's inline width read as hard | 64 | It is sized from its own text, so it follows the font. `card` and `fade` are text parts. |
   | Cards opened below the fold | 32 | Placement flips against the viewport **at open time**. A trigger at y≈1100 in a 924-tall window makes every card resolve to `top`. Scroll each group to the reference's own trigger offset first. |
   | Preview width applied after prepare | 16 | The census sets `width` after prepare runs, so cards opened there saw the docs page's natural 958px column. That left 177px right of the fourth trigger where the card needs 311, so `right` correctly flipped. Set the width inside prepare, before opening. |
   | The card's `transform` read as hard | 32 | Not comparable by design: the mirror strips scripts, so the reference's transform is the sketch's static value — every reference card sits 425 to 541px **above** its trigger, which no live run produces. Ours is computed live and correct. Read as soft; the **side** each card resolves to is the real check, and all four match. |

   The lesson worth carrying into the remaining elements: **an overlay's placement is measured at the
   moment it opens**, so anything that changes the page before that — scroll position, container width,
   layout still settling — changes the answer. The recorded correction completed page setup before opening.

3. Recorded pending — **calendar — the expensive one, and now scoped properly.**

   The element is built (412 lines) and its five tests pass. It has a spec and generated styles. It has
   **no map, no sketches and no census**, and the reason is structural rather than neglect.

   **The reference renders no calendar at all until its trigger is clicked.** Confirmed on the live site,
   not only the mirror: all 16 examples show a loading skeleton, and the real calendar appears only after
   a click. So the usual path — extract the server-rendered DOM into a spec — yields nothing to map.

   **What changed today: the live site can supply that DOM.** With browser access working, clicking a
   trigger renders the real thing — 35 grid cells, Start and End fields, an Apply button, a timezone
   selector, and the month grid inside a popover. Its class strings are readable directly, which is a
   better source than reconstructing them from the compiled chunks.

   The planned capture sequence was:

   1. DOM capture for the **nine** named live examples: Default, Horizontal
      Layout, Sizes, Presets, Compact, Stacked, Presets with default value, Min and max dates, Pinned
      timezone.

      **The capture method, demonstrated on Default.** A trigger click exposed the popover tree. The
      Default state has **40 distinct classed nodes**. Two constraints found by trying it:

      - The live site's security policy blocks a request to localhost, so the page cannot POST its
        capture to the collector. The capture was read back through the browser tool in pieces. The
        collector's `/capture/<name>` route exists and works from the mirror or our own pages, which is
        where it is useful.
      - The whole tree is about 36 KB, too large for one round trip. Distinct classed nodes, depths and tags supplied the bounded sketch input.
   2. A sketch for each state, folded into the spec by extract.ts synth.
   3. A map, generated output and a matching template.
   4. A saved census configuration and measurements in both themes.

   The estimate was several times the cost of the other two components because every state needed manual capture before measurement. The lesson from context-card applies with force here: the calendar
   is a popover, so its placement is measured at open time, and the setup must be complete before the
   trigger is clicked.

### 5.4 Prove behaviour, not just styles `[ ]`

Method in [notes/analysis/behaviour-verification-method.md](../research/03-behaviour-verification-method.md).
The census reads computed styles and is blind to behaviour: a control with perfect styles that does
nothing measures clean, which is exactly what shipped in the virtualized table.

Driving our own examples is **not sufficient on its own** — our examples only show what we chose to
build, so a behaviour we never wired stays invisible. The old exact-port oracle came from the reference. The current supported browser tier and approved family contracts supersede the pending test-tier setup below.

- Recorded pending — Contract checklists in tools/geist/contract/, then generated for 58 pages. They sort
  **442 reference statements** into 114 that name something a test can observe, 24 mixed, and 304 that
  need judgement — plus **40 callbacks the reference's own examples wire up**, which is the signal that
  catches a control wired to nothing.
- Recorded pending — Creation of a real-browser test tier. `happy-dom` has no `ElementInternals`, no `CustomStateSet`, and
  returns zeros from `getBoundingClientRect`; every form control we ship is form-associated and several
  elements are layout-driven, so no change of test library fixes that. `bun test` keeps the unit tier.
- Recorded pending — Applicable ARIA Authoring Practices suites for about 35 elements, with a shadow-piercing active-element helper.
- Recorded pending — Per-element event manifests and assertions **from a light-DOM parent**, because a
  `CustomEvent` defaults to `composed: false` and never leaves the shadow root, and a listener on the host
  cannot detect that.
- Recorded pending — Native computed role/name comparison through the then-proposed WebDriver endpoints. The record distinguished this from Playwright's reimplemented algorithms.
- Recorded pending — Four emulation checks: forced colors (a `box-shadow` focus ring vanishes there),
  reduced motion, touch, print.

### 5.5 Compare against the live reference `[ ]`

**Unblocked 2026-09-10.** Two paths work and agree exactly on the live reference: same box, same wiring,
same animation name.

**The recorded preview-pane observation depended on window state.** Covered is `OCCLUDED`, which keeps
frames: measured at 121 frames per second with the pane behind the terminal, and a tooltip fade watched
live through its 400ms delay and 100ms run. Minimized or closed is `HIDDEN`, which kills them, and no
setting changes that.

**A flag did not prove frame delivery.**
`document.visibilityState` is not a reliable gate — frames were observed firing while the page reported
itself `hidden`, and the document-wide animation count read zero while a real animation ran on an element.
The investigation used a one-frame probe with a timeout and two separated animation readings from the **element**; a single reading could not distinguish running from completed. Verified by catching our tooltip's fade
mid-flight at 55% opacity with the pane minimized.

The old operating preference was the preview pane, with DevTools used when the frame probe failed or identifiers helped interaction. It limited cleanup to tabs opened by the agent. Current host tools and their skills supersede that procedure. Historical method and code:
[notes/analysis/behaviour-verification-method.md](../research/03-behaviour-verification-method.md).

First real finding from it, already: the reference wires `aria-describedby` on a tooltip trigger **only
while the tooltip is open**, and our page has none of its 31 tooltips open at rest. The census cannot see
either fact.

- Recorded pending — Overlay placement and motion, per element, against the live reference
- Recorded pending — Computed role and accessible name, both sides, in one run
- Recorded pending — Keyboard behaviour with real key input: focus order, escape, arrow keys
- Recorded pending — The four emulation checks: forced colors, reduced motion, touch, print

The recorded reference comparison required real driver input because synthetic events did not drive that page. Measuring both live sides in one run made reference changes reviewable.

### 5.6 Package and practice audits `[ ]`

Three research records held the original package/practice questions. Their later decisions and evidence, rather than this historical queue, establish current selections:

- [notes/analysis/package-choices.md](../research/16-package-choices.md) — what we use, what to adopt,
  what to avoid. Confirms floating-ui, `@internationalized/date` and TanStack; recorded no Zag Lit adapter at that date. The later selected native ports replace the runtime-adapter proposal.
- [notes/analysis/hand-rolled-audit.md](../research/13-hand-rolled-audit.md) — what we hand-roll that a
  package could own. Includes the shared floating-ui controller, since six elements each call
  `computePosition` twice with the same shape.
- [notes/analysis/lit-practice-review.md](../research/15-lit-practice-review.md) — the Lit mechanisms we
  are not using. The then-missing custom-elements manifest was a leading finding; the standard analyzer was implemented later.

### 5.7 Cleanup `[ ]`

- Recorded pending — Rename `src/geist.css` and remove the dead hand-written rules the generated modules replaced
- Recorded pending — Prune `tokens.css` to the tiers the elements read (260 KB today). Absorbed into the pass, Phase 1.8.
- Recorded pending — Split the bundle: charts, forms, markdown and highlighting as separate entries (1.33 MB minified today). Absorbed into the pass, Phase 1.8.
- Recorded pending — Sheet: the non-modal form is the reference default and should open as a manual popover, so the page stays interactive. At that checkpoint it used `showModal` and made the page inert.
- Recorded pending — Menu: the reference's mobile path. Under 601px the list opens inside a drawer, which sets no shadow on it. Absent from the corpus, so sketch it alongside the combobox mobile form.
- Recorded pending — Modal: a `form` option wrapping body and footer, so destructive-action-modal drops its two context lines
- Recorded pending — Combobox: the reference's mobile form, a button that opens a drawer under 601px
- Recorded pending — **Move the animated elements onto `@lit-labs/motion`.** Retention was [selected in Phase 1.5 review](../decisions/0004-animation-package.md); the former Phase 5 gate is retired. Two patterns cover nearly all of it:

  1. *A box whose size changes.* Collapse is the clearest case: it measures the body with
     `getBoundingClientRect` and drives an inline pixel height, which is precisely what the
     `animate` directive does properly. Anything else that grows or shrinks belongs here too.
  2. *Something entering or leaving.* Modal, drawer, sheet, toast, tooltip, context-card,
     command-menu and feedback all fade, scale or slide in and back out, today through
     hand-written transitions plus `getAnimations()` bookkeeping to hold the exit open. The
     directive's enter and exit handling is built for exactly this.

  Calendar, Middle Truncate and Text Copy were also identified as script-animation candidates.

  The old motion migration targeted reference parity. Later selected motion roles and deliberate adaptations own current treatments.
- Recorded pending — Sweep the last reference mentions under `src/`
- Recorded pending — Refresh README, the Get Started page and the design-system skill. **README is currently wrong**: it lists `@lit-labs/signals` and `@lit-labs/virtualizer`, but the chosen stack uses TanStack store and TanStack virtual.
- Recorded done — The dialog reset lives in `src/shared/dialog.ts`; modal, drawer and sheet import it
- Recorded done — Menu follow-ups: `width` accepts `auto` plus `min-width`; `offset` replaces the gap constant; context-menu is modal with scroll lock, as the reference's Radix menu is
- Recorded done — Docs app: a census page titles itself "<Element> (census)"
- Recorded done — **Prop naming against the reference** — settled by the parity-scope decision. The reference's
  Button puts the visual look on `type` and the HTML type on `typeName`, and flags that as a trap
  in its own prose; it uses `variant` 174 times against `type` 37 across its pages. Our `variant`
  and `type` stand: self-consistent, idiomatic, and the reference's own majority name. No rename.
- Recorded done — **One name per concept: the visual look is `variant`.** Done 2026-09-10. Seven elements renamed
  from `type`: feedback, fieldset, select, progress, tooltip, snippet and menu-item. **18 elements now
  name the visual look `variant`, up from 11.** The sweep also drew the line that keeps `type` where it
  names a kind of thing rather than an appearance — chart's shape, choicebox's selection mode, file's
  icon, breadcrumbs' layout, and the real HTML attribute on button, copy-button, split-button and input.
  The test and the reasoning are in [notes/decisions/parity-scope.md](../decisions/0077-parity-scope.md).
  It changes the 0.2.0 interface on seven elements, which costs a release note and nothing more.
- Recorded done — ~~Sweep the same way for every other concept that may carry two names (size, shape, state).~~ Superseded by the systematization pass, Phase 2.6.
- Recorded pending — Select: decide the additional `options` property, which feedback uses `[?]`
- Recorded pending — Foundations pages: the reference's exact heading levels, or ours `[?]`

### Later resolution of the cleanup queue

The original statuses above are preserved, not reopened. Later selected contracts and evidence determine the surviving scope:

| Original queue area | Later owner or disposition |
| --- | --- |
| Stylesheet rename, generated CSS and output paths | M01/M02 in the [completed migration](../../tasks/done/systematization/plan.md) |
| Token size and bundle splitting | The complete token catalog and selective module delivery replaced the old prune/split proposal; no blanket token deletion follows from its 260 KB observation |
| Sheet/Modal/Menu/ComboBox mobile and form proposals | Approved [overlay/help](../../spec/SPEC-overlays-help.md), [selection](../../spec/SPEC-selection.md) and [inputs/forms](../../spec/SPEC-inputs-forms.md) contracts replace the old component interfaces |
| Motion migration and source naming | Selected motion roles, rebuilt families and removal/export audits in the completed migration |
| README and consumer documentation | Current package contracts and [documentation specification](../../spec/SPEC-documentation-tooling.md); the former signals/virtualizer listing is historical |
| Select options and Feedback use | Approved authored Option/selection contracts and rebuilt Feedback replace the old data-property question |
| Foundation heading levels | Current typography/documentation contracts govern semantic structure; the old exact-reference-page question does not restart |
| Slotted !important narrowing | The [research](../research/19-slotted-cascade.md) retains the undecided 64/11/53 analysis; this migration selects no new cascade policy |

### 5.8 Release

- Recorded done — **0.2.0, 2026-09-10, live on npm.** The first tag failed CI, because tw.ts and simplify.ts
  read the gitignored corpus at import time. That defect is fixed, the tag was moved to the fixed
  commit (0.2.0 had never published, so the number was still free), and the second run published. The parity port to date: 22 more elements (131 to 153 exports), every
  element re-templated to the reference's DOM, states and API, all 159 style modules regenerated,
  the parity tool itself (129 maps, 187 sketches, 76 specs), the chosen package stack as real
  dependencies, two generator bug fixes with tests, and the virtualized table demo fixed. A minor
  bump, because element APIs changed and below 1.0 that is where breaking changes go. Published by
  pushing the v0.2.0 tag; the workflow publishes through npm's Trusted Publisher, no token.
- Recorded pending — The next release is the one that can claim parity: after the measurement sweep (5.1), the
  behaviour sweep (5.4) and the last three elements (5.3). It required a separate tagging decision at that stage.

The old plan recorded a combined commit/push/docs-deploy/npm-release sequence after one approval. That task-specific sequence is retired; it grants no current outward-action permission.

---

## 6. Defects found and fixed, for the record

This is the original defect ledger. Paths identify the code at that revision, including later removed components. The Error/Kbd display:contents fixes are historical; later real-host contracts supersede them.

| Where | Defect | Fix |
|---|---|---|
| `tools/geist/simplify.ts` | `outline` wrongly treated as resetting `outline-offset`; nine elements shipped without it | `NOT_RESET` table; 5 tests |
| `tools/geist/simplify.ts` | `transform` wrongly treated as resetting `transform-style`; book lost `preserve-3d` | same table |
| `src/components/context-card/context-card.ts` | Focus and click handlers sat on the shadow trigger box, which a light-DOM event never reaches. Real keyboard focus never opened the card; a link click never closed it. The old test passed only because it dispatched events straight onto the shadow box, which no browser does. | Handlers moved to the host |
| `src/components/context-card/context-card.ts` | Escape closed the card, then restored focus, and that focus reopened it | A `dismissed` flag, cleared when focus truly leaves |
| `docs-src/pages/components/table.ts` | The virtualized table's Show More did nothing. The demo listened for `acme-toggle`, which `acme-show-more` never fires: like the reference's, it is controlled and only bubbles a click. Every style on the page measured clean, so the census could never have caught it. | The demo now listens for `click` and sets `expanded`, matching the reference's `onClick` contract. Verified in the browser: the row count moves between 9 and 5000 and back. |
| `tools/geist/tw.ts` and `simplify.ts` | Both read the reference corpus at **import** time. The corpus is gitignored (it is the reference site's own output), so any import of these modules failed wherever the corpus is absent. It broke the 0.2.0 publish: a new unit test imported `simplify` for one pure function and CI had no corpus. | Both now parse on first use. `loadReference()` is exported and called at the top of `generate()`. Verified by hiding the corpus locally: 583 tests pass with it and without it. |
| `src/components/context-card/__tests__/` | Five assertions compared exact class strings; Lit appends newly-true classes on update, so order carries no meaning | Compare the class set |
| `tools/geist/census.js` | The state rewrite ran on the reference side only, on the belief that our generated sheets always key states off attributes. Most do; a rule the reference wrote as a real `:hover` or `:focus-visible` comes through the generator as one, and such a rule of ours was unreachable. The state then read as its resting value and the diff reported a difference the element does not have — the search field's clear button, on both hover colour and focus outline. | Both sides are rewritten. A second rule keeps the descendant clause off a compound that is the pseudo-class alone, or a page-wide rule lands on every descendant of the focused box. Six tests, each proven by reintroducing the bug it guards. |
| `src/components/error/error.ts` | The reference's alert is the box its container lays out. Ours had a host box between them, so a flex row's `items-stretch` reached the host and left the alert at its own height: 20px where the reference reads 24. | `:host { display: contents }`. Its three accepted leftovers went with it — they were the wrapper box. |
| `src/components/kbd/kbd.ts` | Same shape. The reference's key is one element, `inline-flex` in prose and blockified to `flex` in a flex row, so the row sizes to the key's 20px. Our host made the search field's key row 25px. | `:host { display: contents }`. Verified in both contexts: the key row reads 58x20 with both keys 20x20, and the standalone page still reads inline-flex at 26x24, 24x24 and 40x24. |
| `src/geist.css` | A page-wide `:focus-visible` rule put a Geist ring and a 6px radius on every focusable thing, through a published entry point, so it reached consumers' own controls. The reference has no page-wide focus rule of any kind. It also broke the measurement: the census marks a focused root and every descendant, so a rule with no element part landed on each icon inside. | Removed, with the `:focus { outline: none }` beside it. Swept 955 keyboard-reachable boxes across 98 pages afterwards; no element lost a ring it had. See [notes/decisions/focus-ring-ownership.md](../decisions/0041-focus-ring-ownership.md). |
| `src/geist.css` | 44 lines of dead CSS for the select — `.select-wrap`, `.affix-l`, `.affix-r` — a third vocabulary for the input's prefix and suffix, unreferenced by any element, docs page or generated module. | Removed, with the `split-css` routing rule that filed it. |
| `tools/geist/census/input.config.json` | The input page never had matching root counts: 22 on the reference against our 20, because two of its examples are search fields we render on their own page. Every difference the page reported was computed across misaligned roots. | `previews` names the seven shared examples. |

---

## 7. Decided, and deferred

**Historical no-RTL decision, now superseded.** Decided 2026-09-10 on evidence: the reference has none. Zero `dir`
attributes, zero direction selectors, and it mixes 87 physical properties with 75 logical ones, which
would break in a right-to-left context. Our modules inherited that mix faithfully. Supporting it would
mean *deviating* from the reference on several hundred declarations, each becoming a census difference to
accept. Reasoning in [notes/decisions/parity-scope.md](../decisions/0077-parity-scope.md).

**Historical compatibility premise, retired as future authority.** The old record asserted no consumers and therefore required complete replacements without aliases, fallbacks or old-interface comments in current code. Actual usage was not established. Completed approved replacements remain final; this premise creates no permanent policy or permission for future changes.

- **Scoped custom element registries** (`@lit-labs/scoped-registry-mixin`): one pass after the
  port, before 1.0. Every composing element lists what it composes. The polyfill loads only where
  the browser lacks the feature. Decided by Peter on 2026-09-09.

  Read in full on 2026-09-10 while looking for a fix to the slotted-cascade problem: it touches only
  `attachShadow({customElements})` and `elementDefinitions`, for letting two versions of a tag name
  coexist. **No CSS cascade involvement.** At that date it stayed deferred for its own reason. Later core scoped-registration delivery was implemented and verified with explicit platform limits; this is no longer an unopened work item.

- **A group element**, for a control attached to a field — a button on the end of an input, the way
  Chakra's `Group` and Bootstrap's `input-group` compose them as siblings. Worth doing; not now.
  Peter, 2026-09-10. The reference has no such component among its 77 pages, so this is ours to
  design rather than port, and no web component library models it either except Nord's alpha
  `nord-input-group`.
- **Icon elements.** Deferred on 2026-09-10; the 2026-09-19 pass review selected [one element per icon](../decisions/0046-icon-element-shape.md) using [Material Symbols SVGs](../decisions/0060-material-symbols-icons.md). The later complete inventory/migration and icon delivery resolve that stage; the old approval gates are retired.
- **Narrowing the 64 slotted `!important` rules.** 11 of them genuinely need it; the other 53 never
  meet a page rule and only cost a consumer their inline style. Whether to narrow them, and whether
  to adopt Spectrum's `:not([class])` guard, is undecided — the case that raised it dissolved when the
  input's affix API was replaced. Measurement and options in
  [notes/analysis/slotted-cascade.md](../research/19-slotted-cascade.md).
- **Data layer** (TanStack Query and DB): a separate package, later.

### Later resolution of deferred scope

The [bidirectional-support decision](../decisions/0007-bidirectional-support.md) supersedes the old no-RTL decision. [Group](../decisions/0045-group-presentation.md), [per-icon Material Symbols](../decisions/0060-material-symbols-icons.md) and scoped-registration delivery are implemented; the [release evidence](../releases/0.3.2.md) retains their verification limits. The slotted !important investigation and separate Query/DB idea do not become new implementation tasks through this historical conversion. No inspected later record certifies the proposed provenance.js audit as delivered. Current reference measurement must still use valid, controlled evidence.
