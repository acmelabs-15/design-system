import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss, boolish } from "../../base";
import { AcmeResponsiveElement } from "../../shared/responsive-element";
import { atomState } from "../../shared/atom-state";
import { StyleInputController } from "../../shared/style-input-controller";
import { ResponsiveStyleRenderer } from "../../shared/style-renderer";
import { responsiveStyleDelivery } from "../../generated/responsive-styles";
import type { ResponsiveInput } from "../../shared/responsive";
import type { StyleScalar } from "../../shared/style-input-schema";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { videoSurfaceCss } from "../../generated/components/video/video-surface.styles";
type NativeInputs = Pick<HTMLVideoElement, "controls" | "playsInline" | "muted" | "defaultMuted" | "loop" | "preload" | "autoplay">;
type Dimension = ResponsiveInput<StyleScalar<"width">>;
/** A native video owner with visibility-based loading and stable native content access.
 * @attr width - Responsive CSS width or size token. Defaults to 600px.
 * @attr height - Responsive CSS height or size token. Omission keeps intrinsic height.
 * @slot fallback - Content shown when media is absent or unavailable.
 * @csspart root - Media frame.
 * @csspart video - Native HTML video element.
 * @fires {Event} play - Native play-state event.
 * @fires {Event} pause - Native pause event.
 * @fires {Event} ended - Native playback ended.
 * @fires {Event} error - Native media or final source loading failed.
 */
export class AcmeVideo extends AcmeResponsiveElement {
  static styles = [sharedCss, videoSurfaceCss];
  static get observedAttributes() {
    return [...new Set([...super.observedAttributes, "width", "height"])];
  }
  @atomState() @property({ noAccessor: true, useDefault: true }) src = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) poster = "";
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) controls = true;
  @atomState() @property({ noAccessor: true, attribute: "plays-inline", converter: boolish, useDefault: true }) playsInline = true;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) muted = true;
  @atomState() @property({ noAccessor: true, converter: boolish, useDefault: true }) loop = true;
  @atomState() private requestedAutoplay?: boolean;
  @atomState() private reducedMotion = this.ownerDocument.defaultView!.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** Defaults to the current reduced-motion preference when omitted. */
  @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : value !== "false") } }) get autoplay(): boolean {
    return this.requestedAutoplay ?? !this.reducedMotion;
  }
  set autoplay(value: boolean | undefined) {
    if (value !== undefined && typeof value !== "boolean") throw new TypeError("Autoplay requires a boolean or undefined");
    const previous = this.autoplay;
    this.requestedAutoplay = value;
    this.requestUpdate("autoplay", previous);
  }
  @atomState() private preloadValue: "none" | "metadata" | "auto" = "auto";
  /** @default "auto" */
  @property({ noAccessor: true, useDefault: true }) get preload() {
    return this.preloadValue;
  }
  set preload(value: "none" | "metadata" | "auto") {
    if (!["none", "metadata", "auto"].includes(value)) throw new TypeError("Invalid Video preload");
    const previous = this.preloadValue;
    this.preloadValue = value;
    this.requestUpdate("preload", previous);
  }
  @atomState() private loadingValue: "eager" | "lazy" = "lazy";
  /** @default "lazy" */
  @property({ noAccessor: true, useDefault: true }) get loading() {
    return this.loadingValue;
  }
  set loading(value: "eager" | "lazy") {
    if (value !== "eager" && value !== "lazy") throw new TypeError("Invalid Video loading");
    const previous = this.loadingValue;
    this.loadingValue = value;
    this.requestUpdate("loading", previous);
  }
  private readonly dimensions = new StyleInputController(this, ["width", "height"], {
    supports: (property, value) => {
      const css = this.ownerDocument.defaultView?.CSS;
      if (css?.supports) return css.supports(property, value);
      const style = this.ownerDocument.createElement("div").style;
      style.setProperty(property, value);
      return !!style.getPropertyValue(property);
    },
    diagnostic: (diagnostic) => console.warn(this.localName, diagnostic),
  });
  /** @default "600px" */
  get width(): Dimension {
    return this.dimensions.get("width") ?? "600px";
  }
  set width(value: Dimension) {
    this.dimensions.set("width", value);
  }
  get height(): Dimension {
    return this.dimensions.get("height");
  }
  set height(value: Dimension) {
    this.dimensions.set("height", value);
  }
  private readonly renderer = new ResponsiveStyleRenderer(this, responsiveStyleDelivery, {
    root: () => (this.renderRoot?.nodeType === 11 ? (this.renderRoot as ShadowRoot) : undefined),
    state: () => ({ inputs: this.dimensions.entries.get(), target: this.responsiveTarget, container: this.responsiveContainer }),
  });
  private readonly media = this.ownerDocument.createElement("video");
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  @atomState() private ready = false;
  @atomState() private userPaused = false;
  @atomState() private failed = false;
  private readonly applied = new Map<keyof NativeInputs, NativeInputs[keyof NativeInputs]>();
  private sourceApplied?: string;
  private posterApplied?: string;
  private intersection?: IntersectionObserver;
  private childrenObserver?: MutationObserver;
  private preference?: MediaQueryList;
  private sourceErrorFrame?: number;
  private sourceErrorView?: Window;
  private playGeneration = 0;
  private releaseMedia?: () => void;
  constructor() {
    super();
    this.media.setAttribute("part", "video");
    this.media.preload = "none";
    this.media.muted = true;
  }
  /** Stable native target for source/track children, metadata and browser media APIs. */
  getVideoElement(): HTMLVideoElement {
    return this.media;
  }
  /** Resolves only when native playback starts, and preserves native rejection. */
  async play(): Promise<void> {
    if (!this.isConnected) throw new DOMException("Connect Video before playback", "InvalidStateError");
    const generation = ++this.playGeneration;
    this.userPaused = false;
    this.activate();
    await this.updateComplete;
    if (!this.isConnected || generation !== this.playGeneration) throw new DOMException("Playback superseded", "AbortError");
    await this.media.play();
    if (!this.isConnected || generation !== this.playGeneration) throw new DOMException("Playback superseded", "AbortError");
  }
  /** Pauses media and prevents later lazy/preference updates from restarting it. */
  pause() {
    this.playGeneration++;
    this.userPaused = true;
    this.apply("autoplay", false);
    this.media.pause();
  }
  protected get semanticTarget() {
    return this.media;
  }
  protected get semanticDefaults() {
    return { label: message(this.themeContext.scope.effective.get().locale, "video.player", "Video player") };
  }
  private get hasSource() {
    return !!(this.src || this.media.getAttribute("src") || this.media.srcObject || [...this.media.children].some((node) => node.localName === "source" && node.getAttribute("src")));
  }
  private activate = () => {
    this.ready = true;
    this.intersection?.disconnect();
    this.intersection = undefined;
    this.syncMedia();
  };
  private observeVisibility() {
    if (this.ready) return;
    if (this.loading === "eager") {
      this.activate();
      return;
    }
    if (!this.intersection) {
      this.intersection = new this.ownerDocument.defaultView!.IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) this.activate();
        },
        { rootMargin: "20% 0px" },
      );
      this.intersection.observe(this);
    }
  }
  private apply<Key extends keyof NativeInputs>(key: Key, value: NativeInputs[Key]) {
    if (this.applied.get(key) !== value) {
      const target: NativeInputs = this.media;
      target[key] = value;
      this.applied.set(key, value);
    }
  }
  private syncMedia() {
    const media = this.media;
    this.apply("controls", this.controls);
    this.apply("playsInline", this.playsInline);
    this.apply("muted", this.muted);
    this.apply("defaultMuted", this.muted);
    this.apply("loop", this.loop);
    this.apply("preload", this.ready ? this.preload : "none");
    this.apply("autoplay", this.ready && this.autoplay && !this.userPaused && this.isConnected);
    if (this.ready) {
      if (this.posterApplied !== this.poster) {
        if (this.poster) media.poster = this.poster;
        else if (this.posterApplied) media.removeAttribute("poster");
        this.posterApplied = this.poster;
      }
      if (this.sourceApplied !== this.src) {
        this.failed = false;
        if (this.src) media.src = this.src;
        else if (this.sourceApplied) {
          media.removeAttribute("src");
          media.load();
        }
        this.sourceApplied = this.src;
      }
    }
  }
  private native = (event: Event) => {
    if (event.target !== this.media) return;
    if (event.type === "pause" && this.media.paused && !this.media.ended) this.userPaused = true;
    if (event.type === "play" && !this.media.paused) this.userPaused = false;
    if (event.type === "error") {
      if (this.failed) return;
      this.failed = true;
    }
    if (this.isConnected && !event.composed) this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    this.requestUpdate();
  };
  private volume = () => {
    if (this.muted !== this.media.muted) this.muted = this.media.muted;
  };
  private loaded = () => {
    this.failed = false;
    this.requestUpdate();
  };
  private sourceError = (event: Event) => {
    if ((event.target as Element).localName !== "source" || this.sourceErrorFrame !== undefined) return;
    const view = this.ownerDocument.defaultView!;
    this.sourceErrorView = view;
    this.sourceErrorFrame = view.requestAnimationFrame(() => {
      this.sourceErrorFrame = undefined;
      if (this.isConnected && this.ready && !this.failed && this.media.networkState === this.media.NETWORK_NO_SOURCE) {
        this.failed = true;
        this.dispatchEvent(new Event("error", { bubbles: true, composed: true }));
      }
    });
  };
  private motionPreference = () => {
    this.reducedMotion = !!this.preference?.matches;
  };
  connectedCallback() {
    super.connectedCallback();
    const view = this.ownerDocument.defaultView!;
    this.preference = view.matchMedia("(prefers-reduced-motion: reduce)");
    this.preference.addEventListener("change", this.motionPreference);
    this.motionPreference();
    const types = ["play", "pause", "ended", "error"] as const;
    for (const type of types) this.media.addEventListener(type, this.native);
    this.media.addEventListener("error", this.sourceError, true);
    this.media.addEventListener("volumechange", this.volume);
    this.media.addEventListener("loadedmetadata", this.loaded);
    this.media.addEventListener("loadstart", this.loaded);
    this.releaseMedia = () => {
      for (const type of types) this.media.removeEventListener(type, this.native);
      this.media.removeEventListener("error", this.sourceError, true);
      this.media.removeEventListener("volumechange", this.volume);
      this.media.removeEventListener("loadedmetadata", this.loaded);
      this.media.removeEventListener("loadstart", this.loaded);
    };
    this.childrenObserver = new view.MutationObserver(() => {
      this.requestUpdate();
    });
    this.childrenObserver.observe(this.media, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    this.observeVisibility();
    this.requestUpdate();
  }
  disconnectedCallback() {
    this.playGeneration++;
    this.intersection?.disconnect();
    this.intersection = undefined;
    this.childrenObserver?.disconnect();
    this.childrenObserver = undefined;
    this.preference?.removeEventListener("change", this.motionPreference);
    this.preference = undefined;
    this.releaseMedia?.();
    this.releaseMedia = undefined;
    if (this.sourceErrorFrame !== undefined) this.sourceErrorView?.cancelAnimationFrame(this.sourceErrorFrame);
    this.sourceErrorFrame = undefined;
    this.sourceErrorView = undefined;
    this.userPaused = true;
    this.media.autoplay = false;
    this.media.pause();
    super.disconnectedCallback();
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null) {
    if (!this.dimensions?.attributeChanged(name, previous, value)) super.attributeChangedCallback(name, previous, value);
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.renderer.adopted();
  }
  protected updated() {
    this.observeVisibility();
    this.syncMedia();
    this.media.hidden = !this.hasSource || this.failed;
  }
  render() {
    return html`<div part="root">${this.media}<div class="fallback" ?hidden=${this.hasSource && !this.failed}><slot name="fallback">${message(this.themeContext.scope.effective.get().locale, "video.unavailable", "Video unavailable")}</slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-video": AcmeVideo;
  }
}
