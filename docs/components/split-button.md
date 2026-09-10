# Split Button

A button with one primary action and a dropdown menu of further actions.

## Default

The primary action is also the first item in the menu.

```html
<div class="vstack" style="gap:32px;align-items:flex-start">
  <div class="row" style="gap:16px;align-items:stretch;flex-wrap:nowrap">
    <acme-split-button variant="primary" size="small" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="primary" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="primary" size="large" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
    </acme-split-button>
  </div>
  <div class="row" style="gap:16px;align-items:stretch;flex-wrap:nowrap">
    <acme-split-button variant="secondary" size="small" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="secondary" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="secondary" size="large" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
    </acme-split-button>
  </div>
</div>
<script>for (const b of root.querySelectorAll('acme-split-button')) { b.addEventListener('acme-click', () => alert('Clicked Saved')); b.addEventListener('acme-select', e => alert('Clicked ' + e.target.textContent.trim())); }</script>
```

## Menu Alignment

```html
<div class="row" style="gap:32px;align-items:flex-start">
  <acme-split-button variant="primary" menu-button-label="Select save method" menu-width="264">
    Save
    <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
    <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
  </acme-split-button>
  <acme-split-button menu-alignment="bottom-end" menu-button-label="Select save method" menu-width="264">
    Save
    <acme-split-button-item slot="items" description="Save changes">Save</acme-split-button-item>
    <acme-split-button-item slot="items" description="Save changes and create a new production deployment">Save + Redeploy</acme-split-button-item>
  </acme-split-button>
</div>
<script>for (const b of root.querySelectorAll('acme-split-button')) { b.addEventListener('acme-click', () => alert('Clicked Saved')); b.addEventListener('acme-select', e => alert('Clicked ' + e.target.textContent.trim())); }</script>
```

## Icon

```html
<acme-split-button variant="secondary" size="small" menu-button-label="Copy page" menu-width="240">
  Copy page
  <acme-split-button-item slot="items" description="Open this page in v0">
    <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
      <use href="#i-v0"/>
    </svg>
    Open in v0
  </acme-split-button-item>
  <acme-split-button-item slot="items" description="Open this page in ChatGPT">
    <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
      <use href="#i-openai"/>
    </svg>
    Open in ChatGPT
  </acme-split-button-item>
</acme-split-button>
<script>const b = root.querySelector('acme-split-button'); b.addEventListener('acme-click', () => console.log('Copy page')); b.addEventListener('acme-select', e => console.log(e.target.textContent.trim()));</script>
```

## Title with Icon

```html
<div class="vstack" style="gap:32px;align-items:flex-start">
  <div class="row" style="gap:4px;align-items:stretch;flex-wrap:nowrap">
    <acme-split-button variant="primary" size="small" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-floppy"/>
        </svg>
        Save
      </acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-arrow-circle-up"/>
        </svg>
        Save + Redeploy
      </acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="primary" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-floppy"/>
        </svg>
        Save
      </acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-arrow-circle-up"/>
        </svg>
        Save + Redeploy
      </acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="primary" size="large" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-floppy"/>
        </svg>
        Save
      </acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-arrow-circle-up"/>
        </svg>
        Save + Redeploy
      </acme-split-button-item>
    </acme-split-button>
  </div>
  <div class="row" style="gap:4px;align-items:stretch;flex-wrap:nowrap">
    <acme-split-button variant="secondary" size="small" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-floppy"/>
        </svg>
        Save
      </acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-arrow-circle-up"/>
        </svg>
        Save + Redeploy
      </acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="secondary" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-floppy"/>
        </svg>
        Save
      </acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-arrow-circle-up"/>
        </svg>
        Save + Redeploy
      </acme-split-button-item>
    </acme-split-button>
    <acme-split-button variant="secondary" size="large" menu-button-label="Select save method" menu-width="264">
      Save
      <acme-split-button-item slot="items" description="Save changes">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-floppy"/>
        </svg>
        Save
      </acme-split-button-item>
      <acme-split-button-item slot="items" description="Save changes and create a new production deployment">
        <svg class="ic" width="18" height="18" style="width:18px;height:18px" slot="icon" aria-hidden="true">
          <use href="#i-arrow-circle-up"/>
        </svg>
        Save + Redeploy
      </acme-split-button-item>
    </acme-split-button>
  </div>
</div>
<script>for (const b of root.querySelectorAll('acme-split-button')) { b.addEventListener('acme-click', () => alert('Clicked Saved')); b.addEventListener('acme-select', e => alert('Clicked ' + e.target.textContent.trim())); }</script>
```

## `<acme-split-button>`

Split button. The primary action (the default slot) joined to a chevron button that opens a
menu of `acme-split-button-item` rows (slot `items`): two composed `acme-button`s of one
variant (default or secondary) and size (32 / 36 / 40) with a hairline divider between them.
The menu opens under the split button, its start under the primary button
(`menu-alignment="bottom-start"`) or its end under the chevron (`bottom-end`), `menu-width`
wide; it fades out over 150ms. A click on the primary button fires `acme-click`; an item fires
`acme-select` and closes the menu. The chevron button is named by `menu-button-label`. Keys:
Down opens; in the menu Up and Down move, Home and End jump, Escape closes and returns focus,
Tab closes; a click outside closes.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `"default" \| "primary" \| "secondary"` | `"default"` | `default` (the primary look; `primary` is accepted) or `secondary`. |
| `size` | `size` | `"small" \| "medium" \| "large"` | `"medium"` |  |
| `type` | `type` | `"button" \| "submit" \| "reset"` | `"button"` | The primary button's HTML type. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `menu-button-label` | `menuButtonLabel` | `string` | `"More options"` | The chevron button's accessible name: a sentence naming the action set ("Select save method"). |
| `menu-alignment` | `menuAlignment` | `"bottom-start" \| "bottom-end"` | `"bottom-start"` | `bottom-start` under the primary button (default) or `bottom-end` under the chevron. |
| `menu-width` | `menuWidth` | `number` | `150` | The menu's width in px. |
| `open` | `open` | `boolean` | `false` |  |

Slots: `(default)`, `items`

Events: `acme-click`

## `<acme-split-button-item>`

One row of a split button's menu: the title (Title Case, Verb + Noun) in the default slot,
an 18px `icon` before it, and a `description` below in gray-900. A menu item row that
highlights on hover and keyboard focus; Enter, Space or a click select it. Fires `acme-select`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `description` | `description` | `string` | `""` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |

Slots: `icon`, `(default)`

Events: `acme-select`

## Best Practices

- Use a Split Button when one action is the clear default and one to four close variants belong next to it, like Deploy with Deploy to Preview. Unrelated actions go in a Menu.
- Repeat the primary action as the first menu item so keyboard and screen-reader users see the same options. The visible label and the first item match exactly.
- Only primary and secondary are allowed. The destructive variants are blocked on purpose: a delete hidden in a dropdown is a sharp edge.
- Every item label is Title Case, Verb + Noun: Deploy to Production, Promote to Production, Rollback Deployment. Destructive items sit at the bottom behind a divider.
- Set menu-button-label to a sentence that names the action set, like More deploy options. It becomes the aria-label of the chevron button and is the only label a screen reader hears for it.
- The default menu-alignment="bottom-start" puts the menu under the primary button. Use bottom-end only when the button sits flush with the right edge of its container.

