import { css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { avatarCss } from "./avatar.styles";
import { avatarWrapCss } from "./avatar-wrap.styles";

/** The avatar image for a username at twice the rendered size, for high-density screens; no username gives the generic image. */
export const avatarUrl = (username: string, size: number) => `https://vercel.com/api/www/avatar?${username ? `u=${encodeURIComponent(username)}&` : ""}s=${size * 2}`;
/** A size attribute to pixels: a number or a numeric string. */
export const avatarPx = (size: string | number) => (typeof size === "number" ? size : Number.parseInt(size, 10) || 32);
export type AvatarService = "" | "github" | "gitlab" | "bitbucket";
/** Service marks for the 14px corner dot (filled, on their own view boxes). */
const MARKS: Record<string, { box: string; d: string }> = {
  github: {
    box: "0 0 16 16",
    d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z",
  },
  gitlab: {
    box: "0 0 16 16",
    d: "m15.734 6.1-.022-.058L13.534.358a.568.568 0 0 0-.563-.356.583.583 0 0 0-.328.122.582.582 0 0 0-.193.294l-1.47 4.499H5.025l-1.47-4.5A.572.572 0 0 0 2.47.358L.289 6.04l-.022.057A4.044 4.044 0 0 0 1.61 10.77l.007.006.02.014 3.318 2.485 1.64 1.242 1 .755a.67.67 0 0 0 .814 0l1-.755 1.64-1.242 3.338-2.5.009-.007a4.046 4.046 0 0 0 1.34-4.668Z",
  },
  bitbucket: {
    box: "0 0 24 24",
    d: "M.778 1.213a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z",
  },
};

/**
 * Avatar: a round image for one user or team, `--size` wide. The root carries `data-mask` (the
 * round mask and hairline ring; `mask="false"` gives a 6px radius and no ring) and `data-resolved`
 * (false until the image has loaded: a shimmer fills the disc meanwhile). Content is the image
 * (`src`, or the avatar of `username`), or one or two `letter`s on a gray disc, or nothing for the
 * `placeholder` shell. `git` adds a 14px service dot at the bottom left with the provider's mark;
 * an `icon` slot puts a custom icon in that dot; `icon-background` marks the dot's white disc.
 */
@customElement("acme-avatar")
export class AcmeAvatar extends AcmeElement {
  static styles = [
    sharedCss,
    avatarCss,
    avatarWrapCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** Image source; wins over `username`. */
  @property() src = "";
  /** The username whose avatar image is shown. */
  @property() username = "";
  /** One or two uppercase letters shown instead of an image. */
  @property() letter = "";
  /** Pixels: 16, 24, 32, 48, 64, 90 … */
  @property() size: string | number = 32;
  /** The loading shell: the shimmering disc with no content. */
  @property({ type: Boolean }) placeholder = false;
  /** The entity name for assistive tech (`Jane Doe`, `Acme Inc.`); unset, a username reads as `Avatar for <username>`. */
  @property() title = "";
  /** `mask="false"` drops the round mask and the ring for a 6px radius. */
  @property({ converter: boolish }) mask = true;
  /** A 14px service dot at the bottom left with the provider's mark; GitHub images come from GitHub. */
  @property() git: AvatarService = "";
  /** Marks the dot's white disc with a 1px border. */
  @property({ type: Boolean, attribute: "icon-background" }) iconBackground = false;
  @atomState() private resolved = false;
  @atomState() private hasIcon = false;

  connectedCallback() {
    super.connectedCallback();
    this.hasIcon = !!this.querySelector('[slot="icon"]');
  }

  firstUpdated() {
    // A parser that connects the element before its children (happy-dom does) misses them at connect.
    this.hasIcon ||= !!this.querySelector('[slot="icon"]');
    // The name lives on the root's aria-label; the host attribute would also raise the browser's own tooltip.
    if (this.hasAttribute("title")) {
      const t = this.title;
      this.removeAttribute("title");
      this.title = t;
    }
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("src") || ch.has("username") || ch.has("git")) this.resolved = false;
  }

  private slotted = (e: Event) => {
    this.hasIcon = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some((n) => n.nodeType === 1);
  };

  private loaded = () => {
    this.resolved = true;
  };

  render() {
    const px = avatarPx(this.size);
    const letter = this.letter.toUpperCase();
    const name = this.title || (this.username ? `Avatar for ${this.username}` : "");
    const label = this.placeholder ? "Placeholder Avatar" : letter ? `Avatar with initials: ${letter}` : name;
    const src = this.src || (this.git === "github" && this.username ? `https://avatars.githubusercontent.com/${encodeURIComponent(this.username)}?s=${px * 2}` : avatarUrl(this.username, px));
    const avatar = html`<span
      class="avatar"
      role="img"
      aria-label=${label}
      data-mask=${String(this.mask)}
      data-resolved=${String(this.resolved)}
      style=${`--size:${px}px`}
      part="avatar"
      >${this.placeholder ? nothing : html`<img src=${src} alt=${name} title=${name || nothing} width=${px} height=${px} style="color:transparent" @load=${this.loaded} @error=${this.loaded} />`}${
        letter ? html`<span class="letter">${letter}</span>` : nothing
      }</span
    >`;
    if (!this.git && !this.hasIcon) return avatar;
    const mark = this.git ? MARKS[this.git] : undefined;
    return html`<div class=${this.cls("avatar-wrap", { [this.git]: !!this.git })} style=${`--size:${px}px`} part="wrap">
      ${avatar}
      <div class="service" aria-hidden="true" data-git-type=${this.git || nothing} data-icon-background=${String(this.iconBackground || !!this.git)} style="left:-3px;bottom:-5px">
        <slot name="icon" @slotchange=${this.slotted}
          >${mark ? svg`<svg width="14" height="14" viewBox=${mark.box} style=${this.git === "github" ? "color:currentColor" : "color:white"}><path d=${mark.d} fill="currentColor"></path></svg>` : nothing}</slot
        >
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-avatar": AcmeAvatar;
  }
}
