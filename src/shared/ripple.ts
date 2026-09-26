import { createAtom } from "@tanstack/lit-store";
import { html, nothing, type ReactiveController, type ReactiveElement } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { animate, type Animate } from "@lit-labs/motion";
import { StoreSelector } from "./store-connection";

type Wave = Readonly<{ id: number; frames: Keyframe[]; duration: number; easing: string }>;
const emptyWave: Readonly<{ value?: Wave }> = Object.freeze({});
const firstEasing = (value: string) => {
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "(") {
      depth++;
    } else if (value[i] === ")") {
      depth--;
    } else if (value[i] === "," && depth === 0) {
      return value.slice(0, i);
    }
  }
  return value;
};
/** A visual press effect. Interaction owns gestures; this controller owns only its animation. */
export class Ripple implements ReactiveController {
  private readonly wave = createAtom(emptyWave);
  private readonly updates: StoreSelector<{ value?: Wave }>;
  private readonly directives = new Set<Animate>();
  private sequence = 0;
  private media?: MediaQueryList;
  constructor(
    private host: ReactiveElement,
    private target: () => HTMLElement | undefined,
    private enabled: () => boolean,
  ) {
    this.updates = new StoreSelector(host, () => this.wave);
    host.addController(this);
  }
  private preference = () => {
    if (this.media?.matches) {
      this.cancel();
    }
  };
  hostConnected() {
    this.media = this.host.ownerDocument.defaultView?.matchMedia("(prefers-reduced-motion: reduce)");
    this.media?.addEventListener("change", this.preference);
  }
  hostDisconnected() {
    this.media?.removeEventListener("change", this.preference);
    this.media = undefined;
    this.cancel();
  }
  cancel() {
    this.sequence++;
    for (const directive of this.directives) {
      directive.webAnimation?.cancel();
      this.host.removeController(directive);
    }
    this.directives.clear();
    this.wave.set(emptyWave);
  }
  start(event: PointerEvent | KeyboardEvent) {
    this.cancel();
    const target = this.target(),
      view = this.host.ownerDocument.defaultView;
    if (!target || !view || !this.enabled() || this.media?.matches) {
      return;
    }
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const width = target.clientWidth,
      height = target.clientHeight,
      pointer = "clientX" in event;
    const x = pointer ? Math.max(0, Math.min(width, ((event.clientX - rect.left) * target.offsetWidth) / rect.width - target.clientLeft)) : width / 2,
      y = pointer ? Math.max(0, Math.min(height, ((event.clientY - rect.top) * target.offsetHeight) / rect.height - target.clientTop)) : height / 2;
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 1,
      size = radius * 2;
    const style = view.getComputedStyle(target),
      time = style.transitionDuration.split(",")[0].trim(),
      duration = Number.parseFloat(time) * (time.endsWith("ms") ? 1 : 1000);
    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }
    const geometry = { width: `${size}px`, height: `${size}px`, left: `${x - radius}px`, top: `${y - radius}px` };
    this.wave.set({
      value: Object.freeze({
        id: this.sequence,
        duration,
        easing: firstEasing(style.transitionTimingFunction),
        frames: [
          { ...geometry, transform: "scale(0)", opacity: 0.1 },
          { ...geometry, transform: "scale(1)", opacity: 0 },
        ],
      }),
    });
  }
  render() {
    const wave = this.wave.get().value;
    if (!wave) {
      return nothing;
    }
    return html`<span class="ripple-clip" aria-hidden="true">${keyed(
      wave.id,
      html`<span class="ripple" ${animate({
        properties: [],
        in: wave.frames,
        keyframeOptions: { duration: wave.duration, easing: wave.easing },
        onStart: (directive) => {
          if (wave.id === this.sequence && this.host.isConnected) {
            this.directives.add(directive);
          } else {
            this.host.removeController(directive);
          }
        },
        onFrames: () => (wave.id === this.sequence && this.host.isConnected && this.enabled() && !this.media?.matches ? wave.frames : undefined),
        onComplete: () => {
          if (wave.id === this.sequence) {
            this.cancel();
          }
        },
      })}></span>`,
    )}</span>`;
  }
}
