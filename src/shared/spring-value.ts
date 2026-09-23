import { SpringController, type SpringConfig } from "@lit-labs/motion/spring.js";
import type { ReactiveController, ReactiveElement } from "lit";
/** Owns one visual interpolation; the caller retains the canonical endpoint. */
export class SpringValue implements ReactiveController {
  private spring?: SpringController;
  private target?: number;
  private parameters = "";
  private media?: MediaQueryList;
  constructor(
    private host: ReactiveElement,
    private endpoint: () => number,
    private config: () => SpringConfig,
  ) {
    host.addController(this);
  }
  get value() {
    return this.spring?.currentValue ?? this.target ?? this.endpoint();
  }
  get settled(): boolean {
    return !this.spring || this.spring.isAtRest;
  }
  private stop() {
    if (this.spring) {
      this.spring.hostDisconnected();
      this.host.removeController(this.spring);
      this.spring = undefined;
    }
  }
  private preference = () => {
    if (this.media?.matches) this.stop();
    this.host.requestUpdate();
  };
  hostConnected() {
    this.media = this.host.ownerDocument.defaultView!.matchMedia("(prefers-reduced-motion: reduce)");
    this.media.addEventListener("change", this.preference);
    this.host.requestUpdate();
  }
  hostDisconnected() {
    this.stop();
    this.media?.removeEventListener("change", this.preference);
    this.media = undefined;
    this.target = undefined;
  }
  /** Follows a directly manipulated endpoint without retaining an unfinished interpolation. */
  jump() {
    const target = this.endpoint(),
      parameters = JSON.stringify(this.config());
    if (!this.spring && this.target === target && this.parameters === parameters) return;
    this.stop();
    this.target = target;
    this.parameters = parameters;
    this.host.requestUpdate();
  }
  update() {
    const target = this.endpoint(),
      config = this.config(),
      parameters = JSON.stringify(config);
    if (this.target === target && this.parameters === parameters) return;
    const from = this.value,
      velocity = this.spring?.currentVelocity ?? 0,
      initial = this.target === undefined;
    this.stop();
    this.target = target;
    this.parameters = parameters;
    if (!initial && !this.media?.matches && from !== target) this.spring = new SpringController(this.host, { ...config, fromValue: from, toValue: target, initialVelocity: velocity });
    this.host.requestUpdate();
  }
}
