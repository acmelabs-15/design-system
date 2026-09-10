import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import "../avatar/avatar";
import type { AvatarService } from "../avatar/avatar";
import { avatarGroupCss } from "./avatar-group.styles";

export type AvatarMember = { username?: string; src?: string; letter?: string; title?: string; git?: AvatarService };

/**
 * Avatar group: a stack of avatars, each in a wrapper with a 1px ring in the page background,
 * overlapping by `--avatar-overlap`. The first `limit - 1` members show plainly; the last slot
 * holds the next member and, when more than one is hidden (or `extra` says so), a small
 * "+N" counter on a dark disc. The first member sits on top unless `reverse`.
 */
@customElement("acme-avatar-group")
export class AcmeAvatarGroup extends AcmeElement {
  static styles = [
    sharedCss,
    avatarGroupCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** The members, in order: `[{ "username": "rauchg" }, { "src": "…", "title": "…" }, { "letter": "SL" }]`. */
  @property({ type: Array }) members: AvatarMember[] = [];
  /** Each avatar's size in px. */
  @property({ type: Number }) size = 24;
  /** Slots in the stack, the last one for the hidden count; 0 shows every member. */
  @property({ type: Number }) limit = 3;
  /** Members counted as hidden beyond the list. */
  @property({ type: Number }) extra = 0;
  /** Stacks the last member on top instead of the first. */
  @property({ type: Boolean }) reverse = false;
  /** `auto` scales the overlap with `size` (30%); a number sets it in px. */
  @property() overlap: "auto" | number | string = "auto";
  /** Shows a member's service dot. */
  @property({ type: Boolean, attribute: "show-icon" }) showIcon = false;
  /** `icon-background="false"` drops the white disc behind a service mark. */
  @property({ converter: boolish, attribute: "icon-background" }) iconBackground = true;

  private avatar(m: AvatarMember) {
    return html`<acme-avatar
      size=${this.size}
      username=${m.username ?? ""}
      src=${m.src ?? ""}
      letter=${m.letter ?? ""}
      title=${m.title ?? ""}
      git=${(this.showIcon && m.git) || ""}
      ?icon-background=${this.iconBackground}
    ></acme-avatar>`;
  }

  render() {
    const limit = (this.limit === 0 ? this.members.length : this.limit) - 1;
    const shown = this.members.slice(0, limit);
    const rest = this.members.slice(limit);
    const more = rest.length + this.extra;
    const count = more > 9 ? "9+" : `+${more}`;
    const label = `${more} more avatars in this group`;
    const overlap = this.overlap === "auto" || this.overlap === "" ? Math.round(0.3 * this.size) : Number(this.overlap) || 0;
    const stack = !this.reverse;
    return html`<div class="avatar-group" style=${`--avatar-overlap:${overlap}px`} part="group">
      ${shown.map((m, i) => html`<span class="member" style=${stack ? `z-index:${shown.length - i}` : nothing}>${this.avatar(m)}</span>`)}
      ${
        rest.length || more > 0
          ? html`<span class="more" aria-label=${label} title=${label} style=${stack ? "z-index:0" : nothing}
              >${rest.length ? this.avatar(rest[0]) : nothing}${more > 1 ? html`<span class="count">${count}</span>` : nothing}</span
            >`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-avatar-group": AcmeAvatarGroup;
  }
}
