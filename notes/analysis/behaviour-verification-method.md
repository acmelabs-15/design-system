# How we will verify behaviour parity

Researched 2026-09-10. Linked from `PLAN.md` section 5.4. Read
[functional-parity-sources.md](functional-parity-sources.md) first: it records what evidence about the
reference exists at all.

Every claim here was checked against our own saved corpus before being written down, per the standing
rule that evidence beats inference.

## What we verified about the reference, and what we did not

| Claim | Status |
|---|---|
| The reference's **buttons** use Adobe's React Aria press handling | **Verified.** `data-react-aria-pressable` appears 525 times across all 76 saved pages, and only ever as `pressable`. Every occurrence is on a button: `data-geist-button` (470), `data-geist-menu-button` (32), a fieldset footer action button (12), and an anchor styled as a button (11). |
| The reference's **menus, comboboxes and dialogs** use React Aria | **Not verified, and do not assume it.** The only React Aria marker present is press handling on buttons. Our own corpus separately shows Radix markers on menu and context-menu, and cmdk on the command menu, which the port already recorded per element. |
| The reference's **Select** is a native `<select>` | **Verified.** `select.html` contains a real `<select>` element with the reference's utility classes. This matches what the port recorded independently. |

The middle row is the one that matters. React Aria is Apache-2.0 with a public, executable test suite,
which makes it tempting to treat as the reference's behaviour specification. For **button press
behaviour** that is now a reasonable hypothesis to test. For anything else it is a guess, and the
standing rule forbids it. Check per component before relying on it.

## The instruments, and what each is actually for

Four instruments, each answering a different question. Using one to answer another's question is how a
parity claim goes wrong.

### 1. Computed role and accessible name — the specification-backed oracle

W3C WebDriver defines endpoints that ask the **browser** for an element's computed ARIA role and
accessible name. Reachable from Selenium 4 and WebdriverIO. Detail and the driver support matrix are in
[functional-parity-sources.md](functional-parity-sources.md).

Point the same assertion at the reference and at us. This is the strongest machine-checkable evidence of
semantic parity we can get.

**The trap:** Playwright reimplements these algorithms in injected JavaScript rather than asking the
browser, with documented deliberate deviations. Its real-tree API was **removed** in Playwright 1.57,
not merely deprecated. So Playwright is right for our own regression snapshots and wrong for a parity
claim.

### 2. The ARIA Authoring Practices Guide test suites — the best value available

The W3C's APG repository is active and ships **59 executable regression test files** covering exactly
the interaction contracts we need: menu button, combobox in six variants, modal dialog, disclosure,
tabs, listbox, radio, slider, switch, table, tree view, toolbar. Each keyboard-table row in an example
carries a test id, and the matching assertion references that same id, so the prose and the test are
bound together.

Roughly **35 of our elements** map to an APG pattern that has tests. The tests are plain selector plus
key-press plus focus assertions, so they port without dragging APG's harness along.

**One required adaptation:** their focus helpers read `document.activeElement` once, which does not
pierce a shadow root. Every one needs a `deepActiveElement` that walks `shadowRoot.activeElement` down.
That is a contained fix per helper, and we already have the pattern in our own tests.

**A gap to fill ourselves:** APG documents the tooltip pattern but ships no test suite for it.

**What APG is not:** it is the standard pattern's contract, not the reference's. Where the reference
deviates from APG, the reference wins, because the reference is what we are porting. Use APG to know
what to test, then confirm the expected answer against the reference.

### 3. Trusted input only — a live finding that invalidates a whole class of tests

Driving the reference's real combobox with synthetic events produced an incoherent half-open state:
`aria-expanded` flipped to true while the list stayed hidden and focus never moved. A synthetic click on
its trigger did **nothing at all**, because React Aria's press handling ignores untrusted events.

So any harness must use real driver input, never `dispatchEvent`. This also applies to our own tests:
a suite built on synthetic events can pass while the component is broken for a user. It is the same
class of error as the context-card defect we already fixed, where a test dispatched events onto a node
no browser would target.

### 4. Event API parity — the sleeper risk

A `CustomEvent` defaults to `composed: false`, so an event dispatched inside a shadow root never leaves
it and a consumer's handler silently never fires. A listener placed on the host itself will not catch
this, because the event does reach the host — it just cannot get past it.

So: build an event manifest for every element naming the event, whether it bubbles, whether it is
composed, whether it is cancelable, and the shape of its detail. Then assert each one **from a
light-DOM parent**, which is where a consumer listens.

### 5. Cross-root ARIA — a real risk with a moving platform

The reference's combobox uses `aria-owns` and `aria-controls`. **An id reference does not cross a shadow
boundary**, so the same attribute in our shadow DOM may point at nothing. The platform is changing here,
with a reference-target mechanism shipping across engines during 2026.

Verify this against the **computed accessibility tree**, never by reading the attribute back. The
attribute can look perfect while the relationship does not exist.

## Where our current test setup falls short

Our unit tests run on `bun test` with `happy-dom`. That is fast and right for controllers and pure
logic, and it should keep that job.

It cannot test rendered component behaviour honestly, for reasons that no change of test library fixes:

| Missing in happy-dom | Why it matters here |
|---|---|
| `ElementInternals` | Every one of our form controls is form-associated. The whole mechanism is absent. |
| `CustomStateSet` | Custom state selectors cannot be exercised. |
| Real layout — `getBoundingClientRect` returns zeros | Overlay placement, collapse's measured height, and the scroller's overflow detection are all layout-driven. |

That is why interactive behaviour needs a real browser. It is also why the existing census runs in a
browser rather than in the test runner.

**Recommended: Vitest browser mode with Playwright as the driver.** Browser mode left experimental
status in Vitest 4 and the 5.x line is current. The strongest evidence is practice rather than
marketing: Adobe rebuilt Spectrum Web Components, a large Lit design system, on exactly this stack in
2026. Playwright's own component testing is formally deprecated, so use Playwright as the browser
driver underneath Vitest, not as the component test framework.

On Jest: it is not the current choice for this kind of work, and it is not what the Lit ecosystem uses.
Vitest is the successor in the same lineage, keeps a Jest-compatible assertion API, and is the one with
a real browser mode. Bun has no equivalent browser test runner today, so `bun test` keeps the unit tier
and the browser tier lives in Vitest.

## Visual regression: a narrow yes

**Do not pixel-diff against the reference.** Our fonts differ by design, so every text pixel and every
text-driven position differs. A threshold loose enough to absorb that is loose enough to hide a defect.
The computed-style census is the better cross-implementation instrument and stays the primary one.

**Do add pixel diffing against our own history**, on a small set. It closes one hole the census cannot
close by construction: the census iterates a *mapping*, so an element that is missing, extra, occluded
or wrongly clipped is invisible to it — you cannot map what you did not notice was absent. It is also
blind to paint order, gradient banding and backdrop filters.

Use Playwright's built-in screenshot comparison, one pinned browser, on roughly ten elements with
stacking contexts or clipping. No new vendor.

**Maintenance warnings, verified:** Lost Pixel's repository is archived. BackstopJS has not published
since 2024 and its README asks for a maintainer. `ssim.js` is archived. Prefer the engine Playwright
already bundles.

## Cheap high-value checks we were not doing

Each is one flag on a harness we already need:

| Check | Why it matters |
|---|---|
| Forced colors | A focus ring drawn with `box-shadow` **disappears** in forced-colors mode. The fix is a transparent outline plus the shadow ring, never `outline: none`. Safari does not implement `forced-color-adjust`, so opting out cannot be load-bearing. |
| Reduced motion | Assert with `document.getAnimations()` swept across shadow roots, which catches a script-driven animation that ignores the preference. |
| Touch | Hover-opened overlays behave differently under touch emulation. |
| Print | One flag, and it catches overlays that print as blank boxes. |

## Two scope questions, not research gaps

- **Right-to-left:** the reference appears to have none. Matching it means we have none either. That is
  Peter's call, not a finding.
- **Server rendering and hydration:** the reference is React with server components. A Lit port cannot
  follow that architecture, so there is nothing to match. Whether our elements should be
  server-renderable at all is a separate product decision.

## Suggested order

1. Port the applicable APG suites with a shadow-piercing active-element helper. The work is largely
   done by the W3C and covers about 35 elements.
2. Build the event manifest and assert it from a light-DOM parent.
3. Add the computed role and name comparison against the live reference.
4. Add the four emulation flags to the harness.
5. Add screenshot comparison on the ten highest-risk elements.
6. Mine React Aria's public test suite for button press behaviour specifically, having verified that is
   where the reference uses it.

## Method note

Because the reference is only observable as a running site, compare **live against live in the same
run** rather than against a committed baseline. A change on their side then surfaces as a reviewable
event rather than a mystery failure weeks later.

## Unverified

- Whether the reference uses React Aria beyond button press handling. Sweep per component.
- Whether `delegatesFocus` changes `:focus-visible` behaviour. The documentation is silent; test it.
