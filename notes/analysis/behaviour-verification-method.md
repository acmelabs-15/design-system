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

- **Right-to-left: decided, none**, on the evidence that the reference has none. See
  [../decisions/parity-scope.md](../decisions/parity-scope.md).
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

---

## Browser access: solved, and how to measure motion

Tested repeatedly on 2026-09-10, including with the preview pane open, minimized to the dock, and
restored. Both usable paths were driven against the live reference and produced **identical
measurements** — the same tooltip text, the same 247 by 29 box, the same `aria-describedby` wiring, the
same animation name. That agreement between two independent instruments is itself a useful cross-check.

### Do not trust `document.visibilityState` as the gate

The obvious rule — "frames fire when the page is visible" — is wrong, and acting on it would have made us
skip motion checks that work.

Observed, in the same pane, minutes apart:

| Pane state | `visibilityState` | Frames fire | `getAnimations()` on the document |
|---|---|---|---|
| Hidden behind the terminal | `hidden` | no | 0 |
| Open and on screen | `visible` | yes | 8 |
| Minimized to the dock | `hidden` | no | 0 |
| Restored | **`hidden`** | **yes** | 0 |

The last row is the important one: frames fired while the page still reported itself hidden, and the
document-level animation count stayed at zero even though a real animation was running on an element.

**So test the capability, never the flag.** Before a motion assertion, run one frame probe and branch on
the result. `visibilityState` and a document-wide animation count are both unreliable proxies.

### The probe, and how to read a live animation

Ask for a frame with a timeout, then read the animation from the **element**, not the document:

```js
const framesFire = await new Promise((r) => {
  let done = false;
  requestAnimationFrame(() => { done = true; r(true); });
  setTimeout(() => { if (!done) r(false); }, 1200);
});
```

Then sample the same element twice, with a gap, and compare. A single reading cannot tell a running
animation from a finished one:

```js
const a1 = bubble.getAnimations({ subtree: true }).map((a) => ({ name: a.animationName, state: a.playState, t: a.currentTime }));
await new Promise((r) => setTimeout(r, 150));
const a2 = bubble.getAnimations({ subtree: true }).map((a) => ({ name: a.animationName, state: a.playState, t: a.currentTime }));
```

This works. On our own tooltip it caught the fade **mid-flight** at 55% opacity, running, then finished at
100% — with the pane minimized and `visibilityState` reading `hidden` throughout.

### What each path is for

| | Built-in preview pane | Chrome DevTools protocol |
|---|---|---|
| Reaches the reference site | Yes | Yes |
| Reads the page, runs script | Yes | Yes |
| Real hover and key input | Yes | Yes |
| Accessibility tree | Yes | Yes, with identifiers for interaction |
| Timers | Always | Always |
| Frames | **Probe first** | Yes when its page is visible |
| Runs in | Its own pane | **Peter's real Chrome, with his tabs** |

**Default to the preview pane.** It does not touch Peter's browser, and with the frame probe it handles
motion too. Reach for the DevTools protocol when the probe says frames are not firing and the check needs
them, or when element identifiers make an interaction easier.

Courtesy for the DevTools path: it attaches to Peter's real Chrome and lists his tabs, so open what you
need and close only what you opened.

### What was verified end to end

On the live reference: the full accessibility tree with roles and names; **real hover opened a tooltip**,
which matters because the reference ignores synthetic events; and with it open, `position: absolute`, a
247 by 29 box, its transform matrix, the `fadeInTooltip` animation, and that `aria-describedby` is wired
**only while open** — behaviour our element must match and the census cannot see.

On our own docs server: every tooltip element found, **none open at rest**, shadow roots reachable, and a
live fade sampled mid-flight.

### The rule this settles

Both sides can be driven in one session with real input. So compare **live against live in the same run**
rather than against a stored baseline: a change on the reference's side then shows up as a reviewable
difference instead of a mystery failure weeks later.

---

## Measuring motion when the window is not being drawn

Researched and tested 2026-09-10, after Peter asked whether a Chrome setting could keep animations
observable with the window minimized.

### The answer: no setting exists, and none can

Two independent investigations reached the same conclusion from Chromium's own source, and every
candidate flag was tested rather than assumed.

The gate is in the compositor's scheduler. When a widget is not visible it **unsubscribes from the frame
source entirely** — a hard disconnect, not a throttle. The specification agrees: the event loop's
rendering steps filter out any document whose visibility state is hidden, and animation-frame callbacks
only run inside those steps. So a hidden page gets no frames by construction.

Minimizing is **not** occlusion. Chromium treats a minimized or backgrounded window as `HIDDEN` and a
covered one as `OCCLUDED`, on different code paths. That distinction matters, because the one switch that
looks relevant only upgrades `OCCLUDED` to `VISIBLE` and never touches `HIDDEN`.

Tested with the window minimized, all giving zero frames:

`--disable-backgrounding-occluded-windows`, `--disable-renderer-backgrounding`,
`--disable-background-timer-throttling`, `--disable-features=CalculateNativeWinOcclusion`,
`--disable-features=IntensiveWakeUpThrottling`, `--run-all-compositor-stages-before-draw`,
`--disable-gpu-vsync`, `--disable-frame-rate-limit`.

The frame-rate switches drove a *visible* window to roughly 12,000 frames a second and still produced
zero when minimized, which proves the gate is visibility rather than rate. The timer switches do not
touch animation frames at all. Playwright and Puppeteer already pass the first three by default, so
adding them changes nothing.

No `chrome://settings` item, no enterprise policy and no macOS setting changes it. Memory and energy
savers act on background tabs. One macOS detail worth knowing: display sleep also stops frames, even for
a window that is not minimized.

### What works instead: seek the animation and read the style

The escape hatch is that `getComputedStyle` and `getAnimations` both force Blink to update animation
timing **on demand**, off the frame path. So an animation can be moved to any point and sampled with no
frames at all.

Verified by hand, with frames confirmed dead first:

| Seek point | Opacity | Transform |
|---|---|---|
| 0% | 0 | translateX(0px) |
| 25% | 0.25 | translateX(50px) |
| 50% | 0.5 | translateX(100px) |
| 75% | 0.75 | translateX(150px) |
| 100% | 1 | translateX(200px) |

And on our own live tooltip: 0 at the start, **0.315 at halfway**, 1 at the end.

`tools/geist/motion.js` implements this. Paste it into a page and call `window.__motion(element)`.

### Three traps, each found by hand

**Pause before seeking, always.** Chromium's animation clock advances against wall time between tasks, so
an unpaused animation moves between the seek and the read. Every sample then lands past the end and
reports the fill value, which reads as a completely broken animation. Measured on the same element:
unpaused gave 0 at all five points; paused gave 0, 0.315, 1.

**The easing is usually not where you look first.** Our tooltip's effect timing reports `linear` while
the keyframes and the CSS rule both say `ease-in`, and the interpolated value at halfway (0.315, not 0.5)
proves the keyframes win. Read the effect timing, the keyframes and the computed style, and compare all
three.

**A finished animation reads its fill value everywhere.** Catch a bubble mid-exit and every sample looks
wrong. Confirm the animation's state before trusting a sample, and prefer a freshly opened element.

### Two rejected alternatives, for the record

- Forcing the page active through the debugging protocol's lifecycle command does not restore frames. It
  only un-freezes, and the browser code never marks the widget shown.
- The virtual-time policy only fast-forwards delayed tasks, not frames, and one test run deadlocked on it.

### What this means for us

Motion checks do not need a visible window. They need the seek technique, which works in the preview pane
whatever its state. Keep the frame probe anyway, because a check that genuinely needs a drawn frame — a
screenshot — still requires visibility.

One consequence worth noting: a common actionability check in test tools compares an element's box across
animation frames, so it **hangs forever** with no frames. Avoid waiting on that in a hidden pane.
