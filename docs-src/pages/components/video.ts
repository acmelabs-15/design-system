// Docs page: Video — mirrors https://vercel.com/geist/video
import type { Doc } from "../../site";

const SRC = "https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4";
const video = (extra = "") => `<acme-video height="582" lazy="false" src="${SRC}" width="600"${extra}></acme-video>`;
/** Marks the video as playable so the bar renders before (or without) the source loading. */
const loaded = `const el = root.querySelector('acme-video');
el.updateComplete.then(() => {
  const v = el.shadowRoot.querySelector('video');
  Object.defineProperty(v, 'readyState', { value: 4 });
  v.dispatchEvent(new Event('loadeddata'));`;

export const doc: Doc = {
  id: "video",
  title: "Video",
  lede: "Embed a video with built-in playback controls and lazy loading support.",
  tags: ["acme-video"],
  examples: [
    { h: "Default", html: video() },
    { h: "No Loop", html: video(' loop="false"') },
    { h: "No Controls", html: video(' controls="false"') },
    {
      h: "Controls", census: true,
      p: "The bar once the video can play: 48px, 85% wide, 5% above the bottom, transparent until the pointer moves over the player. Play, the elapsed time, the scrubber and the duration.",
      html: video(),
      script: `${loaded}
});`,
    },
    {
      h: "Controls visible", census: true,
      p: "While the pointer moves over the player the bar is opaque and lifted 6px; it hides three seconds after the last move, or when the pointer leaves. Here the video is playing.",
      html: video(),
      script: `${loaded}
  v.dispatchEvent(new Event('play'));
  const figure = el.shadowRoot.querySelector('figure');
  figure.dispatchEvent(new MouseEvent('mouseenter'));
  setInterval(() => figure.dispatchEvent(new MouseEvent('mousemove')), 2000);
});`,
    },
    {
      h: "Rounded", census: true,
      p: "border-radius rounds the video box by the radius token.",
      html: video(" border-radius"),
    },
  ],
};
