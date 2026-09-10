# How we verify functional parity

Researched 2026-09-10. Linked from `PLAN.md` section 5.4.

The census proves that our boxes compute the same styles as the reference's. It is blind to
behaviour: a button with perfect styles that does nothing on click measures clean. The virtualized
table's Show More was exactly that, and it shipped. So behaviour needs its own sources of truth.

This file records what those sources are, what was checked, and what does not exist. It exists so
nobody spends a day rediscovering that the source code is unavailable.

## What is not available, verified

| Route | Result |
|---|---|
| A public npm package of the components | **No.** The docs name the package as `@vercel/geistcn` (and `@vercel/geistcn-assets` for icons). Both return 404 on the public registry. It is an internal package. |
| The `geist` npm package | Fonts only, v1.7.2, repo `vercel/geist-font`. No components. |
| `@vercel/style-guide` | ESLint and Prettier configuration only. No components. |
| A public source repository | **No.** The `vercel` GitHub org holds two Geist repos, both fonts: `geist-font` and `geist-pixel-font`. |
| Type declarations | **No.** They live in the private package, so the `.d.ts` files that would enumerate every prop and event are unreachable. |
| Source maps in production | **No.** All 34 production chunks were downloaded and none carries a `sourceMappingURL` comment. |

**A trap worth knowing.** Requesting `<chunk>.js.map` on vercel.com returns HTTP 200. It is not a
source map. The response is the site's 404 shell: `content-type: text/html`, `x-matched-path: /404`,
and an identical body for any nonsense filename. Anyone testing by status code alone will wrongly
conclude that maps exist.

**A name collision worth knowing.** `geist-org/geist-ui` (formerly linked as `geist-ui/geist-ui`) is
a *different, unrelated community project*, now archived, last published in 2022. Its own README
states it is not officially associated with Vercel. It is not a parity reference.

## What is available, in order of value per unit of effort

### 1. The authored prose in the `.md` pages — best value, already on disk

Every reference page returns markdown when `.md` is appended to its URL. All 77 are already saved
under `tools/geist/corpus/md/`. They carry **574 authored behaviour statements across 56 pages**,
and this source is currently unused for verification.

They contain no implementation. Every code block is a consumer call site. But the prose is the
reference team describing intended behaviour in their own words, which is better evidence than
anything recovered from a bundle. Real examples from `button.md`:

- "For form submits, use `typeName="submit"`. The HTML `type` attribute lives on `typeName`, not on
  `type`, which controls the visual variant." — a non-obvious API split, and one we diverge from
  (see the open decision in `PLAN.md`).
- "Pass `loading` instead of swapping in a spinner so the button stays focusable and announces the
  busy state." — a focus and ARIA requirement.
- "Icon-only buttons should include the `svgOnly` prop and an `aria-label`." — the live component
  reportedly throws without them, implying a runtime invariant.

**Action:** treat these 574 statements as a behaviour checklist. For each, assert the behaviour holds
in our element, or record why it does not apply.

### 2. Upstream open-source libraries underneath the reference — high value

The reference is not all bespoke. Grepping our own saved chunks confirms it composes public
libraries:

| Library | Chunks referencing it (our corpus) |
|---|---|
| Radix (popper, focus guard, menu content, collection item) | 7 |
| cmdk | 5 |
| react-aria | 4 |

Where a reference element wraps one of these, **the state machine and keyboard behaviour we are
matching is already documented and open source.** Port against the upstream documentation rather
than reverse-engineering the wrapper, and the reference's own code reduces to styling plus a thin
prop layer.

This confirms findings the port already reached independently and recorded per element: combobox is
a Radix popover with match-sorter, context-menu is a Radix context menu, command-menu is cmdk-based,
drawer is Base UI. Those notes are in `PLAN.md` section 3.

### 3. The compiled chunks, deminified — real but slower

2.7 MB across 40 chunks is already saved under `tools/geist/corpus/js/`. The JSX survives
minification legibly, and handler density is real. Two tools are current and worth using:

| Tool | Status | Use |
|---|---|---|
| `pionxzh/wakaru` | 985 stars, pushed 2026-09-09 | Strongest for React: un-compiles `jsx`/`jsxs` calls back to JSX and restores hook names. |
| `j4k0xb/webcrack` | 2,901 stars, pushed 2026-07-26, npm 2.16.0 | Unpacks a bundle into per-module files, which is the step that splits our 40 chunks apart. |

Two to avoid, both easy to reach for by mistake:

- `aidenybai/react-scan` — 21,839 stars, but it is a runtime render-performance visualiser, not a
  deminifier. The name is the only thing it shares with this task.
- `moroshko/react-scanner` — statically scans *source*, so it cannot read a minified bundle. It is
  usable against our own code or the saved `.md` examples to diff prop coverage, nothing more.

### 4. The live site as a behavioural oracle — the only real proof

For keyboard order, focus movement, escape handling and pointer drag, the only trustworthy check is
driving the live reference and our page through the same script and comparing. This needs Peter's
own Chrome, because the built-in browser pane cannot reach vercel.com and fires no timers.

## The method that follows from this

1. Turn the 574 `.md` behaviour statements into a per-element checklist. Assert each, or record why
   it does not apply. Cheapest and highest value; needs no new tooling.
2. For every element that wraps Radix, cmdk or react-aria, verify against that library's own
   documented behaviour.
3. Deminify the chunks with wakaru and webcrack for the reference-specific wrappers that remain,
   principally the ones with no upstream library behind them.
4. Drive both sites through the same interaction script in Peter's Chrome for anything that only a
   real browser can settle.

Step 1 alone would have caught the table's Show More, because the table page's prose describes the
expand behaviour. Do it first.
