# Avatar

An avatar stands for one user or team. A stack of avatars stands for a group of people.

## Group

```html
<div class="row" style="gap:16px">
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' size="32"></acme-avatar-group>
  <acme-avatar-group limit="4" members='[{"username":"christopherkindl"},{"username":"rauno"},{"username":"shuding"},{"username":"skllcrn"},{"username":"almonk"}]' size="32"></acme-avatar-group>
</div>
```

## Stacking order

The first member sits on top of the stack, so the first credited author stays the most visible. Add reverse to put the last member on top. The left-to-right order does not change.

```html
<div class="row" style="gap:16px">
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' size="32"></acme-avatar-group>
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' reverse size="32"></acme-avatar-group>
</div>
```

## Overlap

With overlap="auto" (the default) the spacing scales with the size, so the cluster stays even at any size.

```html
<div class="row" style="gap:24px">
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="auto" size="16"></acme-avatar-group>
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="auto" size="24"></acme-avatar-group>
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="auto" size="32"></acme-avatar-group>
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="auto" size="48"></acme-avatar-group>
</div>
```

## Fixed overlap

A number sets the overlap in pixels. A low value spreads the members out; a high value packs them tight for dense UI.

```html
<div class="row" style="gap:16px">
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="10" size="24"></acme-avatar-group>
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="6" size="24"></acme-avatar-group>
  <acme-avatar-group members='[{"username":"evilrabbit"},{"username":"severinlandolt"},{"username":"rauchg"}]' overlap="0" size="24"></acme-avatar-group>
</div>
```

## Size

```html
<div class="row" style="gap:16px">
  <acme-avatar size="24" username="evilrabbit"></acme-avatar>
  <acme-avatar size="32" username="evilrabbit"></acme-avatar>
  <acme-avatar size="48" username="evilrabbit"></acme-avatar>
</div>
```

## Git

```html
<div class="row" style="gap:16px">
  <acme-avatar git="github" size="32" username="rauchg"></acme-avatar>
  <acme-avatar git="gitlab" size="32" username="severinlandolt"></acme-avatar>
  <acme-avatar git="bitbucket" size="32" username="evilrabbit"></acme-avatar>
</div>
```

## With custom icon

```html
<div class="row" style="gap:16px">
  <acme-avatar size="32" icon-background>
    <svg slot="icon" width="14" height="14" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ds-gray-900)" aria-hidden="true">
      <use href="#i-arrow-circle-down" fill="none"/>
    </svg>
  </acme-avatar>
  <acme-avatar size="32" icon-background>
    <svg slot="icon" width="14" height="14" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ds-gray-900)" aria-hidden="true">
      <use href="#i-check-circle-fill" fill="none"/>
    </svg>
  </acme-avatar>
  <acme-avatar size="32" icon-background>
    <svg slot="icon" width="14" height="14" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ds-gray-900)" aria-hidden="true">
      <use href="#i-clock-dashed" fill="none"/>
    </svg>
  </acme-avatar>
</div>
```

## Letter

```html
<div class="row" style="gap:16px">
  <acme-avatar letter="SL" placeholder size="32"></acme-avatar>
  <acme-avatar letter="EK" placeholder size="32"></acme-avatar>
  <acme-avatar letter="CK" placeholder size="32"></acme-avatar>
</div>
```

## Placeholder

```html
<acme-avatar placeholder size="90"></acme-avatar>
```

## `<acme-avatar>`

Avatar: a round image for one user or team, `--size` wide. The root carries `data-mask` (the
round mask and hairline ring; `mask="false"` gives a 6px radius and no ring) and `data-resolved`
(false until the image has loaded: a shimmer fills the disc meanwhile). Content is the image
(`src`, or the avatar of `username`), or one or two `letter`s on a gray disc, or nothing for the
`placeholder` shell. `git` adds a 14px service dot at the bottom left with the provider's mark;
an `icon` slot puts a custom icon in that dot; `icon-background` marks the dot's white disc.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `src` | `src` | `string` | `""` | Image source; wins over `username`. |
| `username` | `username` | `string` | `""` | The username whose avatar image is shown. |
| `letter` | `letter` | `string` | `""` | One or two uppercase letters shown instead of an image. |
| `size` | `size` | `string \| number` | `32` | Pixels: 16, 24, 32, 48, 64, 90 … |
| `placeholder` | `placeholder` | `boolean` | `false` | The loading shell: the shimmering disc with no content. |
| `title` | `title` | `string` | `""` | The entity name for assistive tech (`Jane Doe`, `Acme Inc.`); unset, a username reads as `Avatar for <username>`. |
| `mask` | `mask` | `boolean` | `true` | `mask="false"` drops the round mask and the ring for a 6px radius. |
| `git` | `git` | `AvatarService` | `""` | A 14px service dot at the bottom left with the provider's mark; GitHub images come from GitHub. |
| `icon-background` | `iconBackground` | `boolean` | `false` | Marks the dot's white disc with a 1px border. |

Slots: `icon`

## `<acme-avatar-group>`

Avatar group: a stack of avatars, each in a wrapper with a 1px ring in the page background,
overlapping by `--avatar-overlap`. The first `limit - 1` members show plainly; the last slot
holds the next member and, when more than one is hidden (or `extra` says so), a small
"+N" counter on a dark disc. The first member sits on top unless `reverse`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `members` | `members` | `AvatarMember[]` | `[]` | The members, in order: `[{ "username": "rauchg" }, { "src": "…", "title": "…" }, { "letter": "SL" }]`. |
| `size` | `size` | `number` | `24` | Each avatar's size in px. |
| `limit` | `limit` | `number` | `3` | Slots in the stack, the last one for the hidden count; 0 shows every member. |
| `extra` | `extra` | `number` | `0` | Members counted as hidden beyond the list. |
| `reverse` | `reverse` | `boolean` | `false` | Stacks the last member on top instead of the first. |
| `overlap` | `overlap` | `"auto" \| number \| string` | `"auto"` | `auto` scales the overlap with `size` (30%); a number sets it in px. |
| `show-icon` | `showIcon` | `boolean` | `false` | Shows a member's service dot. |
| `icon-background` | `iconBackground` | `boolean` | `true` | `icon-background="false"` drops the white disc behind a service mark. |

## Best Practices

- One acme-avatar for one person, team or organization. Two or more stacked avatars go in an acme-avatar-group, which sets the overlap, the size and one accessible label.
- Give src first and fall back to letter (one or two uppercase characters) when there is no image. placeholder is the loading shell, never a lasting fallback.
- entity holds the plain name (Acme Inc., Jane Doe). A letter avatar already announces "Avatar with initials:", so do not write "Avatar of …" yourself.
- Keep letter uppercase and taken from the entity name. No emoji, no punctuation, no question mark.
- Match the size to the type beside it: 20–24px next to label-14, 32px next to label-16, 48–64px in headers and onboarding states.

