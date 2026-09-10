# Video

Embed a video with built-in playback controls and lazy loading support.

## Default

```html
<acme-video height="582" lazy="false" src="https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4" width="600"></acme-video>
```

## No Loop

```html
<acme-video height="582" lazy="false" src="https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4" width="600" loop="false"></acme-video>
```

## No Controls

```html
<acme-video height="582" lazy="false" src="https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4" width="600" controls="false"></acme-video>
```

## `<acme-video>`

Video player. A figure (role region, "Video player") with `margin` above and below, holding a
centred box `width` wide (capped at 950px and at the container) whose frame keeps the
`width`:`height` ratio; the video fills the frame and a click on it plays or pauses. The control
bar appears once the video can play: a 48px bar 5% above the bottom, 85% wide, transparent until
the pointer moves over the player, opaque and lifted 6px while it does (it hides three seconds
after the last move, or when the pointer leaves; below 992px it stays flat). The bar holds the
play/pause button, the elapsed time, the scrubber (a drag area over the progress bar; release
seeks) and the duration. The video is muted and plays inline by default, autoplays unless the
user prefers reduced motion, and with `loop` restarts twice after its first play, then stops.
`lazy` defers the source until the frame comes within 20% of the viewport. `acme-play` fires
whenever playback starts, with the source in `detail.src`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `src` | `src` | `string` | `""` | The video URL. |
| `width` | `width` | `number` | `600` | Intrinsic width in px: the box is this wide, capped at 950px and at the container. |
| `height` | `height` | `number` | `0` | Intrinsic height in px: with `width`, the aspect ratio the frame keeps. |
| `margin` | `margin` | `number \| string` | `40` | Vertical margin around the player: a number in px, or a CSS length. |
| `border-radius` | `borderRadius` | `boolean` | `false` | Rounds the video box by the radius token. |
| `controls` | `controls` | `boolean` | `true` | `controls="false"` leaves the control bar out. |
| `plays-inline` | `playsInline` | `boolean` | `true` | `plays-inline="false"` lets a phone open the video full screen. |
| `lazy` | `lazy` | `boolean` | `true` | `lazy="false"` loads the source at once instead of when the frame nears the viewport. |
| `muted` | `muted` | `boolean` | `true` | `muted="false"` plays the sound. |
| `autoplay` | `autoplay` | `` | `!reduced()` | `autoplay="false"` waits for Play. The default follows the user's motion preference. |
| `preload` | `preload` | `"auto" \| "metadata" \| "none"` | `"auto"` | The video's preload hint. |
| `max-width` | `maxWidth` | `number \| string` | `""` | Caps the figure's width: a number in px, or a CSS length. |
| `loop` | `loop` | `boolean` | `true` | `loop="false"` plays once. |

Events: `acme-play`

