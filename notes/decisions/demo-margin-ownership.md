# The docs harness owns the space around a demo, not the element

Decided 2026-09-10 by Peter, who saw more vertical space around our code block than the reference's
when the two docs pages are put side by side.

## What is actually true, measured on the live reference

Both readings were half right, and neither was what we assumed.

- **The reference's code block really carries `my-4`**, and it really resolves to `margin-block: 1rem`.
  Our generated `margin-block: 1rem` reproduces it faithfully. The class is not inert.
- **Their docs page cancels it on every demo.** A rule keyed on the exact value
  `aria-label="Hello world"` zeroes the margin on all 10 demos on that page.

Bisected in the browser rather than inferred:

| Change to the live element | Computed `margin-top` |
|---|---|
| As shipped | `0px` |
| `aria-label` removed | `16px` |
| `aria-label` set to another value | `16px` |
| A plain `<div class="my-4" aria-label="Hello world">` in the same parent | `0px` |

So the component has the margin and the demo harness hides it. Peter's screenshot is right about
the docs pages; the element is right about the reference.

## The decision

**Our docs preview container zeroes the margin, the way theirs does.** The element keeps the
reference's value as its default, so a consumer dropping `acme-code-block` into a page gets the
spacing the reference gives it.

Rejected: removing `margin-block` from the element. That is a permanent divergence from a real
reference value, it needs an accepted census entry, and the generator would keep reproducing `my-4`
from the spec on every regeneration unless the map also carried an `ignore` claim.

## Why a custom property, and not a rule on the preview

The first attempt was `.showcase .preview > * { margin-block: 0 }`. It does nothing: the margin is on
`.code-block` **inside the shadow root**, and no rule on the page reaches through a shadow boundary.

So the element exposes `--acme-code-block-margin-block`, defaulting to the reference's `1rem`. The
docs preview sets it to `0`. Verified: inside the docs the margin is `0` and the 24px gap is the
preview's own padding, matching the reference's `p-6`; a block mounted outside the docs still
computes `16px`.

## The general rule this establishes

A container that lays out a demo owns the space around it. Where the reference's own docs do the
same thing, copying the *element* faithfully and copying the *harness* faithfully are two separate
jobs, and a difference between two docs pages is not automatically an element defect.
