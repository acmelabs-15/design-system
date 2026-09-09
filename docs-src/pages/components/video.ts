// Docs page: Video — mirrors https://vercel.com/geist/video
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "video",
  title: "Video",
  lede: "Embed a video with playback controls and lazy loading.",
  tags: ["acme-video"],
  examples: [
    {
      h: "Default",
      p: "With a src the element renders the player; the control bar floats over the frame.",
      html: `<acme-video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" style="display:block;max-width:600px"></acme-video>`,
    },
    {
      h: "No controls",
      html: `<acme-video controls="false" autoplay src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" style="display:block;max-width:600px"></acme-video>`,
    },
  ],
  practices: {
    "When to use": ["Marketing and docs video with loop, controls and lazy loading; honor reduced motion with a paused poster."],
  },
};
