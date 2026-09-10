# Empty State

Fills a space that has no content yet, or is empty for now by the nature of the feature, so the reader is not confused.

## Empty state Design framework

A well designed empty state is part of a smooth experience: it gives enough context to keep the user productive. Several approaches fit different situations a developer meets:Blank Slate - Basic empty state for first run experienceInformational - Alternative for first use empty state, including in-line CTAs and supplemental documentation linksEducational - Launch a contextual onboarding flow to gain deeper understanding about that area of the appGuide - Starter content that allows users to interact with data and learn the system by tinkering or setting up their environment

```html
<acme-empty-state title="Title" description="A message conveying the state of the product.">
  <acme-icon-tile slot="icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-chart"/>
    </svg>
  </acme-icon-tile>
</acme-empty-state>
```

## Blank slate

The simplest empty state says what state the view is in.

```html
<acme-empty-state title="Title" description="A message conveying the state of the product.">
  <acme-icon-tile slot="icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-chart"/>
    </svg>
  </acme-icon-tile>
</acme-empty-state>
```

## Informational

Explains the benefit of a product or feature, with a call to action and a link to more information so the user can move on. Show the value rather than tell it; some entry points call for a unique empty state and a call to upgrade. An informational empty state always has a call to action.

```html
<acme-empty-state title="Title" description="This should detail the actions you can take on this screen, as well as why it’s valuable.">
  <acme-icon-tile slot="icon">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-chart"/>
    </svg>
  </acme-icon-tile>
  <acme-button variant="secondary">Primary Action</acme-button>
  <a href="/" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:2px;color:var(--ds-gray-900)">
    Learn more
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <use href="#i-ext"/>
    </svg>
  </a>
</acme-empty-state>
```

## `<acme-empty-state>`

Empty state: fills a space that has no content yet. A full-width bordered column, centred: an
optional icon (the `icon` slot, usually an `acme-icon-tile`), the text column with the title and
the description (each centred, at most 340px wide), then the default slot's children as they
come, one per row (a button, a link). `border="false"` keeps the border box and makes it
transparent; `secondary` swaps the background for background-200 and the title for the 14px
heading. Slots: default (the calls to action), `icon`, `title` and `description` (rich content
in place of the attributes).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `title` | `title` | `string` | `""` | The title line, Title Case. |
| `description` | `description` | `string` | `""` | The sentence under the title. |
| `border` | `border` | `boolean` | `true` | `border="false"` turns the border transparent. |
| `secondary` | `secondary` | `boolean` | `false` | The background-200 form with the 14px title, for a state inside a tinted panel. |

Slots: `icon`, `title`, `description`, `(default)`

## `<acme-icon-tile>`

Icon tile: the bordered 8px-radius tile around an empty state's icon (the `icon` slot of
`acme-empty-state`). A centred flex box with 10px padding, the gray-alpha-400 border and gray-900
text; the slotted icon sets its own size (32px in an empty state). `size` fixes the tile's width
and height (a number is pixels).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `size` | `size` | `string` | `""` | Width and height of the tile: a number in pixels, or any CSS length. Unset, the tile wraps its icon. |

Slots: `(default)`

## Best Practices

**When to use**

- Pick the variant by what the user needs: no-results for a filtered list with zero rows, blank slate or informational for a resource not yet created, cleared for finished work, permission for role or tier denials, error for a failed load.
- Render the permission and tier-denial variants full-page when the user lands on a route they cannot view. Use a Note only when one tile inside an otherwise accessible page is gated.
- Keep critical persistent warnings out of it. An empty state disappears once the list fills; persistent warnings belong in a Note or the page header.

**Behavior**

- The call to action is a real button or link, not a click handler on a div, so it is in the tab order and has a role.
- One primary call to action, plus one secondary only when the first step can be one of two paths (Import Repository and Deploy Template). Three is too many.
- After an async filter change, wrap the region in aria-live="polite" so screen readers announce the new state.
- Do not start a tour on its own from the educational variant; pair Start Tour with Skip.

**Content**

- The title is Title Case (No Logs Match Your Filter); the description is sentence case and adds new information instead of repeating the title.
- Quote a single typed query verbatim in curly quotes: No logs match “${query}”. Clear the filter to see all logs. For several facets use the plural No {Items} Match Your Filters and suggest widening or clearing.
- Onboarding text names the next action that creates the first item: Push to your Git repository to create your first one. Tier-gated text follows {Feature value} with the {Plan} plan.
- The error variant pairs the text with a copyable request ID and a Try Again button.
- Call-to-action labels are Title Case Verb + Noun. Never Get Started, Continue or OK.

