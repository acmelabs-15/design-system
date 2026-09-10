# Description

A brief heading and subheading that give the reader the context they need to continue.

## Default

```html
<acme-description content="Data about this section." title="Section Title" tooltip="Additional context about what this section refers to."></acme-description>
```

## Text right

```html
<acme-description content="Data about this section." right title="Section Title" tooltip="Additional context about what this section refers to."></acme-description>
```

## Ellipsis

```html
<acme-description content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem." ellipsis title="Section Title" tooltip="Additional context about what this section refers to."></acme-description>
```

## `<acme-description>`

Description: a definition list of one Title Case key (dt, 14px gray-900, capitalized) and its
value (dd, 14/16 500 gray-1000). `tooltip` adds a 14px info icon after the key, wrapped in a
tooltip that opens on hover or keyboard focus; `right` aligns the text right; `ellipsis`
truncates both lines.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `title` | `title` | `string` | `""` | The Title Case key. |
| `content` | `content` | `string` | `""` | The value; the default slot carries richer content. |
| `right` | `right` | `boolean` | `false` |  |
| `ellipsis` | `ellipsis` | `boolean` | `false` |  |
| `tooltip` | `tooltip` | `string` | `""` | One sentence shown on the info icon after the key. |

Slots: `(default)`

## Best Practices

- A Description is definition-list metadata: a short Title Case key with one value (Last Deployed, Region, Plan). Inline help under a form field is the input's helper text.
- It renders dl, dt and dd, so a screen reader announces each key and value as a definition; extra paragraphs around it break that.
- The title is a Title Case noun (Last Deployed, Build Duration); the content is sentence case unless the value is a literal identifier, ID or timestamp, which stays verbatim.
- A tooltip only when the title alone is ambiguous and one sentence settles it; the tooltip text is sentence case and ends with a period.
- No interactive control in the title: buttons, menus and links go in the content (dd) or the parent layout, never the label (dt).

