# Context Card

A floating card that appears on hover or focus and holds richer UI than a tooltip.

## Default

```html
<div style="display:flex;flex-direction:row;align-items:stretch;justify-content:space-around;flex:0 1 auto">
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 1 auto">
    <acme-context-card content="The Evil Rabbit Jumped over the Fence" side="top">
      <span>Top</span>
    </acme-context-card>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 1 auto">
    <acme-context-card content="The Evil Rabbit Jumped over the Fence" side="bottom">
      <span>Bottom</span>
    </acme-context-card>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 1 auto">
    <acme-context-card content="The Evil Rabbit Jumped over the Fence" side="left">
      <span>Left</span>
    </acme-context-card>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 1 auto">
    <acme-context-card content="The Evil Rabbit Jumped over the Fence" side="right">
      <span>Right</span>
    </acme-context-card>
  </div>
</div>
```

## Alignment

Set align to put the card at the start, the center or the end of the trigger.

```html
<div style="display:flex;gap:16px;align-items:center;justify-content:center">
  <acme-context-card align="start" content="Start alignment positions the card at the beginning edge." side="bottom">
    <acme-button>Start</acme-button>
  </acme-context-card>
  <acme-context-card align="center" content="Center alignment positions the card in the middle." side="bottom">
    <acme-button>Center</acme-button>
  </acme-context-card>
  <acme-context-card align="end" content="End alignment positions the card at the ending edge." side="bottom">
    <acme-button>End</acme-button>
  </acme-context-card>
</div>
```

## Render prop

The trigger is whatever you slot: a button, a link, a badge. Plain content gets the element's own wrapper. The element is the trigger's box, so a link's own look (colour, underline) goes on the element and the link inherits it.

```html
<div style="display:flex;align-items:center;gap:32px">
  <acme-context-card content="Default: the trigger renders its own &lt;div&gt; around the children." side="top">
    <acme-button>Default wrapper</acme-button>
  </acme-context-card>
  <acme-context-card content="render: trigger behavior is merged onto your element. In this case a semantic &lt;a&gt;." side="top" style="color:var(--ds-blue-700);text-decoration:underline;text-underline-offset:2px">
    <a href="https://vercel.com" rel="noreferrer" target="_blank" style="color:inherit;text-decoration:inherit">Rendered as a link</a>
  </acme-context-card>
</div>
```

## `<acme-context-card>`

Context card. The slotted content sits in an inline-flex trigger with a pointer cursor; the
card is a floating shell (the page background, a 6px radius, the tooltip shadow under a 1px
ring, a 14 by 7 stem on the facing edge) 16px off the trigger on `side` (right by default),
along it at `align` (start, center or end), moved by `side-offset` and `align-offset`, with
the `content` text or the `content` slot in a 12px padded box (`no-padding` drops it). It
flips to the side with more room when the viewport leaves none, keeps 8px from its edges, and
the stem follows the trigger's centre. A mouse opens it 150ms after entering the trigger, at
once when a card is already up, and it slides there from the last card within 150px (a move
of 250ms; a card opened from rest, further away, or while scrolling appears in place); the
pointer may cross onto the card, and it closes `inactive-timeout-ms` (250) after leaving
both, or on a click on a link in the trigger. Focus on the trigger opens it too, and Escape
closes it and returns focus. `ignore-card-pointer-events` lets the pointer pass through the
card, `hide` keeps it closed, `shown` sets the open bits (1 hover, 2 focus, 4 touch; 8 marks
a card that moved here from a neighbour), `disable-triggers` ignores every trigger.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `content` | `content` | `string` | `""` | The card's text; the `content` slot takes markup instead or as well. |
| `side` | `side` | `ContextCardSide` | `"right"` |  |
| `align` | `align` | `ContextCardAlign` | `"center"` |  |
| `side-offset` | `sideOffset` | `number` | `16` | Space between the trigger and the card. |
| `align-offset` | `alignOffset` | `number` | `0` | The card's shift along the trigger. |
| `ignore-card-pointer-events` | `ignoreCardPointerEvents` | `boolean` | `false` | The pointer passes through the card. |
| `no-padding` | `noPadding` | `boolean` | `false` | The content box has no padding. |
| `hide` | `hide` | `boolean` | `false` | Keeps the card closed. |
| `inactive-timeout-ms` | `inactiveTimeoutMs` | `number` | `250` | Milliseconds after the pointer leaves the trigger and the card before the card closes. |
| `shown` | `shown` | `number` | `0` | The open bits: 1 hover or keyboard, 2 focus, 4 touch; 8 a card that moved here from a neighbour. |
| `disable-triggers` | `disableTriggers` | `boolean` | `false` | Ignores hover, focus, keys and touch. |

Slots: `(default)`, `content`

## Best Practices

**When to use**

- A Context Card reveals entity metadata on hover or focus: a user, a deployment, a project, an API key; the trigger is usually a name link or an avatar in dense data.
- A one-line why with no metadata rows is a Tooltip; long-form content, an edit form or persistent navigation goes to a Drawer or a detail page.
- No destructive action lives in a Context Card: the card can close on cursor exit before the user commits.

**Behavior**

- It opens on hover and keyboard focus and closes on cursor exit or blur; the ~150 ms entry delay stops it flashing on a fast mouse sweep.
- At most one primary action (View Project, Open Settings); two CTAs read as a menu and belong in a Menu.
- A Context Card never sits inside a Tooltip or another Context Card: the second layer steals focus and traps keyboard users.

**Content**

- Lead with the entity name as a Title Case heading and one identifying line in sentence case under it (team slug, owner, deployment URL).
- Then 2–4 rows of Label: value with Title Case noun keys (Last Active, Created, Plan); values follow the table-cell rules, and an unknown value is an em dash (—), never N/A or null.
- The card does not repeat what the trigger already shows: a row that renders the deployment URL does not open the card with it.

**Accessibility**

- The trigger keeps its own accessible name; the card is supplementary and never replaces it.
- Card content is reachable by keyboard once the trigger has focus; Escape closes the card and returns focus to the trigger.

