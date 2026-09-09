import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base.js";
import { avatarCss } from "../avatar/avatar.styles.js";

/** A stacked group with a 1px ring per member and a +N counter over `limit`. */
@customElement("acme-avatar-group")
export class AcmeAvatarGroup extends AcmeElement {
  static styles = [
    sharedCss,
    avatarCss,
    css`:host{display:inline-flex} ::slotted(acme-avatar){margin-left:calc(var(--overlap,8px) * -1);border-radius:50%;box-shadow:0 0 0 1px var(--bg)} ::slotted(acme-avatar:first-child){margin-left:0}`,
  ];
  @property({ type: Number }) limit = 0;
  @property({ type: Boolean }) reverse = false;
  render() {
    const extra = this.limit ? Math.max(0, this.querySelectorAll("acme-avatar").length - this.limit) : 0;
    return html`<span class=${this.cls("avatar-group", { reverse: this.reverse })}><slot></slot>${extra ? html`<span class="avatar more" style="--size:32px">+${extra}</span>` : nothing}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-avatar-group": AcmeAvatarGroup;
  }
}
