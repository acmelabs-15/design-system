# File Tree

Display a hierarchical directory structure with expandable folders and files, useful for illustrating project layouts.

## Default

```html
<acme-file-tree>
  <acme-folder name=".vercel" default-open>
    <acme-folder name="output" default-open>
      <acme-folder name="functions" default-open>
        <acme-folder name="edge.func" default-open>
          <acme-file name=".vc-config.json" href="/"></acme-file>
          <acme-file name="index.js"></acme-file>
        </acme-folder>
      </acme-folder>
    </acme-folder>
  </acme-folder>
  <acme-folder name="app">
    <acme-file name="main.tsx" type="edge-function"></acme-file>
    <acme-file name="dashboard.tsx" type="lambda"></acme-file>
    <acme-file name="dashboard.tsx" type="middleware"></acme-file>
  </acme-folder>
</acme-file-tree>
```

## `<acme-file-tree>`

File tree. A 13px column of rows, 1px apart: `acme-folder` and `acme-file` elements nested in
the default slot, each row indented one 23px guide per folder level above it. `card` puts the
tree in a padded card: the page background, the smallest shadow, radius 8, padding 24 and 16px
text.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `card` | `card` | `boolean` | `false` | Renders the tree as a card: page background, the smallest shadow, radius 8, padding 24, 16px text. |

Slots: `(default)`

## `<acme-folder>`

Folder row of a file tree. A 28px full-width toggle button holds one indent guide per folder
level above, the folder icon (open or closed) and the mono name; open, the folder renders its
rows (`acme-folder` and `acme-file` elements in the default slot), closed it renders none.
Closed by default; `default-open` starts open and `open` is the live state (set it to drive the
folder). A click flips `open` and fires `acme-toggle` (`detail.open`, `detail.name`). `label`
shows in place of `name` (the `label` slot holds rich content); the row's tooltip is that text.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `name` | `name` | `string` | `""` | The folder's name: its text and tooltip. |
| `label` | `label` | `string` | `""` | Shown in place of `name` when set. |
| `default-open` | `defaultOpen` | `boolean` | `false` | Starts open. |
| `open` | `open` | `boolean` | `false` | Whether the folder shows its rows; reflects. |

Slots: `label`, `(default)`

Events: `acme-toggle`

## `<acme-file>`

File row of a file tree. A 28px line with one indent guide per folder level above and a
full-width link holding the kind's 14px icon and the mono name. `href` makes the link navigate;
without it the row is a plain anchor. `active` marks the current file: semibold name, gray-1000
icon. `type` picks the icon (file, lambda, edge-function, middleware); `show-icon="false"` hides
it. `label` shows in place of `name` (the `label` slot holds rich content); the row's tooltip is
that text. A click bubbles out as a plain `click` event.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `name` | `name` | `string` | `""` | The file's name: its text and tooltip. |
| `label` | `label` | `string` | `""` | Shown in place of `name` when set. |
| `href` | `href` | `string` | `""` | The link's target; without it the row does not navigate. |
| `active` | `active` | `boolean` | `false` | The current file: semibold name, gray-1000 icon. |
| `type` | `type` | `FileType` | `"file"` | The icon: file, lambda, edge-function or middleware. |
| `show-icon` | `showIcon` | `boolean` | `true` | `show-icon="false"` hides the icon. |

Slots: `label`

