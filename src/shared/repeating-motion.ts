import { type Animate, AnimateController, type Options } from "@lit-labs/motion";
import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";
import { StoreSelector } from "./store-connection";
/** Owns repeating decorative motion without owning the component's business state. */
export class RepeatingMotion implements ReactiveController {
  private readonly state = createAtom({ reduced: false, generation: 0 });
  private readonly motion: AnimateController;
  private readonly updates: StoreSelector<unknown>;
  private readonly directives = new Set<Animate>();
  private media?: MediaQueryList;
  constructor(
    private host: ReactiveElement,
    private enabled: () => boolean,
  ) {
    host.addController(this);
    this.motion = new AnimateController(host, {});
    this.updates = new StoreSelector(host, () => this.state);
  }
  get key() {
    return this.state.get().generation;
  }
  get reduced() {
    return this.state.get().reduced;
  }
  reset() {
    this.motion.cancel();
    for (const directive of this.directives) this.host.removeController(directive);
    this.directives.clear();
    this.state.set((state) => ({ ...state, generation: state.generation + 1 }));
  }
  private preference = () => {
    this.state.set((state) => ({ ...state, reduced: this.media?.matches ?? false }));
    this.reset();
  };
  hostConnected() {
    this.media = this.host.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)");
    this.media?.addEventListener("change", this.preference);
    this.preference();
  }
  hostDisconnected() {
    this.media?.removeEventListener("change", this.preference);
    this.media = undefined;
    this.reset();
  }
  options(frames: Keyframe[], timing: Omit<KeyframeAnimationOptions, "iterations">, properties: string[] = ["opacity"]): Options {
    const generation = this.key;
    return {
      properties,
      disabled: !this.enabled() || this.reduced,
      in: frames,
      onStart: (directive) => {
        if (generation === this.key && this.host.isConnected) this.directives.add(directive);
        else this.host.removeController(directive);
      },
      onFrames: () => (this.host.isConnected && this.enabled() && !this.reduced && generation === this.key ? frames : undefined),
      keyframeOptions: { ...timing, iterations: Infinity },
    };
  }
}
