# Reference parity pipeline

Derives each element's styles from the reference's compiled output and proves parity in the
browser. Everything here is a build-time tool; nothing under `tools/` ships, and nothing under
`src/` may mention the reference by name (comments included). Fonts never change.

## Pieces

| File | Role |
|---|---|
| `corpus/` | The reference site: `html/<page>.html` (server-rendered), `md/<page>.md` (prose + JSX), `css/` (three sheets), `js/` (chunks with client-only component code). |
| `tw.ts` | Parses the sheets in link order; `resolve(class)` → rules; `allRules()`; `sheetOrder()`. |
| `extract.ts` | `bun tools/geist/extract.ts <page>` writes `spec/<page>.json`: every example's DOM with resolved styles per state. `synth <page> <sketch.json>` adds a client-only state (open menu, tooltip, toast) drawn by hand from a class string found in `corpus/js`. |
| `maps/<name>.ts` | The mapping for one element: reference page and JSX tags, root marker, our root selector, prop → modifier class, children, slotted tags. See `maps/button.ts`. |
| `gen.ts` | `bun tools/geist/gen.ts <name>` writes `src/components/<name>/<name>.styles.ts`. Reports classes no group covers, unmapped children, composition hazards. |
| `vars.ts` | Writes `src/generated/theme.css` (all token tiers, light and dark). Rerun only when the corpus changes. |
| `serve.ts` (:4184) | Mirror of the reference: `http://localhost:4184/geist/<page>`. Scripts stripped, so overlays do not open there. |
| `collector.ts` (:4183) | Receives census results → `census/<page>[.dark].<side>.json`. Also serves `/census.js`. |
| `census.js` | Runs in a page: computed styles of every example root (and mapped children) per state, both themes. |
| `diff.ts` | `bun tools/geist/diff.ts <page>[.dark]` compares the two sides. Hard = defect. Soft = font-driven (family, line-height, text widths). |

## The loop for one element

The docs page of an element shows exactly the reference page's sections, nothing pinned open. A state the reference page does not show (an open overlay, a sketched variant) is an `Example` with `census: true`: it renders only on the element's census page, `http://localhost:4180/census/<id>` (built from the same page file), in the mirror's order (page examples first, sketches after). A state that must be set at read time (an overlay opened, a scroll position) goes into the census config's `prepare` script, which `__census` runs before it freezes transitions; the docs markup never carries it.


1. **Spec.** `bun tools/geist/extract.ts <page>`. Read `spec/<page>.json`: examples, roots, children, states. For states the server HTML lacks (open menu, tooltip content, toast), find the component's class string in `corpus/js` (grep the marker, e.g. `data-geist-tooltip`), write a sketch JSON `{ heading, code, dom }` and run `extract.ts synth`. A sketch carries what the reference renders, after its class merge (`cn` is a tailwind-merge): a conditional utility drops the base one of its group (`bg-[var(--ds-red-800)]` drops `bg-[var(--geist-background)]`, `opacity-100` drops `opacity-0`), important ones conflict among themselves only, and a repeated class stands once; the button spec's rendered lists show the result. A sketch that keeps both lets the base win on both sides, and the census cannot tell.
2. **Map.** Write `maps/<name>.ts`. Every prop value → one modifier class of ours; defaults listed; children picked by a class they carry; `slotted` lists tags that are light DOM in ours (`svg`). Unknown values show up in the generator report.
3. **Generate.** `bun tools/geist/gen.ts <name>`. Read the report until it is only known reference inconsistencies.
4. **Template.** Re-template the element to the reference DOM with our own class names: root carries the modifier classes and the interaction states (`Interaction` controller from `src/shared/interaction.ts`), children as in the spec, slotted content through slots. Behavior from the package list in the brief (floating-ui, lit-hotkeys, pacer, TanStack store, @internationalized/date, native dialog, own controllers). Neutral comments: describe what the element does, never where it came from.
5. **Build.** `bun run split && bun run build && bun run docs && bun test`.
6. **Census.** In the Browser pane, one tab on the mirror page and one on `http://localhost:4180/components/<name>`. Inject `census.js` (the collector serves it at `http://localhost:4183/census.js`; paste its text into the javascript tool) and call:
   ```js
   await window.__census({ side: "geist", page: "<page>", marker: "data-geist-<x>", theme: "light", children: { label: ".label|.truncate" } })
   await window.__census({ side: "ours",  page: "<page>", host: "acme-<name>", ours: ".<root>", theme: "light", children: { ... } })
   ```
   Run the reference side only once its page has fully loaded: a run right after navigation finds the sheets still empty, and the `:hover` rewrite skips them. A state attribute a sketched node already carries (a `data-hover` on a toast area, the sketch of its hover-expanded stack) survives the state passes. `each` follows every match of every hop (`acme-toast >> .toast`: one root per composed toast).
   `children` maps a part name to `ours|theirs` selectors; ours is searched through slots. A part that is a pseudo-element reads as `::after` (the root's) or `.cover::after|.BH179W_book::after` (a child's). `ours` may list alternative paths when one page hosts the root at different depths (`host: "acme-input, acme-search", ours: [".wrap", "acme-input >> .wrap"]`); `":host"` reads the host's own box (a root that is our element itself, the context menu's inline wrapper). With `each: true`, every hop reads the shadow tree flattened, a slot standing for the light DOM assigned to it (the context menu's own link rows before the consumer's, in tree order). `textParts` names parts whose width follows the text or the container (a full-width field), so the diff reads them as soft. `width` gives every preview on both sides one outer width (`"666px"`, the docs preview), so a value the container decides (a centred box's auto margins, a padding in percent) is read in one context. Run both themes. The pane is hidden: timers never fire there, so scripts must not wait on `setTimeout`.
7. **Record.** Save the exact `__census` configuration you ran (both sides, as one JSON object) to `census/<page>.config.json`, so the run can be repeated by anyone after a regeneration.
8. **Diff.** `bun tools/geist/diff.ts <page>` and `<page>.dark`. Fix the cause (map, generator, template, tokens) and repeat until hard = 0. A remaining difference must be explained in the report, with its cause, never waved through.

## What the generator guarantees

- Modifiers are wrapped in `:where()`, so rules on one element tie on specificity and source order decides, like the reference's flat utilities. Rules are ordered by a topological sort of the conflicts.
- A default value is the negation of the prop's other modifiers; groups may be value subsets (`:not(.tiny,.lg)`, `:is(.sm,.lg)`).
- Compound rules apply only when every class of the compound is on every member of the group.
- Dark rules render as `:where(:host([data-dark])) ...`; light-only rules as `:host(:not([data-dark])) ...`. The host attribute is maintained by `src/base.ts`.
- Slotted tags are reached through `slot::slotted(tag)`. Icons carry `width`/`height` attributes so slotted rules can resize them; no document-level rule may size them.
- A rule that runs through ancestors to a mapped child (`.body .bind`, `.book .content .title`) is the child's: it is emitted on the child's side when the ancestors are on its path in the spec (`>` bound to the parent), the ancestor's side skips it, and a state on the root's compound (`.perspective:hover .wrapper`) becomes the root's state. A wrapper whose classes stand for a root modifier of ours (the reference's variant class on an inner element) is named in `context`; the rest of the prefix must sit below it, so `.stripe .bind` reaches the band's bind and not the body's. A class token is tried at every occurrence (`.stripe .stripe`).
- `assets` maps a reference asset URL the rules name in `url()` to the house copy under `assets/` (shipped with the package), so the module points at ours.
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

The mirror serves the pages' media files (logos, textures) from `corpus/media/`, fetched from the reference site with the owner's approval. A reference `<img>` whose file is missing draws as a broken image at 16 by 20, which shows up as a 4-pixel difference through every box that contains it; fetch the file rather than explaining the lines.

## Known context differences

- A floating box in the top layer (menu, tooltip, split-button popover) reads `position: fixed`; the reference's popper reads `absolute`. The top layer's containing block is the viewport, so viewport coordinates are the only correct placement there. Accepted.
- A link root (`<a>`) reads `min-width: 0px` in the reference (block context) and `auto` in ours (flex item of the wrapper). No visible effect.
- The reference docs page is itself framed by a contained grid system: a non-contained system in an example (the grid page example) reads the frame's container width there, where ours reads the viewport. The census strips the frame's wrapper class off the mirror page first, so both sides measure the same context.
- The reference page's sidebar is script-rendered, so the mirror has none: from the reference's `xl` breakpoint its `main` is a two-column grid (`260px 1fr`) and the page content falls into the 260px sidebar track, so a full-width example (the phone frame, `w-full` under `max-w-xs`) reads a fraction of its width there. Measure with the pane below that breakpoint (an 1100px viewport: `main` is a flex column and the content column is full width); the sketched examples sit on their own 600px stage and are unaffected.
- The same split reaches any root whose context the reference page varies between examples (a block child in one, a flex item of a stack in the next): our host has one box, so the root is always the one or the other. A flex item reads `min-width: auto` and a blockified `display` (`inline-flex` → `flex`); a block child reads `0px` and its own `display`. The host takes the layout of the reference's usual context (a column for the switch group and the input, a block for the radio group, an inline flex box for a checkbox, radio or toggle); the examples in the other context read the split. No visible effect: `auto` in a column's cross axis resolves like 0, and a blockified flex item lays out as the inline box would.

## Deferred, decided

- **Scoped custom element registries** (Lit's `@lit-labs/scoped-registry-mixin`): adopted after the port and before 1.0, as one pass over the stable element set. Every composing element lists the pieces it composes; the polyfill loads only where the browser lacks the feature (Firefox). Decided by the owner on 2026-09-09; not part of any element's port.

## The three servers, and the launch config

`.claude/launch.json` names all three, so the browser preview can attach to them:

| Name | Port | What it serves |
|---|---|---|
| `docs` | 4180 | Attaches to an already-running docs server, starting nothing |
| `docs-start` | 4180 | Starts one: `bun scripts/dev.ts --no-build` |
| `census-collector` | 4183 | Receives measurements; serves `/census.js` |
| `reference-mirror` | 4184 | The reference site with its scripts stripped |

**Every port is fixed, and `autoPort` is `false` on all of them.** The census configurations, the saved
result files and this runbook all name these ports by number, so a reassigned port would silently break a
repeatable run. Free the port rather than moving the server.

The `docs` entry exists because these servers are usually already running. Attaching avoids a second
process fighting for the port. Use `docs-start` when nothing is listening yet.
