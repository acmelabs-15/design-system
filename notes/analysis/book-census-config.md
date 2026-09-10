# Book: 142 hard differences to 0, and every one was the measurement

Investigated 2026-09-10. **No element defect found, and none fixed.** All 21 roots pair correctly by
example and index; all 162 geometry readings now match exactly.

## The four faults, each found by measuring rather than reasoning

1. **`BH179W_stripe` appears twice per book.** Once on the outer `rotateWrapper` (the full 240px
   book) and once on the real band inside `BH179W_book`. A bare `.BH179W_stripe` returns the outer
   one, and every number downstream is then wrong. The band selector is
   `.BH179W_book > .BH179W_stripe`. Six of the 21 roots have no band at all — the `simple` variant —
   which the saved run also records, and which is how this was confirmed rather than guessed.

2. **The icon needs a different selector per side.** Theirs is scoped to `.BH179W_content`, because
   a bare one finds the 197×149 illustration in example 4 first. Ours is bare `svg, img`, because our
   icon is **slotted**: the census's slot fallback matches the whole selector against slotted
   elements, and a slotted svg has no `.content` ancestor in the light DOM. A `>>` hop does not
   bridge that either — `dive()` crosses **shadow roots**, and `.content` is a plain div, so every
   hop returns null and all 21 roots read "missing on ours".

3. **The element types differ, and four properties follow from that.** The reference passes an
   `<img>` logo, ours an inline `<svg>`. Checked against bare elements in the browser:
   `overflow` clip-vs-hidden is the **UA default** for the two tags; `color: transparent` and
   `max-width: 100%` are their page's image handling; `flex-shrink: 0` is **ours**, because our docs
   example writes `class="ic"` and `tokens.css` carries `.ic { flex: none }`. Demo markup on both
   sides, the same shape as the badge case. On root 10 the whole reading differs, because
   `getComputedStyle` on an SVG returns an empty string for a layout property it does not apply.

4. **In dark, their icon is an image pair and the census reads the hidden twin.** The light file is
   `display: none` and `querySelector` returns it, so the reading is a 0×0 hidden box while the
   visible dark file reads 16×16 exactly like ours. No selector fixes this in both themes at once,
   because the hidden twin swaps sides and a `:not()` inside a comma list still matches through the
   fallback.

Faults 3 and 4 are ACCEPTED entries in `diff.ts` carrying that evidence. The rule is scoped to
`part === "icon"` and fires on no other page — checked against badge, button, input and select.

## Two things I got wrong on the way, both worth recording

- **I blamed a transition.** The book transitions `transform` over 0.25s, so a mid-flight read was a
  plausible cause and I wrote it up as one. It is wrong: the census already injects
  `transition: none !important` into every shadow root, and setting `data-hover` by hand gives the
  identity matrix immediately and after 400ms alike. The 3D matrix I saw came from reading the outer
  `stripe`, which is fault 1.
- **I compared the wrong roots.** My "the live reference matches ours" check read their example 3
  against saved roots 15–17, which are example **7**. The conclusion happened to be right; the
  evidence for it was not. Root 0 as a control is what settled it — it reads 196×115 and 196×125
  live, exactly what the saved run recorded, which proves the setup rather than the hypothesis.

## What was stale after all

Only the three custom-icon roots. Their logo was 20px tall when the census last ran and is 16px now,
which moved the band and body by 4px in opposite directions. The rest of the saved run was accurate.

`book.config.json` is written, verified against a control, and carries the reasoning for every
selector so the run repeats.
