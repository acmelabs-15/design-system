// Docs page: Phone — mirrors https://vercel.com/geist/phone
import type { Doc } from "../../site";

const wrap = (inner: string) => `<div style="width:100%;max-width:320px;margin:0 auto">${inner}</div>`;

export const doc: Doc = {
  id: "phone",
  title: "Phone",
  lede: "Device chrome that frames a screenshot, a recording or other content the way a real phone would.",
  tags: ["acme-phone"],
  examples: [
    {
      h: "Composition",
      html: wrap(`<acme-phone address="https://vercel.com"></acme-phone>`),
    },
    {
      h: "Light", census: true,
      p: "The light variant: a gray-100 shell with a gray outline, for a light surrounding page.",
      html: wrap(`<acme-phone address="https://vercel.com" variant="light"></acme-phone>`),
    },
    {
      h: "Without address", census: true,
      p: "No address: the screen renders without the gradient and the navigation bar.",
      html: wrap(`<acme-phone></acme-phone>`),
    },
    {
      h: "Without notch", census: true,
      p: 'notch="false" leaves the island out.',
      html: wrap(`<acme-phone address="https://vercel.com" notch="false"></acme-phone>`),
    },
  ],
  practices: {
    "When to use": [
      "Phone is marketing chrome around mobile screenshots, recordings and demo images on landing pages and docs.",
      'Live mobile product UI does not go inside the frame. The chrome says "captured screen", not "interactive surface".',
      "To show desktop and mobile side by side, pair it with Browser and keep both on the same theme.",
    ],
    Behavior: [
      "Match the variant to the surrounding theme so the chrome does not outshine the screenshot it frames.",
      "Lock the inner image to a real device ratio (19.5:9 for a modern phone) so the bezel does not crop the content.",
      "No extra shadow on the parent. The frame carries its own elevation; a second shadow reads as a halo.",
    ],
    Accessibility: [
      'The chrome is decorative and carries <code>aria-hidden="true"</code>. The accessible name belongs to the inner screenshot.',
      "The inner image's alt text describes the screen (<code>Vercel dashboard on iPhone</code>), not the device.",
      "Autoplay video inside the frame respects <code>prefers-reduced-motion</code> and falls back to a paused poster.",
    ],
  },
};
