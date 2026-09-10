# Tooltip

A floating label that appears on hover or focus to provide additional context about an element.

## Default

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip text="The Evil Rabbit Jumped over the Fence">
      <span>Top</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right</span>
    </acme-tooltip>
  </div>
</div>
```

## No delay

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip delay="false" text="The Evil Rabbit Jumped over the Fence">
      <span>Top</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip delay="false" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip delay="false" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip delay="false" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right</span>
    </acme-tooltip>
  </div>
</div>
```

## Box align

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip box-align="left" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Center</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip box-align="right" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Right</span>
    </acme-tooltip>
  </div>
</div>
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip box-align="left" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Center</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip box-align="right" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Right</span>
    </acme-tooltip>
  </div>
</div>
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip box-align="left" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Center</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip box-align="right" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Right</span>
    </acme-tooltip>
  </div>
</div>
```

## Custom content

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip>
      <span slot="content">
        The
        <b>Evil Rabbit</b>
        Jumped over the
        <i>Fence</i>
        .
      </span>
      <span>Top</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="bottom">
      <span slot="content">
        The
        <b>Evil Rabbit</b>
        Jumped over the
        <i>Fence</i>
        .
      </span>
      <span>Bottom</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="left">
      <span slot="content">
        The
        <b>Evil Rabbit</b>
        Jumped over the
        <i>Fence</i>
        .
      </span>
      <span>Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="right">
      <span slot="content">
        The
        <b>Evil Rabbit</b>
        Jumped over the
        <i>Fence</i>
        .
      </span>
      <span>Right</span>
    </acme-tooltip>
  </div>
</div>
```

## Custom type

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip text="The Evil Rabbit Jumped over the Fence" variant="success">
      <span>Top</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence" variant="error">
      <span>Bottom</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="left" text="The Evil Rabbit Jumped over the Fence" variant="warning">
      <span>Left</span>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="right" text="The Evil Rabbit Jumped over the Fence" variant="violet">
      <span>Right</span>
    </acme-tooltip>
  </div>
</div>
```

## Components

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <acme-button size="small">Bottom</acme-button>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <acme-badge size="sm">LEFT</acme-badge>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <acme-spinner></acme-spinner>
    </acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip text="Search">
      <acme-kbd slot="content">/</acme-kbd>
      <span>Shortcut</span>
    </acme-tooltip>
  </div>
</div>
```

## Other

```html
<div style="display:flex;flex-wrap:wrap;position:relative;min-width:1px;max-width:100%">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip text="The Evil Rabbit Jumped over the Fence" tip="false">No tip indicator</acme-tooltip>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;min-width:1px;max-width:100%">
    <acme-tooltip center="false" text="The Evil Rabbit Jumped over the Fence multiple times.">No center text</acme-tooltip>
  </div>
</div>
```

## `<acme-tooltip>`

Tooltip. The slotted content sits in a focusable inline-flex trigger; the bubble is a 13px
inverted-theme box with an 8px radius, 10px from the trigger on the `position` side (top by
default, `auto` picks top or bottom), its arrow centred on the facing edge or, with `box-align`
left or right (`auto` near a viewport edge), at the arrow offset from the bubble's start or
end. The bubble takes `text`, or the `content` slot (a key in it draws small and flat), and
`max-width` (250px), `padding`, `variant` (the themed colour variables of success, error, warning
and violet), `tip` (the arrow), `center`, `wrap` and `invert-theme`, each on by default.
It fades in after 400ms (`delay="false"`: at once; `lower-delay`, or a touch: 100ms), placed
with floating-ui in the top layer, so it escapes clipping ancestors, and flips or shifts only
when the viewport leaves no room. A mouse or pen opens it on enter (after `delay-time`) and
closes it 100ms after leaving; Enter and Space open it, Escape closes it; focus opens it with
`sticky`; a tap opens it on a touch screen (never with `desktop-only`) over a backdrop that
catches the next tap; a scroll closes it. `shown` sets the open bits (1 hover, 2 focus, 4
touch), `force-hide` keeps it closed, `disable-triggers` ignores every trigger, `hide-on-click`
closes it as the trigger takes focus, `trigger-tabindex` sets the trigger's tab order (`none`
for no tab stop), `cursor` its pointer, `use-parent-for-bounding-rect` measures the host's parent.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `text` | `text` | `string` | `""` | The bubble's text; a trailing period is dropped. The `content` slot takes markup instead or as well. |
| `position` | `position` | `TooltipPosition` | `"top"` |  |
| `box-align` | `boxAlign` | `TooltipAlign` | `"auto"` |  |
| `center` | `center` | `boolean` | `true` | `center="false"` left-aligns the text. |
| `delay` | `delay` | `boolean` | `true` | `delay="false"` fades the bubble in at once. |
| `delay-time` | `delayTime` | `number` | `0` | Milliseconds before a hover or key opens the bubble. |
| `desktop-only` | `desktopOnly` | `boolean` | `false` | Never opens on a touch. |
| `disable-triggers` | `disableTriggers` | `boolean` | `false` | Ignores hover, focus, keys and touch. |
| `fill` | `fill` | `boolean` | `true` | `fill="false"` drops the filled colour variables of `variant`. |
| `hide-on-click` | `hideOnClick` | `boolean` | `false` | Closes the bubble as the trigger takes focus. |
| `max-width` | `maxWidth` | `string` | `"250px"` |  |
| `padding` | `padding` | `string` | `""` | The bubble's padding, as CSS. |
| `shown` | `shown` | `number` | `0` | The open bits: 1 hover or keyboard, 2 focus, 4 touch. |
| `sticky` | `sticky` | `boolean` | `false` | Focus on the trigger opens the bubble. |
| `tip` | `tip` | `boolean` | `true` | `tip="false"` hides the arrow. |
| `variant` | `variant` | `TooltipVariant` | `""` | `success`, `error`, `warning` or `violet`: the themed colour variables of that tooltip variant. |
| `wrap` | `wrap` | `boolean` | `true` | `wrap="false"` keeps the text on one line. |
| `use-parent-for-bounding-rect` | `useParentForBoundingRect` | `boolean` | `false` | Measures the host's parent instead of the trigger. |
| `lower-delay` | `lowerDelay` | `boolean` | `false` | The shorter fade-in delay. |
| `force-hide` | `forceHide` | `boolean` | `false` | Keeps the bubble closed. |
| `invert-theme` | `invertTheme` | `boolean` | `true` | `invert-theme="false"` keeps the page's theme in the bubble. |
| `trigger-tabindex` | `triggerTabindex` | `string` | `"0"` | The trigger's tab order (`0`); `none` takes it out of the tab order. |
| `cursor` | `cursor` | `string` | `""` | The trigger's pointer, as CSS. |

Slots: `(default)`, `content`

## Best Practices

**When to use**

- A Tooltip explains why something exists, not what it is. The visible label names the thing; the tooltip adds the constraint, scope or limit.
- An entity preview with metadata rows (avatar, identifier, a few facts, an optional action) is a Context Card. Long content or actions that must persist go to a Drawer or a page.
- Lifecycle tooltips (Alpha, Experimental, Beta, Early Access) name the limits that apply: API stability, SLA, support, pricing, retention.

**Behavior**

- Tooltips open on hover and on keyboard focus. Keep the default ~150 ms delay so a sweeping mouse does not flicker them.
- Never wrap a labelled Input in a Tooltip: the trigger lands on the label, and the text becomes a second invisible label for screen readers. Put help on a sibling icon button.
- Keep primary actions outside the Tooltip; touch users cannot reach a hover-revealed control.

**Content**

- One sentence or fragment in text. Sentence case, no period for a single fragment.
- Skip a tooltip that repeats the visible label (Rate Limit on a Rate Limit button) or describes the interaction (Click to override).
- A lifecycle tooltip reads {Label}: {one-line meaning}. {Specific limit}. For a paid Beta feature, combine lifecycle and pricing in one tooltip instead of stacking two badges.

**Accessibility**

- An icon-only trigger needs an aria-label that names the action; the tooltip adds context, it does not replace the label.
- Escape closes the tooltip and focus stays on the trigger.

