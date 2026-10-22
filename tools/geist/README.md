# Reference generation and comparison

These build-time tools derive mapped styles from captured reference output and compare corresponding boxes in a browser. They do not own every component's styles or define its public contract. Nothing under `tools/` ships. Keep reference identity out of code, comments and JSDoc under `src/`.

Read the [generation guide](../../docs/development/generation.md) and the [producer map](../../docs/agents/repository.md#generator-and-delivery-map) before changing an input. The [current specification](../../spec/README.md) and applicable decisions own the component's accepted interface and adaptations. Installed brain skills own the task workflow.

Google Sans Flex and Google Sans Code remain the default fonts. [Custom themes](../../docs/decisions/0022-custom-themes.md) can override them. The [systematization goal](../../docs/decisions/0105-systematization-goal.md) replaces unconditional exact parity with named, sourced and verified differences. Each affected component records its difference in the comparison's `ACCEPTED` table or explicitly leaves that sweep. Components absent from the reference use their selected source system's published values.

## Pieces

The file column is relative to this directory. Commands and output paths use the repository root.

| File | Role |
|---|---|
| `corpus/` | The reference site: `html/<page>.html` (server-rendered), `md/<page>.md` (prose + JSX), `css/` (three sheets), `js/` (chunks with client-only component code). |
| `tw.ts` | Parses the sheets in link order; `resolve(class)` → rules; `allRules()`; `sheetOrder()`. |
| `extract.ts` | `bun tools/geist/extract.ts <page>` writes `tools/geist/spec/<page>.json`: every example's DOM with resolved styles per state. `synth <page> <sketch.json>` adds a client-only state (open menu, tooltip, toast) drawn by hand from a class string found in `tools/geist/corpus/js`. |
| `maps/<name>.ts` | The mapping for one element: reference page and JSX tags, root marker, our root selector, prop → modifier class, children, slotted tags. See `tools/geist/maps/button.ts`. |
| `gen.ts` | `bun tools/geist/gen.ts <name>` writes `src/generated/components/<name>/<name>.styles.ts` and its compiled CSS/maps. Reports classes no group covers, unmapped children, composition hazards. |
| `vars.ts` | Writes `src/generated/theme.css` from ordered corpus CSS and token declarations, including color tiers, light/dark selectors and default fonts. Regenerate when these inputs or their producer change; split compiles the result into token delivery. |
| `serve.ts` (:4184) | Mirror of the reference: `http://localhost:4184/geist/<page>`. Scripts stripped, so overlays do not open there. |
| `collector.ts` (:4183) | Receives census results → `tools/geist/census/<page>[.dark].<side>.json`. Also serves `/census.js`. |
| `census.js` | Runs in a page: computed styles of every example root (and mapped children) per state, both themes. |
| `diff.ts` | `bun tools/geist/diff.ts <page>[.dark]` compares the two sides. Hard differences need investigation. Soft differences follow the tool's font-related rules; accepted differences have explicit reasons. |

## Working with a mapped comparison

Run the commands below from the repository root with pinned Bun 1.4.2. Check the manifest's producer before selecting a map: authored CSS and reference-only maps have different roles. The generator skips reference-only maps and removes their stale generated style output.

Consumer documentation follows the [approved page and example contract](../../spec/SPEC-documentation-tooling.md#standard-page-layout), not an exact copy of reference sections. A comparison-only state can still use an `Example` with `census: true`. It renders on `http://localhost:4180/census/<id>`, not the ordinary documentation or Markdown page. Keep paired roots in the mirror's order: page examples first, sketches after. The existing renderer includes every example on that census page. Put measurement-only setup, such as opening an overlay or setting scroll position, in the config's `prepare` script. `__census` runs it before freezing transitions. Ordinary examples retain their actual supported interactions.

Save existing measurements before a rerun. The collector writes directly to `tools/geist/census/` and rejects zero-root captures. Historical results do not establish a fresh pass.

1. **Spec.** `bun tools/geist/extract.ts <page>`. Read `tools/geist/spec/<page>.json`: examples, roots, children, states. For states the server HTML lacks (open menu, tooltip content, toast), prefer a captured live DOM state through the collector's `/capture/<name>` route. If using compiled source, find the component's class string in `tools/geist/corpus/js` (search its marker, e.g. `data-geist-tooltip`). Write a sketch JSON `{ heading, code, dom }` and run `bun tools/geist/extract.ts synth <page> <sketch.json>`. A sketch carries what the reference renders, after its class merge (`cn` is a tailwind-merge): a conditional utility drops the base one of its group (`bg-[var(--ds-red-800)]` drops `bg-[var(--geist-background)]`, `opacity-100` drops `opacity-0`), important ones conflict among themselves only, and a repeated class stands once; the button spec's rendered lists show the result. A sketch that keeps both lets the base win on both sides, and the census cannot tell.
2. **Map.** Write `tools/geist/maps/<name>.ts`. Every prop value → one modifier class of ours; defaults listed; children picked by a class they carry; `slotted` lists tags that are light DOM in ours (`svg`). Unknown values show up in the generator report.
3. **Generate.** `bun tools/geist/gen.ts <name>`. Investigate uncovered classes, unmapped children and composition hazards. Resolve each finding or record its evidence and approved disposition. Change the owning input; generated CSS and Lit modules remain outputs.
4. **Component.** Match measured boxes by layout role, then preserve the approved Lit composition and public contract. Reference DOM is evidence, not a required internal template. Mapped roots carry modifier classes and visual interaction states; the shared `Interaction` controller owns visual state while native controls own activation. Use slots and parts according to the component contract. Read the [component guide](../../docs/development/components.md) and [selected package roles](../../docs/development/stack.md) for behavior. Describe the component in source comments; keep reference provenance in research and decisions.
5. **Verify the change.** Run the affected producer and focused checks, then dependent builds and browser checks from the [verification guide](../../docs/agents/verification.md). The installed incremental-implementation skill owns focused checks per slice and the full gate at task closure. A census checks the recorded visual comparison; it does not replace behavior, package or actual-platform verification.
6. **Census.** Use browser tooling that can inspect the mirror and the matching component or census page. Load `census.js` from the collector at `http://localhost:4183/census.js` and call the saved configuration. The following calls illustrate its API; confirm selectors and roots for the current fixture:
   ```js
   await window.__census({ side: "geist", page: "<page>", marker: "data-geist-<x>", theme: "light", children: { label: ".label|.truncate" } })
   await window.__census({ side: "ours",  page: "<page>", host: "acme-<name>", ours: ".<root>", theme: "light", children: { ... } })
   ```
   Run the reference side only once its page has fully loaded: a run right after navigation finds the sheets still empty, and the `:hover` rewrite skips them. A state attribute a sketched node already carries (a `data-hover` on a toast area, the sketch of its hover-expanded stack) survives the state passes. `each` follows every match of every hop (`acme-toast >> .toast`: one root per composed toast).
   `children` maps a part name to `ours|theirs` selectors; ours is searched through slots. A part that is a pseudo-element reads as `::after` (the root's) or `.cover::after|.BH179W_book::after` (a child's). `ours` may list alternative paths when one page hosts the root at different depths (`host: "acme-input, acme-search", ours: [".wrap", "acme-input >> .wrap"]`); `":host"` reads the host's own box (a root that is our element itself, the context menu's inline wrapper). With `each: true`, every hop reads the shadow tree flattened, a slot standing for the light DOM assigned to it (the context menu's own link rows before the consumer's, in tree order). `textParts` names parts whose width follows the text or the container (a full-width field), so the diff reads them as soft. `width` gives every preview on both sides one outer width (`"666px"`, the docs preview), so a value the container decides (a centred box's auto margins, a padding in percent) is read in one context. Run both themes. The historical hidden-pane harness could suspend timers. The census reads settled styles synchronously after `prepare`; verify any preparation wait against the current host instead of assuming a timer proves readiness.
7. **Record.** Save the exact `__census` configuration you ran (both sides, as one JSON object) to `tools/geist/census/<page>.config.json`, so the run can be repeated by anyone after a regeneration.
8. **Diff.** `bun tools/geist/diff.ts <page>` and `<page>.dark`. Both sides must have equal, nonzero root counts and matching root order. Zero or unequal roots exit with failure. Investigate each hard difference before identifying a component defect: stale files, unequal contexts and harness selectors can cause it. Fix a confirmed defect in its owning input. Preserve the source and verification for an approved difference through `ACCEPTED`, or explicitly record removal from that sweep. A soft classification is not permission to dismiss an unexplained difference.

## What the generator guarantees

- Modifiers are wrapped in `:where()`, so rules on one element tie on specificity and source order decides, like the reference's flat utilities. Rules are ordered by a topological sort of the conflicts.
- A default value is the negation of the prop's other modifiers; groups may be value subsets (`:not(.tiny,.lg)`, `:is(.sm,.lg)`).
- Compound rules apply only when every class of the compound is on every member of the group.
- Dark rules render as `:where(:host([data-dark])) ...`; light-only rules as `:host(:not([data-dark])) ...`. The host attribute is maintained by `src/base.ts`.
- Slotted tags are reached through `slot::slotted(tag)`. Icons carry `width`/`height` attributes so slotted rules can resize them; no document-level rule may size them.
- A rule that runs through ancestors to a mapped child (`.body .bind`, `.book .content .title`) is the child's: it is emitted on the child's side when the ancestors are on its path in the spec (`>` bound to the parent), the ancestor's side skips it, and a state on the root's compound (`.perspective:hover .wrapper`) becomes the root's state. A wrapper whose classes stand for a root modifier of ours (the reference's variant class on an inner element) is named in `context`; the rest of the prefix must sit below it, so `.stripe .bind` reaches the band's bind and not the body's. A class token is tried at every occurrence (`.stripe .stripe`).
- `assets` maps a reference asset URL the rules name in `url()` to the packaged copy under `assets/` (shipped with the package), so the module points at ours.
- The wrapper stays transparent to the root's context: a root property that acts as an item of the parent's layout or takes the parent's value by `inherit` is repeated on `:host` (`host` in the map); a state that is the host's, a position among siblings, maps to `@:last-child` and renders as `:host(:not(:last-child)) :where(.root)` (a state a child's rule reaches through a group ancestor, `group-not-last/x:`, lands there too), the root's class wrapped so the `:host` pseudo-class stands in for it and the rule weighs what the reference's `.class:not(:last-child)` does, tying with a root state of the same weight; a parent utility on its child (`[&>li:not(:last-child)]:border-b` on a list) is emitted on the child's element (`fromAncestor`), the parent read as a context attribute the element keeps in step with its parent. A slotted element of ours (a child map with `slotted: true`, `acme-grid-cell`) gets no `!important`: its own styles sit in its shadow tree, which the outer rule outranks anyway.
- An ancestor compound that qualifies a descendant's rule (`.systemDebug .block`) is a `context` entry of the map: it becomes a root state (`:where([data-debug])`, an attribute the element keeps in step with its context; `:where(.contained)` when it is the root's own modifier), or `""` when the ancestor is always there. The descendant's side emits the rule; the ancestor's side skips it.
- A rule that names the root by its marker attribute (`.system [data-grid]`) is the root's own when every ancestor before it is a context entry.
- `ours: ":host"` puts a root's rules on our host (a slotted element whose box the parent's map styles): its `extends: "parent/acme-child"` keeps only the rules into its own tree (`.cell > div` → `::slotted(div)`).
- A root that `extends` another element skips that element's own classes, except those whose rules reach only beyond its tree (`[&_svg]:shrink-0` into slotted content): a descendant of this element's own tree (a chevron the trigger draws) needs them here, as a child that extends an element does. The composed element's own classes are its whole chain's (a menu button is a button), and a class of theirs whose rules reach a node of this element's own tree (the dots icon the dots menu draws inside the menu button) is emitted here too. A root mapped onto a `part` takes an attribute state on the composed element's tag before the part and a descendant rule on the tag alone, as a child part does; a rule on the part's own child (`[&>span]`, the composed button's label) is the composed element's, left out and reported. A rule of this module on a part lands from the outer tree and beats every rule of the composed element's own module: the composed chain's state rules the reference orders after this element's own on a property (the hover fill after the open fill) are repeated here, in the reference's order.
- Within one rule, a later shorthand replaces every earlier longhand it resets (an unlayered `border: none` after a utility's `border-top-width`), in the first replaced declaration's place, so a module carries no declaration the reference's cascade has already beaten.
- A `classes` entry renames a keyframes name too (a CSS-module animation).
- A tag compound in a rule's tail (`[&>div]:mx-…` on a wrapper) that matches exactly one mapped child ours composes (a `part`, or a custom element of ours: the breadcrumbs list under the command menu's crumbs wrapper) is written as that child's selector, part included, the compound's own states kept before the part; the rewrite follows the tail hop by hop, and stops at a compound that names a class or matches an unmapped node under the rule's own parents. A child that keeps its tag (`input`, `svg`) needs no rewrite and gets none.
- A theme constant whose value names other variables (`--animate-cmdkScaleIn: cmdkScaleIn var(--ds-motion-overlay-duration) …`) is inlined with every inner constant inlined in turn; a token it names stays a variable, and the keyframes it names ship in the module.
- A rule the sheet wraps whole in `:where()` (`space-y-6`: `:where(.x > :not(:last-child))`, a child rule at zero specificity) is read as the inner selector, so the class is found on the root and the child tail (`.stack > :not(:last-child)`) is emitted like any other.
- A state or theme rule that sets only a variable (`dark-theme:ring-black` sets the ring color) re-emits, in its own cascade position, the inherited properties that read it (the ring's `box-shadow`), so the state renders the composed value.
- A child of a composed element that maps to a `part` keeps only the rules its own module cannot reach: a descendant rule (`[&_svg]`, into deep slotted content) and a sibling rule are emitted on the parent's side; a child rule (`[&>input]`, the element's own shadow child or a node slotted straight into it) is the composed element's own.

## Static media

The mirror serves the pages' media files (logos, textures) from `tools/geist/corpus/media/`, fetched from the reference site with the owner's approval. A reference `<img>` whose file is missing draws as a broken image at 16 by 20, which shows up as a 4-pixel difference through every box that contains it; fetch the file rather than explaining the lines.

## Recorded comparison context differences

These observations describe the saved parity fixtures. Recheck their conditions before using them to explain a new result; they do not declare current component structure.

- A floating box in the top layer (menu, tooltip, split-button popover) reads `position: fixed`; the reference's popper reads `absolute`. The top layer's containing block is the viewport, so viewport coordinates are the only correct placement there. Accepted.
- A link root (`<a>`) reads `min-width: 0px` in the reference (block context) and `auto` in ours (flex item of the wrapper). No visible effect.
- The reference docs page is itself framed by a contained grid system: a non-contained system in an example (the grid page example) reads the frame's container width there, where ours reads the viewport. The census strips the frame's wrapper class off the mirror page first, so both sides measure the same context.
- The reference page's sidebar is script-rendered, so the mirror has none: from the reference's `xl` breakpoint its `main` is a two-column grid (`260px 1fr`) and the page content falls into the 260px sidebar track, so a full-width example (the phone frame, `w-full` under `max-w-xs`) reads a fraction of its width there. Measure with the pane below that breakpoint (an 1100px viewport: `main` is a flex column and the content column is full width); the sketched examples sit on their own 600px stage and are unaffected.
- The same split reaches any root whose context the reference page varies between examples (a block child in one, a flex item of a stack in the next): our host has one box, so the root is always the one or the other. A flex item reads `min-width: auto` and a blockified `display` (`inline-flex` → `flex`); a block child reads `0px` and its own `display`. The host takes the layout of the reference's usual context (a column for the switch group and the input, a block for the radio group, an inline flex box for a checkbox, radio or toggle); the examples in the other context read the split. No visible effect: `auto` in a column's cross axis resolves like 0, and a blockified flex item lays out as the inline box would.

## Scoped registration

Scoped registration is implemented. Class and explicit-registration imports are inert; `register(registry)` includes owned public and private dependencies. Component rendering carries the registry and destination document through the shared Lit creation scope. React wrappers register globally.

The implementation uses native registry APIs and public polyfill interfaces, not a requirement to adopt the earlier proposed Lit mixin. The library does not install a global polyfill. The tested Firefox compatibility path uses `@webcomponents/scoped-custom-element-registry@0.0.10`; define elements before cross-document adoption because late definition after adoption fails in that mode.

See the [consumer registration guide](../../README.md#scoped-registration) and [scoped-delivery evidence](../../docs/verification/systematization/m26-scoped/README.md). Source, build and installed-archive results have separate identities. Same-origin active-document checks do not certify inert documents, cross-origin frames or every component lifecycle.

## The three servers, and the launch config

`.claude/launch.json` names all three, so the browser preview can attach to them:

| Name | Port | What it serves |
|---|---|---|
| `docs` | 4180 | Attaches to an already-running docs server, starting nothing |
| `docs-start` | 4180 | Starts one: `bun scripts/dev.ts --no-build` |
| `census-collector` | 4183 | Receives measurements; serves `/census.js` |
| `reference-mirror` | 4184 | The reference site with its scripts stripped |

The saved launch profiles set `autoPort: false` and use the ports above. Census configurations and the client name 4183 explicitly. Reuse a matching running server, or identify a conflicting process before starting the required server. The mirror source also supports a `PORT` override for a separate instance; an alternate port needs matching explicit URLs and a separately identified run. Do not treat it as the saved fixed-port configuration.

The `docs` entry exists because these servers are usually already running. Attaching avoids a second
process fighting for the port. Use `docs-start` when nothing is listening yet.
