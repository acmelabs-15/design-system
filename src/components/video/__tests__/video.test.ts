import { expect, test } from "bun:test";
import "../../../all";
async function mount() {
  const el = document.createElement("acme-video");
  el.loading = "eager";
  el.autoplay = false;
  document.body.replaceChildren(el);
  await el.updateComplete;
  return el;
}
test("Video keeps one native media owner and real source/track children", async () => {
  const el = await mount(),
    media = el.getVideoElement(),
    track = document.createElement("track");
  media.append(track);
  el.poster = "poster.png";
  el.controls = false;
  await el.updateComplete;
  expect(el.getVideoElement()).toBe(media);
  expect(track.parentNode).toBe(media);
  expect(media.controls).toBe(false);
  expect(media.playsInline).toBe(true);
  expect(media.loop).toBe(true);
  expect(media.muted).toBe(true);
  expect(el.width).toBe("600px");
  expect(el.height).toBeUndefined();
});
test("native playback rejection remains a rejection without a success event", async () => {
  const el = await mount(),
    media = el.getVideoElement();
  let plays = 0;
  el.addEventListener("play", () => plays++);
  media.play = async () => {
    throw new DOMException("denied", "NotAllowedError");
  };
  await expect(el.play()).rejects.toThrow("denied");
  expect(plays).toBe(0);
});
test("native events forward once through the host, including capture listeners", async () => {
  const el = await mount();
  let normal = 0,
    capture = 0;
  el.addEventListener("play", () => normal++);
  el.addEventListener("play", () => capture++, true);
  el.getVideoElement().dispatchEvent(new Event("play"));
  expect(normal).toBe(1);
  expect(capture).toBe(1);
});
test("pause prevents preference or unrelated updates from restarting autoplay", async () => {
  const el = await mount();
  el.autoplay = true;
  await el.updateComplete;
  el.pause();
  el.poster = "changed.png";
  await el.updateComplete;
  expect(el.getVideoElement().autoplay).toBe(false);
  expect(el.getVideoElement().paused).toBe(true);
});
test("native mute changes remain canonical and are not overwritten by unrelated renders", async () => {
  const el = await mount(),
    media = el.getVideoElement();
  media.muted = false;
  el.poster = "new.png";
  await el.updateComplete;
  media.dispatchEvent(new Event("volumechange"));
  await el.updateComplete;
  expect(el.muted).toBe(false);
  expect(media.muted).toBe(false);
});

test("pause before the render flush cancels a pending wrapper play request", async () => {
  const el = await mount();
  let nativeCalls = 0;
  el.getVideoElement().play = async () => {
    nativeCalls++;
  };
  const pending = el.play();
  el.pause();
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  expect(nativeCalls).toBe(0);
});
