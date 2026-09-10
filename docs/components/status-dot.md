# Status Dot

Display an indicator of deployment status.

## Default

```html
<div class="vstack" style="gap:24px">
  <acme-status-dot state="QUEUED"></acme-status-dot>
  <acme-status-dot state="BUILDING"></acme-status-dot>
  <acme-status-dot state="ERROR"></acme-status-dot>
  <acme-status-dot state="READY"></acme-status-dot>
  <acme-status-dot state="CANCELED"></acme-status-dot>
</div>
```

## Label

```html
<div class="vstack" style="gap:24px">
  <acme-status-dot label state="QUEUED"></acme-status-dot>
  <acme-status-dot label state="BUILDING"></acme-status-dot>
  <acme-status-dot label state="ERROR"></acme-status-dot>
  <acme-status-dot label state="READY"></acme-status-dot>
  <acme-status-dot label state="CANCELED"></acme-status-dot>
</div>
```

## `<acme-status-dot>`

Status dot: the deployment lifecycle as a 10px dot. The root carries the state class, an
`aria-label` with the short state name and a `title` with the state sentence; the dot is a
child span; with `label` the state name follows the dot as text. Queued, canceled and deleted
share the neutral colour; building is the warning colour, ready the cyan, error the error red.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `state` | `state` | `DeployState` | `"QUEUED"` | QUEUED · BUILDING · READY · ERROR · CANCELED · DELETED (lower case is accepted). |
| `label` | `label` | `boolean` | `false` | Shows the state name after the dot. |

## Best Practices

**When to use**

- Deployment lifecycle only. state takes QUEUED, BUILDING, READY, ERROR, CANCELED or DELETED.
- Other statuses (workflow runs, queue messages, sandboxes, cron jobs) use a Badge with the canonical state words, not a repurposed dot.
- A health summary with a number (uptime, hit rate) is a Gauge; in-flight work with a known total is a Progress.

**Behavior**

- The dot changes colour with the state and goes neutral in a terminal state. Do not add a spinner next to it.
- Update the colour only when the ready state changes, not on every polling tick.
- Add a Relative Time Card when timing matters (Building · 12s ago); the dot alone says nothing about duration.

**Content**

- The title is a fixed sentence per state ("This deployment is building."). In a list, name the entity in the row text next to the dot.
- Use label only when the dot stands alone; the element sentence-cases the state for you (Building, Ready, Error).
- Do not wrap the dot in prose such as "Status: Ready". The label already names the state.

**Accessibility**

- The element sets its own aria-label (the state name) and title (the state sentence); do not replace them with a generic "status".
- When the dot sits next to text that already names the state, mark it aria-hidden so it is not read twice.
- Color is not the only signal: every state has its own title and label, so colorblind users get the same information.

