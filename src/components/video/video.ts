import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, boolish, paths, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { Interaction } from "../../shared/interaction";
import { reduced } from "../../shared/overlay";
import { videoCss } from "./video.styles";

/** The control bar hides this long after the pointer last moved over the player. */
const HIDE_MS = 3000;
/** With `loop`, the video restarts this many times after its first play, then stops. */
const REPLAYS = 2;
/** The source loads once the frame comes within this margin of the viewport. */
const LAZY_MARGIN = "20% 0px";
/** A length: a number is pixels, a string passes through as written. */
const px = (v: number | string) => (typeof v === "number" ? `${v}px` : v);
/** Converter for a length attribute: a bare number reads as pixels, anything else as a CSS length. */
const length = (fallback: number | string) => ({
  fromAttribute: (v: string | null) => (v === null ? fallback : /^-?\d*\.?\d+$/.test(v) ? Number(v) : v),
  toAttribute: (v: number | string) => String(v),
});
/** mm:ss; a missing time reads as zero. */
export const formatTime = (seconds: number) => {
  const pad = (n: number) => String(Number.isNaN(n) ? 0 : n).padStart(2, "0");
  return `${pad(Math.floor(seconds / 60))}:${pad(Math.floor(seconds % 60))}`;
};
/** A 16px solid glyph in gray-1000, for the play and pause button. */
const glyph = (d: string) =>
  html`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ds-gray-1000)" aria-hidden="true"><path d=${d}></path></svg>`;

/**
 * Video player. A figure (role region, "Video player") with `margin` above and below, holding a
 * centred box `width` wide (capped at 950px and at the container) whose frame keeps the
 * `width`:`height` ratio; the video fills the frame and a click on it plays or pauses. The control
 * bar appears once the video can play: a 48px bar 5% above the bottom, 85% wide, transparent until
 * the pointer moves over the player, opaque and lifted 6px while it does (it hides three seconds
 * after the last move, or when the pointer leaves; below 992px it stays flat). The bar holds the
 * play/pause button, the elapsed time, the scrubber (a drag area over the progress bar; release
 * seeks) and the duration. The video is muted and plays inline by default, autoplays unless the
 * user prefers reduced motion, and with `loop` restarts twice after its first play, then stops.
 * `lazy` defers the source until the frame comes within 20% of the viewport. `acme-play` fires
 * whenever playback starts, with the source in `detail.src`.
 */
@customElement("acme-video")
export class AcmeVideo extends AcmeElement {
  static styles = [
    sharedCss,
    videoCss,
    css`
      :host {
        display: block;
      }
    `,
  ];
  /** The video URL. */
  @property() src = "";
  /** Intrinsic width in px: the box is this wide, capped at 950px and at the container. */
  @property({ type: Number }) width = 600;
  /** Intrinsic height in px: with `width`, the aspect ratio the frame keeps. */
  @property({ type: Number }) height = 0;
  /** Vertical margin around the player: a number in px, or a CSS length. */
  @property({ converter: length(40) }) margin: number | string = 40;
  /** Rounds the video box by the radius token. */
  @property({ type: Boolean, attribute: "border-radius" }) borderRadius = false;
  /** `controls="false"` leaves the control bar out. */
  @property({ converter: boolish }) controls = true;
  /** `plays-inline="false"` lets a phone open the video full screen. */
  @property({ converter: boolish, attribute: "plays-inline" }) playsInline = true;
  /** `lazy="false"` loads the source at once instead of when the frame nears the viewport. */
  @property({ converter: boolish }) lazy = true;
  /** `muted="false"` plays the sound. */
  @property({ converter: boolish }) muted = true;
  /** `autoplay="false"` waits for Play. The default follows the user's motion preference. */
  @property({ converter: boolish }) autoplay = !reduced();
  /** The video's preload hint. */
  @property() preload: "auto" | "metadata" | "none" = "auto";
  /** Caps the figure's width: a number in px, or a CSS length. */
  @property({ converter: length(""), attribute: "max-width" }) maxWidth: number | string = "";
  /** `loop="false"` plays once. */
  @property({ converter: boolish }) loop = true;
  /** The source is set: at once, or once the frame nears the viewport with `lazy`. */
  @atomState() private ready = false;
  /** The video can play: the control bar renders. */
  @atomState() private loaded = false;
  @atomState() private playing = false;
  /** The control bar is opaque and lifted: the pointer moved over the player in the last three seconds. */
  @atomState() private visible = false;
  @atomState() private current = 0;
  @atomState() private duration = 0;
  /** The scrubber's position, in percent. */
  @atomState() private position = 0;
  private dragging = false;
  private loops = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private io?: IntersectionObserver;
  @query("video") private media!: HTMLVideoElement | null;
  @query(".frame") private frame!: HTMLElement;
  @query(".play") private playButton!: HTMLElement | null;
  private interaction = new Interaction(this);

  willUpdate() {
    if (!this.lazy) this.ready = true;
  }

  firstUpdated() {
    if (this.ready) return;
    if (typeof IntersectionObserver === "undefined") {
      this.ready = true;
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        this.ready = true;
        this.io?.disconnect();
        this.io = undefined;
      },
      { rootMargin: LAZY_MARGIN },
    );
    this.io.observe(this.frame);
  }

  updated() {
    this.interaction.attach(this.playButton);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    this.io?.disconnect();
    if (this.dragging) this.endDrag();
  }

  private show = () => {
    clearTimeout(this.timer);
    this.visible = true;
    this.timer = setTimeout(() => {
      this.visible = false;
    }, HIDE_MS);
  };
  private hide = () => {
    clearTimeout(this.timer);
    this.visible = false;
  };

  private play() {
    this.media?.play().catch(() => {
      this.playing = false;
    });
  }
  private pause() {
    this.media?.pause();
    this.playing = false;
  }
  private toggle = () => {
    if (this.media?.paused) this.play();
    else this.pause();
  };
  private canPlay = (e: Event) => {
    const v = e.target as HTMLVideoElement;
    if (v.readyState < 3) return;
    this.loaded = true;
    this.duration = v.duration || 0;
  };
  private onPlay = () => {
    this.playing = true;
    this.dispatchEvent(new CustomEvent("acme-play", { detail: { src: this.src }, bubbles: true, composed: true }));
  };
  private onPause = () => {
    this.playing = false;
  };
  private onEnded = () => {
    if (this.loop && this.loops < REPLAYS) {
      this.loops++;
      this.play();
    } else this.pause();
  };
  private onTime = (e: Event) => {
    if (this.dragging) return;
    this.current = (e.target as HTMLVideoElement).currentTime;
    this.position = this.duration ? (this.current / this.duration) * 100 : 0;
  };

  /** The pointer's place along the drag area, 0 to 1. */
  private fraction(e: PointerEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return r.width ? Math.min(Math.max(e.clientX - r.left, 0), r.width) / r.width : 0;
  }
  private dragStart = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    this.dragging = true;
    document.body.style.userSelect = "none";
  };
  private dragMove = (e: PointerEvent) => {
    if (this.dragging) this.position = 100 * this.fraction(e);
  };
  private dragEnd = (e: PointerEvent) => {
    if (!this.dragging) return;
    const f = this.fraction(e);
    this.position = 100 * f;
    if (this.media) this.media.currentTime = this.duration * f;
    this.endDrag();
  };
  private endDrag() {
    this.dragging = false;
    document.body.style.userSelect = "";
  }

  render() {
    const style = [`--video-margin:${px(this.margin)}`, `--video-width:min(${px(this.width)}, 950px)`, ...(this.maxWidth !== "" ? [`max-width:${px(this.maxWidth)}`] : [])].join(";");
    const ratio = this.height && this.width ? `padding-bottom:${(this.height / this.width) * 100}%` : nothing;
    const bar =
      this.controls && this.loaded
        ? html`<div class="controls" part="controls">
            <button class="play" type="button" aria-label=${this.playing ? "Pause" : "Play"} @click=${this.toggle}>${glyph(this.playing ? paths.pause : paths.play)}</button>
            <div class="current">${formatTime(this.current)}</div>
            <div class="track">
              <div class="scrub" @pointerdown=${this.dragStart} @pointermove=${this.dragMove} @pointerup=${this.dragEnd} @pointercancel=${this.dragEnd}></div>
              <progress max="100" value=${this.position}></progress>
              <div class="handle" style=${`left:${this.position}%`}></div>
            </div>
            <div class="total">${formatTime(this.duration)}</div>
          </div>`
        : nothing;
    return html`<figure class=${this.cls("video", { visible: this.visible, round: this.borderRadius })} role="region" aria-label="Video player" style=${style} @mouseenter=${this.show} @mousemove=${this.show} @mouseleave=${this.hide} part="video">
      <div class="box">
        <div class="frame" style=${ratio}>
          ${
            this.ready && this.src
              ? html`<video
                  src=${this.src}
                  width=${this.width}
                  height=${this.height || nothing}
                  preload=${this.preload}
                  ?autoplay=${this.autoplay}
                  .muted=${this.muted}
                  ?playsinline=${this.playsInline}
                  @canplay=${this.canPlay}
                  @loadeddata=${this.canPlay}
                  @click=${this.toggle}
                  @play=${this.onPlay}
                  @pause=${this.onPause}
                  @ended=${this.onEnded}
                  @timeupdate=${this.onTime}
                  part="media"
                ></video>${bar}`
              : nothing
          }
        </div>
      </div>
    </figure>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-video": AcmeVideo;
  }
}
