# Browser

A realistic browser frame around a website screenshot or any other content.

## Composition

```html
<div style="max-width:896px">
  <acme-browser address="https://www.vercel.com">
    <div style="padding:24px"></div>
  </acme-browser>
</div>
```

## `<acme-browser>`

Browser frame. A small-material box, rounded in proportion to its own width from the md
breakpoint, with a header over the slotted content. The header holds three sections: the
traffic-light dots with the back, forward and reload controls (the controls hide below md); the
address bar, a pill that shows `address` without its scheme, `www.` and trailing slash, with a
copy button (a tertiary, tiny, square icon button) that writes the full address to the
clipboard, is named "Copied" and shows a check for one second after a copy, and raises an error
toast when the copy fails; and an empty spacer that appears from lg. The chrome takes the page
theme. The frame is decorative: set `aria-hidden="true"` on the element and describe the
screenshot inside it.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `address` | `address` | `string` | `""` | The URL the address bar shows and the copy button copies. |

Slots: `(default)`

## Best Practices

**When to use**

- Marketing chrome around screenshots, demos and recordings on landing pages, docs and changelog posts.
- Do not put real product UI inside the frame; the chrome says screenshot, not live surface.
- When the canned shape does not fit, compose from the parts (dots, controls, the address bar); do not fork the chrome.

**Behavior**

- The chrome takes the page theme: light chrome on light pages, dark chrome on dark, so the frame does not fight the page.
- For a long URL, use Middle Truncate inside the address bar so the host and the end of the path both stay visible.
- Lock the aspect ratio of the inner image so the chrome does not reflow while the image is missing or slow.

**Accessibility**

- The chrome is decorative: set aria-hidden="true" on the element; the meaning lives on the inner image or video.
- Give the screenshot alt text that says what the user sees, not "browser screenshot".
- No focusable dots or back and forward buttons; the chrome is a frame, and controls that go nowhere confuse keyboard users.

