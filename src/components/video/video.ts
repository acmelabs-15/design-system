import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { progressCss } from "../progress/progress.styles.js";
import { videoCss } from "./video.styles.js";

/** Geist Video: a player with a floating control bar; wraps a slotted video element. */
@customElement("acme-video")
export class AcmeVideo extends AcmeElement {
  static styles = [sharedCss, videoCss, progressCss, css`:host{display:block} ::slotted(video),::slotted(img){display:block;width:100%;height:auto}`];
  @property({ type: Boolean }) controls = true;
  @property() src = "";
  @property() poster = "";
  @property({ type: Boolean }) loop = true;
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) lazy = true;
  private playing = false;
  private t = 0;
  private dur = 0;
  private get video() {
    return (this.shadowRoot?.querySelector("video") ?? this.querySelector("video")) as HTMLVideoElement | null;
  }
  private fmt(s: number) {
    const m = Math.floor(s / 60),
      r = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  private toggle() {
    const v = this.video;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }
  render() {
    return html`<div class="video" part="video">${
      this.src
        ? html`<video src=${this.src} poster=${this.poster || nothing} ?loop=${this.loop} ?autoplay=${this.autoplay} ?muted=${this.autoplay} playsinline preload=${this.lazy ? "metadata" : "auto"} @play=${() => {
            this.playing = true;
            this.requestUpdate();
          }} @pause=${() => {
            this.playing = false;
            this.requestUpdate();
          }} @timeupdate=${(e: Event) => {
            const v = e.target as HTMLVideoElement;
            this.t = v.currentTime;
            this.dur = v.duration || 0;
            this.requestUpdate();
          }}></video>`
        : html`<slot></slot>`
    }
      ${this.controls ? html`<div class="video-controls"><button class="play" aria-label=${this.playing ? "Pause" : "Play"} @click=${this.toggle}>${glyph(this.playing ? "pause" : "play")}</button><span class="time">${this.fmt(this.t)}</span><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax=${Math.round(this.dur)} aria-valuenow=${Math.round(this.t)}><i style=${`width:${this.dur ? (this.t / this.dur) * 100 : 0}%`}></i></div><span class="time end">${this.fmt(this.dur)}</span></div>` : nothing}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-video": AcmeVideo;
  }
}
