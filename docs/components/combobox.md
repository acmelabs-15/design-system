# Combobox

Filters a large list down to the options that match what the user types.

## Uncontrolled

```html
<acme-combobox aria-label="Search" placeholder="Search...">
  <acme-combobox-option value="a">One</acme-combobox-option>
  <acme-combobox-option value="b">Two</acme-combobox-option>
  <acme-combobox-option value="c">Three</acme-combobox-option>
</acme-combobox>
```

## Controlled

```html
<acme-combobox aria-label="Search" placeholder="Search..." value="b">
  <acme-combobox-option value="a">One</acme-combobox-option>
  <acme-combobox-option value="b">Two</acme-combobox-option>
  <acme-combobox-option value="c">Three</acme-combobox-option>
</acme-combobox>
<script>const combobox = root.querySelector('acme-combobox'); combobox.addEventListener('acme-change', (e) => { combobox.value = e.detail.value ?? ''; });</script>
```

## Disabled

```html
<acme-combobox aria-label="Search" disabled placeholder="Search...">
  <acme-combobox-option value="a">One</acme-combobox-option>
  <acme-combobox-option value="b">Two</acme-combobox-option>
  <acme-combobox-option value="c">Three</acme-combobox-option>
</acme-combobox>
```

## Errored

```html
<acme-combobox aria-label="Search" errored placeholder="Search...">
  <acme-combobox-option value="a">One</acme-combobox-option>
  <acme-combobox-option value="b">Two</acme-combobox-option>
  <acme-combobox-option value="c">Three</acme-combobox-option>
</acme-combobox>
```

## Custom width input

```html
<acme-combobox aria-label="Search" placeholder="Search..." width="256">
  <acme-combobox-option value="a">One</acme-combobox-option>
  <acme-combobox-option value="b">Two</acme-combobox-option>
  <acme-combobox-option value="c">Three</acme-combobox-option>
</acme-combobox>
```

## Custom width list

```html
<acme-combobox aria-label="Search" placeholder="Search..." list-max-width="500">
  <acme-combobox-option value="a">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</acme-combobox-option>
  <acme-combobox-option value="b">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</acme-combobox-option>
  <acme-combobox-option value="c">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</acme-combobox-option>
</acme-combobox>
```

## Custom empty message

```html
<acme-combobox aria-label="Search" placeholder="Search..." width="256" empty-message="Nothing to see here..."></acme-combobox>
```

## Clearable

Set `clearable` to show a clear button once a value is selected.

```html
<acme-combobox aria-label="Search" clearable placeholder="Search..." value="two">
  <acme-combobox-option value="one">one</acme-combobox-option>
  <acme-combobox-option value="two">two</acme-combobox-option>
  <acme-combobox-option value="three">three</acme-combobox-option>
</acme-combobox>
```

## With prefix icons

```html
<acme-combobox aria-label="Search" placeholder="Search..." style="width:fit-content">
  <acme-combobox-option value="a">
    <svg viewBox="0 0 16 16" width="16" height="16" slot="start" fill="none" style="color:currentColor" aria-hidden="true">
      <path fill="currentColor" d="M8 1 16 15H0L8 1Z"/>
    </svg>
    One
  </acme-combobox-option>
  <acme-combobox-option value="b">
    <svg viewBox="0 0 16 16" width="16" height="16" slot="start" fill="none" style="color:currentColor" aria-hidden="true">
      <path fill="currentColor" d="M8 1 16 15H0L8 1Z"/>
    </svg>
    Two
  </acme-combobox-option>
  <acme-combobox-option value="c">
    <svg viewBox="0 0 16 16" width="16" height="16" slot="start" fill="none" style="color:currentColor" aria-hidden="true">
      <path fill="currentColor" d="M8 1 16 15H0L8 1Z"/>
    </svg>
    Three
  </acme-combobox-option>
</acme-combobox>
```

## With suffix icons

```html
<acme-combobox aria-label="Search" placeholder="Search..." style="width:fit-content">
  <acme-combobox-option value="a">
    <svg viewBox="0 0 16 16" width="16" height="16" slot="end" fill="none" style="color:currentColor" aria-hidden="true">
      <path fill="currentColor" d="M8 1 16 15H0L8 1Z"/>
    </svg>
    One
  </acme-combobox-option>
  <acme-combobox-option value="b">
    <svg viewBox="0 0 16 16" width="16" height="16" slot="end" fill="none" style="color:currentColor" aria-hidden="true">
      <path fill="currentColor" d="M8 1 16 15H0L8 1Z"/>
    </svg>
    Two
  </acme-combobox-option>
  <acme-combobox-option value="c">
    <svg viewBox="0 0 16 16" width="16" height="16" slot="end" fill="none" style="color:currentColor" aria-hidden="true">
      <path fill="currentColor" d="M8 1 16 15H0L8 1Z"/>
    </svg>
    Three
  </acme-combobox-option>
</acme-combobox>
```

## With label

```html
<div class="vstack" style="gap:8px">
  <label class="text-label-14" style="color:var(--ds-gray-900)" for="combobox-country">Select your country</label>
  <acme-combobox aria-label="Select your country" id="combobox-country" placeholder="Search countries…">
    <acme-combobox-option value="us">United States</acme-combobox-option>
    <acme-combobox-option value="ca">Canada</acme-combobox-option>
    <acme-combobox-option value="uk">United Kingdom</acme-combobox-option>
    <acme-combobox-option value="de">Germany</acme-combobox-option>
    <acme-combobox-option value="fr">France</acme-combobox-option>
    <acme-combobox-option value="jp">Japan</acme-combobox-option>
    <acme-combobox-option value="au">Australia</acme-combobox-option>
    <acme-combobox-option value="br">Brazil</acme-combobox-option>
  </acme-combobox>
</div>
```

## Sizes

```html
<div class="row-md" style="gap:16px;align-items:stretch">
  <acme-combobox aria-label="Search" placeholder="Search..." size="small">
    <acme-combobox-option value="a">One</acme-combobox-option>
    <acme-combobox-option value="b">Two</acme-combobox-option>
    <acme-combobox-option value="c">Three</acme-combobox-option>
  </acme-combobox>
  <acme-combobox aria-label="Search" placeholder="Search...">
    <acme-combobox-option value="a">One</acme-combobox-option>
    <acme-combobox-option value="b">Two</acme-combobox-option>
    <acme-combobox-option value="c">Three</acme-combobox-option>
  </acme-combobox>
  <acme-combobox aria-label="Search" placeholder="Search..." size="large">
    <acme-combobox-option value="a">One</acme-combobox-option>
    <acme-combobox-option value="b">Two</acme-combobox-option>
    <acme-combobox-option value="c">Three</acme-combobox-option>
  </acme-combobox>
</div>
```

## Used inside a Modal

A Combobox often sits inside a Modal. On mobile the Modal becomes a bottom sheet by itself.

```html
<div class="row" style="gap:16px">
  <acme-button size="small">Open Modal</acme-button>
  <acme-modal heading="Create Token">
    <p slot="subtitle">Enter a unique name for your token to differentiate it from other tokens and then select the scope.</p>
    <acme-modal-inset>
      <div class="vstack" style="gap:10px">
        <acme-label>Region</acme-label>
        <acme-combobox aria-label="Region" placeholder="Search..." size="small">
          <acme-combobox-option value="a">One</acme-combobox-option>
          <acme-combobox-option value="b">Two</acme-combobox-option>
          <acme-combobox-option value="c">Three</acme-combobox-option>
        </acme-combobox>
        <p class="text-copy-13" style="color:var(--ds-gray-900)">This is the region where your database reads and writes will take place.</p>
      </div>
    </acme-modal-inset>
    <acme-button slot="actions" variant="secondary">Cancel</acme-button>
    <acme-button slot="actions">Submit</acme-button>
  </acme-modal>
</div>
<script>const modal = root.querySelector('acme-modal'); root.querySelector('acme-button').addEventListener('click', () => modal.show()); for (const action of modal.querySelectorAll('[slot=actions]')) action.addEventListener('click', () => modal.close());</script>
```

## Inside a Sheet with multi-line options

An option opts out of the fixed row height with `ignore-default-height` and renders multi-line content, such as a shared environment variable name with its target. The list sizes each row to its content and still scrolls.

```html
<acme-button size="small">Link Shared Variable</acme-button>
<acme-sheet heading="Link Shared Variable">
  <p slot="header" class="text-copy-14 muted">Changes to shared variables sync automatically across all linked projects.</p>
  <acme-combobox aria-label="Search for shared environment variables" placeholder="Search for shared environment variables…">
    <acme-combobox-option ignore-default-height value="CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID::Preview and Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview and Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="EXTENSION_AUTH_JWT_SECRET::Development">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">EXTENSION_AUTH_JWT_SECRET</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Development</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="SCREENSHOT_SECRET_DEPLOYMENT_SUMMARY::failover">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">SCREENSHOT_SECRET_DEPLOYMENT_SUMMARY</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">failover</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="FLAGS_VERCEL_MARKETING::Preview and Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">FLAGS_VERCEL_MARKETING</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview and Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="FLAGS_VERCEL_MARKETING::Development">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">FLAGS_VERCEL_MARKETING</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Development</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="FLAGS_VERCEL_MARKETING::Preview">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">FLAGS_VERCEL_MARKETING</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="DATABASE_URL::Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">DATABASE_URL</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="REDIS_URL::Preview and Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">REDIS_URL</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview and Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="STRIPE_SECRET_KEY::Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">STRIPE_SECRET_KEY</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="STRIPE_WEBHOOK_SECRET::Development">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">STRIPE_WEBHOOK_SECRET</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Development</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="OPENAI_API_KEY::Preview and Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">OPENAI_API_KEY</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview and Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="SENTRY_AUTH_TOKEN::Preview">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">SENTRY_AUTH_TOKEN</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="NEXT_PUBLIC_ANALYTICS_ID::Development">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">NEXT_PUBLIC_ANALYTICS_ID</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Development</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="AWS_ACCESS_KEY_ID::Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">AWS_ACCESS_KEY_ID</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="AWS_SECRET_ACCESS_KEY::Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">AWS_SECRET_ACCESS_KEY</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Production</p>
      </div>
    </acme-combobox-option>
    <acme-combobox-option ignore-default-height value="GITHUB_APP_PRIVATE_KEY::Preview and Production">
      <div class="vstack" style="gap:0;padding:15px 8px">
        <p class="text-copy-14-mono" style="font-weight:500">GITHUB_APP_PRIVATE_KEY</p>
        <p class="text-label-12" style="margin-top:3px;color:var(--ds-gray-900)">Preview and Production</p>
      </div>
    </acme-combobox-option>
  </acme-combobox>
</acme-sheet>
<script>const sheet = root.querySelector('acme-sheet'); const combobox = root.querySelector('acme-combobox'); root.querySelector('acme-button').addEventListener('click', () => sheet.show()); // A chosen variable is linked: it leaves the list. combobox.addEventListener('acme-change', (e) => { const value = e.detail.value; if (!value) return; for (const option of combobox.querySelectorAll('acme-combobox-option')) if (option.value === value) option.remove(); combobox.value = ''; });</script>
```

## `<acme-combobox>`

A field that filters a list of rows (`acme-combobox-option` children) by what the user types
and takes the chosen row's value. The shell (`role="combobox"`) holds the field: a start box
with the glass (a spinner while `loading`, an icon in the `start-icon` slot, or the chosen
row's start content), the searchbox input, the clear button once the field holds text (`clearable`,
on unless `"false"`), and the menu button with its chevron (`show-menu-button="false"` drops
it); `no-input-start` drops the start box, `display-selected-end` shows the chosen row's
end content beside the field. `size` small / medium / large; `errored` reads red; `width` fixes the
field's width in px. The list floats 8px under the field in the top layer at the field's width
(`list-width` sets it, `list-max-width` lets it grow to that), five and a half rows tall at most
(`max-visible-options`), placed at `side` and `align` (`align-offset`, `collision-padding`,
`avoid-collisions="false"`, `hide-when-detached`); `empty-message` is its text when no row
matches (`hide-on-empty` hides it then), and the `footer` slot renders under the rows. The
field opens on focus, a click or Arrow Down; typing filters (match-sorter by value and label;
`filter` replaces it) and highlights the first row; the arrows move the highlight (past the
ends into the footer's control, or around), Home and End jump, Enter takes the highlighted row
(Tab too with `allow-tab`), Escape closes, a press outside or a blur closes. A chosen row's
label fills the field (`no-raw-selected-value` leaves an unknown value out); `should-continue`
keeps the list open after a choice, `no-negative-index` keeps the highlight on a row while the
footer has focus, `no-text-selection` leaves the text unselected on open, `trim-value` trims
typed text. Fires `acme-input` (typed text), `acme-change` (`detail.value`, null on clear),
`acme-clear`, `acme-open` and `acme-close`. Form-associated and labelable.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `placeholder` | `placeholder` | `string` | `""` |  |
| `value` | `value` | `string` | `""` | The chosen row's value; empty for none. |
| `name` | `name` | `string` | `""` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `errored` | `errored` | `boolean` | `false` | The field reads red and marks itself invalid. |
| `clearable` | `clearable` | `boolean` | `true` | The clear button once the field holds text; `"false"` drops it. |
| `size` | `size` | `ComboboxSize` | `"medium"` |  |
| `width` | `width` | `number` | `0` | The field's width in px. |
| `no-input-start` | `noInputStart` | `boolean` | `false` | No start box: the text starts at the field's edge. |
| `show-menu-button` | `showMenuButton` | `boolean` | `true` | The menu button with the chevron; `"false"` drops it. |
| `display-selected-end` | `displaySelectedEnd` | `boolean` | `false` | The chosen row's end content shown beside the field. |
| `no-negative-index` | `noNegativeIndex` | `boolean` | `false` | The highlight stays on a row while the footer's control has focus. |
| `no-text-selection` | `noTextSelection` | `boolean` | `false` | The text stays unselected when the field opens. |
| `allow-tab` | `allowTab` | `boolean` | `false` | Tab takes the highlighted row like Enter. |
| `should-continue` | `shouldContinue` | `boolean` | `false` | The list stays open after a choice. |
| `no-raw-selected-value` | `noRawSelectedValue` | `boolean` | `false` | A value no row carries is left out of the field. |
| `loading` | `loading` | `boolean` | `false` | A spinner replaces the glass. |
| `trim-value` | `trimValue` | `boolean` | `false` | Typed text is trimmed. |
| `autocomplete` | `autocomplete` | `string` | `"off"` |  |
| `aria-label` | `ariaLabelText` | `string` | `""` |  |
| `empty-message` | `emptyMessage` | `string` | `"No results"` | The list's text when no row matches. |
| `list-width` | `listWidth` | `number` | `0` | The list's width in px; unset, the field's. |
| `list-max-width` | `listMaxWidth` | `number` | `0` | The list may grow wider than the field, to this many px. |
| `side` | `side` | `ComboboxSide` | `"bottom"` |  |
| `align` | `align` | `ComboboxAlign` | `"center"` |  |
| `align-offset` | `alignOffset` | `number` | `0` | Offset along the aligned edge, in px. |
| `avoid-collisions` | `avoidCollisions` | `boolean` | `true` | The list flips and shifts to stay in the window; `"false"` pins it. |
| `collision-padding` | `collisionPadding` | `number` | `0` | Space kept from the window's edges when the list moves, in px. |
| `hide-on-empty` | `hideOnEmpty` | `boolean` | `false` | The list hides when no row matches. |
| `hide-when-detached` | `hideWhenDetached` | `boolean` | `false` | The list hides while the field is scrolled out of view. |
| `max-visible-options` | `maxVisibleOptions` | `number` | `VISIBLE_ROWS` | Rows shown before the list scrolls. |
| — | `filter` | `ComboboxFilter` | `defaultFilter` | Narrows the rows to the ones the typed text matches, best first. |
| `open` | `open` | `boolean` | `false` |  |

Slots: `start-icon`, `(default)`, `footer`

Events: `acme-change`, `acme-input`, `acme-clear`

## `<acme-combobox-option>`

One row of a combobox list: a 36px `option` (its content's own height with
`ignore-default-height`) with the label in the default slot, an icon in the `start` slot
before it and one in the `end` slot after it. A plain-text label truncates on one line;
other content renders as given. `value` is what the field takes; `label` is the text the filter
reads and the field shows once chosen (the row's text, or its value when the content is not
plain text), and `display-value` shows the value instead. `menu` marks a row that opens further
choices: it is never filtered out and lists after the matches; `display-last` lists a row last;
`truncate-start` and `truncate-end` truncate those slots. `disabled` fades the row and takes
no pointer. The combobox sets `active` (the row under the keys or the pointer), `chosen` (the
row whose value the field holds, with a check mark at its end when it has no end content) and
`size`. A pointer release on the row fires `acme-select` (cancelable: a handler that prevents
it takes the selection over).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |
| `label` | `label` | `string` | `""` | The text the filter reads and the field shows once chosen; unset, the row's text, or its value when the content is not plain text. |
| `display-value` | `displayValue` | `boolean` | `false` | The field shows the value, not the label, once the row is chosen. |
| `menu` | `menu` | `boolean` | `false` | A row that opens further choices: never filtered out, listed after the matches. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `ignore-default-height` | `ignoreDefaultHeight` | `boolean` | `false` | The row takes its content's height instead of the fixed row height. |
| `truncate-start` | `truncateStart` | `boolean` | `false` |  |
| `truncate-end` | `truncateEnd` | `boolean` | `false` |  |
| `display-last` | `displayLast` | `boolean` | `false` | Listed last, whatever the filter's order. |
| `active` | `active` | `boolean` | `false` | The row under the keys or the pointer; the combobox sets it. |
| `chosen` | `chosen` | `boolean` | `false` | The row whose value the field holds while the list is open; the combobox sets it. |
| `size` | `size` | `ComboboxOptionSize` | `"medium"` | The combobox's size; the combobox sets it. |

Slots: `start`, `end`, `(default)`

Events: `acme-select`

## Best Practices

**When to use**

- A Combobox is for typing to narrow a known list: regions, frameworks, environment variable names.
- A short fixed list where typing adds nothing is a Select.
- Several values at once is a Multi Select.
- A free-form filter string that maps to no single option is an Input in its search form.

**Behavior**

- Async results show a loading state; the list stays open while the request runs.
- The empty state names the query: No {items} match "{query}", not a bare No results.
- Inside a Modal the Modal turns into a bottom sheet on mobile by itself; no second layer is needed.
- Arrow keys move through the options; Enter picks an option while the list is open and never submits the form around it.

**Content**

- The visible label is a short Title Case noun (Region, Environment Variable Name).
- The placeholder is the inline hint (Search regions, DATABASE_URL): never a bare Search… and never the label again.
- Option text is Title Case for short values and follows the product's own spelling (Next.js, not NextJS), in one register across the list.
- A validation message names the field and the constraint, in sentence case with a period (Select a region.).

**Accessibility**

- The element has no label prop: pair a sibling label whose for names the element's id, or set aria-label for an icon-only trigger.
- aria-label is the only name attribute; there is no aria-labelledby, so the sibling label is the way to point at visible text.
- Inside a Modal, focus stays in the list, so Tab moves through the options and not the page behind.

