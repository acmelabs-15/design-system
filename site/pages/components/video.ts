import {readFileSync} from "node:fs";
import type { Doc } from "../../site";
const source = "data:video/mp4;base64," + readFileSync(new URL("../../assets/video/example.mp4", import.meta.url)).toString("base64"),
  captions = "data:text/vtt;base64," + readFileSync(new URL("../../assets/video/captions.vtt", import.meta.url)).toString("base64");
export const doc: Doc = {
  id: "video",
  title: "Video",
  lede: "Native video playback, controls and captions, with visibility-based loading and responsive dimensions.",
  tags: ["acme-video"],
  examples: [
    { h: "Native controls", html: `<acme-video src="${source}" autoplay="false" loading="eager" aria-label="Synthetic video example"></acme-video>` },
    {
      h: "Captions",
      p: "Native track nodes live directly in the returned video element.",
      html: `<acme-video src="${source}" autoplay="false" loading="eager" aria-label="Captioned synthetic example"></acme-video>`,
      script: `const player=root.querySelector('acme-video'),track=document.createElement('track');track.kind='captions';track.label='English';track.srclang='en';track.src='${captions}';track.default=true;player.getVideoElement().append(track);track.track.mode='showing';`,
    },
    {
      h: "Native source children",
      html: '<acme-video autoplay="false" loading="eager" aria-label="Native source example"></acme-video>',
      script: `const player=root.querySelector('acme-video'),source=document.createElement('source');source.src='${source}';source.type='video/mp4';player.getVideoElement().append(source);`,
    },
    {
      h: "Application controls",
      html: `<acme-video src="${source}" controls="false" autoplay="false" loop="false" aria-label="Application-controlled example"></acme-video><acme-h-stack gap="2"><acme-button data-action="play">Play</acme-button><acme-button data-action="pause" variant="secondary">Pause</acme-button></acme-h-stack><output aria-live="polite"></output>`,
      script:
        'const player=root.querySelector("acme-video"),output=root.querySelector("output");root.querySelector("[data-action=play]").addEventListener("click",()=>player.play().then(()=>output.textContent="Playback started",()=>output.textContent="Playback unavailable"));root.querySelector("[data-action=pause]").addEventListener("click",()=>{player.pause();output.textContent="Paused";});',
    },
    {
      h: "Lazy loading",
      p: "The source and poster activate near the viewport. Calling play also activates the media.",
      html: `<acme-video src="${source}" autoplay="false" aria-label="Lazy video example"></acme-video>`,
    },
    { h: "Unavailable media", html: '<acme-video src="data:video/mp4;base64,AA==" autoplay="false" loading="eager"><span slot="fallback">This video is unavailable.</span></acme-video>' },
  ],
  practices: {
    Playback: [
      "The native video owns playback, seeking, volume, looping, fullscreen and caption behavior. The component does not build a second player.",
      "Await play() before reporting that playback started. Browser policy or unsupported media can reject that promise.",
      "Pause remains in effect through lazy activation and preference changes. Reconnecting a removed element does not silently resume it.",
      "Omitted autoplay follows the reduced-motion preference. Assign undefined to follow the preference again after a property override. Explicit true and false remain application choices.",
    ],
    Content: [
      "getVideoElement() returns a stable native target for source and track nodes. Append native nodes directly, render Lit content into it, or use a React portal.",
      "Keep source and track nodes inside that native target. The component does not clone them or move framework-owned child ranges.",
      "After replacing a native source list, use the native load() method when a new resource selection is required.",
      "The fallback slot stays on the component host and provides content for absent or failed media.",
    ],
    Layout: [
      "Width defaults to 600px and height remains intrinsic. Dimensions use the shared responsive size inputs; numeric values are tokens and CSS lengths specify pixels.",
      "The surrounding layout owns margins and maximum width. Native video controls retain the browser’s keyboard behavior and appearance.",
      "Use a meaningful aria-label and captions where needed. Native keyboard focus navigation follows the browser and operating-system conventions.",
    ],
  },
};
