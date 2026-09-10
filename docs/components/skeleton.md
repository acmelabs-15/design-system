# Skeleton

Show a placeholder shape while another component loads.

## Default with set width

```html
<acme-skeleton width="160"></acme-skeleton>
```

## Default with box height

```html
<acme-skeleton box-height="42" width="160"></acme-skeleton>
```

## Wrapping children

Without a fixed size the skeleton takes the size of its children.

```html
<div class="vstack" style="gap:16px;align-items:flex-start">
  <acme-skeleton>
    <acme-button>Hidden by skeleton</acme-button>
  </acme-skeleton>
  <acme-skeleton show="false">
    <acme-button>Not hidden by skeleton</acme-button>
  </acme-skeleton>
</div>
```

## Wrapping children with fixed size

The skeleton hides once children are present, and the size stays reserved.

```html
<div class="vstack" style="gap:16px;align-items:flex-start">
  <acme-skeleton height="100" width="100%"></acme-skeleton>
  <acme-skeleton height="100" width="100%">
    <acme-button>Not hidden by Skeleton</acme-button>
  </acme-skeleton>
</div>
```

## Pill

```html
<acme-skeleton pill width="48"></acme-skeleton>
```

## Rounded

```html
<acme-skeleton box-height="48" height="48" rounded width="48"></acme-skeleton>
```

## Squared

```html
<acme-skeleton box-height="48" height="48" squared width="48"></acme-skeleton>
```

## No animation

```html
<acme-skeleton animated="false" height="100" width="100%"></acme-skeleton>
```

## Button

```html
<div class="vstack" style="gap:16px">
  <div class="vstack" style="gap:8px">
    <p class="text-label-14">Without button prop (default):</p>
    <acme-skeleton height="32" width="120">
      <acme-button>Loading...</acme-button>
    </acme-skeleton>
  </div>
  <div class="vstack" style="gap:8px">
    <p class="text-label-14">With button prop (extends animation by 1px):</p>
    <acme-skeleton button height="32" width="120">
      <acme-button>Loading...</acme-button>
    </acme-skeleton>
  </div>
  <div class="vstack" style="gap:8px">
    <p class="text-label-14">Multiple buttons loading:</p>
    <div class="row">
      <acme-skeleton button>
        <acme-button>Save</acme-button>
      </acme-skeleton>
      <acme-skeleton button>
        <acme-button variant="secondary">Cancel</acme-button>
      </acme-skeleton>
    </div>
  </div>
</div>
```

## `<acme-skeleton>`

Skeleton: a block with a gray sweep, shown while content loads. The root carries the shape
classes (pill, rounded, squared), `still` without animation, `button` for the wider sweep,
and one of four states: bare (a block of the given size), `wrap` (children present, hidden
under the sweep), `off` (`show="false"`: children visible, no sweep), `auto` (a fixed size
with children: the children show, the block keeps its size). Width, min-height (24 by
default) and the bottom margin from `box-height` are inline styles. The host renders as its
contents, so the block itself is the flex or block item of the layout around it.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `width` | `width` | `string \| number` | `""` | Pixels or any CSS length ("100%"). |
| `height` | `height` | `string \| number` | `""` | Pixels or any CSS length; the block's min-height (24 when a size is given). |
| `box-height` | `boxHeight` | `string \| number` | `""` | Height reserved for the box; the difference to `height` becomes bottom margin. |
| `show` | `show` | `boolean` | — | Force the skeleton on or off (`show="false"`); unset, a fixed-size skeleton hides once children are present. |
| `pill` | `pill` | `boolean` | `false` |  |
| `rounded` | `rounded` | `boolean` | `false` |  |
| `squared` | `squared` | `boolean` | `false` |  |
| `button` | `button` | `boolean` | `false` | Inside a Button: the sweep extends by 1px so the border is covered. |
| `animated` | `animated` | `boolean` | `true` | `animated="false"` stops the sweep. |

Slots: `(default)`

## Best Practices

**When to use**

- Show a Skeleton when async data fills a layout you already know: table rows, card grids, profile blocks, sidebars.
- Use Spinner for one in-flight action, Loading Dots for an inline wait with no end in sight, and Progress when the total is known.
- A Skeleton is not decoration and not an empty state. When there is no data to load, render an Empty State.

**Behavior**

- Set width and height to the final content so nothing shifts when data lands. A 200×20 block that becomes an 80×16 string reads as a glitch.
- Pick pill, rounded or squared to mirror the shape that follows: avatars pill, buttons and chips rounded, image tiles squared.
- When the skeleton wraps children, keep the size stable so the swap does not reflow the content around it.

**Accessibility**

- Put aria-busy="true" on the loading region and announce completion with aria-live="polite" on the destination, not on the skeleton.
- Turn the shimmer off with animated="false" on low-power surfaces; the sweep also stops under prefers-reduced-motion.
- Skeletons are decorative. Keep focusable controls out of them while loading.

