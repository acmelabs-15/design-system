// Reads a running CSS animation or transition without needing the browser to draw a frame.
//
// Why this exists: a Chromium page that is not being rendered — a background tab, a minimized window,
// a hidden preview pane — is removed from the event loop's rendering steps, so requestAnimationFrame
// never fires and the compositor unsubscribes from frames entirely. No Chrome setting, flag or feature
// changes that; it is a visibility gate in the compositor's scheduler, not a throttle. Verified by
// reading Chromium's own source and by testing every candidate flag.
//
// What still works: `getComputedStyle` and `getAnimations` both force Blink to update animation timing
// on demand, off the frame path. So an animation can be seeked and sampled with no frames at all.
//
// Paste this into the page (the census tooling does the same with census.js) and call
// `window.__motion(element)`.

(() => {
  /** Whether the page is currently being rendered. Probe it; never trust `document.visibilityState`. */
  const framesFire = (timeoutMs = 900) =>
    new Promise((resolve) => {
      let done = false;
      requestAnimationFrame(() => {
        done = true;
        resolve(true);
      });
      setTimeout(() => {
        if (!done) resolve(false);
      }, timeoutMs);
    });

  /**
   * Every animation and transition on `el` and its subtree, with the values each produces at the
   * sample points. Sampling seeks the animation, so it is restored to where it was on the way out.
   *
   * Two traps this avoids, both found by hand:
   *   - The easing that matters is usually on the KEYFRAMES or the CSS rule, not on the effect's
   *     timing. Our tooltip's effect reports `linear` while the keyframes say `ease-in`, and the
   *     interpolated value at halfway proves the keyframes win. Read all three.
   *   - A running animation must be PAUSED before seeking. Chromium's animation clock advances
   *     against wall time between tasks, so an unpaused animation moves between the seek and the
   *     read, every sample lands past the end, and each reports the fill value. That reads as a
   *     completely broken animation. Measured: unpaused gave 0 at all five points; paused gave
   *     0, 0.315 and 1. The playing state is restored afterwards.
   */
  const read = (el, props = ["opacity", "transform"], at = [0, 0.25, 0.5, 0.75, 1]) =>
    el.getAnimations({ subtree: true }).map((a) => {
      const t = a.effect.getTiming();
      const target = a.effect.target;
      const was = a.currentTime;
      const wasPlaying = a.playState === "running";
      const duration = typeof t.duration === "number" ? t.duration : 0;
      // MANDATORY: pause before seeking. Chromium's animation clock advances against wall time
      // between tasks, so an unpaused animation moves between the seek and the read. Every sample
      // then lands past the end and reports the fill value — which looks exactly like a broken
      // animation. Verified by hand: unpaused gave 0 at every point, paused gave 0, 0.315, 1.
      a.pause();
      const samples = at.map((frac) => {
        a.currentTime = duration * frac;
        const cs = getComputedStyle(target);
        const out = { at: frac };
        for (const p of props) out[p] = cs.getPropertyValue(p);
        return out;
      });
      a.currentTime = was;
      if (wasPlaying) a.play();
      const cs = getComputedStyle(target);
      return {
        name: a.animationName ?? a.transitionProperty ?? null,
        kind: a.constructor.name,
        target: target === el ? "self" : (target.className || target.tagName),
        durationMs: duration,
        // Three places an easing can live. The keyframe and CSS values are the ones that bite.
        easing: { effect: t.easing, keyframes: a.effect.getKeyframes().map((k) => k.easing), css: cs.animationTimingFunction, transition: cs.transitionTimingFunction },
        fill: t.fill,
        delayMs: t.delay,
        iterations: t.iterations,
        keyframes: a.effect.getKeyframes().map((k) => ({ offset: k.offset, easing: k.easing })),
        samples,
      };
    });

  window.__motion = async (el, props, at) => ({
    framesFire: await framesFire(),
    visibilityState: document.visibilityState,
    animations: read(el, props, at),
  });
  /** The synchronous half, for a caller that has already probed. */
  window.__motionRead = read;
})();
