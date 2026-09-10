# Collapse

A stack of headings that each reveal a related section of content; often called an accordion.

## Default

```html
<acme-collapse-group>
  <acme-collapse title="Question A">
    <p class="text-copy-16" style="margin-bottom:16px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </acme-collapse>
  <acme-collapse title="Question B">
    <p class="text-copy-16" style="margin-bottom:16px">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  </acme-collapse>
</acme-collapse-group>
```

## Expanded

```html
<acme-collapse-group>
  <acme-collapse title="Question A">
    <p class="text-copy-16" style="margin-bottom:16px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </acme-collapse>
  <acme-collapse default-expanded title="Question B">
    <p class="text-copy-16" style="margin-bottom:16px">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  </acme-collapse>
</acme-collapse-group>
```

## Multiple

```html
<acme-collapse-group multiple>
  <acme-collapse title="Question A">
    <p class="text-copy-16" style="margin-bottom:16px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </acme-collapse>
  <acme-collapse title="Question B">
    <p class="text-copy-16" style="margin-bottom:16px">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  </acme-collapse>
</acme-collapse-group>
```

## Small

```html
<acme-collapse size="small" title="Question A">
  <p class="text-copy-16" style="margin-bottom:16px">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</acme-collapse>
```

## `<acme-collapse>`

Collapse. A bordered block with a heading (24px semibold; `size="small"` 16px medium) whose
button trigger holds the title and a chevron that turns 90° when open, over a region that
animates its height (0 when closed, the body's height when open) around the scrolling body
(60vh at most). The content stays in the DOM when closed, inert. Closed by default;
`default-expanded` starts open. Fires `acme-toggle` (`detail.open`) on a click and `acme-expand`
when it opens. Inside an `acme-collapse-group` the group drives `open`: one panel at a time
unless the group is `multiple`, and a `default-expanded` panel cannot close itself
(its trigger reads aria-disabled while open).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `title` | `title` | `string` | `""` | The Title Case topic name in the trigger. |
| `default-expanded` | `defaultExpanded` | `boolean` | `false` | Starts open. |
| `size` | `size` | `"medium" \| "small"` | `"medium"` |  |
| `open` | `open` | `boolean` | `false` | Whether the panel is open; reflects. |
| — | `group` | `AcmeCollapseGroup \| null` | `null` | The group this panel belongs to, set by the group; the group then owns `open`. |

Slots: `title`, `(default)`

Events: `acme-toggle`, `acme-expand`

## `<acme-collapse-group>`

Collapse group. A stack of `acme-collapse` under one shared top border. One panel is open at
a time (opening one closes the other) unless `multiple`; a click on an open panel closes it.
While nothing has been chosen, the panels show their own `default-expanded` state, and a
`default-expanded` panel cannot close itself.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `multiple` | `multiple` | `boolean` | `false` | Lets several panels stay open at once. |

Slots: `(default)`

## Best Practices

**When to use**

- Collapse holds optional, advanced or repetitive content most readers skip: an FAQ, advanced settings, a request payload.
- Content every reader needs is a page section with a normal heading; a collapsed primary section hides what the page is about.
- One Collapse for one optional block; a group for a related set; Tabs when the items are sibling views rather than optional detail.

**Behavior**

- Closed by default, unless a first-time visitor has to read the content to act.
- In a group, one panel open at a time when the items exclude each other; several when they are independent.
- The open and close transition animates; a jump cut makes the page feel like it teleported.
- One level of nesting at most; a second level hides too much and breaks the tab order.

**Content**

- The heading is Title Case and names the topic, not the action: Advanced Settings, not Show Advanced Settings.
- The body is sentence case prose with normal section formatting: a small page, not a tooltip.
- A primary destructive action stays out of a closed Collapse; two clicks to reach a warning is one too many.

**Accessibility**

- The trigger is a button with aria-expanded that flips on toggle and aria-controls that names the panel.
- Enter and Space toggle; no other key is bound globally, and arrow keys move through the panel content.
- The panel content stays in the DOM when closed, so find-in-page still reaches it; render lazily only when the content is expensive.

