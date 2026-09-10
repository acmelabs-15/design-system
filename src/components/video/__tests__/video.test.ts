import { describe, expect, test } from "bun:test";
import "../../../index";
import { type AcmeVideo, formatTime } from "../video";

const SRC = "https://example.com/clip.mp4";
const mount = async (markup: string) => {
  document.body.innerHTML = markup;
  const el = document.body.firstElementChild as AcmeVideo;
  await el.updateComplete;
  await el.updateComplete;
  return el;
};
const q = <T extends Element>(el: AcmeVideo, sel: string) => el.shadowRoot!.querySelector(sel) as T | null;
/** Marks the inner video as playable (readyState 4) and announces it, the way a loaded source does. */
const load = async (el: AcmeVideo, duration = 90) => {
  const v = q<HTMLVideoElement>(el, "video")!;
  Object.defineProperty(v, "readyState", { value: 4, configurable: true });
  Object.defineProperty(v, "duration", { value: duration, configurable: true });
  v.dispatchEvent(new Event("loadeddata"));
  await el.updateComplete;
  return v;
};

describe("acme-video", () => {
  test("lazy=false renders the figure, the frame ratio and the muted, inline, autoplaying video without a loop attribute", async () => {
    const el = await mount(`<acme-video height="582" lazy="false" src="${SRC}" width="600"></acme-video>`);
    const fig = q<HTMLElement>(el, "figure.video")!;
    expect(fig.getAttribute("role")).toBe("region");
    expect(fig.getAttribute("aria-label")).toBe("Video player");
    expect(fig.getAttribute("style")).toBe("--video-margin:40px;--video-width:min(600px, 950px)");
    expect(q<HTMLElement>(el, ".box .frame")!.getAttribute("style")).toBe("padding-bottom:97%");
    const v = q<HTMLVideoElement>(el, ".frame > video")!;
    expect(v.getAttribute("src")).toBe(SRC);
    expect(v.getAttribute("width")).toBe("600");
    expect(v.getAttribute("height")).toBe("582");
    expect(v.getAttribute("preload")).toBe("auto");
    expect(v.hasAttribute("autoplay")).toBe(true);
    expect(v.hasAttribute("playsinline")).toBe(true);
    expect(v.muted).toBe(true);
    expect(v.hasAttribute("loop")).toBe(false);
    // The bar waits for a playable source.
    expect(q(el, ".controls")).toBeNull();
  });

  test("the false-valued booleans turn the defaults off", async () => {
    const el = await mount(`<acme-video lazy="false" loop="false" controls="false" muted="false" autoplay="false" plays-inline="false" src="${SRC}"></acme-video>`);
    expect(el.loop).toBe(false);
    expect(el.controls).toBe(false);
    const v = await load(el);
    expect(v.muted).toBe(false);
    expect(v.hasAttribute("autoplay")).toBe(false);
    expect(v.hasAttribute("playsinline")).toBe(false);
    expect(q(el, ".controls")).toBeNull();
  });

  test("margin, width, max-width and border-radius reach the figure; a bare number is pixels", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}" width="800" margin="24" max-width="80%" border-radius></acme-video>`);
    const fig = q<HTMLElement>(el, "figure")!;
    expect(fig.getAttribute("style")).toBe("--video-margin:24px;--video-width:min(800px, 950px);max-width:80%");
    expect(fig.classList.contains("round")).toBe(true);
    el.margin = "2rem";
    el.maxWidth = 700;
    await el.updateComplete;
    expect(fig.getAttribute("style")).toBe("--video-margin:2rem;--video-width:min(800px, 950px);max-width:700px");
  });

  test("the control bar renders once the video can play: play button, times, scrubber, progress and handle", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}"></acme-video>`);
    await load(el, 75);
    const bar = q<HTMLElement>(el, ".frame > .controls")!;
    expect(bar).not.toBeNull();
    expect(bar.querySelector(".play")!.getAttribute("aria-label")).toBe("Play");
    expect(bar.querySelector(".current")!.textContent!.trim()).toBe("00:00");
    expect(bar.querySelector(".total")!.textContent!.trim()).toBe("01:15");
    expect(bar.querySelector(".track > .scrub")).not.toBeNull();
    expect(bar.querySelector(".track > progress")!.getAttribute("value")).toBe("0");
    expect(bar.querySelector<HTMLElement>(".track > .handle")!.getAttribute("style")).toBe("left:0%");
  });

  test("a source that is not yet playable keeps the bar out", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}"></acme-video>`);
    const v = q<HTMLVideoElement>(el, "video")!;
    Object.defineProperty(v, "readyState", { value: 1, configurable: true });
    v.dispatchEvent(new Event("canplay"));
    await el.updateComplete;
    expect(q(el, ".controls")).toBeNull();
  });

  test("the pointer over the player shows the bar; leaving hides it", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}"></acme-video>`);
    await load(el);
    const fig = q<HTMLElement>(el, "figure")!;
    fig.dispatchEvent(new MouseEvent("mouseenter"));
    await el.updateComplete;
    expect(fig.classList.contains("visible")).toBe(true);
    fig.dispatchEvent(new MouseEvent("mouseleave"));
    await el.updateComplete;
    expect(fig.classList.contains("visible")).toBe(false);
  });

  test("playback flips the button, fires acme-play with the source, and the time follows the video", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}"></acme-video>`);
    const v = await load(el, 100);
    const events: string[] = [];
    el.addEventListener("acme-play", (e) => events.push((e as CustomEvent).detail.src));
    v.dispatchEvent(new Event("play"));
    await el.updateComplete;
    expect(events).toEqual([SRC]);
    expect(q<HTMLElement>(el, ".play")!.getAttribute("aria-label")).toBe("Pause");
    Object.defineProperty(v, "currentTime", { value: 25, writable: true, configurable: true });
    v.dispatchEvent(new Event("timeupdate"));
    await el.updateComplete;
    expect(q<HTMLElement>(el, ".current")!.textContent!.trim()).toBe("00:25");
    expect(q<HTMLElement>(el, "progress")!.getAttribute("value")).toBe("25");
    expect(q<HTMLElement>(el, ".handle")!.getAttribute("style")).toBe("left:25%");
    v.dispatchEvent(new Event("pause"));
    await el.updateComplete;
    expect(q<HTMLElement>(el, ".play")!.getAttribute("aria-label")).toBe("Play");
  });

  test("loop restarts the video twice after it ends, then stops; loop=false stops at once", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}"></acme-video>`);
    const v = await load(el);
    let plays = 0;
    let pauses = 0;
    v.play = () => {
      plays++;
      return Promise.resolve();
    };
    v.pause = () => {
      pauses++;
    };
    for (let i = 0; i < 3; i++) v.dispatchEvent(new Event("ended"));
    expect(plays).toBe(2);
    expect(pauses).toBe(1);
    const once = await mount(`<acme-video lazy="false" loop="false" src="${SRC}"></acme-video>`);
    const w = await load(once);
    plays = 0;
    w.play = () => {
      plays++;
      return Promise.resolve();
    };
    w.dispatchEvent(new Event("ended"));
    expect(plays).toBe(0);
  });

  test("the scrubber seeks on release: the position follows the drag, the video's time is set at the end", async () => {
    const el = await mount(`<acme-video lazy="false" src="${SRC}"></acme-video>`);
    const v = await load(el, 200);
    Object.defineProperty(v, "currentTime", { value: 0, writable: true, configurable: true });
    const scrub = q<HTMLElement>(el, ".scrub")!;
    scrub.getBoundingClientRect = () => ({ left: 100, width: 400, top: 0, height: 18, right: 500, bottom: 18, x: 100, y: 0, toJSON: () => "" }) as DOMRect;
    scrub.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse", button: 0, clientX: 100 }));
    expect(document.body.style.userSelect).toBe("none");
    scrub.dispatchEvent(new PointerEvent("pointermove", { pointerType: "mouse", clientX: 200 }));
    await el.updateComplete;
    expect(q<HTMLElement>(el, "progress")!.getAttribute("value")).toBe("25");
    expect(v.currentTime).toBe(0);
    scrub.dispatchEvent(new PointerEvent("pointerup", { pointerType: "mouse", clientX: 300 }));
    await el.updateComplete;
    expect(v.currentTime).toBe(100);
    expect(q<HTMLElement>(el, "progress")!.getAttribute("value")).toBe("50");
    expect(document.body.style.userSelect).toBe("");
  });

  test("lazy defers the source until the frame nears the viewport (20% margin, observed once)", async () => {
    const observed: Element[] = [];
    let options: IntersectionObserverInit | undefined;
    let notify: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
    const original = globalThis.IntersectionObserver;
    (globalThis as { IntersectionObserver: unknown }).IntersectionObserver = class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void, opts?: IntersectionObserverInit) {
        notify = cb;
        options = opts;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {}
    };
    try {
      const el = await mount(`<acme-video src="${SRC}"></acme-video>`);
      expect(q(el, "video")).toBeNull();
      expect(observed[0]).toBe(q<HTMLElement>(el, ".frame")!);
      expect(options?.rootMargin).toBe("20% 0px");
      notify!([{ isIntersecting: false }]);
      await el.updateComplete;
      expect(q(el, "video")).toBeNull();
      notify!([{ isIntersecting: true }]);
      await el.updateComplete;
      expect(q<HTMLVideoElement>(el, "video")!.getAttribute("src")).toBe(SRC);
    } finally {
      (globalThis as { IntersectionObserver: unknown }).IntersectionObserver = original;
    }
  });

  test("formatTime pads minutes and seconds and reads a missing time as zero", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(75.9)).toBe("01:15");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(Number.NaN)).toBe("00:00");
  });
});
